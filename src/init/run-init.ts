import { multiselect, text, cancel, intro, isCancel, log, note, outro } from "@clack/prompts";
import { mkdir, rm } from "node:fs/promises";
import { join, relative } from "node:path";

import { PRESETS, RULES_CATALOG, getCategoryById } from "../catalog/rules-catalog.ts";
import { renderRuleFileMarkdown } from "../generate/render-rule-file.ts";
import {
  backupCorruptedConfig,
  readSelectionState,
  selectionStateSchema,
  writeSelectionState,
} from "../generate/write-config.ts";
import { detectTargetFile } from "./detect-target.ts";
import { updateInstructionsFile } from "../patch/update-instructions-file.ts";
import type {
  CategoryDefinition,
  CategoryRuleNotes,
  CategorySelection,
  InitOptions,
  InitResult,
  RuleDefinition,
  SelectionState,
} from "../types.ts";

function toPosixPath(pathLike: string): string {
  return pathLike.split("\\").join("/");
}

function asRelative(cwd: string, absolutePath: string): string {
  return toPosixPath(relative(cwd, absolutePath));
}

function dedupe(values: string[]): string[] {
  return [...new Set(values)];
}

function sortStrings(values: string[]): string[] {
  return [...values].sort((a, b) => a.localeCompare(b));
}

function normalizeRuleSelection(
  rule: RuleDefinition,
  selectedOptionIds: string[],
  fallbackToDefault = true,
): { value: string[]; changed: boolean } {
  const allowed = new Set(rule.options.map((option) => option.id));
  const filtered = dedupe(selectedOptionIds.filter((optionId) => allowed.has(optionId)));

  if (filtered.length === 0) {
    if (fallbackToDefault) {
      return { value: [rule.defaultOptionId], changed: true };
    }
    return { value: [], changed: selectedOptionIds.length > 0 };
  }

  const changed = filtered.length !== selectedOptionIds.length;
  return { value: filtered, changed };
}

function normalizeCategorySelection(category: CategoryDefinition, selection: Record<string, string[]> | undefined): {
  normalized: Record<string, string[]>;
  changes: string[];
} {
  const normalized: Record<string, string[]> = {};
  const changes: string[] = [];

  for (const rule of category.rules) {
    const raw = selection?.[rule.id] ?? [rule.defaultOptionId];
    const { value, changed } = normalizeRuleSelection(rule, raw);
    normalized[rule.id] = value;
    if (changed) {
      changes.push(`${category.id}.${rule.id}`);
    }
  }

  return { normalized, changes };
}

function normalizeCategoryNotes(
  category: CategoryDefinition,
  notes: Record<string, string> | undefined,
): Record<string, string> {
  const normalized: Record<string, string> = {};
  for (const rule of category.rules) {
    const note = normalizeNote(notes?.[rule.id]);
    if (note.length > 0) {
      normalized[rule.id] = note;
    }
  }
  return normalized;
}

function canonicalizeSelection(selection: Record<string, string[]>): Record<string, string[]> {
  const next: Record<string, string[]> = {};
  for (const [ruleId, optionIds] of Object.entries(selection)) {
    next[ruleId] = sortStrings(dedupe(optionIds));
  }
  return next;
}

function normalizeNote(value: string | undefined): string {
  return (value ?? "").trim();
}

function canonicalizeNotes(notes: Record<string, string> | undefined): Record<string, string> {
  if (!notes) {
    return {};
  }
  const next: Record<string, string> = {};
  for (const [ruleId, rawValue] of Object.entries(notes)) {
    const value = normalizeNote(rawValue);
    if (value.length > 0) {
      next[ruleId] = value;
    }
  }
  return next;
}

function isSameSelection(left: Record<string, string[]> | undefined, right: Record<string, string[]> | undefined): boolean {
  if (!left || !right) {
    return false;
  }

  const leftKeys = sortStrings(Object.keys(left));
  const rightKeys = sortStrings(Object.keys(right));
  if (leftKeys.length !== rightKeys.length) {
    return false;
  }
  for (let index = 0; index < leftKeys.length; index += 1) {
    const leftKey = leftKeys[index];
    const rightKey = rightKeys[index];
    if (leftKey !== rightKey) {
      return false;
    }
    const leftValues = sortStrings(left[leftKey] ?? []);
    const rightValues = sortStrings(right[rightKey] ?? []);
    if (leftValues.length !== rightValues.length) {
      return false;
    }
    for (let valueIndex = 0; valueIndex < leftValues.length; valueIndex += 1) {
      if (leftValues[valueIndex] !== rightValues[valueIndex]) {
        return false;
      }
    }
  }

  return true;
}

function isSameNotes(left: Record<string, string> | undefined, right: Record<string, string> | undefined): boolean {
  const leftNotes = canonicalizeNotes(left);
  const rightNotes = canonicalizeNotes(right);

  const leftKeys = sortStrings(Object.keys(leftNotes));
  const rightKeys = sortStrings(Object.keys(rightNotes));
  if (leftKeys.length !== rightKeys.length) {
    return false;
  }

  for (let index = 0; index < leftKeys.length; index += 1) {
    const leftKey = leftKeys[index];
    const rightKey = rightKeys[index];
    if (leftKey !== rightKey) {
      return false;
    }
    if (leftNotes[leftKey] !== rightNotes[rightKey]) {
      return false;
    }
  }

  return true;
}

function getRuleDefault(categoryId: string, ruleId: string): string | null {
  const category = getCategoryById(categoryId);
  if (!category) {
    return null;
  }
  const rule = category.rules.find((candidate) => candidate.id === ruleId);
  if (!rule) {
    return null;
  }
  return rule.defaultOptionId;
}

function applyConflictResolution(selection: CategorySelection): string[] {
  const warnings: string[] = [];

  const forceDefault = (categoryId: string, ruleId: string, reason: string): void => {
    const defaultOptionId = getRuleDefault(categoryId, ruleId);
    if (!defaultOptionId || !selection[categoryId] || !selection[categoryId][ruleId]) {
      return;
    }
    selection[categoryId][ruleId] = [defaultOptionId];
    warnings.push(`${categoryId}.${ruleId}: ${reason}. Resolved to default \`${defaultOptionId}\`.`);
  };

  const frontendStyling = selection["frontend"]?.["styling_strategy"];
  if (frontendStyling && frontendStyling.includes("bem") && frontendStyling.includes("utility_first")) {
    forceDefault("frontend", "styling_strategy", "Conflict between `bem` and `utility_first`");
  }

  const backendApiStyle = selection["backend"]?.["api_style"];
  if (backendApiStyle && backendApiStyle.includes("graphql") && backendApiStyle.includes("grpc")) {
    forceDefault("backend", "api_style", "Conflict between `graphql` and `grpc`");
  }

  const sourceOfTruth = selection["api-contracts"]?.["source_of_truth"];
  if (sourceOfTruth && sourceOfTruth.length > 1) {
    forceDefault("api-contracts", "source_of_truth", "Rule requires at most one selected option");
  }

  const testingPyramid = selection["testing"]?.["pyramid"] ?? [];
  const testingE2e = selection["testing"]?.["e2e_scope"] ?? [];
  if (testingPyramid.includes("unit_heavy") && testingE2e.includes("full_regression")) {
    warnings.push(
      "Soft conflict: `testing.pyramid=unit_heavy` + `testing.e2e_scope=full_regression` can increase maintenance cost.",
    );
  }

  const authModel = selection["security"]?.["auth_model"] ?? [];
  const mobileSync = selection["mobile"]?.["sync_policy"] ?? [];
  if (authModel.includes("session_cookie") && mobileSync.includes("offline_first")) {
    warnings.push(
      "Soft conflict: `security.auth_model=session_cookie` + `mobile.sync_policy=offline_first` may require additional session refresh handling.",
    );
  }

  return warnings;
}

async function promptForSelection(previous: SelectionState | null): Promise<{
  selection: CategorySelection;
  notes: CategoryRuleNotes;
}> {
  log.message(
    "Shortcuts: use `a` to toggle all items, press `a` again to deselect all, and use `i` to invert selection.",
  );
  log.message("Press `Enter` without selecting anything to skip a question.");

  const selectedCategories = await multiselect({
    message: "Select categories to generate rules for",
    options: RULES_CATALOG.map((category) => ({
      value: category.id,
      label: category.label,
      hint: category.description,
    })),
    initialValues: [],
    required: false,
  });

  if (isCancel(selectedCategories)) {
    cancel("Operation cancelled.");
    process.exit(1);
  }

  const categoryIds = sortStrings(selectedCategories as string[]);
  const result: CategorySelection = {};
  const notes: CategoryRuleNotes = {};

  for (const categoryId of categoryIds) {
    const category = getCategoryById(categoryId);
    if (!category) {
      continue;
    }

    result[categoryId] = {};
    notes[categoryId] = {};
    for (const rule of category.rules) {
      const previousValues = previous?.categories?.[categoryId]?.[rule.id] ?? [];
      const normalizedInitial = normalizeRuleSelection(rule, previousValues, false).value;

      const selectedOptions = await multiselect({
        message: `${category.label} / ${rule.label}`,
        options: rule.options.map((option) => ({
          value: option.id,
          label: option.label,
          hint: option.emits,
        })),
        initialValues: normalizedInitial.length > 0 ? normalizedInitial : [],
        required: false,
      });

      if (isCancel(selectedOptions)) {
        cancel("Operation cancelled.");
        process.exit(1);
      }

      const normalized = normalizeRuleSelection(rule, selectedOptions as string[], false).value;
      result[categoryId][rule.id] = normalized;

      const previousCustomNote = normalizeNote(previous?.customNotes?.[categoryId]?.[rule.id]);
      const customText = await text({
        message: `${category.label} / ${rule.label} custom instruction (optional)`,
        placeholder: "Example: Use tRPC routers with end-to-end types.",
        initialValue: previousCustomNote,
      });

      if (isCancel(customText)) {
        cancel("Operation cancelled.");
        process.exit(1);
      }

      const normalizedNote = normalizeNote(customText as string);
      if (normalizedNote.length > 0) {
        notes[categoryId][rule.id] = normalizedNote;
      }
    }
  }

  return {
    selection: result,
    notes,
  };
}

function buildDefaultSelectionFromCategories(categoryIds: string[]): CategorySelection {
  const result: CategorySelection = {};

  for (const categoryId of categoryIds) {
    const category = getCategoryById(categoryId);
    if (!category) {
      continue;
    }
    result[categoryId] = {};
    for (const rule of category.rules) {
      result[categoryId][rule.id] = [rule.defaultOptionId];
    }
  }

  return result;
}

function buildNonInteractiveSelection(previous: SelectionState | null, preset: string | undefined): {
  selection: CategorySelection;
  notes: CategoryRuleNotes;
  warnings: string[];
} {
  const warnings: string[] = [];

  if (previous && !preset) {
    const selection: CategorySelection = {};
    const notes: CategoryRuleNotes = {};
    for (const [categoryId, ruleMap] of Object.entries(previous.categories)) {
      const category = getCategoryById(categoryId);
      if (!category) {
        warnings.push(`Unknown category in existing config: \`${categoryId}\`. Skipped.`);
        continue;
      }
      const { normalized, changes } = normalizeCategorySelection(category, ruleMap);
      selection[categoryId] = normalized;
      notes[categoryId] = normalizeCategoryNotes(category, previous.customNotes?.[categoryId]);
      for (const changedRule of changes) {
        warnings.push(`Invalid or empty selection in existing config for \`${changedRule}\`. Reset to default.`);
      }
    }
    return { selection, notes, warnings };
  }

  const normalizedPreset = preset && PRESETS[preset] ? preset : "balanced";
  if (preset && !PRESETS[preset]) {
    warnings.push(`Unknown preset \`${preset}\`. Falling back to \`balanced\`.`);
  }

  return {
    selection: buildDefaultSelectionFromCategories(PRESETS[normalizedPreset]),
    notes: {},
    warnings,
  };
}

export async function runInit(options: InitOptions): Promise<InitResult> {
  const cwd = options.cwd;
  const rulesDirectory = join(cwd, ".ai_rules");
  const configPath = join(rulesDirectory, "config.json");

  intro("ai-init: rule wizard");

  await mkdir(rulesDirectory, { recursive: true });

  const target = await detectTargetFile(cwd, options.targetFile);

  const hasConfig = await Bun.file(configPath).exists();
  let previousState = await readSelectionState(configPath);
  if (hasConfig && !previousState) {
    await backupCorruptedConfig(configPath);
    log.warn("Detected corrupted `.ai_rules/config.json`. A backup was created at `.ai_rules/config.json.bak`.");
  }

  let selection: CategorySelection;
  let customNotes: CategoryRuleNotes;
  const warnings: string[] = [];

  if (options.nonInteractive) {
    const nonInteractive = buildNonInteractiveSelection(previousState, options.preset);
    selection = nonInteractive.selection;
    customNotes = nonInteractive.notes;
    warnings.push(...nonInteractive.warnings);
  } else {
    const interactive = await promptForSelection(previousState);
    selection = interactive.selection;
    customNotes = interactive.notes;
  }

  const conflictWarnings = applyConflictResolution(selection);
  warnings.push(...conflictWarnings);

  for (const warning of warnings) {
    log.warn(warning);
  }

  const generatedAt = new Date().toISOString();
  const nextSelection = Object.fromEntries(
    Object.entries(selection)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([categoryId, rules]) => [categoryId, canonicalizeSelection(rules)]),
  );
  const nextCustomNotes = Object.fromEntries(
    Object.entries(customNotes)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([categoryId, notes]) => [categoryId, canonicalizeNotes(notes)]),
  );

  const previousCategories = previousState?.categories ?? {};
  const previousCustomNotes = previousState?.customNotes ?? {};
  const nextCategoryIds = sortStrings(Object.keys(nextSelection));

  const writtenRuleFiles: string[] = [];
  const removedRuleFiles: string[] = [];
  const activeAbsoluteRulePaths: string[] = [];

  for (const categoryId of nextCategoryIds) {
    const category = getCategoryById(categoryId);
    if (!category) {
      continue;
    }

    const absoluteFilePath = join(rulesDirectory, `${categoryId}.md`);
    activeAbsoluteRulePaths.push(absoluteFilePath);

    const previousCategorySelection = previousCategories[categoryId];
    const nextCategorySelection = nextSelection[categoryId];
    const previousCategoryNotes = previousCustomNotes[categoryId];
    const nextCategoryNotes = nextCustomNotes[categoryId] ?? {};
    const sameSelection = isSameSelection(previousCategorySelection, nextCategorySelection);
    const sameNotes = isSameNotes(previousCategoryNotes, nextCategoryNotes);
    const exists = await Bun.file(absoluteFilePath).exists();

    if (sameSelection && sameNotes && exists) {
      continue;
    }

    const markdown = renderRuleFileMarkdown({
      category,
      selectedRuleOptions: nextCategorySelection,
      selectedRuleNotes: nextCategoryNotes,
      generatedAt,
    });
    await Bun.write(absoluteFilePath, markdown);
    writtenRuleFiles.push(asRelative(cwd, absoluteFilePath));
  }

  const previousCategoryIds = sortStrings(Object.keys(previousCategories));
  for (const categoryId of previousCategoryIds) {
    if (nextSelection[categoryId]) {
      continue;
    }

    const absoluteFilePath = join(rulesDirectory, `${categoryId}.md`);
    const exists = await Bun.file(absoluteFilePath).exists();
    if (exists) {
      await rm(absoluteFilePath, { force: true });
      removedRuleFiles.push(asRelative(cwd, absoluteFilePath));
    }
  }

  const nextState: SelectionState = {
    version: 1,
    targetFile: target.targetFile,
    categories: nextSelection,
    customNotes: nextCustomNotes,
    generatedAt,
  };

  const parseResult = selectionStateSchema.safeParse(nextState);
  if (!parseResult.success) {
    throw new Error("Failed to validate generated selection state.");
  }

  await writeSelectionState(configPath, nextState);

  const patchResult = await updateInstructionsFile({
    targetFilePath: target.targetFilePath,
    targetFileName: target.targetFile,
    absoluteRuleFilePaths: activeAbsoluteRulePaths,
  });

  note(
    [
      `Target file: ${asRelative(cwd, target.targetFilePath)}`,
      `Written rule files: ${writtenRuleFiles.length}`,
      `Removed rule files: ${removedRuleFiles.length}`,
      `Linked files: ${patchResult.updatedLinks.length}`,
    ].join("\n"),
    "Summary",
  );

  outro("ai-init completed.");

  return {
    targetFilePath: target.targetFilePath,
    writtenRuleFiles,
    removedRuleFiles,
    updatedLinks: patchResult.updatedLinks,
  };
}

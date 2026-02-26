import { z } from "zod";

import type { SelectionState } from "../types.ts";

export const selectionStateSchema = z.object({
  version: z.literal(1),
  targetFile: z.enum(["AGENTS.md", "CLAUDE.md"]),
  categories: z.record(z.string(), z.record(z.string(), z.array(z.string()))),
  customNotes: z.record(z.string(), z.record(z.string(), z.string())).default({}),
  generatedAt: z.string(),
});

export async function readSelectionState(configPath: string): Promise<SelectionState | null> {
  const exists = await Bun.file(configPath).exists();
  if (!exists) {
    return null;
  }

  try {
    const raw = await Bun.file(configPath).text();
    const parsed = JSON.parse(raw);
    const result = selectionStateSchema.safeParse(parsed);
    if (!result.success) {
      return null;
    }
    return result.data;
  } catch {
    return null;
  }
}

export async function writeSelectionState(configPath: string, state: SelectionState): Promise<void> {
  await Bun.write(configPath, `${JSON.stringify(state, null, 2)}\n`);
}

export async function backupCorruptedConfig(configPath: string): Promise<void> {
  const exists = await Bun.file(configPath).exists();
  if (!exists) {
    return;
  }

  const backupPath = `${configPath}.bak`;
  const raw = await Bun.file(configPath).text();
  await Bun.write(backupPath, raw);
}

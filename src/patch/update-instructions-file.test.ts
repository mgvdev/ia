import { afterEach, describe, expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  AI_RULES_BEGIN_MARKER,
  AI_RULES_END_MARKER,
  updateInstructionsFile,
} from "./update-instructions-file.ts";

const cleanupPaths: string[] = [];

afterEach(async () => {
  while (cleanupPaths.length > 0) {
    const dir = cleanupPaths.pop();
    if (dir) {
      await rm(dir, { recursive: true, force: true });
    }
  }
});

async function makeTmpDir(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "ai-init-patch-file-"));
  cleanupPaths.push(dir);
  return dir;
}

describe("updateInstructionsFile", () => {
  test("inserts managed block when markers are absent", async () => {
    const cwd = await makeTmpDir();
    const target = join(cwd, "AGENTS.md");
    await Bun.write(target, "# AGENTS\n\nProject instructions.\n");

    const ruleFile = join(cwd, ".ai_rules", "frontend.md");
    await Bun.write(ruleFile, "# Frontend\n");

    const result = await updateInstructionsFile({
      targetFilePath: target,
      targetFileName: "AGENTS.md",
      absoluteRuleFilePaths: [ruleFile],
    });

    const content = await Bun.file(target).text();
    expect(content).toContain(AI_RULES_BEGIN_MARKER);
    expect(content).toContain(AI_RULES_END_MARKER);
    expect(content).toContain("[frontend](.ai_rules/frontend.md)");
    expect(result.updatedLinks).toEqual([".ai_rules/frontend.md"]);
  });

  test("replaces managed block when markers exist", async () => {
    const cwd = await makeTmpDir();
    const target = join(cwd, "AGENTS.md");
    await Bun.write(
      target,
      `# AGENTS\n\n${AI_RULES_BEGIN_MARKER}\nold\n${AI_RULES_END_MARKER}\n`,
    );

    const first = join(cwd, ".ai_rules", "frontend.md");
    const second = join(cwd, ".ai_rules", "backend.md");
    await Bun.write(first, "# Frontend\n");
    await Bun.write(second, "# Backend\n");

    await updateInstructionsFile({
      targetFilePath: target,
      targetFileName: "AGENTS.md",
      absoluteRuleFilePaths: [second, first],
    });

    const content = await Bun.file(target).text();
    expect(content).not.toContain("\nold\n");
    expect(content).toContain("[backend](.ai_rules/backend.md)");
    expect(content).toContain("[frontend](.ai_rules/frontend.md)");
  });

  test("creates minimal file if target does not exist", async () => {
    const cwd = await makeTmpDir();
    const target = join(cwd, "CLAUDE.md");

    const result = await updateInstructionsFile({
      targetFilePath: target,
      targetFileName: "CLAUDE.md",
      absoluteRuleFilePaths: [],
    });

    const content = await Bun.file(target).text();
    expect(content).toContain("# CLAUDE.md");
    expect(content).toContain("No active rule files selected");
    expect(result.updatedLinks).toEqual([]);
  });
});

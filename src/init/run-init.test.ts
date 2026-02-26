import { afterEach, describe, expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { runInit } from "./run-init.ts";
import { AI_RULES_BEGIN_MARKER, AI_RULES_END_MARKER } from "../patch/update-instructions-file.ts";

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
  const dir = await mkdtemp(join(tmpdir(), "ai-init-run-init-"));
  cleanupPaths.push(dir);
  return dir;
}

describe("runInit (non-interactive)", () => {
  test("creates .ai_rules and updates AGENTS.md", async () => {
    const cwd = await makeTmpDir();
    await Bun.write(join(cwd, "AGENTS.md"), "# AGENTS\n");

    const result = await runInit({
      cwd,
      nonInteractive: true,
      preset: "web",
    });

    const configPath = join(cwd, ".ai_rules", "config.json");
    const configExists = await Bun.file(configPath).exists();
    expect(configExists).toBe(true);

    const agentsContent = await Bun.file(join(cwd, "AGENTS.md")).text();
    expect(agentsContent).toContain(AI_RULES_BEGIN_MARKER);
    expect(agentsContent).toContain(AI_RULES_END_MARKER);
    expect(result.updatedLinks.length).toBeGreaterThan(0);
    expect(result.writtenRuleFiles.length).toBeGreaterThan(0);
  });

  test("second run without changes keeps rule files untouched", async () => {
    const cwd = await makeTmpDir();
    await Bun.write(join(cwd, "AGENTS.md"), "# AGENTS\n");

    await runInit({
      cwd,
      nonInteractive: true,
      preset: "web",
    });

    const second = await runInit({
      cwd,
      nonInteractive: true,
      preset: "web",
    });

    expect(second.writtenRuleFiles.length).toBe(0);
    expect(second.removedRuleFiles.length).toBe(0);
  });

  test("creates AGENTS.md when no target file exists", async () => {
    const cwd = await makeTmpDir();

    await runInit({
      cwd,
      nonInteractive: true,
      preset: "balanced",
    });

    const agentsPath = join(cwd, "AGENTS.md");
    const exists = await Bun.file(agentsPath).exists();
    expect(exists).toBe(true);
  });
});

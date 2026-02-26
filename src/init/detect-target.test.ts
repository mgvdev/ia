import { afterEach, describe, expect, test } from "bun:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { detectTargetFile } from "./detect-target.ts";

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
  const dir = await mkdtemp(join(tmpdir(), "ai-init-detect-target-"));
  cleanupPaths.push(dir);
  return dir;
}

describe("detectTargetFile", () => {
  test("uses AGENTS.md when present", async () => {
    const cwd = await makeTmpDir();
    await Bun.write(join(cwd, "AGENTS.md"), "# AGENTS\n");

    const result = await detectTargetFile(cwd);

    expect(result.targetFile).toBe("AGENTS.md");
    expect(result.exists).toBe(true);
  });

  test("falls back to CLAUDE.md when AGENTS.md is absent", async () => {
    const cwd = await makeTmpDir();
    await Bun.write(join(cwd, "CLAUDE.md"), "# CLAUDE\n");

    const result = await detectTargetFile(cwd);

    expect(result.targetFile).toBe("CLAUDE.md");
    expect(result.exists).toBe(true);
  });

  test("returns AGENTS.md with exists=false when both files are absent", async () => {
    const cwd = await makeTmpDir();

    const result = await detectTargetFile(cwd);

    expect(result.targetFile).toBe("AGENTS.md");
    expect(result.exists).toBe(false);
  });

  test("respects explicit target file", async () => {
    const cwd = await makeTmpDir();
    await Bun.write(join(cwd, "CLAUDE.md"), "# CLAUDE\n");

    const result = await detectTargetFile(cwd, "CLAUDE.md");

    expect(result.targetFile).toBe("CLAUDE.md");
    expect(result.exists).toBe(true);
  });
});

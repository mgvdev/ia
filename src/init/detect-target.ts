import { join } from "node:path";

import type { DetectTargetResult, TargetFileName } from "../types.ts";

export async function detectTargetFile(cwd: string, explicitTargetFile?: TargetFileName): Promise<DetectTargetResult> {
  if (explicitTargetFile) {
    const explicitPath = join(cwd, explicitTargetFile);
    const exists = await Bun.file(explicitPath).exists();
    return {
      targetFile: explicitTargetFile,
      targetFilePath: explicitPath,
      exists,
    };
  }

  const agentsPath = join(cwd, "AGENTS.md");
  const claudePath = join(cwd, "CLAUDE.md");

  const hasAgents = await Bun.file(agentsPath).exists();
  if (hasAgents) {
    return {
      targetFile: "AGENTS.md",
      targetFilePath: agentsPath,
      exists: true,
    };
  }

  const hasClaude = await Bun.file(claudePath).exists();
  if (hasClaude) {
    return {
      targetFile: "CLAUDE.md",
      targetFilePath: claudePath,
      exists: true,
    };
  }

  return {
    targetFile: "AGENTS.md",
    targetFilePath: agentsPath,
    exists: false,
  };
}

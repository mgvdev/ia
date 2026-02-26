import { Command } from "commander";

import { runInit } from "./init/run-init.ts";
import type { TargetFileName } from "./types.ts";

export async function runCli(argv: string[]): Promise<void> {
  const program = new Command();

  program
    .name("ai-init")
    .description("Generate AI rule files and inject links into AGENTS.md/CLAUDE.md")
    .showHelpAfterError();

  program
    .command("init")
    .description("Run the interactive rule setup")
    .option("--cwd <path>", "Project directory to initialize", process.cwd())
    .option("--target-file <name>", "Target instruction file: AGENTS.md or CLAUDE.md")
    .option("--non-interactive", "Run without interactive prompts", false)
    .option("--preset <name>", "Preset to use in non-interactive mode (balanced, web)")
    .action(async (options: { cwd: string; targetFile?: string; nonInteractive?: boolean; preset?: string }) => {
      const targetFile =
        options.targetFile === "AGENTS.md" || options.targetFile === "CLAUDE.md"
          ? (options.targetFile as TargetFileName)
          : undefined;

      if (options.targetFile && !targetFile) {
        throw new Error("`--target-file` must be `AGENTS.md` or `CLAUDE.md`.");
      }

      await runInit({
        cwd: options.cwd,
        targetFile,
        nonInteractive: Boolean(options.nonInteractive),
        preset: options.preset,
      });
    });

  await program.parseAsync(argv);
}

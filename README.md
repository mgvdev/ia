# @mgvdev/ai

A Bun CLI to generate project AI rules and automatically wire them into `AGENTS.md` or `CLAUDE.md`.

## Demo

<video src="media/demo.mp4" controls muted playsinline width="100%"></video>

If the embedded player does not render, [open the video directly](media/demo.mp4).

## What The CLI Does

When you run `init`, the CLI:

1. Detects the target instructions file:
`AGENTS.md` first, then `CLAUDE.md`, otherwise creates `AGENTS.md`.
2. Opens an interactive wizard for categories/rules/options.
3. Lets you skip questions (`Enter` with no selection).
4. Supports keyboard shortcuts:
`a` (select/deselect all), `i` (invert selection).
5. Lets you add free text per rule (for example, specifying "tRPC" for API style).
6. Generates `.ai_rules/*.md` files and `.ai_rules/config.json`.
7. Updates a managed block in `AGENTS.md`/`CLAUDE.md` with links to generated rule files.

## Local Installation (Development)

```bash
bun install
```

## Local Usage

```bash
bun run index.ts init
```

Non-interactive mode:

```bash
bun run index.ts init --non-interactive --preset web
```

## Usage With bunx (Published Package)

```bash
bunx --bun @mgvdev/ai init
```

## Publishing

```bash
npm login
bun publish --access public
```

## Generated Output

After `init`, you get:

- `.ai_rules/config.json` (source of truth for selections)
- `.ai_rules/<category>.md` (1 file per selected category)
- a managed block between:
`<!-- AI-INIT:RULES:BEGIN -->` and `<!-- AI-INIT:RULES:END -->`
in `AGENTS.md` or `CLAUDE.md`

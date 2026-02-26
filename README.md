# @mgvdev/ai

CLI Bun pour générer des règles IA de projet et les brancher automatiquement dans `AGENTS.md` ou `CLAUDE.md`.

## Ce que fait le CLI

Au lancement de `init`, le CLI:

1. Détecte le fichier d'instructions cible:
`AGENTS.md` en priorité, sinon `CLAUDE.md`, sinon crée `AGENTS.md`.
2. Ouvre un wizard interactif de catégories/règles/options.
3. Permet de sauter des questions (`Enter` sans sélection).
4. Permet des actions clavier:
`a` (tout cocher/décocher), `i` (inverser).
5. Permet un texte libre par règle (ex: préciser "tRPC" pour un style API).
6. Génère les fichiers `.ai_rules/*.md` + `.ai_rules/config.json`.
7. Met à jour un bloc géré automatiquement dans `AGENTS.md`/`CLAUDE.md` avec des liens vers les règles.

## Installation locale (développement)

```bash
bun install
```

## Utilisation locale

```bash
bun run index.ts init
```

Mode non interactif:

```bash
bun run index.ts init --non-interactive --preset web
```

## Utilisation via bunx (package publié)

```bash
bunx --bun @mgvdev/ai init
```

## Publication

```bash
npm login
bun publish --access public
```

## Sortie générée

Après `init`, tu obtiens:

- `.ai_rules/config.json` (source de vérité des sélections)
- `.ai_rules/<category>.md` (1 fichier par catégorie sélectionnée)
- un bloc géré entre:
`<!-- AI-INIT:RULES:BEGIN -->` et `<!-- AI-INIT:RULES:END -->`
dans `AGENTS.md` ou `CLAUDE.md`

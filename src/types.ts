export type TargetFileName = "AGENTS.md" | "CLAUDE.md";

export interface RuleOption {
  id: string;
  label: string;
  emits: string;
}

export interface RuleDefinition {
  id: string;
  label: string;
  description: string;
  options: RuleOption[];
  conflictGroups?: string[];
  defaultOptionId: string;
}

export interface CategoryDefinition {
  id: string;
  label: string;
  description: string;
  rules: RuleDefinition[];
}

export interface SelectionState {
  version: 1;
  targetFile: TargetFileName;
  categories: Record<string, Record<string, string[]>>;
  customNotes: Record<string, Record<string, string>>;
  generatedAt: string;
}

export interface InitResult {
  targetFilePath: string;
  writtenRuleFiles: string[];
  removedRuleFiles: string[];
  updatedLinks: string[];
}

export interface DetectTargetResult {
  targetFile: TargetFileName;
  targetFilePath: string;
  exists: boolean;
}

export interface InitOptions {
  cwd: string;
  targetFile?: TargetFileName;
  nonInteractive?: boolean;
  preset?: string;
}

export type CategorySelection = Record<string, Record<string, string[]>>;
export type CategoryRuleNotes = Record<string, Record<string, string>>;

import { describe, expect, test } from "bun:test";

import { getCategoryById } from "../catalog/rules-catalog.ts";
import { renderRuleFileMarkdown } from "./render-rule-file.ts";

describe("renderRuleFileMarkdown", () => {
  test("renders selected rules and options", () => {
    const category = getCategoryById("frontend");
    if (!category) {
      throw new Error("Missing frontend category");
    }

    const markdown = renderRuleFileMarkdown({
      category,
      generatedAt: "2026-01-01T00:00:00.000Z",
      selectedRuleOptions: {
        component_pattern: ["compound", "headless"],
        styling_strategy: ["css_modules"],
        state_strategy: ["query_cache"],
      },
      selectedRuleNotes: {
        component_pattern: "Use a dedicated composition API for slot contracts.",
      },
    });

    expect(markdown).toContain("# Frontend Rules");
    expect(markdown).toContain("Build complex widgets as compound components");
    expect(markdown).toContain("Separate behavior from presentation using headless components.");
    expect(markdown).toContain("Use CSS Modules and avoid global style leakage.");
    expect(markdown).toContain("Custom instruction");
    expect(markdown).toContain("Use a dedicated composition API for slot contracts.");
    expect(markdown).toContain("### Rationale");
  });
});

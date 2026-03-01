import { describe, expect, test } from "bun:test";

import { getCategoryById } from "./rules-catalog.ts";

describe("rules catalog", () => {
  test("includes shadcn frontend standard with strict operational guardrails", () => {
    const frontend = getCategoryById("frontend");
    expect(frontend).toBeDefined();

    const componentLibraryRule = frontend?.rules.find((rule) => rule.id === "component_library_standard");
    expect(componentLibraryRule).toBeDefined();

    const strictOption = componentLibraryRule?.options.find((option) => option.id === "shadcn_strict");
    expect(strictOption).toBeDefined();

    const strictEmits = strictOption?.emits ?? "";
    expect(strictEmits).toContain("shadcn-first");
    expect(strictEmits).toContain("<button>");
    expect(strictEmits).toContain("token-only design classes");
    expect(strictEmits).toContain("rg -n");
    expect(strictEmits).toContain("Storybook build");
  });
});

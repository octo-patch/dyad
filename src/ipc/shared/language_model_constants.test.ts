import { describe, expect, it } from "vitest";

import { MODEL_OPTIONS } from "./language_model_constants";

describe("language model constants", () => {
  it("includes MiniMax M3 in the MiniMax catalog", () => {
    const model = MODEL_OPTIONS.minimax.find(
      (option) => option.name === "MiniMax-M3",
    );

    expect(model).toMatchObject({
      displayName: "MiniMax M3",
      contextWindow: 1_000_000,
    });
  });
});

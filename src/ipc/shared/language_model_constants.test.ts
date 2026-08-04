import { describe, expect, it } from "vitest";
import { MODEL_OPTIONS } from "./language_model_constants";

describe("MiniMax model options", () => {
  it("lists the current model first", () => {
    expect(MODEL_OPTIONS.minimax[0]).toMatchObject({
      name: "MiniMax-M3",
      displayName: "MiniMax M3",
      contextWindow: 1_000_000,
      dollarSigns: 2,
    });
  });
});

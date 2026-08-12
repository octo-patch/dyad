import { describe, expect, it } from "vitest";

import { MODEL_OPTIONS } from "./language_model_constants";

describe("MiniMax model options", () => {
  it("lists MiniMax M3 with its current runtime metadata", () => {
    expect(MODEL_OPTIONS.minimax[0]).toMatchObject({
      name: "MiniMax-M3",
      displayName: "MiniMax M3",
      contextWindow: 1_000_000,
      temperature: 1.0,
      dollarSigns: 2,
    });
  });
});

import { describe, expect, test } from "vitest";

import { getMiniMaxOpenAIBaseUrl } from "./minimax_endpoint";

describe("getMiniMaxOpenAIBaseUrl", () => {
  test("uses the global endpoint by default", () => {
    expect(getMiniMaxOpenAIBaseUrl(undefined)).toBe(
      "https://api.minimax.io/v1",
    );
  });

  test("selects the configured region endpoint", () => {
    expect(getMiniMaxOpenAIBaseUrl("global_en")).toBe(
      "https://api.minimax.io/v1",
    );
    expect(getMiniMaxOpenAIBaseUrl("cn_zh")).toBe(
      "https://api.minimaxi.com/v1",
    );
  });

  test("rejects unsupported regions", () => {
    expect(() => getMiniMaxOpenAIBaseUrl("unsupported")).toThrow(
      "Unsupported MiniMax region",
    );
  });
});

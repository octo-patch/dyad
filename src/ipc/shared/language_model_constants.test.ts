import { describe, expect, test } from "vitest";

import {
  DEFAULT_MINIMAX_REGION,
  MINIMAX_REGIONS,
  MINIMAX_REGION_IDS,
  getMiniMaxOpenAiBaseUrl,
  getMiniMaxRegionConfig,
  isMiniMaxRegion,
  resolveMiniMaxRegion,
} from "./language_model_constants";

describe("MiniMax regions", () => {
  test("exposes a global and a China deployment", () => {
    expect(MINIMAX_REGION_IDS).toEqual(["global_en", "cn_zh"]);
    expect(MINIMAX_REGIONS.global_en).toMatchObject({
      openaiBaseUrl: "https://api.minimax.io/v1",
      anthropicBaseUrl: "https://api.minimax.io/anthropic",
      docsRoot: "https://platform.minimax.io/docs",
    });
    expect(MINIMAX_REGIONS.cn_zh).toMatchObject({
      openaiBaseUrl: "https://api.minimaxi.com/v1",
      anthropicBaseUrl: "https://api.minimaxi.com/anthropic",
      docsRoot: "https://platform.minimaxi.com/docs",
    });
  });

  test("defaults to the global deployment", () => {
    expect(DEFAULT_MINIMAX_REGION).toBe("global_en");
    expect(resolveMiniMaxRegion(undefined)).toBe("global_en");
    expect(resolveMiniMaxRegion(null)).toBe("global_en");
    expect(resolveMiniMaxRegion("")).toBe("global_en");
    expect(getMiniMaxOpenAiBaseUrl(undefined)).toBe(
      "https://api.minimax.io/v1",
    );
  });

  test("resolves the China deployment and normalizes the stored value", () => {
    expect(resolveMiniMaxRegion("cn_zh")).toBe("cn_zh");
    expect(resolveMiniMaxRegion(" CN_ZH ")).toBe("cn_zh");
    expect(resolveMiniMaxRegion("cn-zh")).toBe("cn_zh");
    expect(getMiniMaxOpenAiBaseUrl("cn_zh")).toBe(
      "https://api.minimaxi.com/v1",
    );
  });

  test("falls back to the default region for unknown values", () => {
    expect(resolveMiniMaxRegion("mars")).toBe("global_en");
    expect(getMiniMaxOpenAiBaseUrl("mars")).toBe("https://api.minimax.io/v1");
    expect(isMiniMaxRegion("cn_zh")).toBe(true);
    expect(isMiniMaxRegion("mars")).toBe(false);
    expect(isMiniMaxRegion(undefined)).toBe(false);
  });

  test("returns the config for a region", () => {
    expect(getMiniMaxRegionConfig("cn_zh").displayName).toBe("China");
    expect(getMiniMaxRegionConfig("global_en").displayName).toBe("Global");
  });
});

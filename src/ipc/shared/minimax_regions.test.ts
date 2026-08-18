import { describe, expect, it } from "vitest";

import {
  DEFAULT_MINIMAX_REGION_ID,
  getMiniMaxRegion,
  MINIMAX_REGIONS,
  resolveMiniMaxRegionId,
} from "./minimax_regions";

describe("MiniMax regions", () => {
  it("defaults to the global region when no region is selected", () => {
    expect(resolveMiniMaxRegionId(undefined)).toBe("global_en");
    expect(resolveMiniMaxRegionId(null)).toBe("global_en");
    expect(resolveMiniMaxRegionId("")).toBe("global_en");
    expect(DEFAULT_MINIMAX_REGION_ID).toBe("global_en");
  });

  it("falls back to the global region for unknown region ids", () => {
    expect(resolveMiniMaxRegionId("not-a-region")).toBe("global_en");
    expect(getMiniMaxRegion("not-a-region").openaiBaseUrl).toBe(
      MINIMAX_REGIONS.global_en.openaiBaseUrl,
    );
  });

  it("keeps the region base URLs and docs roots distinct", () => {
    expect(getMiniMaxRegion("global_en").openaiBaseUrl).toBe(
      "https://api.minimax.io/v1",
    );
    expect(getMiniMaxRegion("cn_zh").openaiBaseUrl).toBe(
      "https://api.minimaxi.com/v1",
    );
    expect(getMiniMaxRegion("global_en").docsUrl).toBe(
      "https://platform.minimax.io/docs",
    );
    expect(getMiniMaxRegion("cn_zh").docsUrl).toBe(
      "https://platform.minimaxi.com/docs",
    );
  });
});

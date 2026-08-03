import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { buildLanguageModelCatalogResponse } from "../../../plans/catalog-data";

describe("remote language model catalog", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.DYAD_LANGUAGE_MODEL_CATALOG_URL =
      "http://localhost:9/language-model-catalog";
  });

  afterEach(() => {
    delete process.env.DYAD_LANGUAGE_MODEL_CATALOG_URL;
    vi.unstubAllGlobals();
  });

  it("exposes MiniMax M3 without dropping MiniMax M2.7", async () => {
    const responseBody = buildLanguageModelCatalogResponse();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json(responseBody, {
          status: 200,
        }),
      ),
    );

    const { getBuiltinLanguageModelCatalog } =
      await import("./remote_language_model_catalog");
    const catalog = await getBuiltinLanguageModelCatalog();

    expect(catalog.source).toBe("remote");
    expect(
      catalog.modelsByProvider.minimax.map((model) => model.apiName),
    ).toEqual(["MiniMax-M3", "MiniMax-M2.7"]);
  });
});

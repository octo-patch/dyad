// MiniMax serves the same models from region-specific hosts, so the
// OpenAI-compatible base URL is not a single global constant. Keys issued on
// one platform are only accepted by that region's host, which means the region
// has to be selectable instead of hard-coded.

export interface MiniMaxRegion {
  /** Label shown in the provider settings page. */
  displayName: string;
  /** OpenAI-compatible API base URL for the region. */
  openaiBaseUrl: string;
  /** Documentation root for the region's platform. */
  docsUrl: string;
}

export const MINIMAX_REGION_IDS = ["global_en", "cn_zh"] as const;

export type MiniMaxRegionId = (typeof MINIMAX_REGION_IDS)[number];

export const DEFAULT_MINIMAX_REGION_ID: MiniMaxRegionId = "global_en";

export const MINIMAX_REGIONS: Record<MiniMaxRegionId, MiniMaxRegion> = {
  global_en: {
    displayName: "Global",
    openaiBaseUrl: "https://api.minimax.io/v1",
    docsUrl: "https://platform.minimax.io/docs",
  },
  cn_zh: {
    displayName: "Mainland China",
    openaiBaseUrl: "https://api.minimaxi.com/v1",
    docsUrl: "https://platform.minimaxi.com/docs",
  },
};

/**
 * Falls back to the global region so that settings saved by a newer version
 * (or left empty by an older one) never break model requests.
 */
export function resolveMiniMaxRegionId(
  regionId: string | null | undefined,
): MiniMaxRegionId {
  const normalizedRegionId = regionId?.trim();
  return (
    MINIMAX_REGION_IDS.find((id) => id === normalizedRegionId) ??
    DEFAULT_MINIMAX_REGION_ID
  );
}

export function getMiniMaxRegion(
  regionId: string | null | undefined,
): MiniMaxRegion {
  return MINIMAX_REGIONS[resolveMiniMaxRegionId(regionId)];
}

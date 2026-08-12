const MINIMAX_OPENAI_BASE_URLS = {
  global_en: "https://api.minimax.io/v1",
  cn_zh: "https://api.minimaxi.com/v1",
} as const;

export function getMiniMaxOpenAIBaseUrl(region: string | undefined): string {
  const normalizedRegion = region?.trim() || "global_en";
  const baseUrl =
    MINIMAX_OPENAI_BASE_URLS[
      normalizedRegion as keyof typeof MINIMAX_OPENAI_BASE_URLS
    ];

  if (!baseUrl) {
    throw new Error(
      `Unsupported MiniMax region: ${normalizedRegion}. Use global_en or cn_zh.`,
    );
  }

  return baseUrl;
}

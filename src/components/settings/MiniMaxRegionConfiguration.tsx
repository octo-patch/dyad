import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import type { MiniMaxProviderSetting, UserSettings } from "@/lib/schemas";
import {
  MINIMAX_REGIONS,
  MINIMAX_REGION_ENV_VAR,
  MINIMAX_REGION_IDS,
  getMiniMaxRegionConfig,
  resolveMiniMaxRegion,
} from "@/ipc/shared/language_model_constants";

interface MiniMaxRegionConfigurationProps {
  settings: UserSettings | null | undefined;
  envVars: Record<string, string | undefined>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<UserSettings>;
}

export function MiniMaxRegionConfiguration({
  settings,
  envVars,
  updateSettings,
}: MiniMaxRegionConfigurationProps) {
  const existing =
    (settings?.providerSettings?.minimax as
      | MiniMaxProviderSetting
      | undefined) ?? {};
  const savedRegion = existing.region;
  const envRegion = envVars[MINIMAX_REGION_ENV_VAR];

  // Saved settings win over the environment variable, which mirrors how the
  // model client resolves the region when it builds a request.
  const selectedRegion = useMemo(
    () => resolveMiniMaxRegion(savedRegion ?? envRegion),
    [savedRegion, envRegion],
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const usingEnvironmentOnly = !savedRegion && Boolean(envRegion);

  const handleChange = async (value: string | null) => {
    const region = resolveMiniMaxRegion(value);
    if (region === savedRegion) {
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await updateSettings({
        providerSettings: {
          ...settings?.providerSettings,
          minimax: {
            ...existing,
            region,
          },
        },
      });
    } catch (e: any) {
      setError(e?.message || "Failed to save the region");
    } finally {
      setSaving(false);
    }
  };

  const activeConfig = getMiniMaxRegionConfig(selectedRegion);

  return (
    <div className="mt-6 space-y-3 p-4 bg-(--background-lightest) rounded-lg border">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-medium">API Region</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Choose the deployment that issued your API key.
          </p>
        </div>
        <Select
          value={selectedRegion}
          onValueChange={(value) => void handleChange(value)}
          disabled={saving}
        >
          <SelectTrigger
            className="w-[160px]"
            aria-label="API region"
            data-testid="minimax-region-select"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MINIMAX_REGION_IDS.map((region) => (
              <SelectItem key={region} value={region}>
                {MINIMAX_REGIONS[region].displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p
        className="text-sm text-muted-foreground"
        data-testid="minimax-region-base-url"
      >
        Requests go to{" "}
        <code className="font-mono">{activeConfig.openaiBaseUrl}</code>
      </p>

      {usingEnvironmentOnly && (
        <Alert variant="default">
          <Info className="h-4 w-4" />
          <AlertTitle>Using Environment Variable</AlertTitle>
          <AlertDescription>
            {MINIMAX_REGION_ENV_VAR} is set. Picking a region here overrides it.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Save Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

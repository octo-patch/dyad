import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ipc } from "@/ipc/types";
import type { MiniMaxProviderSetting, UserSettings } from "@/lib/schemas";
import {
  MINIMAX_REGION_IDS,
  MINIMAX_REGIONS,
  resolveMiniMaxRegionId,
  type MiniMaxRegionId,
} from "@/ipc/shared/minimax_regions";
import { showError } from "@/lib/toast";

interface MiniMaxRegionSelectorProps {
  settings: UserSettings | null | undefined;
  updateSettings: (settings: Partial<UserSettings>) => Promise<UserSettings>;
}

export function MiniMaxRegionSelector({
  settings,
  updateSettings,
}: MiniMaxRegionSelectorProps) {
  const existing =
    (settings?.providerSettings?.minimax as
      | MiniMaxProviderSetting
      | undefined) ?? {};
  const selectedRegionId = resolveMiniMaxRegionId(existing.region);
  const selectedRegion = MINIMAX_REGIONS[selectedRegionId];
  const [isSaving, setIsSaving] = useState(false);

  const handleRegionChange = async (regionId: MiniMaxRegionId) => {
    if (regionId === selectedRegionId) {
      return;
    }
    setIsSaving(true);
    try {
      await updateSettings({
        providerSettings: {
          ...settings?.providerSettings,
          minimax: {
            ...existing,
            region: regionId,
          },
        },
      });
    } catch (error) {
      showError(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="border rounded-lg px-4 py-4 bg-(--background-lightest) space-y-2">
      <label
        htmlFor="minimax-region"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        API Region
      </label>
      <Select
        value={selectedRegionId}
        onValueChange={(value) => handleRegionChange(value as MiniMaxRegionId)}
        disabled={isSaving}
      >
        <SelectTrigger id="minimax-region" className="w-[220px]">
          <SelectValue>
            {(value: string) =>
              MINIMAX_REGIONS[resolveMiniMaxRegionId(value)].displayName
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {MINIMAX_REGION_IDS.map((regionId) => (
            <SelectItem key={regionId} value={regionId}>
              {MINIMAX_REGIONS[regionId].displayName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Requests are sent to{" "}
        <code className="font-mono">{selectedRegion.openaiBaseUrl}</code>. An
        API key only works with the region it was created in.
      </p>
      <Button
        variant="link"
        size="sm"
        className="h-auto p-0 text-xs"
        onClick={() => ipc.system.openExternalUrl(selectedRegion.docsUrl)}
      >
        Region documentation
        <ExternalLink className="ml-1 h-3 w-3" />
      </Button>
    </div>
  );
}

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { UserSettings } from "@/lib/schemas";
import { MiniMaxRegionSelector } from "./MiniMaxRegionSelector";

describe("MiniMaxRegionSelector", () => {
  it("saves the selected region without dropping the stored API key", async () => {
    const updateSettings = vi.fn().mockResolvedValue({});
    const settings = {
      providerSettings: {
        minimax: {
          apiKey: { value: "minimax-key" },
        },
        openai: {
          apiKey: { value: "openai-key" },
        },
      },
    } as unknown as UserSettings;

    render(
      <MiniMaxRegionSelector
        settings={settings}
        updateSettings={updateSettings}
      />,
    );

    // happy-dom won't open a Base UI Select on a bare click; focus + ArrowDown
    // opens the popup, then pointer events commit the option.
    const trigger = screen.getByRole("combobox");
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    const option = await screen.findByRole("option", {
      name: "Mainland China",
    });
    fireEvent.pointerDown(option);
    fireEvent.pointerUp(option);
    fireEvent.click(option);
    fireEvent.keyDown(option, { key: "Enter" });

    await waitFor(() => {
      expect(updateSettings).toHaveBeenCalled();
    });

    const update = updateSettings.mock.calls[0][0] as Partial<UserSettings>;
    expect(update.providerSettings?.minimax).toEqual({
      apiKey: { value: "minimax-key" },
      region: "cn_zh",
    });
    expect(update.providerSettings?.openai).toEqual({
      apiKey: { value: "openai-key" },
    });
  });

  it("shows the global host when no region has been saved", () => {
    render(
      <MiniMaxRegionSelector
        settings={{ providerSettings: {} } as unknown as UserSettings}
        updateSettings={vi.fn()}
      />,
    );

    expect(screen.getByRole("combobox").textContent).toContain("Global");
    expect(screen.getByText("https://api.minimax.io/v1")).toBeTruthy();
  });
});

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSettingsText } from "../i18n/hooks";
import { FONT_CONFIG } from "../theme/typography";

type FontKey = "system" | "serif" | "sans" | "mono" | "script";
type FontOption = {
  key: FontKey;
  label: string;
  fontFamily?: string;
  fontWeight?: "300" | "400" | "500" | "600" | "700" | "800" | "900";
};

type SettingsContextValue = {
  font: FontOption;
  cycleFont: () => void;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [fontIndex, setFontIndex] = useState(0);
  const settingsText = useSettingsText();

  const fontOptions = useMemo<FontOption[]>(
    () => [
      {
        key: "system",
        label: settingsText.fonts.system,
        fontFamily: FONT_CONFIG.families.system,
        fontWeight: "400",
      },
      {
        key: "serif",
        label: settingsText.fonts.serif,
        fontFamily: FONT_CONFIG.families.serif,
        fontWeight: "400",
      },
      {
        key: "sans",
        label: settingsText.fonts.sans,
        fontFamily: FONT_CONFIG.families.sans,
        fontWeight: "400",
      },
      {
        key: "script",
        label: settingsText.fonts.script,
        fontFamily: FONT_CONFIG.families.script,
        fontWeight: "400",
      },
    ],
    [settingsText]
  );

  const value = useMemo<SettingsContextValue>(() => {
    const font = fontOptions[fontIndex] ?? fontOptions[0];
    return {
      font,
      cycleFont: () =>
        setFontIndex((current) => (current + 1) % fontOptions.length),
    };
  }, [fontIndex, fontOptions]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

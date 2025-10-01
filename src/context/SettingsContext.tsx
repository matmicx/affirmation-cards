import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Platform } from "react-native";

type FontKey = "system" | "serif" | "sans" | "mono";
type FontOption = {
  key: FontKey;
  label: string;
  fontFamily?: string;
};

type SettingsContextValue = {
  font: FontOption;
  cycleFont: () => void;
};

const FONT_OPTIONS: FontOption[] = [
  {
    key: "system",
    label: "Default",
    fontFamily: Platform.select({
      ios: undefined,
      android: "sans-serif",
      default: undefined,
    }),
  },
  {
    key: "serif",
    label: "Serif",
    fontFamily:
      Platform.select({
        ios: "Times New Roman",
        android: "serif",
        default: "serif",
      }) ?? "serif",
  },
  {
    key: "sans",
    label: "Sans",
    fontFamily:
      Platform.select({
        ios: "Helvetica Neue",
        android: "sans-serif-medium",
        default: "sans-serif",
      }) ?? "sans-serif",
  },
  {
    key: "mono",
    label: "Mono",
    fontFamily:
      Platform.select({
        ios: "Menlo",
        android: "monospace",
        default: "monospace",
      }) ?? "monospace",
  },
];

const SettingsContext = createContext<SettingsContextValue | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [fontIndex, setFontIndex] = useState(1);

  const value = useMemo<SettingsContextValue>(() => {
    const font = FONT_OPTIONS[fontIndex] ?? FONT_OPTIONS[0];
    return {
      font,
      cycleFont: () =>
        setFontIndex((current) => (current + 1) % FONT_OPTIONS.length),
    };
  }, [fontIndex]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}

export const fontOptions = FONT_OPTIONS;

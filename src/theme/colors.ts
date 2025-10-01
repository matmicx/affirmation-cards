export type Tone = "light" | "dark";

export const COLORS = {
  text: {
    light: "rgba(248, 250, 252, 1)", // #f8fafc
    dark: "rgba(15, 23, 42, 1)", // #0f172a
  },
  overlay: {
    light: "rgba(15, 23, 42, 0.24)",
    dark: "rgba(255, 255, 255, 0.3)",
  },
  badgeBackground: {
    light: "rgba(15, 23, 42, 0.15)",
    dark: "rgba(255, 255, 255, 0.60)",
  },
  badgeTrack: {
    light: "rgba(248, 250, 252, 0.3)",
    dark: "rgba(17, 24, 39, 0.28)",
  },
  badgeStroke: {
    light: "rgba(143, 216, 189, 0.6)",
    dark: "rgba(15, 23, 42, 1)", // #0f172a
  },
  // FontToggle button colors
  fontToggle: {
    light: {
      border: "rgba(248, 250, 252, 1)", // #f8fafc
      borderActive: "rgba(255, 251, 157, 0.8)",
      background: "rgba(15, 23, 42, 0.1)",
      backgroundActive: "rgba(255, 217, 0, 0.01)",
      shadow: "rgba(0, 0, 0, 0.2)",
    },
    dark: {
      border: "rgba(15, 23, 42, 1)", // #0f172a
      borderActive: "rgba(255, 215, 0, 1)", // #FFD700
      background: "rgba(255, 255, 255, 0.1)",
      backgroundActive: "rgba(255, 215, 0, 0.1)",
      shadow: "rgba(255, 255, 255, 0.2)",
    },
  },
} as const;

export function resolveTextColor(tone: Tone) {
  return tone === "light" ? COLORS.text.light : COLORS.text.dark;
}

export function resolveOverlayColor(tone: Tone) {
  return tone === "light" ? COLORS.overlay.light : COLORS.overlay.dark;
}

export type BadgeColorOverrides = {
  badgeBackground?: string;
  badgeTrack?: string;
  badgeStroke?: string;
};

export function resolveBadgeColors(
  tone: Tone,
  overrides?: BadgeColorOverrides
) {
  return {
    background:
      overrides?.badgeBackground ??
      (tone === "light"
        ? COLORS.badgeBackground.light
        : COLORS.badgeBackground.dark),
    track:
      overrides?.badgeTrack ??
      (tone === "light" ? COLORS.badgeTrack.light : COLORS.badgeTrack.dark),
    stroke:
      overrides?.badgeStroke ??
      (tone === "light" ? COLORS.badgeStroke.light : COLORS.badgeStroke.dark),
  } as const;
}

// FontToggle colors
export type FontToggleColorOverrides = {
  border?: string;
  borderActive?: string;
  background?: string;
  backgroundActive?: string;
  shadow?: string;
};

export function resolveFontToggleColors(
  tone: Tone,
  overrides?: FontToggleColorOverrides
) {
  const baseColors =
    tone === "light" ? COLORS.fontToggle.light : COLORS.fontToggle.dark;

  return {
    border: overrides?.border ?? baseColors.border,
    borderActive: overrides?.borderActive ?? baseColors.borderActive,
    background: overrides?.background ?? baseColors.background,
    backgroundActive:
      overrides?.backgroundActive ?? baseColors.backgroundActive,
    shadow: overrides?.shadow ?? baseColors.shadow,
  } as const;
}

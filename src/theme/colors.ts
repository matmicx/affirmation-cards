export type Tone = "light" | "dark";

export const COLORS = {
  text: {
    light: "#f8fafc",
    dark: "#0f172a",
  },
  overlay: {
    light: "rgba(15,23,42,0.24)",
    dark: "rgba(255,255,255,0.3)",
  },
  badgeBackground: {
    light: "rgba(15,23,42,0.15)",
    dark: "rgba(255,255,255,0.60)",
  },
  badgeTrack: {
    light: "rgba(248,250,252,0.3)",
    dark: "rgba(17,24,39,0.28)",
  },
  badgeStroke: {
    light: "#38bdf8",
    dark: "#0f172a",
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

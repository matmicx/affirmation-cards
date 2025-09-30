import type { ImageSourcePropType } from "react-native";
import { generatedCards } from "./cards.generated";

export type Card = {
  id: number;
  text: string;
  image: ImageSourcePropType;
  preferredTone?: "light" | "dark";
  video?: any;
  videoAfter3m?: any;
  // Optional per-card video alignment
  videoScale?: number; // default 1.0
  videoOffsetX?: number; // px, positive = move right
  videoOffsetY?: number; // px, positive = move down
  videoResizeMode?: "cover" | "contain" | "stretch" | "center" | "repeat";
  // Optional per-card text styling
  textOpacity?: number; // 0..1, default 1
  // Optional per-card badge placement (pixels or percents 0..1)
  badgeLeft?: number;
  badgeTop?: number;
  badgeLeftPct?: number;
  badgeTopPct?: number;
  // Optional per-card badge styling overrides
  badgeBackground?: string; // pill fill color
  badgeTrack?: string; // track stroke color
  badgeStroke?: string; // progress stroke color
};

// Centralized per-card overrides for video alignment/scaling, badge, etc.
const videoScaleOverrides: Record<number, number> = {
  29: 1.08,
  // Add more: id: scale
};

const textOpacityOverrides: Record<number, number> = {
  // Example: 12: 0.85,
};

export const cards: Card[] = generatedCards.map((c: any) => {
  const overrides: Partial<Card> = {};

  if (videoScaleOverrides[c.id] != null) {
    overrides.videoScale = videoScaleOverrides[c.id];
  }

  if (textOpacityOverrides[c.id] != null) {
    overrides.textOpacity = textOpacityOverrides[c.id];
  }

  // Future: add similar lookups for videoOffsetX/Y, resizeMode, badge colors, etc.

  return Object.keys(overrides).length ? { ...c, ...overrides } : c;
});

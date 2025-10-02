// Font Design System
// Centralized configuration for all typography in the app

import { Platform } from "react-native";

export const FONT_CONFIG = {
  // Font families available across the app
  families: {
    system: "System", // Platform default
    serif: Platform.select({
      ios: "Baskerville",
      android: "serif",
    }),
    sans: Platform.select({
      ios: "Helvetica Neue",
      android: "sans-serif",
    }),
    mono: Platform.select({
      ios: "Menlo",
      android: "monospace",
    }),
    script: Platform.select({
      ios: "Great Vibes",
      android: "serif", // Fallback
    }),
  },

  // Font sizes (in pixels)
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
    "4xl": 36,
    "5xl": 48,
    "6xl": 60,
    "7xl": 72,
    "8xl": 96,
  },

  // Font weights
  weights: {
    thin: "100",
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  },

  // Line heights (multiplier of font size)
  lineHeights: {
    tight: 1.2,
    snug: 1.3,
    normal: 1.4,
    relaxed: 1.5,
    loose: 1.6,
  },

  // Letter spacing
  letterSpacing: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
    widest: 1,
  },

  // Typography scales for different contexts
  scales: {
    // Welcome screen typography
    welcome: {
      title: {
        family: "script",
        size: "6xl",
        weight: "normal",
        lineHeight: "tight",
        letterSpacing: "normal",
      },
      subtitle: {
        family: "sans",
        size: "lg",
        weight: "normal",
        lineHeight: "normal",
        letterSpacing: "normal",
      },
      body: {
        family: "serif",
        size: "base",
        weight: "normal",
        lineHeight: "relaxed",
        letterSpacing: "normal",
      },
      button: {
        family: "sans",
        size: "base",
        weight: "semibold",
        lineHeight: "normal",
        letterSpacing: "wide",
      },
    },

    // Card display typography
    card: {
      text: {
        family: "serif",
        size: "2xl",
        weight: "normal",
        lineHeight: "relaxed",
        letterSpacing: "normal",
      },
      badge: {
        family: "sans",
        size: "sm",
        weight: "medium",
        lineHeight: "tight",
        letterSpacing: "normal",
      },
    },

    // Settings/UI typography
    ui: {
      heading: {
        family: "sans",
        size: "xl",
        weight: "semibold",
        lineHeight: "snug",
        letterSpacing: "normal",
      },
      body: {
        family: "sans",
        size: "base",
        weight: "normal",
        lineHeight: "normal",
        letterSpacing: "normal",
      },
      caption: {
        family: "sans",
        size: "sm",
        weight: "normal",
        lineHeight: "normal",
        letterSpacing: "normal",
      },
      button: {
        family: "sans",
        size: "base",
        weight: "medium",
        lineHeight: "normal",
        letterSpacing: "wide",
      },
    },

    // Development/debug typography
    debug: {
      family: "mono",
      size: "xs",
      weight: "normal",
      lineHeight: "normal",
      letterSpacing: "normal",
    },
  },
} as const;

// Helper functions for creating font styles
export const createFontStyle = (
  family: keyof typeof FONT_CONFIG.families,
  size: keyof typeof FONT_CONFIG.sizes,
  weight: keyof typeof FONT_CONFIG.weights,
  options?: {
    lineHeight?: keyof typeof FONT_CONFIG.lineHeights;
    letterSpacing?: keyof typeof FONT_CONFIG.letterSpacing;
  }
) => {
  const style: any = {
    fontFamily: FONT_CONFIG.families[family],
    fontSize: FONT_CONFIG.sizes[size],
    fontWeight: FONT_CONFIG.weights[weight],
  };

  if (options?.lineHeight) {
    style.lineHeight =
      FONT_CONFIG.sizes[size] * FONT_CONFIG.lineHeights[options.lineHeight];
  }

  if (options?.letterSpacing) {
    style.letterSpacing = FONT_CONFIG.letterSpacing[options.letterSpacing];
  }

  return style;
};

// Preset font styles for common use cases
export const FONT_PRESETS = {
  // Welcome screen
  welcomeTitle: createFontStyle("script", "6xl", "normal", {
    lineHeight: "tight",
  }),
  welcomeSubtitle: createFontStyle("sans", "lg", "normal"),
  welcomeBody: createFontStyle("serif", "base", "normal", {
    lineHeight: "relaxed",
  }),
  welcomeButton: createFontStyle("sans", "base", "semibold", {
    letterSpacing: "wide",
  }),

  // Card display
  cardText: createFontStyle("serif", "2xl", "normal", {
    lineHeight: "relaxed",
  }),
  cardBadge: createFontStyle("sans", "sm", "medium", {
    lineHeight: "tight",
  }),

  // UI elements
  uiHeading: createFontStyle("sans", "xl", "semibold", {
    lineHeight: "snug",
  }),
  uiBody: createFontStyle("sans", "base", "normal"),
  uiCaption: createFontStyle("sans", "sm", "normal"),
  uiButton: createFontStyle("sans", "base", "medium", {
    letterSpacing: "wide",
  }),

  // Development
  debug: createFontStyle("mono", "xs", "normal"),
} as const;

// Typography scale helpers
export const getTypographyScale = (scale: keyof typeof FONT_CONFIG.scales) => {
  return FONT_CONFIG.scales[scale];
};

export const createTypographyStyle = (
  scale: keyof typeof FONT_CONFIG.scales,
  variant: string
) => {
  const scaleConfig = FONT_CONFIG.scales[scale];
  const variantConfig = (scaleConfig as any)[variant];

  return createFontStyle(
    variantConfig.family,
    variantConfig.size,
    variantConfig.weight,
    {
      lineHeight: variantConfig.lineHeight,
      letterSpacing: variantConfig.letterSpacing,
    }
  );
};

// Font size scaling helpers
export const scaleFontSize = (baseSize: number, scale: number = 1) => {
  return Math.round(baseSize * scale);
};

export const getResponsiveFontSize = (
  baseSize: number,
  screenWidth: number
) => {
  // Scale font size based on screen width
  const scaleFactor = Math.min(screenWidth / 375, 1.2); // Base on iPhone width
  return Math.round(baseSize * scaleFactor);
};

// Font weight helpers
export const getFontWeight = (weight: keyof typeof FONT_CONFIG.weights) => {
  return FONT_CONFIG.weights[weight];
};

export const isBold = (weight: keyof typeof FONT_CONFIG.weights) => {
  const numericWeight = parseInt(FONT_CONFIG.weights[weight]);
  return numericWeight >= 600;
};

// Font family helpers
export const getFontFamily = (family: keyof typeof FONT_CONFIG.families) => {
  return FONT_CONFIG.families[family];
};

export const isSystemFont = (family: keyof typeof FONT_CONFIG.families) => {
  return family === "system";
};

// Type definitions for better IDE support
export type FontFamily = keyof typeof FONT_CONFIG.families;
export type FontSize = keyof typeof FONT_CONFIG.sizes;
export type FontWeight = keyof typeof FONT_CONFIG.weights;
export type LineHeight = keyof typeof FONT_CONFIG.lineHeights;
export type LetterSpacing = keyof typeof FONT_CONFIG.letterSpacing;
export type TypographyScale = keyof typeof FONT_CONFIG.scales;
export type FontPreset = keyof typeof FONT_PRESETS;

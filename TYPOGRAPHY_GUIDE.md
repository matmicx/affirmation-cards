# Typography Design System

A comprehensive font management system for the Daily Wisdom app that provides centralized control over all typography elements.

## 🎯 Features

- **Centralized Configuration** - All font families, sizes, weights, and spacing in one place
- **Platform-Specific Fonts** - Automatic iOS/Android font selection
- **Typography Scales** - Pre-defined scales for different contexts (welcome, card, UI)
- **Helper Functions** - Easy-to-use functions for creating font styles
- **Type Safety** - Full TypeScript support with autocomplete

## 📁 File Structure

```
src/theme/
├── typography.ts     # Main typography system
├── animations.ts     # Animation system
└── colors.ts         # Color system
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { FONT_PRESETS, createFontStyle } from "../theme/typography";

// Use predefined presets
<Text style={FONT_PRESETS.welcomeTitle}>Daily Wisdom</Text>
<Text style={FONT_PRESETS.cardText}>Your wisdom text</Text>
<Text style={FONT_PRESETS.uiButton}>Button Text</Text>

// Create custom styles
<Text style={createFontStyle("serif", "xl", "bold")}>Custom Text</Text>
```

### Advanced Usage

```typescript
import {
  FONT_CONFIG,
  createFontStyle,
  getTypographyScale,
  scaleFontSize,
} from "../theme/typography";

// Access configuration directly
const customStyle = {
  fontFamily: FONT_CONFIG.families.script,
  fontSize: FONT_CONFIG.sizes["4xl"],
  fontWeight: FONT_CONFIG.weights.bold,
  lineHeight: FONT_CONFIG.sizes["4xl"] * FONT_CONFIG.lineHeights.tight,
};

// Use typography scales
const welcomeScale = getTypographyScale("welcome");
const titleStyle = createFontStyle(
  welcomeScale.title.family,
  welcomeScale.title.size,
  welcomeScale.title.weight,
  {
    lineHeight: welcomeScale.title.lineHeight,
    letterSpacing: welcomeScale.title.letterSpacing,
  }
);

// Responsive font sizing
const responsiveSize = scaleFontSize(16, 1.2); // 20% larger
```

## 📋 Available Font Families

| Key      | iOS            | Android    | Description        |
| -------- | -------------- | ---------- | ------------------ |
| `system` | System         | System     | Platform default   |
| `serif`  | Baskerville    | serif      | Elegant serif      |
| `sans`   | Helvetica Neue | sans-serif | Clean sans-serif   |
| `mono`   | Menlo          | monospace  | Monospace for code |
| `script` | Great Vibes    | serif      | Decorative script  |

## 📏 Font Sizes

| Key    | Size (px) | Usage            |
| ------ | --------- | ---------------- |
| `xs`   | 12        | Captions, labels |
| `sm`   | 14        | Small text       |
| `base` | 16        | Body text        |
| `lg`   | 18        | Large body       |
| `xl`   | 20        | Headings         |
| `2xl`  | 24        | Large headings   |
| `3xl`  | 30        | Page titles      |
| `4xl`  | 36        | Hero text        |
| `5xl`  | 48        | Display text     |
| `6xl`  | 60        | Welcome title    |
| `7xl`  | 72        | Large display    |
| `8xl`  | 96        | Massive display  |

## ⚖️ Font Weights

| Key         | Weight | Usage           |
| ----------- | ------ | --------------- |
| `thin`      | 100    | Very light      |
| `light`     | 300    | Light text      |
| `normal`    | 400    | Regular text    |
| `medium`    | 500    | Medium emphasis |
| `semibold`  | 600    | Strong emphasis |
| `bold`      | 700    | Bold headings   |
| `extrabold` | 800    | Very bold       |
| `black`     | 900    | Maximum weight  |

## 📐 Line Heights

| Key       | Multiplier | Usage         |
| --------- | ---------- | ------------- |
| `tight`   | 1.2        | Headlines     |
| `snug`    | 1.3        | Subheadings   |
| `normal`  | 1.4        | Body text     |
| `relaxed` | 1.5        | Reading text  |
| `loose`   | 1.6        | Spacious text |

## 🎨 Typography Scales

### Welcome Screen Scale

```typescript
const welcomeScale = {
  title: { family: "script", size: "6xl", weight: "normal" },
  subtitle: { family: "sans", size: "lg", weight: "normal" },
  body: { family: "serif", size: "base", weight: "normal" },
  button: { family: "sans", size: "base", weight: "semibold" },
};
```

### Card Display Scale

```typescript
const cardScale = {
  text: { family: "serif", size: "2xl", weight: "normal" },
  badge: { family: "sans", size: "sm", weight: "medium" },
};
```

### UI Scale

```typescript
const uiScale = {
  heading: { family: "sans", size: "xl", weight: "semibold" },
  body: { family: "sans", size: "base", weight: "normal" },
  caption: { family: "sans", size: "sm", weight: "normal" },
  button: { family: "sans", size: "base", weight: "medium" },
};
```

## 🛠️ Helper Functions

### `createFontStyle(family, size, weight, options?)`

Creates a complete font style object.

```typescript
const style = createFontStyle("serif", "xl", "bold", {
  lineHeight: "tight",
  letterSpacing: "wide",
});
```

### `getTypographyScale(scale)`

Gets a predefined typography scale.

```typescript
const welcomeScale = getTypographyScale("welcome");
```

### `createTypographyStyle(scale, variant)`

Creates a style from a typography scale variant.

```typescript
const titleStyle = createTypographyStyle("welcome", "title");
```

### `scaleFontSize(baseSize, scale)`

Scales a font size by a multiplier.

```typescript
const largerText = scaleFontSize(16, 1.25); // 20px
```

### `getResponsiveFontSize(baseSize, screenWidth)`

Creates responsive font sizes based on screen width.

```typescript
const responsiveSize = getResponsiveFontSize(16, 414); // iPhone 11 Pro Max
```

## 📱 Component Integration

### WelcomeScreen Component

```typescript
// Before
<Text style={{
  fontSize: 56,
  fontWeight: "400",
  fontFamily: Platform.OS === "ios" ? "Snell Roundhand" : "serif",
}}>Daily Wisdom</Text>

// After
<Text style={FONT_PRESETS.welcomeTitle}>Daily Wisdom</Text>
```

### CardDisplay Component

```typescript
// Before
<Text style={{
  fontSize: 24,
  fontWeight: "bold",
  fontFamily: font.fontFamily,
}}>{card.text}</Text>

// After
<Text style={[
  FONT_PRESETS.cardText,
  { fontFamily: font.fontFamily }
]}>{card.text}</Text>
```

### Settings Context

```typescript
// Before
const fontOptions = [
  {
    key: "serif",
    label: "Baskerville",
    fontFamily: Platform.select({
      ios: "Baskerville",
      android: "serif",
    }),
    fontWeight: "400",
  },
];

// After
const fontOptions = [
  {
    key: "serif",
    label: "Baskerville",
    fontFamily: FONT_CONFIG.families.serif,
    fontWeight: "400",
  },
];
```

## 🎯 Best Practices

### 1. Use Presets When Possible

```typescript
// ✅ Good
<Text style={FONT_PRESETS.welcomeTitle}>Title</Text>

// ❌ Avoid
<Text style={{
  fontFamily: FONT_CONFIG.families.script,
  fontSize: FONT_CONFIG.sizes["6xl"],
  fontWeight: FONT_CONFIG.weights.normal,
}}>Title</Text>
```

### 2. Create Custom Styles for Reusable Components

```typescript
// ✅ Good
const CustomButton = ({ children }) => (
  <Text style={[FONT_PRESETS.uiButton, styles.customButton]}>{children}</Text>
);
```

### 3. Use Typography Scales for Consistency

```typescript
// ✅ Good
const headingStyle = createTypographyStyle("ui", "heading");

// ❌ Avoid
const headingStyle = createFontStyle("sans", "xl", "semibold");
```

### 4. Leverage Helper Functions

```typescript
// ✅ Good
const isBoldText = isBold("bold"); // true
const systemFont = isSystemFont("system"); // true

// ❌ Avoid
const isBoldText = parseInt(FONT_CONFIG.weights.bold) >= 600;
```

## 🔧 Customization

### Adding New Font Families

```typescript
// In typography.ts
families: {
  // ... existing families
  custom: Platform.select({
    ios: "Custom Font",
    android: "custom-font",
  }),
},
```

### Adding New Font Sizes

```typescript
// In typography.ts
sizes: {
  // ... existing sizes
  "9xl": 128,
  "10xl": 144,
},
```

### Creating New Typography Scales

```typescript
// In typography.ts
scales: {
  // ... existing scales
  modal: {
    title: {
      family: "sans",
      size: "2xl",
      weight: "bold",
      lineHeight: "tight",
      letterSpacing: "normal",
    },
    body: {
      family: "sans",
      size: "base",
      weight: "normal",
      lineHeight: "normal",
      letterSpacing: "normal",
    },
  },
},
```

## 🚀 Migration Guide

### Step 1: Import the Typography System

```typescript
import { FONT_PRESETS, createFontStyle } from "../theme/typography";
```

### Step 2: Replace Hardcoded Styles

```typescript
// Before
fontSize: 16,
fontWeight: "600",
fontFamily: "Helvetica Neue",

// After
...FONT_PRESETS.uiButton,
// or
...createFontStyle("sans", "base", "semibold"),
```

### Step 3: Update Component Props

```typescript
// Before
<Text style={{ fontSize: props.size, fontWeight: props.weight }}>

// After
<Text style={createFontStyle("sans", props.size, props.weight)}>
```

## 🎨 Design Tokens

The typography system integrates with other design systems:

```typescript
// Combined with animation system
const animatedText = Animated.timing(textOpacity, {
  ...ANIMATION_PRESETS.fadeIn,
});

// Combined with color system
const styledText = {
  ...FONT_PRESETS.cardText,
  color: resolveTextColor("light"),
};
```

This typography system provides a solid foundation for consistent, maintainable, and scalable text styling across the entire Daily Wisdom app.

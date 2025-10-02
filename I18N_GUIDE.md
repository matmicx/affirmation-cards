# Internationalization (i18n) Guide

A comprehensive internationalization system using i18next for centralized text management and multi-language support in the Daily Wisdom app.

## 🌍 Features

- **Centralized Text Management** - All text content in one place
- **Multi-Language Support** - English, Spanish, French, and more
- **Easy Language Switching** - Dynamic language changes
- **Type-Safe Translations** - Full TypeScript support
- **Specialized Hooks** - Easy-to-use hooks for different sections
- **Accessibility Support** - Screen reader friendly translations
- **Time Formatting** - Localized date and time formats
- **Pluralization** - Proper plural forms for different languages

## 📁 File Structure

```
src/i18n/
├── index.ts          # Main i18n configuration
├── hooks.ts          # Custom hooks for easy usage
└── translations/     # Translation files (future)
    ├── en.json
    ├── es.json
    └── fr.json
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { useI18n, useWelcomeText } from "../i18n/hooks";

// Simple translation
const { t } = useI18n();
const title = t("welcome.title"); // "Daily Wisdom"

// Specialized hooks
const welcomeText = useWelcomeText();
const title = welcomeText.title; // "Daily Wisdom"
const button = welcomeText.cta.button; // "Begin Your Journey"
```

### Language Switching

```typescript
import { useLanguageManager } from "../i18n/hooks";

const { setLanguage, availableLanguages, currentLanguage } =
  useLanguageManager();

// Change language
await setLanguage("es"); // Switch to Spanish

// Get current language info
const currentLang = getCurrentLanguageInfo();
console.log(currentLang.nativeName); // "Español"
```

## 📋 Available Languages

| Code | Language   | Native Name | Status      |
| ---- | ---------- | ----------- | ----------- |
| `en` | English    | English     | ✅ Complete |
| `es` | Spanish    | Español     | ✅ Complete |
| `fr` | French     | Français    | ✅ Complete |
| `de` | German     | Deutsch     | 🚧 Planned  |
| `it` | Italian    | Italiano    | 🚧 Planned  |
| `pt` | Portuguese | Português   | 🚧 Planned  |

## 🎯 Translation Keys Structure

### App Metadata

```typescript
app: {
  name: "Daily Wisdom",
  tagline: "Your daily dose of mindful reflection",
}
```

### Welcome Screen

```typescript
welcome: {
  title: "Daily Wisdom",
  subtitle: "Your daily dose of mindful reflection",
  explainer: {
    title: "What to expect",
    body: "Every 24 hours you'll receive one short wisdom card...",
  },
  cta: {
    title: "Ready?",
    body: "Begin a gentle, daily practice.",
    button: "Begin Your Journey",
  },
}
```

### Card Display

```typescript
card: {
  loading: "Loading your wisdom...",
  error: "Unable to load wisdom card",
  retry: "Try again",
  nextCard: "Next card in",
  hours: "hours",
  minutes: "minutes",
  seconds: "seconds",
}
```

### Settings

```typescript
settings: {
  title: "Settings",
  fonts: {
    title: "Font Style",
    system: "System Default",
    serif: "Baskerville",
    sans: "Helvetica",
    mono: "Menlo",
    script: "Great Vibes",
  },
  themes: {
    title: "Theme",
    light: "Light",
    dark: "Dark",
    auto: "Auto",
  },
  language: {
    title: "Language",
    english: "English",
    spanish: "Español",
    french: "Français",
    // ... more languages
  },
}
```

### Common UI Elements

```typescript
common: {
  ok: "OK",
  cancel: "Cancel",
  done: "Done",
  back: "Back",
  next: "Next",
  previous: "Previous",
  close: "Close",
  save: "Save",
  reset: "Reset",
  loading: "Loading...",
  error: "Error",
  success: "Success",
  warning: "Warning",
  info: "Information",
}
```

### Accessibility

```typescript
accessibility: {
  welcomeScreen: "Welcome screen with app introduction",
  cardDisplay: "Daily wisdom card display",
  settingsScreen: "App settings and preferences",
  fontToggle: "Toggle font style",
  themeToggle: "Toggle theme",
  languageSelector: "Select language",
  countdownBadge: "Time until next card",
  beginButton: "Begin your daily wisdom journey",
  cardText: "Wisdom card text",
  backgroundImage: "Background image",
  navigationDots: "Page navigation indicators",
}
```

### Error Messages

```typescript
errors: {
  networkError: "Network connection error",
  serverError: "Server error occurred",
  unknownError: "An unknown error occurred",
  cardLoadError: "Failed to load wisdom card",
  settingsSaveError: "Failed to save settings",
  welcomeResetError: "Failed to reset welcome screen",
}
```

### Notifications

```typescript
notifications: {
  newCardAvailable: "New wisdom card available",
  dailyReminder: "Your daily wisdom awaits",
  settingsSaved: "Settings saved successfully",
  welcomeReset: "Welcome screen reset",
}
```

### Time Formats

```typescript
time: {
  formats: {
    short: "MMM d",
    long: "MMMM d, yyyy",
    time: "h:mm a",
    datetime: "MMM d, h:mm a",
  },
  relative: {
    now: "now",
    minutesAgo: "{{count}} minute ago",
    minutesAgo_plural: "{{count}} minutes ago",
    hoursAgo: "{{count}} hour ago",
    hoursAgo_plural: "{{count}} hours ago",
    daysAgo: "{{count}} day ago",
    daysAgo_plural: "{{count}} days ago",
  },
}
```

## 🛠️ Available Hooks

### `useI18n()`

Main translation hook with basic functionality.

```typescript
const { t, changeLanguage, currentLanguage, isReady } = useI18n();

// Basic translation
const title = t("welcome.title");

// Change language
await changeLanguage("es");

// Check if i18n is ready
if (isReady) {
  // Safe to use translations
}
```

### `useWelcomeText()`

Specialized hook for welcome screen text.

```typescript
const welcomeText = useWelcomeText();

// Access all welcome text
const title = welcomeText.title;
const subtitle = welcomeText.subtitle;
const explainerTitle = welcomeText.explainer.title;
const explainerBody = welcomeText.explainer.body;
const ctaTitle = welcomeText.cta.title;
const ctaBody = welcomeText.cta.body;
const ctaButton = welcomeText.cta.button;
```

### `useCardText()`

Specialized hook for card display text.

```typescript
const cardText = useCardText();

const loading = cardText.loading;
const error = cardText.error;
const retry = cardText.retry;
const nextCard = cardText.nextCard;
const hours = cardText.hours;
const minutes = cardText.minutes;
const seconds = cardText.seconds;
```

### `useSettingsText()`

Specialized hook for settings screen text.

```typescript
const settingsText = useSettingsText();

const title = settingsText.title;
const fontTitle = settingsText.fonts.title;
const systemFont = settingsText.fonts.system;
const serifFont = settingsText.fonts.serif;
// ... etc
```

### `useCommonText()`

Specialized hook for common UI text.

```typescript
const commonText = useCommonText();

const ok = commonText.ok;
const cancel = commonText.cancel;
const done = commonText.done;
const loading = commonText.loading;
// ... etc
```

### `useAccessibilityText()`

Specialized hook for accessibility labels.

```typescript
const accessibilityText = useAccessibilityText();

const welcomeScreen = accessibilityText.welcomeScreen;
const cardDisplay = accessibilityText.cardDisplay;
const fontToggle = accessibilityText.fontToggle;
// ... etc
```

### `useErrorText()`

Specialized hook for error messages.

```typescript
const errorText = useErrorText();

const networkError = errorText.networkError;
const serverError = errorText.serverError;
const cardLoadError = errorText.cardLoadError;
// ... etc
```

### `useNotificationText()`

Specialized hook for notification messages.

```typescript
const notificationText = useNotificationText();

const newCardAvailable = notificationText.newCardAvailable;
const dailyReminder = notificationText.dailyReminder;
const settingsSaved = notificationText.settingsSaved;
// ... etc
```

### `useLanguageManager()`

Hook for language management functionality.

```typescript
const {
  availableLanguages,
  currentLanguage,
  setLanguage,
  getCurrentLanguageInfo,
} = useLanguageManager();

// Available languages
console.log(availableLanguages);
// [
//   { code: 'en', name: 'English', nativeName: 'English' },
//   { code: 'es', name: 'Spanish', nativeName: 'Español' },
//   ...
// ]

// Change language
const success = await setLanguage("es");

// Get current language info
const currentLang = getCurrentLanguageInfo();
console.log(currentLang.nativeName); // "Español"
```

### `useTimeFormat()`

Hook for time formatting utilities.

```typescript
const { formatTime, formatRelativeTime } = useTimeFormat();

// Format date
const formattedDate = formatTime(new Date(), "long");

// Format relative time
const relativeTime = formatRelativeTime(someDate);
```

### `useTextInterpolation()`

Hook for text interpolation and pluralization.

```typescript
const { interpolate, pluralize } = useTextInterpolation();

// Interpolate values
const message = interpolate("card.nextCard", { time: "2 hours" });

// Pluralize
const minutesText = pluralize("time.relative.minutesAgo", 5);
```

## 📱 Component Integration

### WelcomeScreen Component

```typescript
// Before
const pages = [
  {
    key: "intro",
    title: "Daily Wisdom",
    subtitle: "Your daily dose of mindful reflection",
  },
];

// After
const welcomeText = useWelcomeText();
const pages = [
  {
    key: "intro",
    title: welcomeText.title,
    subtitle: welcomeText.subtitle,
  },
];
```

### Settings Context

```typescript
// Before
const fontOptions = [
  {
    key: "system",
    label: "Default",
    fontFamily: FONT_CONFIG.families.system,
  },
];

// After
const settingsText = useSettingsText();
const fontOptions = [
  {
    key: "system",
    label: settingsText.fonts.system,
    fontFamily: FONT_CONFIG.families.system,
  },
];
```

### Language Selector Component

```typescript
import { LanguageSelector } from "../components/LanguageSelector";

const [showLanguageSelector, setShowLanguageSelector] = useState(false);

<LanguageSelector
  isVisible={showLanguageSelector}
  onClose={() => setShowLanguageSelector(false)}
/>;
```

## 🎨 Styling with i18n

### Dynamic Text Length Handling

```typescript
// Handle different text lengths for different languages
const buttonText = welcomeText.cta.button;
const buttonStyle = {
  ...FONT_PRESETS.welcomeButton,
  // Adjust padding based on text length
  paddingHorizontal: buttonText.length > 15 ? 8 : 12,
};
```

### RTL Support (Future)

```typescript
// For right-to-left languages like Arabic
const isRTL = currentLanguage === "ar";
const textStyle = {
  textAlign: isRTL ? "right" : "left",
  writingDirection: isRTL ? "rtl" : "ltr",
};
```

## 🔧 Advanced Features

### Pluralization

```typescript
// English
t("time.relative.minutesAgo", { count: 1 }); // "1 minute ago"
t("time.relative.minutesAgo", { count: 5 }); // "5 minutes ago"

// Spanish (different plural rules)
t("time.relative.minutesAgo", { count: 1 }); // "hace 1 minuto"
t("time.relative.minutesAgo", { count: 5 }); // "hace 5 minutos"
```

### Interpolation

```typescript
// With variables
t("card.nextCard", { time: "2 hours" }); // "Next card in 2 hours"

// With multiple variables
t("settings.about.version", { version: "1.0.0" }); // "Version 1.0.0"
```

### Namespace Support

```typescript
// Future: Multiple namespaces
t("common:ok"); // From common namespace
t("settings:title"); // From settings namespace
```

## 🚀 Migration Guide

### Step 1: Initialize i18n

```typescript
// In App.tsx
import "./i18n"; // Initialize i18n
```

### Step 2: Replace Hardcoded Text

```typescript
// Before
<Text>Daily Wisdom</Text>;

// After
const welcomeText = useWelcomeText();
<Text>{welcomeText.title}</Text>;
```

### Step 3: Add Language Switching

```typescript
// Add language selector to settings
const { setLanguage } = useLanguageManager();
await setLanguage("es");
```

### Step 4: Update Accessibility

```typescript
// Before
<Text accessibilityLabel="Welcome screen">

// After
const accessibilityText = useAccessibilityText();
<Text accessibilityLabel={accessibilityText.welcomeScreen}>
```

## 🎯 Best Practices

### 1. Use Specialized Hooks

```typescript
// ✅ Good
const welcomeText = useWelcomeText();
const title = welcomeText.title;

// ❌ Avoid
const { t } = useI18n();
const title = t("welcome.title");
```

### 2. Handle Loading States

```typescript
// ✅ Good
const { isReady } = useI18n();
if (!isReady) return <LoadingSpinner />;

// ❌ Avoid
const text = t("some.key"); // Might be undefined during loading
```

### 3. Use Interpolation for Dynamic Content

```typescript
// ✅ Good
const message = interpolate("card.nextCard", { time: "2 hours" });

// ❌ Avoid
const message = `${t("card.nextCard")} 2 hours`;
```

### 4. Provide Fallbacks

```typescript
// ✅ Good
const title = t("welcome.title") || "Daily Wisdom";

// ❌ Avoid
const title = t("welcome.title"); // Might be undefined
```

### 5. Test All Languages

```typescript
// Test with different languages
const testLanguages = ["en", "es", "fr"];
testLanguages.forEach(async (lang) => {
  await setLanguage(lang);
  // Test UI with this language
});
```

## 🔧 Customization

### Adding New Languages

```typescript
// In i18n/index.ts
const resources = {
  // ... existing languages
  de: {
    translation: {
      welcome: {
        title: "Tägliche Weisheit",
        subtitle: "Ihre tägliche Dosis bewusster Reflexion",
      },
      // ... rest of translations
    },
  },
};
```

### Adding New Translation Keys

```typescript
// Add to all language files
en: {
  translation: {
    // ... existing keys
    newFeature: {
      title: "New Feature",
      description: "This is a new feature",
    },
  },
},
```

### Custom Time Formatting

```typescript
// Integrate with date-fns or similar
import { format } from "date-fns";
import { de } from "date-fns/locale";

const formatTime = (date: Date, formatStr: string) => {
  return format(date, formatStr, { locale: de });
};
```

## 🎨 Integration with Design Systems

### Typography System

```typescript
// Combine with typography system
const titleStyle = {
  ...FONT_PRESETS.welcomeTitle,
  // Adjust for different languages
  fontSize: currentLanguage === "zh" ? 48 : 60,
};
```

### Animation System

```typescript
// Combine with animation system
const animatedText = Animated.timing(textOpacity, {
  ...ANIMATION_PRESETS.fadeIn,
  // Adjust timing for different languages
  duration: currentLanguage === "ar" ? 1000 : 800,
});
```

This internationalization system provides a solid foundation for multi-language support, making the Daily Wisdom app accessible to users worldwide! 🌍

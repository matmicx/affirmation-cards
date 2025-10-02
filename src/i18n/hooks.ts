// i18n Hook and Utilities
// Easy-to-use hooks and utilities for internationalization

import { useTranslation } from "react-i18next";
import { useCallback } from "react";

// Main translation hook
export const useI18n = () => {
  const { t, i18n } = useTranslation();

  return {
    t,
    changeLanguage: i18n.changeLanguage,
    currentLanguage: i18n.language,
    isReady: i18n.isInitialized,
  };
};

// Specialized hooks for different sections
export const useWelcomeText = () => {
  const { t } = useTranslation();

  return {
    title: t("welcome.title"),
    subtitle: t("welcome.subtitle"),
    explainer: {
      title: t("welcome.explainer.title"),
      body: t("welcome.explainer.body"),
    },
    cta: {
      title: t("welcome.cta.title"),
      body: t("welcome.cta.body"),
      button: t("welcome.cta.button"),
    },
  };
};

export const useCardText = () => {
  const { t } = useTranslation();

  return {
    loading: t("card.loading"),
    error: t("card.error"),
    retry: t("card.retry"),
    nextCard: t("card.nextCard"),
    hours: t("card.hours"),
    minutes: t("card.minutes"),
    seconds: t("card.seconds"),
  };
};

export const useSettingsText = () => {
  const { t } = useTranslation();

  return {
    title: t("settings.title"),
    fonts: {
      title: t("settings.fonts.title"),
      system: t("settings.fonts.system"),
      serif: t("settings.fonts.serif"),
      sans: t("settings.fonts.sans"),
      mono: t("settings.fonts.mono"),
      script: t("settings.fonts.script"),
    },
    themes: {
      title: t("settings.themes.title"),
      light: t("settings.themes.light"),
      dark: t("settings.themes.dark"),
      auto: t("settings.themes.auto"),
    },
    language: {
      title: t("settings.language.title"),
      english: t("settings.language.english"),
      spanish: t("settings.language.spanish"),
      french: t("settings.language.french"),
      german: t("settings.language.german"),
      italian: t("settings.language.italian"),
      portuguese: t("settings.language.portuguese"),
    },
    about: {
      title: t("settings.about.title"),
      version: t("settings.about.version"),
      description: t("settings.about.description"),
    },
  };
};

export const useCommonText = () => {
  const { t } = useTranslation();

  return {
    ok: t("common.ok"),
    cancel: t("common.cancel"),
    done: t("common.done"),
    back: t("common.back"),
    next: t("common.next"),
    previous: t("common.previous"),
    close: t("common.close"),
    save: t("common.save"),
    reset: t("common.reset"),
    loading: t("common.loading"),
    error: t("common.error"),
    success: t("common.success"),
    warning: t("common.warning"),
    info: t("common.info"),
  };
};

export const useAccessibilityText = () => {
  const { t } = useTranslation();

  return {
    welcomeScreen: t("accessibility.welcomeScreen"),
    cardDisplay: t("accessibility.cardDisplay"),
    settingsScreen: t("accessibility.settingsScreen"),
    fontToggle: t("accessibility.fontToggle"),
    themeToggle: t("accessibility.themeToggle"),
    languageSelector: t("accessibility.languageSelector"),
    countdownBadge: t("accessibility.countdownBadge"),
    beginButton: t("accessibility.beginButton"),
    cardText: t("accessibility.cardText"),
    backgroundImage: t("accessibility.backgroundImage"),
    navigationDots: t("accessibility.navigationDots"),
  };
};

export const useErrorText = () => {
  const { t } = useTranslation();

  return {
    networkError: t("errors.networkError"),
    serverError: t("errors.serverError"),
    unknownError: t("errors.unknownError"),
    cardLoadError: t("errors.cardLoadError"),
    settingsSaveError: t("errors.settingsSaveError"),
    welcomeResetError: t("errors.welcomeResetError"),
  };
};

export const useNotificationText = () => {
  const { t } = useTranslation();

  return {
    newCardAvailable: t("notifications.newCardAvailable"),
    dailyReminder: t("notifications.dailyReminder"),
    settingsSaved: t("notifications.settingsSaved"),
    welcomeReset: t("notifications.welcomeReset"),
  };
};

// Time formatting utilities
export const useTimeFormat = () => {
  const { t } = useTranslation();

  const formatTime = useCallback(
    (date: Date, format: "short" | "long" | "time" | "datetime" = "short") => {
      const formatKey = `time.formats.${format}`;
      // This would integrate with a proper date formatting library like date-fns
      // For now, return a simple format
      return date.toLocaleDateString();
    },
    [t]
  );

  const formatRelativeTime = useCallback(
    (date: Date) => {
      const now = new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );

      if (diffInMinutes < 1) {
        return t("time.relative.now");
      } else if (diffInMinutes < 60) {
        return t("time.relative.minutesAgo", { count: diffInMinutes });
      } else {
        const diffInHours = Math.floor(diffInMinutes / 60);
        return t("time.relative.hoursAgo", { count: diffInHours });
      }
    },
    [t]
  );

  return {
    formatTime,
    formatRelativeTime,
  };
};

// Language management utilities
export const useLanguageManager = () => {
  const { changeLanguage, currentLanguage } = useI18n();

  const availableLanguages = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "es", name: "Spanish", nativeName: "Español" },
    { code: "fr", name: "French", nativeName: "Français" },
    { code: "de", name: "German", nativeName: "Deutsch" },
    { code: "it", name: "Italian", nativeName: "Italiano" },
    { code: "pt", name: "Portuguese", nativeName: "Português" },
  ];

  const setLanguage = useCallback(
    async (languageCode: string) => {
      try {
        await changeLanguage(languageCode);
        // You could save the language preference to AsyncStorage here
        return true;
      } catch (error) {
        console.error("Failed to change language:", error);
        return false;
      }
    },
    [changeLanguage]
  );

  const getCurrentLanguageInfo = useCallback(() => {
    return (
      availableLanguages.find((lang) => lang.code === currentLanguage) ||
      availableLanguages[0]
    );
  }, [currentLanguage]);

  return {
    availableLanguages,
    currentLanguage,
    setLanguage,
    getCurrentLanguageInfo,
  };
};

// Text interpolation utilities
export const useTextInterpolation = () => {
  const { t } = useTranslation();

  const interpolate = useCallback(
    (key: string, values?: Record<string, any>) => {
      return t(key, values);
    },
    [t]
  );

  const pluralize = useCallback(
    (key: string, count: number, values?: Record<string, any>) => {
      return t(key, { count, ...values });
    },
    [t]
  );

  return {
    interpolate,
    pluralize,
  };
};

// Type definitions for better IDE support
export type LanguageCode = "en" | "es" | "fr" | "de" | "it" | "pt";
export type TranslationKey = string;
export type TranslationValues = Record<string, any>;

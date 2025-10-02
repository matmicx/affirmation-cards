// Internationalization Configuration
// Centralized text management and multi-language support

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Translation resources
const resources = {
  en: {
    translation: {
      // App metadata
      app: {
        name: "Daily Wisdom",
        tagline: "Your daily dose of mindful reflection",
      },

      // Welcome screen
      welcome: {
        title: "Daily Wisdom",
        subtitle: "Your daily dose of mindful reflection",
        explainer: {
          title: "What to expect",
          body: "Every 24 hours you'll receive one short wisdom card.\n\nTake a mindful moment, read slowly, and let it settle. A subtle countdown shows when the next card arrives.",
        },
        cta: {
          title: "Ready?",
          body: "Begin a gentle, daily practice.",
          button: "Begin Your Journey",
        },
      },

      // Card display
      card: {
        loading: "Loading your wisdom...",
        error: "Unable to load wisdom card",
        retry: "Try again",
        nextCard: "Next card in",
        hours: "hours",
        minutes: "minutes",
        seconds: "seconds",
      },

      // Settings
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
          german: "Deutsch",
          italian: "Italiano",
          portuguese: "Português",
        },
        about: {
          title: "About",
          version: "Version",
          description: "A gentle daily practice for mindful reflection.",
        },
      },

      // Common UI elements
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
      },

      // Accessibility
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
      },

      // Error messages
      errors: {
        networkError: "Network connection error",
        serverError: "Server error occurred",
        unknownError: "An unknown error occurred",
        cardLoadError: "Failed to load wisdom card",
        settingsSaveError: "Failed to save settings",
        welcomeResetError: "Failed to reset welcome screen",
      },

      // Notifications
      notifications: {
        newCardAvailable: "New wisdom card available",
        dailyReminder: "Your daily wisdom awaits",
        settingsSaved: "Settings saved successfully",
        welcomeReset: "Welcome screen reset",
      },

      // Time formats
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
      },

      // Wisdom card categories (if you want to categorize)
      categories: {
        mindfulness: "Mindfulness",
        gratitude: "Gratitude",
        selfCompassion: "Self-Compassion",
        growth: "Personal Growth",
        relationships: "Relationships",
        purpose: "Purpose",
        resilience: "Resilience",
        wisdom: "Wisdom",
      },
    },
  },

  es: {
    translation: {
      // App metadata
      app: {
        name: "Sabiduría Diaria",
        tagline: "Tu dosis diaria de reflexión consciente",
      },

      // Welcome screen
      welcome: {
        title: "Sabiduría Diaria",
        subtitle: "Tu dosis diaria de reflexión consciente",
        explainer: {
          title: "Qué esperar",
          body: "Cada 24 horas recibirás una tarjeta de sabiduría breve.\n\nTómate un momento consciente, lee lentamente y deja que se asiente. Un contador sutil muestra cuándo llega la siguiente tarjeta.",
        },
        cta: {
          title: "¿Listo?",
          body: "Comienza una práctica diaria suave.",
          button: "Comenzar Tu Viaje",
        },
      },

      // Card display
      card: {
        loading: "Cargando tu sabiduría...",
        error: "No se pudo cargar la tarjeta de sabiduría",
        retry: "Intentar de nuevo",
        nextCard: "Próxima tarjeta en",
        hours: "horas",
        minutes: "minutos",
        seconds: "segundos",
      },

      // Settings
      settings: {
        title: "Configuración",
        fonts: {
          title: "Estilo de Fuente",
          system: "Predeterminado del Sistema",
          serif: "Baskerville",
          sans: "Helvetica",
          mono: "Menlo",
          script: "Great Vibes",
        },
        themes: {
          title: "Tema",
          light: "Claro",
          dark: "Oscuro",
          auto: "Automático",
        },
        language: {
          title: "Idioma",
          english: "English",
          spanish: "Español",
          french: "Français",
          german: "Deutsch",
          italian: "Italiano",
          portuguese: "Português",
        },
        about: {
          title: "Acerca de",
          version: "Versión",
          description:
            "Una práctica diaria suave para la reflexión consciente.",
        },
      },

      // Common UI elements
      common: {
        ok: "OK",
        cancel: "Cancelar",
        done: "Hecho",
        back: "Atrás",
        next: "Siguiente",
        previous: "Anterior",
        close: "Cerrar",
        save: "Guardar",
        reset: "Restablecer",
        loading: "Cargando...",
        error: "Error",
        success: "Éxito",
        warning: "Advertencia",
        info: "Información",
      },

      // Accessibility
      accessibility: {
        welcomeScreen:
          "Pantalla de bienvenida con introducción de la aplicación",
        cardDisplay: "Pantalla de tarjeta de sabiduría diaria",
        settingsScreen: "Configuración y preferencias de la aplicación",
        fontToggle: "Alternar estilo de fuente",
        themeToggle: "Alternar tema",
        languageSelector: "Seleccionar idioma",
        countdownBadge: "Tiempo hasta la próxima tarjeta",
        beginButton: "Comenzar tu viaje de sabiduría diaria",
        cardText: "Texto de la tarjeta de sabiduría",
        backgroundImage: "Imagen de fondo",
        navigationDots: "Indicadores de navegación de página",
      },

      // Error messages
      errors: {
        networkError: "Error de conexión de red",
        serverError: "Ocurrió un error del servidor",
        unknownError: "Ocurrió un error desconocido",
        cardLoadError: "Error al cargar la tarjeta de sabiduría",
        settingsSaveError: "Error al guardar la configuración",
        welcomeResetError: "Error al restablecer la pantalla de bienvenida",
      },

      // Notifications
      notifications: {
        newCardAvailable: "Nueva tarjeta de sabiduría disponible",
        dailyReminder: "Tu sabiduría diaria te espera",
        settingsSaved: "Configuración guardada exitosamente",
        welcomeReset: "Pantalla de bienvenida restablecida",
      },

      // Time formats
      time: {
        formats: {
          short: "d MMM",
          long: "d 'de' MMMM 'de' yyyy",
          time: "HH:mm",
          datetime: "d MMM, HH:mm",
        },
        relative: {
          now: "ahora",
          minutesAgo: "hace {{count}} minuto",
          minutesAgo_plural: "hace {{count}} minutos",
          hoursAgo: "hace {{count}} hora",
          hoursAgo_plural: "hace {{count}} horas",
          daysAgo: "hace {{count}} día",
          daysAgo_plural: "hace {{count}} días",
        },
      },

      // Wisdom card categories
      categories: {
        mindfulness: "Atención Plena",
        gratitude: "Gratitud",
        selfCompassion: "Autocompasión",
        growth: "Crecimiento Personal",
        relationships: "Relaciones",
        purpose: "Propósito",
        resilience: "Resiliencia",
        wisdom: "Sabiduría",
      },
    },
  },

  fr: {
    translation: {
      // App metadata
      app: {
        name: "Sagesse Quotidienne",
        tagline: "Votre dose quotidienne de réflexion consciente",
      },

      // Welcome screen
      welcome: {
        title: "Sagesse Quotidienne",
        subtitle: "Votre dose quotidienne de réflexion consciente",
        explainer: {
          title: "À quoi s'attendre",
          body: "Toutes les 24 heures, vous recevrez une courte carte de sagesse.\n\nPrenez un moment conscient, lisez lentement et laissez-la s'installer. Un compte à rebours subtil indique quand la prochaine carte arrive.",
        },
        cta: {
          title: "Prêt ?",
          body: "Commencez une pratique quotidienne douce.",
          button: "Commencer Votre Voyage",
        },
      },

      // Card display
      card: {
        loading: "Chargement de votre sagesse...",
        error: "Impossible de charger la carte de sagesse",
        retry: "Réessayer",
        nextCard: "Prochaine carte dans",
        hours: "heures",
        minutes: "minutes",
        seconds: "secondes",
      },

      // Settings
      settings: {
        title: "Paramètres",
        fonts: {
          title: "Style de Police",
          system: "Par Défaut du Système",
          serif: "Baskerville",
          sans: "Helvetica",
          mono: "Menlo",
          script: "Great Vibes",
        },
        themes: {
          title: "Thème",
          light: "Clair",
          dark: "Sombre",
          auto: "Automatique",
        },
        language: {
          title: "Langue",
          english: "English",
          spanish: "Español",
          french: "Français",
          german: "Deutsch",
          italian: "Italiano",
          portuguese: "Português",
        },
        about: {
          title: "À Propos",
          version: "Version",
          description:
            "Une pratique quotidienne douce pour la réflexion consciente.",
        },
      },

      // Common UI elements
      common: {
        ok: "OK",
        cancel: "Annuler",
        done: "Terminé",
        back: "Retour",
        next: "Suivant",
        previous: "Précédent",
        close: "Fermer",
        save: "Enregistrer",
        reset: "Réinitialiser",
        loading: "Chargement...",
        error: "Erreur",
        success: "Succès",
        warning: "Avertissement",
        info: "Information",
      },

      // Accessibility
      accessibility: {
        welcomeScreen: "Écran d'accueil avec introduction de l'application",
        cardDisplay: "Affichage de la carte de sagesse quotidienne",
        settingsScreen: "Paramètres et préférences de l'application",
        fontToggle: "Basculer le style de police",
        themeToggle: "Basculer le thème",
        languageSelector: "Sélectionner la langue",
        countdownBadge: "Temps jusqu'à la prochaine carte",
        beginButton: "Commencer votre voyage de sagesse quotidienne",
        cardText: "Texte de la carte de sagesse",
        backgroundImage: "Image de fond",
        navigationDots: "Indicateurs de navigation de page",
      },

      // Error messages
      errors: {
        networkError: "Erreur de connexion réseau",
        serverError: "Erreur du serveur",
        unknownError: "Une erreur inconnue s'est produite",
        cardLoadError: "Échec du chargement de la carte de sagesse",
        settingsSaveError: "Échec de la sauvegarde des paramètres",
        welcomeResetError: "Échec de la réinitialisation de l'écran d'accueil",
      },

      // Notifications
      notifications: {
        newCardAvailable: "Nouvelle carte de sagesse disponible",
        dailyReminder: "Votre sagesse quotidienne vous attend",
        settingsSaved: "Paramètres enregistrés avec succès",
        welcomeReset: "Écran d'accueil réinitialisé",
      },

      // Time formats
      time: {
        formats: {
          short: "d MMM",
          long: "d MMMM yyyy",
          time: "HH:mm",
          datetime: "d MMM, HH:mm",
        },
        relative: {
          now: "maintenant",
          minutesAgo: "il y a {{count}} minute",
          minutesAgo_plural: "il y a {{count}} minutes",
          hoursAgo: "il y a {{count}} heure",
          hoursAgo_plural: "il y a {{count}} heures",
          daysAgo: "il y a {{count}} jour",
          daysAgo_plural: "il y a {{count}} jours",
        },
      },

      // Wisdom card categories
      categories: {
        mindfulness: "Pleine Conscience",
        gratitude: "Gratitude",
        selfCompassion: "Auto-Compassion",
        growth: "Développement Personnel",
        relationships: "Relations",
        purpose: "But",
        resilience: "Résilience",
        wisdom: "Sagesse",
      },
    },
  },
};

// Initialize i18next
i18n.use(initReactI18next).init({
  resources,
  lng: "en", // Default language
  fallbackLng: "en", // Fallback language

  interpolation: {
    escapeValue: false, // React already escapes values
  },

  // Namespace configuration
  defaultNS: "translation",
  ns: ["translation"],

  // Detection options (for future use)
  detection: {
    order: ["localStorage", "navigator", "htmlTag"],
    caches: ["localStorage"],
  },

  // React i18next options
  react: {
    useSuspense: false, // Disable suspense for React Native
  },
});

export default i18n;

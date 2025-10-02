// Animation Design System
// Centralized configuration for all animations in the app

import { Easing, Animated } from "react-native";

export const ANIMATION_CONFIG = {
  // Timing durations (in milliseconds)
  duration: {
    fast: 200,
    normal: 400,
    slow: 800,
    verySlow: 1200,
    orbit: 25000, // 25 seconds for full orbit
    pulse: 1600, // pulse cycle duration
  },

  // Easing functions
  easing: {
    linear: "linear",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    quadOut: "quad-out",
    quadIn: "quad-in",
  },

  // CTA Button & Orbit System
  cta: {
    // Button dimensions
    button: {
      size: 180,
      radius: 90,
      strokeWidth: "hairline", // or specific pixel value
    },

    // Orbit dot
    orbitDot: {
      size: 6,
      radius: 3,
      glowSmall: {
        size: 14,
        radius: 7,
        opacity: 0.25,
      },
      glowLarge: {
        size: 24,
        radius: 12,
        opacity: 0.12,
      },
    },

    // Aura/pulse system
    aura: {
      size: 180,
      radius: 90,
      opacity: {
        min: 0,
        max: 0.35,
        secondary: 0.25,
      },
      scale: {
        start: 0.9,
        end: 1.35,
        secondary: 1.6,
      },
    },

    // Fade-in timing
    fadeIn: {
      delay: 120,
      duration: 1200,
      easing: "quad-out",
    },
  },

  // Welcome Screen Transitions
  welcome: {
    crossfade: {
      duration: 800,
      easing: "ease-in-out",
    },
    pageSnap: {
      threshold: 0.05, // 5% of screen width
    },
  },

  // Card Display Animations
  card: {
    transitionDuration: 300,
    textOpacity: 0.7,
    shadowRadius: 6,
    // Card entrance animations
    entrance: {
      fadeIn: {
        duration: 600,
        easing: "ease-out",
      },
      slideUp: {
        duration: 800,
        easing: "ease-out",
        offset: 50, // pixels to slide up from
      },
      scaleIn: {
        duration: 500,
        easing: "ease-out",
        scale: {
          from: 0.95,
          to: 1.0,
        },
      },
    },
    // Card interaction animations
    interaction: {
      press: {
        duration: 150,
        scale: 0.98,
        easing: "ease-in-out",
      },
      hover: {
        duration: 200,
        scale: 1.02,
        easing: "ease-out",
      },
    },
    // Text animations
    text: {
      fadeIn: {
        duration: 800,
        delay: 200,
        easing: "ease-out",
      },
      typewriter: {
        duration: 2000,
        easing: "linear",
      },
    },
  },

  // Badge Animations (CountdownBadge)
  badge: {
    fadeDelay: 20000, // 20 seconds before fade
    fadeDuration: 500,
    activeOpacity: 1.0,
    fadedOpacity: 0.4,
    pulseDuration: 1600,
    // Badge expansion animation
    expansion: {
      duration: 300,
      easing: "ease-out",
      scale: {
        from: 1.0,
        to: 1.1,
      },
    },
    // Badge collapse animation
    collapse: {
      duration: 200,
      easing: "ease-in",
      scale: {
        from: 1.1,
        to: 1.0,
      },
    },
    // Progress ring animation
    progress: {
      duration: 1000,
      easing: "ease-in-out",
    },
    // Dot pulse animation
    dotPulse: {
      duration: 800,
      easing: "ease-in-out",
      scale: {
        from: 1.0,
        to: 1.3,
      },
    },
  },

  // Page/Scene Transitions
  pageTransition: {
    // Welcome screen to main app
    welcomeToMain: {
      duration: 800,
      easing: "ease-in-out",
      type: "crossfade", // crossfade, slide, scale
    },
    // Card screen transitions
    cardTransition: {
      duration: 400,
      easing: "ease-out",
      slideOffset: 30,
    },
    // Modal presentations
    modal: {
      present: {
        duration: 300,
        easing: "ease-out",
        scale: {
          from: 0.9,
          to: 1.0,
        },
        opacity: {
          from: 0,
          to: 1,
        },
      },
      dismiss: {
        duration: 250,
        easing: "ease-in",
        scale: {
          from: 1.0,
          to: 0.95,
        },
        opacity: {
          from: 1,
          to: 0,
        },
      },
    },
  },

  // Gesture Response Animations
  gesture: {
    // Pan responder feedback
    pan: {
      resistance: 0.3, // resistance factor for overscroll
      threshold: 10, // minimum distance to trigger
      velocityThreshold: 0.5, // minimum velocity
    },
    // Drag feedback
    drag: {
      scale: 1.05, // scale when dragging
      opacity: 0.8, // opacity when dragging
      shadowRadius: 8, // shadow when lifted
    },
    // Swipe gestures
    swipe: {
      threshold: 50, // minimum swipe distance
      velocity: 0.3, // minimum swipe velocity
      bounceBack: {
        duration: 300,
        easing: "ease-out",
      },
    },
    // Tap feedback
    tap: {
      duration: 100,
      scale: 0.95,
      easing: "ease-in-out",
    },
    // Long press
    longPress: {
      duration: 500, // time to trigger
      scale: 1.1,
      hapticFeedback: true,
    },
  },

  // Loading & State Animations
  loading: {
    // Spinner animations
    spinner: {
      duration: 1000,
      easing: "linear",
    },
    // Skeleton loading
    skeleton: {
      shimmer: {
        duration: 1500,
        easing: "ease-in-out",
      },
      pulse: {
        duration: 2000,
        easing: "ease-in-out",
      },
    },
    // Progress indicators
    progress: {
      bar: {
        duration: 300,
        easing: "ease-out",
      },
      circular: {
        duration: 500,
        easing: "ease-in-out",
      },
    },
  },

  // Micro-interactions
  micro: {
    // Button press feedback
    buttonPress: {
      duration: 100,
      scale: 0.98,
      easing: "ease-in-out",
    },
    // Icon animations
    icon: {
      rotate: {
        duration: 300,
        easing: "ease-out",
      },
      bounce: {
        duration: 400,
        easing: "ease-out",
        scale: {
          from: 1.0,
          to: 1.2,
          back: 1.0,
        },
      },
    },
    // Notification animations
    notification: {
      slideIn: {
        duration: 300,
        easing: "ease-out",
        offset: 100,
      },
      slideOut: {
        duration: 250,
        easing: "ease-in",
        offset: 100,
      },
    },
  },
} as const;

// Helper function to convert easing strings to Easing functions
const getEasingFunction = (easingString: string) => {
  switch (easingString) {
    case "linear":
      return Easing.linear;
    case "ease-in":
      return Easing.in(Easing.ease);
    case "ease-out":
      return Easing.out(Easing.ease);
    case "ease-in-out":
      return Easing.inOut(Easing.ease);
    case "quad-out":
      return Easing.out(Easing.quad);
    case "quad-in":
      return Easing.in(Easing.quad);
    default:
      return Easing.inOut(Easing.ease);
  }
};

// Helper functions for common animation patterns
export const createTimingConfig = (
  duration: number,
  easing: string = ANIMATION_CONFIG.easing.easeInOut
) => ({
  duration,
  easing: getEasingFunction(easing),
  useNativeDriver: true,
});

export const createLoopConfig = (
  duration: number,
  easing: string = ANIMATION_CONFIG.easing.linear
) => ({
  duration,
  easing: getEasingFunction(easing),
  useNativeDriver: true,
});

// Animation presets
export const ANIMATION_PRESETS = {
  fadeIn: createTimingConfig(
    ANIMATION_CONFIG.duration.normal,
    ANIMATION_CONFIG.easing.easeOut
  ),
  fadeOut: createTimingConfig(
    ANIMATION_CONFIG.duration.normal,
    ANIMATION_CONFIG.easing.easeIn
  ),
  slideIn: createTimingConfig(
    ANIMATION_CONFIG.duration.slow,
    ANIMATION_CONFIG.easing.easeOut
  ),
  pulse: createLoopConfig(
    ANIMATION_CONFIG.duration.pulse,
    ANIMATION_CONFIG.easing.quadOut
  ),
  orbit: createLoopConfig(
    ANIMATION_CONFIG.duration.orbit,
    ANIMATION_CONFIG.easing.linear
  ),

  // Card animations
  cardEntrance: createTimingConfig(
    ANIMATION_CONFIG.card.entrance.fadeIn.duration,
    ANIMATION_CONFIG.card.entrance.fadeIn.easing
  ),
  cardPress: createTimingConfig(
    ANIMATION_CONFIG.card.interaction.press.duration,
    ANIMATION_CONFIG.card.interaction.press.easing
  ),

  // Badge animations
  badgeExpansion: createTimingConfig(
    ANIMATION_CONFIG.badge.expansion.duration,
    ANIMATION_CONFIG.badge.expansion.easing
  ),
  badgeCollapse: createTimingConfig(
    ANIMATION_CONFIG.badge.collapse.duration,
    ANIMATION_CONFIG.badge.collapse.easing
  ),

  // Page transitions
  pageTransition: createTimingConfig(
    ANIMATION_CONFIG.pageTransition.welcomeToMain.duration,
    ANIMATION_CONFIG.pageTransition.welcomeToMain.easing
  ),
  modalPresent: createTimingConfig(
    ANIMATION_CONFIG.pageTransition.modal.present.duration,
    ANIMATION_CONFIG.pageTransition.modal.present.easing
  ),

  // Gesture responses
  tapFeedback: createTimingConfig(
    ANIMATION_CONFIG.gesture.tap.duration,
    ANIMATION_CONFIG.gesture.tap.easing
  ),
  swipeBounce: createTimingConfig(
    ANIMATION_CONFIG.gesture.swipe.bounceBack.duration,
    ANIMATION_CONFIG.gesture.swipe.bounceBack.easing
  ),

  // Micro-interactions
  buttonPress: createTimingConfig(
    ANIMATION_CONFIG.micro.buttonPress.duration,
    ANIMATION_CONFIG.micro.buttonPress.easing
  ),
  iconBounce: createTimingConfig(
    ANIMATION_CONFIG.micro.icon.bounce.duration,
    ANIMATION_CONFIG.micro.icon.bounce.easing
  ),

  // Loading states
  spinner: createLoopConfig(
    ANIMATION_CONFIG.loading.spinner.duration,
    ANIMATION_CONFIG.loading.spinner.easing
  ),
  skeletonPulse: createLoopConfig(
    ANIMATION_CONFIG.loading.skeleton.pulse.duration,
    ANIMATION_CONFIG.loading.skeleton.pulse.easing
  ),
} as const;

// Specialized animation helpers
export const createCardAnimation = (
  type: "entrance" | "interaction" | "text",
  variant: string
) => {
  const config = (ANIMATION_CONFIG.card as any)[type][variant];
  return createTimingConfig(config.duration, config.easing);
};

export const createBadgeAnimation = (
  type: "expansion" | "collapse" | "progress" | "dotPulse"
) => {
  const config = (ANIMATION_CONFIG.badge as any)[type];
  return createTimingConfig(config.duration, config.easing);
};

export const createPageTransition = (
  type: "welcomeToMain" | "cardTransition"
) => {
  const config = (ANIMATION_CONFIG.pageTransition as any)[type];
  return createTimingConfig(config.duration, config.easing);
};

export const createGestureResponse = (type: "tap" | "swipe") => {
  const config = (ANIMATION_CONFIG.gesture as any)[type];
  if (type === "tap") {
    return createTimingConfig(config.duration, config.easing);
  } else {
    return createTimingConfig(
      config.bounceBack.duration,
      config.bounceBack.easing
    );
  }
};

export const createMicroInteraction = (type: "buttonPress") => {
  const config = (ANIMATION_CONFIG.micro as any)[type];
  return createTimingConfig(config.duration, config.easing);
};

// Animation sequence helpers
export const createSequence = (animations: any[], delay: number = 0) => {
  if (delay > 0) {
    return Animated.sequence([Animated.delay(delay), ...animations]);
  }
  return Animated.sequence(animations);
};

export const createParallel = (animations: any[]) => {
  return Animated.parallel(animations);
};

// Scale animation helper
export const createScaleAnimation = (
  animatedValue: any,
  from: number,
  to: number,
  duration: number,
  easing: string = "ease-in-out"
) => {
  return Animated.timing(animatedValue, {
    toValue: to,
    duration,
    easing: getEasingFunction(easing),
    useNativeDriver: true,
  });
};

// Opacity animation helper
export const createOpacityAnimation = (
  animatedValue: any,
  from: number,
  to: number,
  duration: number,
  easing: string = "ease-in-out"
) => {
  return Animated.timing(animatedValue, {
    toValue: to,
    duration,
    easing: getEasingFunction(easing),
    useNativeDriver: true,
  });
};

// Transform animation helper
export const createTransformAnimation = (
  animatedValue: any,
  transforms: any,
  duration: number,
  easing: string = "ease-in-out"
) => {
  return Animated.timing(animatedValue, {
    toValue: transforms,
    duration,
    easing: getEasingFunction(easing),
    useNativeDriver: true,
  });
};

// Type definitions for better IDE support
export type AnimationDuration = keyof typeof ANIMATION_CONFIG.duration;
export type AnimationEasing = keyof typeof ANIMATION_CONFIG.easing;
export type AnimationPreset = keyof typeof ANIMATION_PRESETS;

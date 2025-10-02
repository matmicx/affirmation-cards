import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FONT_PRESETS } from "../theme/typography";
import Svg, { Defs, LinearGradient, Stop, Path } from "react-native-svg";

const BADGE_SIZE = 40;
const BADGE_RADIUS = BADGE_SIZE / 2;
const STROKE_WIDTH = 1;
const CHIP_PADDING_HORIZONTAL = 20;
const INNER_HEIGHT = BADGE_SIZE - STROKE_WIDTH;
const START_DOT_DIAMETER = 8;
const MIN_CONTENT_WIDTH = 120;
const FADE_DELAY = 20000; // 20 seconds
const FADED_OPACITY = 0.4;
const ACTIVE_OPACITY = 1.0;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedPath = Animated.createAnimatedComponent(Path);

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export type CountdownBadgeProps = {
  progress: number;
  label: string;
  backgroundColor: string;
  trackColor: string;
  strokeColor: string;
  textColor: string;
  fontFamily?: string;
};

function lightenHex(color: string, amount: number) {
  const hex = color.startsWith("#") ? color.slice(1) : color;
  if (hex.length !== 6) {
    return color;
  }
  const num = parseInt(hex, 16);
  const r = (num >> 16) & 0xff;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  const tint = (channel: number) =>
    Math.max(0, Math.min(255, Math.round(channel + (255 - channel) * amount)));
  const newColor = (tint(r) << 16) | (tint(g) << 8) | tint(b);
  return `#${newColor.toString(16).padStart(6, "0")}`;
}

export function CountdownBadge({
  progress,
  label,
  backgroundColor,
  trackColor,
  strokeColor,
  textColor,
  fontFamily,
}: CountdownBadgeProps) {
  const [expanded, setExpanded] = useState(false);
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const [renderWidth, setRenderWidth] = useState(BADGE_SIZE);
  const [isActive, setIsActive] = useState(true);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const strokeOpacity = useRef(new Animated.Value(ACTIVE_OPACITY)).current;
  const dotPulse = useRef(new Animated.Value(1)).current;

  const modeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(progress)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  const resetFadeTimer = useCallback(() => {
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
    }

    setIsActive(true);
    Animated.timing(strokeOpacity, {
      toValue: ACTIVE_OPACITY,
      duration: 200,
      useNativeDriver: false,
    }).start();

    fadeTimeoutRef.current = setTimeout(() => {
      setIsActive(false);
      Animated.timing(strokeOpacity, {
        toValue: FADED_OPACITY,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }, FADE_DELAY);
  }, [strokeOpacity]);

  useEffect(() => {
    resetFadeTimer();
    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, [resetFadeTimer]);

  // Pulsing animation for the start dot
  useEffect(() => {
    const createPulseAnimation = () => {
      return Animated.sequence([
        Animated.timing(dotPulse, {
          toValue: 0.6,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(dotPulse, {
          toValue: 1,
          duration: 500,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]);
    };

    const startPulse = () => {
      createPulseAnimation().start(() => {
        // Restart the animation after completion
        startPulse();
      });
    };

    startPulse();
  }, [dotPulse]);

  const computeTargetWidth = useCallback((contentWidth: number) => {
    const content = Math.max(MIN_CONTENT_WIDTH, Math.max(0, contentWidth));
    const required = BADGE_RADIUS * 2 + CHIP_PADDING_HORIZONTAL * 2 + content;
    return Math.max(BADGE_SIZE, required);
  }, []);

  const updateRenderWidth = useCallback(
    (value: number, contentWidth?: number) => {
      const target = computeTargetWidth(contentWidth ?? measuredWidth);
      const extra = Math.max(0, target - BADGE_SIZE);
      const clampedValue = clamp(value, 0, 1);
      const computedWidth = BADGE_SIZE + extra * clampedValue;

      setRenderWidth((current) => {
        // While expanded (value ≈ 1), avoid shrinking below current width.
        if (clampedValue > 0.99 && computedWidth < current) {
          return current;
        }
        return computedWidth;
      });
    },
    [computeTargetWidth, measuredWidth]
  );

  useEffect(() => {
    updateRenderWidth((modeAnim as any)._value ?? 0);
    const id = modeAnim.addListener(({ value }) => updateRenderWidth(value));
    return () => modeAnim.removeListener(id);
  }, [modeAnim, updateRenderWidth]);

  const innerWidth = Math.max(renderWidth - STROKE_WIDTH, INNER_HEIGHT);

  const trackPerimeter = useMemo(() => {
    const straight = Math.max(0, innerWidth - INNER_HEIGHT);
    return 2 * straight + Math.PI * INNER_HEIGHT;
  }, [innerWidth]);

  const baseDashoffset = useMemo(
    () =>
      progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [trackPerimeter, 0],
      }),
    [progressAnim, trackPerimeter]
  );

  const adjustedDashoffset = useMemo(
    () => Animated.modulo(baseDashoffset, trackPerimeter),
    [baseDashoffset, trackPerimeter]
  );

  const pillPath = useMemo(() => {
    const left = STROKE_WIDTH / 2;
    const top = STROKE_WIDTH / 2;
    const right = left + innerWidth;
    const bottom = top + INNER_HEIGHT;
    const radius = INNER_HEIGHT / 2;
    const startX = left + innerWidth / 2;
    return (
      `M ${startX} ${top} ` +
      `L ${right - radius} ${top} ` +
      `A ${radius} ${radius} 0 0 1 ${right} ${top + radius} ` +
      `L ${right} ${bottom - radius} ` +
      `A ${radius} ${radius} 0 0 1 ${right - radius} ${bottom} ` +
      `L ${left + radius} ${bottom} ` +
      `A ${radius} ${radius} 0 0 1 ${left} ${bottom - radius} ` +
      `L ${left} ${top + radius} ` +
      `A ${radius} ${radius} 0 0 1 ${left + radius} ${top} ` +
      `L ${startX} ${top}`
    );
  }, [innerWidth]);

  const gradientIdRef = useRef(
    `countdown-gradient-${Math.random().toString(36).slice(2)}`
  );
  const effectiveStrokeColor = useMemo(() => {
    // Only apply white stroke when in circular mode (not expanded) and not active
    return !expanded && !isActive ? "#ffffff" : strokeColor;
  }, [expanded, isActive, strokeColor]);

  const gradientStart = useMemo(
    () => lightenHex(effectiveStrokeColor, 0.45),
    [effectiveStrokeColor]
  );

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  const chipOpacity = modeAnim.interpolate({
    inputRange: [0, 0.82, 0.92, 1],
    outputRange: [0, 0, 0.6, 1],
    extrapolate: "clamp",
  });

  const animateTo = useCallback(
    (target: 0 | 1) => {
      resetFadeTimer(); // Reset timer on any interaction
      Animated.timing(modeAnim, {
        toValue: target,
        duration: 300,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (!finished) return;
        updateRenderWidth(target === 1 ? 1 : 0);
      });
    },
    [modeAnim, updateRenderWidth, resetFadeTimer]
  );

  const handleToggle = () => {
    if (expanded) {
      setExpanded(false);
      contentOpacity.stopAnimation();
      contentOpacity.setValue(0);
      animateTo(0);
    } else {
      setExpanded(true);
      contentOpacity.stopAnimation();
      contentOpacity.setValue(0);
      animateTo(1);
    }
  };

  useEffect(() => {
    if (!expanded) {
      contentOpacity.stopAnimation();
      contentOpacity.setValue(0);
      return;
    }

    contentOpacity.stopAnimation();
    contentOpacity.setValue(0);

    const delay = setTimeout(() => {
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }).start();
    }, 300);

    return () => {
      clearTimeout(delay);
      contentOpacity.stopAnimation();
    };
  }, [expanded, contentOpacity]);

  useEffect(() => {
    if (!expanded) {
      return;
    }
    const currentValue = (modeAnim as any)._value ?? 0;
    updateRenderWidth(currentValue);
  }, [expanded, modeAnim, updateRenderWidth]);

  useEffect(() => {
    if (!expanded) return;
    // Reset timer when expanded to prevent fading in descriptive mode
    resetFadeTimer();
    const timeout = setTimeout(() => {
      setExpanded(false);
      contentOpacity.stopAnimation();
      contentOpacity.setValue(0);
      animateTo(0);
    }, 60000);
    return () => clearTimeout(timeout);
  }, [expanded, animateTo, contentOpacity, resetFadeTimer]);

  return (
    <>
      <Text
        style={[styles.measureLabel, { color: textColor, fontFamily }]}
        numberOfLines={1}
        onLayout={({ nativeEvent }) => {
          const width = nativeEvent.layout.width;
          if (width > 0 && Math.abs(width - measuredWidth) > 0.5) {
            setMeasuredWidth(width);
            const currentValue = (modeAnim as any)._value ?? 0;
            updateRenderWidth(currentValue, width);
          }
        }}
      >
        {label}
      </Text>

      <AnimatedPressable
        onPress={handleToggle}
        style={[styles.container, { width: renderWidth }]}
      >
        <Animated.View
          pointerEvents="none"
          style={[
            styles.backgroundFill,
            { backgroundColor, opacity: chipOpacity },
          ]}
        />

        <Animated.View
          style={[
            styles.strokeWrapper,
            { width: renderWidth, opacity: strokeOpacity },
          ]}
        >
          <Svg
            width={renderWidth}
            height={BADGE_SIZE}
            viewBox={`0 0 ${renderWidth} ${BADGE_SIZE}`}
            preserveAspectRatio="none"
          >
            <Defs>
              <LinearGradient
                id={gradientIdRef.current}
                x1="0%"
                y1="50%"
                x2="100%"
                y2="50%"
              >
                <Stop offset="0%" stopColor={gradientStart} stopOpacity={1} />
                <Stop
                  offset="100%"
                  stopColor={effectiveStrokeColor}
                  stopOpacity={1}
                />
              </LinearGradient>
            </Defs>
            <AnimatedPath
              d={pillPath}
              stroke={trackColor}
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={`${trackPerimeter} ${trackPerimeter}`}
              strokeDashoffset={adjustedDashoffset}
              strokeLinecap="round"
              fill="none"
            />
            <AnimatedPath
              d={pillPath}
              stroke={`url(#${gradientIdRef.current})`}
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={`${trackPerimeter} ${trackPerimeter}`}
              strokeDashoffset={adjustedDashoffset}
              strokeLinecap="round"
              fill="none"
            />
          </Svg>
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[styles.labelWrapper, { opacity: contentOpacity }]}
        >
          <Text
            style={[styles.label, { color: textColor, fontFamily }]}
            numberOfLines={1}
          >
            {label}
          </Text>
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={[
            styles.startDot,
            {
              left: renderWidth / 2 - START_DOT_DIAMETER / 2,
              transform: [{ scale: dotPulse }],
            },
          ]}
        />
      </AnimatedPressable>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: BADGE_SIZE,
    justifyContent: "center",
  },
  backgroundFill: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BADGE_RADIUS,
  },
  strokeWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    height: BADGE_SIZE,
  },
  labelWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    height: BADGE_SIZE,
    justifyContent: "center",
    paddingLeft: BADGE_RADIUS + CHIP_PADDING_HORIZONTAL,
    paddingRight: BADGE_RADIUS + CHIP_PADDING_HORIZONTAL,
  },
  label: {
    ...FONT_PRESETS.cardBadge,
    textAlign: "center",
  },
  measureLabel: {
    position: "absolute",
    opacity: 0,
    ...FONT_PRESETS.cardBadge,
    left: -9999,
  },
  startDot: {
    position: "absolute",
    top: -START_DOT_DIAMETER / 2,
    width: START_DOT_DIAMETER,
    height: START_DOT_DIAMETER,
    borderRadius: START_DOT_DIAMETER / 2,
    backgroundColor: "#f8fafc",
  },
});

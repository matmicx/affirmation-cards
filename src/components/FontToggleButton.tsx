import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

import { useSettings } from "../context/SettingsContext";
import { resolveFontToggleColors } from "../theme/colors";

const BUTTON_SIZE = 40;
const BUTTON_RADIUS = BUTTON_SIZE / 2;
const FONT_MIN_SIZE = 18;
const FONT_MAX_SIZE = 30;
const FONT_LINE_HEIGHT_OFFSET = 6;
const LOWER_FRACTION = 0.5;
const UPPER_FRACTION = 0.1;
const FADE_DELAY = 20000; // 20 seconds
const FADED_OPACITY = 0.4;
const ACTIVE_OPACITY = 1.0;

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export type FontToggleButtonProps = {
  strokeColor: string;
  labelColor: string;
  value: number;
  onChange: (value: number) => void;
  onCenterYChange?: (centerY: number) => void;
  tone?: "light" | "dark"; // Add tone prop
};

export function FontToggleButton({
  strokeColor,
  labelColor,
  value,
  onChange,
  onCenterYChange,
  tone = "light", // Default to light tone
}: FontToggleButtonProps) {
  const { font, cycleFont } = useSettings();
  const { height } = useWindowDimensions();

  // Get themed colors
  const fontToggleColors = resolveFontToggleColors(tone);

  const progress = useRef(new Animated.Value(clamp(value, 0, 1))).current;
  const valueRef = useRef(clamp(value, 0, 1));
  const startValueRef = useRef(valueRef.current);

  const [isActive, setIsActive] = useState(true);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const opacity = useRef(new Animated.Value(ACTIVE_OPACITY)).current;

  const resetFadeTimer = useCallback(() => {
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
    }

    setIsActive(true);
    Animated.timing(opacity, {
      toValue: ACTIVE_OPACITY,
      duration: 200,
      useNativeDriver: false,
    }).start();

    fadeTimeoutRef.current = setTimeout(() => {
      setIsActive(false);
      Animated.timing(opacity, {
        toValue: FADED_OPACITY,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }, FADE_DELAY);
  }, [opacity]);

  useEffect(() => {
    resetFadeTimer();
    return () => {
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
    };
  }, [resetFadeTimer]);

  useEffect(() => {
    const clamped = clamp(value, 0, 1);
    valueRef.current = clamped;
    Animated.spring(progress, {
      toValue: clamped,
      tension: 120,
      friction: 16,
      useNativeDriver: false,
    }).start();
  }, [value, progress]);

  const sliderRange = useMemo(
    () => Math.max(1, height * (LOWER_FRACTION - UPPER_FRACTION)),
    [height]
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dy) > 4,
        onPanResponderGrant: () => {
          startValueRef.current = valueRef.current;
          resetFadeTimer();
        },
        onPanResponderMove: (_, gesture) => {
          const delta = gesture.dy * -1;
          const progressDelta = delta / sliderRange;
          const next = clamp(startValueRef.current + progressDelta, 0, 1);
          progress.setValue(next);
          valueRef.current = next;
          onChange(next);
        },
        onPanResponderRelease: () => {
          // ensure animated value aligns with final state
          const finalValue = valueRef.current;
          onChange(finalValue);
        },
        onPanResponderTerminate: () => {
          onChange(valueRef.current);
        },
      }),
    [onChange, progress, sliderRange, resetFadeTimer]
  );

  const top = useMemo(
    () =>
      progress.interpolate({
        inputRange: [0, 1],
        outputRange: [
          height * LOWER_FRACTION - BUTTON_RADIUS,
          height * UPPER_FRACTION - BUTTON_RADIUS,
        ],
        extrapolate: "clamp",
      }),
    [progress, height]
  );

  const fontSize = useMemo(
    () =>
      progress.interpolate({
        inputRange: [0, 1],
        outputRange: [FONT_MIN_SIZE, FONT_MAX_SIZE],
        extrapolate: "clamp",
      }),
    [progress]
  );

  const lineHeight = useMemo(
    () =>
      progress.interpolate({
        inputRange: [0, 1],
        outputRange: [
          FONT_MIN_SIZE + FONT_LINE_HEIGHT_OFFSET,
          FONT_MAX_SIZE + FONT_LINE_HEIGHT_OFFSET,
        ],
        extrapolate: "clamp",
      }),
    [progress]
  );

  return (
    <Animated.View
      style={[styles.container, { top, opacity }]}
      {...panResponder.panHandlers}
      onLayout={({ nativeEvent }) => {
        const { y, height } = nativeEvent.layout;
        if (onCenterYChange) {
          onCenterYChange(y + height / 2);
        }
      }}
    >
      <Pressable
        accessibilityLabel="Cycle font style"
        hitSlop={10}
        onPress={() => {
          cycleFont();
          resetFadeTimer();
        }}
        style={({ pressed }) => [
          styles.button,
          {
            borderColor: isActive
              ? fontToggleColors.borderActive
              : fontToggleColors.border,
            backgroundColor: isActive
              ? fontToggleColors.backgroundActive
              : fontToggleColors.background,
            shadowColor: fontToggleColors.shadow,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Animated.Text
          style={[
            styles.label,
            {
              color: labelColor,
              fontFamily: font.fontFamily,
              fontSize,
              lineHeight,
            },
          ]}
        >
          F
        </Animated.Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: "2%",
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_RADIUS,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontWeight: "600",
    letterSpacing: 0.5,
    textAlign: "center",
  },
});

export default FontToggleButton;

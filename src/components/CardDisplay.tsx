// src/components/CardDisplay.tsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  Text,
  SafeAreaView,
  Animated,
  PanResponder,
  StyleSheet,
  ImageBackground,
  Platform,
  useWindowDimensions,
} from "react-native";
import { styled } from "nativewind";

import { Card } from "../data/cards";
import { useSettings } from "../context/SettingsContext";
import { CountdownBadge } from "./CountdownBadge";
import { FontToggleButton } from "./FontToggleButton";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledImageBackground = styled(ImageBackground);
const StyledView = styled(View);
const StyledText = styled(Text);
const COUNTDOWN_FONT_FAMILY = Platform.select({
  ios: undefined,
  android: "sans-serif",
  default: undefined,
});
const CARD_FONT_MIN_SIZE = 24;
const CARD_FONT_MAX_SIZE = 42;

export type CardDisplayProps = {
  card: Card;
};

type TimeStats = {
  progress: number;
  longLabel: string;
};

function calculateTimeStats(): TimeStats {
  const now = new Date();
  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const nextDay = new Date(startOfDay);
  nextDay.setDate(nextDay.getDate() + 1);

  const totalMs = nextDay.getTime() - startOfDay.getTime();
  const remainingMs = Math.max(0, nextDay.getTime() - now.getTime());
  const progress = Math.min(1, Math.max(0, 1 - remainingMs / totalMs));

  if (remainingMs <= 0) {
    return {
      progress: 1,
      longLabel: "Ready until next affirmation",
    };
  }

  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

  const hourPart = hours > 0 ? `${hours}h` : "";
  const minutePart = minutes > 0 ? `${minutes}m` : "";
  const parts = [hourPart, minutePart].filter(Boolean).join(" ").trim();

  const longLabel = parts
    ? `${parts} until next affirmation`
    : `${seconds}s until next affirmation`;

  return { progress, longLabel };
}

export default function CardDisplay({ card }: CardDisplayProps) {
  const { font } = useSettings();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const [timeStats, setTimeStats] = useState<TimeStats>(() =>
    calculateTimeStats()
  );
  const [fontScale, setFontScale] = useState(0.5);
  // Absolute-positioned draggable text
  const clamp = useCallback(
    (value: number, min: number, max: number) =>
      Math.max(min, Math.min(max, value)),
    []
  );
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [textSize, setTextSize] = useState({ width: 0, height: 0 });
  const textLeft = useRef(new Animated.Value(0)).current;
  const textTop = useRef(new Animated.Value(0)).current;
  const startLeftRef = useRef(0);
  const startTopRef = useRef(0);

  // Badge absolute-positioned dragging (same model as text)
  const [badgeSize, setBadgeSize] = useState({ width: 60, height: 60 });
  const badgeLeft = useRef(new Animated.Value(0)).current;
  const badgeTop = useRef(new Animated.Value(0)).current;
  const startBadgeLeftRef = useRef(0);
  const startBadgeTopRef = useRef(0);

  // Boundary constraint functions
  const constrainToScreen = useCallback(
    (x: number, y: number, elementWidth: number, elementHeight: number) => {
      const padding = 20; // Safe padding from screen edges
      const minX = padding;
      const maxX = screenWidth - elementWidth - padding;
      const minY = padding;
      const maxY = screenHeight - elementHeight - padding;

      console.log("Constraining:", {
        x,
        y,
        elementWidth,
        elementHeight,
        screenWidth,
        screenHeight,
      });
      console.log("Bounds:", { minX, maxX, minY, maxY });

      const constrainedX = Math.max(minX, Math.min(maxX, x));
      const constrainedY = Math.max(minY, Math.min(maxY, y));

      console.log("Result:", { constrainedX, constrainedY });

      return {
        x: constrainedX,
        y: constrainedY,
      };
    },
    [screenWidth, screenHeight]
  );

  const updateTime = useCallback(() => {
    setTimeStats(calculateTimeStats());
  }, []);

  useEffect(() => {
    // On card change just refresh time stats
    updateTime();
  }, [card.id, updateTime]);

  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, [updateTime]);

  const textPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          startLeftRef.current = (textLeft as any)._value ?? 0;
          startTopRef.current = (textTop as any)._value ?? 0;
        },
        onPanResponderMove: (_evt, gesture) => {
          const maxLeft = Math.max(0, containerSize.width - textSize.width);
          const maxTop = Math.max(0, containerSize.height - textSize.height);
          const nextLeft = clamp(startLeftRef.current + gesture.dx, 0, maxLeft);
          const nextTop = clamp(startTopRef.current + gesture.dy, 0, maxTop);
          textLeft.setValue(nextLeft);
          textTop.setValue(nextTop);
        },
        onPanResponderRelease: (_evt, gesture) => {
          const maxLeft = Math.max(0, containerSize.width - textSize.width);
          const maxTop = Math.max(0, containerSize.height - textSize.height);
          const targetLeft = clamp(
            startLeftRef.current + gesture.dx,
            0,
            maxLeft
          );
          const targetTop = clamp(startTopRef.current + gesture.dy, 0, maxTop);
          Animated.parallel([
            Animated.spring(textLeft, {
              toValue: targetLeft,
              useNativeDriver: false,
            }),
            Animated.spring(textTop, {
              toValue: targetTop,
              useNativeDriver: false,
            }),
          ]).start();
        },
      }),
    [clamp, containerSize, textLeft, textTop, textSize]
  );

  const badgePanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, g) =>
          Math.abs(g.dx) > 6 || Math.abs(g.dy) > 6,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => {
          startBadgeLeftRef.current = (badgeLeft as any)._value ?? 0;
          startBadgeTopRef.current = (badgeTop as any)._value ?? 0;
        },
        onPanResponderMove: (_evt, g) => {
          const maxLeft = Math.max(0, containerSize.width - badgeSize.width);
          const maxTop = Math.max(0, containerSize.height - badgeSize.height);
          const nextLeft = clamp(startBadgeLeftRef.current + g.dx, 0, maxLeft);
          const nextTop = clamp(startBadgeTopRef.current + g.dy, 0, maxTop);
          badgeLeft.setValue(nextLeft);
          badgeTop.setValue(nextTop);
        },
        onPanResponderRelease: (_evt, g) => {
          const maxLeft = Math.max(0, containerSize.width - badgeSize.width);
          const maxTop = Math.max(0, containerSize.height - badgeSize.height);
          const targetLeft = clamp(
            startBadgeLeftRef.current + g.dx,
            0,
            maxLeft
          );
          const targetTop = clamp(startBadgeTopRef.current + g.dy, 0, maxTop);
          Animated.parallel([
            Animated.spring(badgeLeft, {
              toValue: targetLeft,
              useNativeDriver: false,
            }),
            Animated.spring(badgeTop, {
              toValue: targetTop,
              useNativeDriver: false,
            }),
          ]).start();
        },
      }),
    [badgeLeft, badgeTop, clamp, containerSize, badgeSize]
  );

  const resolvedTone = card.preferredTone ?? "light";
  const textColor = resolvedTone === "light" ? "#f8fafc" : "#0f172a";
  const overlayColor =
    resolvedTone === "light" ? "rgba(15,23,42,0.24)" : "rgba(255,255,255,0.3)";
  const badgeBackground =
    resolvedTone === "light" ? "rgba(15,23,42,0.50)" : "rgba(255,255,255,0.60)";
  const trackColor =
    resolvedTone === "light" ? "rgba(248,250,252,0.3)" : "rgba(17,24,39,0.28)";
  const strokeColor = resolvedTone === "light" ? "#38bdf8" : "#0f172a";
  const badgeLabelColor = resolvedTone === "light" ? "#f8fafc" : "#0f172a";
  const cardFontSize = useMemo(
    () =>
      CARD_FONT_MIN_SIZE +
      (CARD_FONT_MAX_SIZE - CARD_FONT_MIN_SIZE) * fontScale,
    [fontScale]
  );
  const cardLineHeight = cardFontSize * 1.25;

  return (
    <View style={styles.root}>
      <StyledImageBackground
        source={card.image}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { backgroundColor: overlayColor }]}
        />

        <StyledSafeAreaView style={styles.safeArea} className="flex-1">
          <FontToggleButton
            strokeColor="#ffffff"
            labelColor={badgeLabelColor}
            value={fontScale}
            onChange={setFontScale}
          />

          <StyledView
            className="flex-1 p-8"
            onLayout={({ nativeEvent }) => {
              const { width, height } = nativeEvent.layout;
              if (
                Math.abs(width - containerSize.width) > 0.5 ||
                Math.abs(height - containerSize.height) > 0.5
              ) {
                setContainerSize({ width, height });
                // Initialize near bottom-center once sizes are known
                if (textSize.width > 0 && textSize.height > 0) {
                  const initLeft = Math.max(0, (width - textSize.width) / 2);
                  const initTop = Math.max(0, height - textSize.height);
                  if (
                    ((textLeft as any)._value ?? 0) === 0 &&
                    ((textTop as any)._value ?? 0) === 0
                  ) {
                    textLeft.setValue(initLeft);
                    textTop.setValue(initTop);
                  }
                }
                // Keep badge in bounds if container changed
                const maxLeft = Math.max(0, width - badgeSize.width);
                const maxTop = Math.max(0, height - badgeSize.height);
                const currentLeft = (badgeLeft as any)._value ?? 0;
                const currentTop = (badgeTop as any)._value ?? 0;
                const clampedLeft = Math.max(0, Math.min(maxLeft, currentLeft));
                const clampedTop = Math.max(0, Math.min(maxTop, currentTop));
                if (clampedLeft !== currentLeft) {
                  badgeLeft.setValue(clampedLeft);
                }
                if (clampedTop !== currentTop) {
                  badgeTop.setValue(clampedTop);
                }
                // If badge hasn't been positioned yet, set an initial location
                if (
                  ((badgeLeft as any)._value ?? 0) === 0 &&
                  ((badgeTop as any)._value ?? 0) === 0
                ) {
                  const initialLeft = Math.max(
                    0,
                    Math.min(maxLeft, Math.round(width * 0.1))
                  );
                  const initialTop = Math.max(
                    0,
                    Math.min(maxTop, Math.round(height * 0.1))
                  );
                  badgeLeft.setValue(initialLeft);
                  badgeTop.setValue(initialTop);
                }
              }
            }}
          >
            <Animated.View
              {...textPanResponder.panHandlers}
              onLayout={({ nativeEvent }) => {
                const { width, height } = nativeEvent.layout;
                if (
                  Math.abs(width - textSize.width) > 0.5 ||
                  Math.abs(height - textSize.height) > 0.5
                ) {
                  setTextSize({ width, height });
                  // Initialize position if container already measured
                  const cw = containerSize.width;
                  const ch = containerSize.height;
                  if (cw > 0 && ch > 0) {
                    const initLeft = Math.max(0, (cw - width) / 2);
                    const initTop = Math.max(0, ch - height);
                    if (
                      ((textLeft as any)._value ?? 0) === 0 &&
                      ((textTop as any)._value ?? 0) === 0
                    ) {
                      textLeft.setValue(initLeft);
                      textTop.setValue(initTop);
                    }
                  }
                }
              }}
              style={[
                styles.draggableContainer,
                { position: "absolute", left: textLeft, top: textTop },
              ]}
            >
              <StyledText
                className="text-center font-bold mb-4"
                style={{
                  color: textColor,
                  fontFamily: font.fontFamily,
                  fontSize: cardFontSize,
                  lineHeight: cardLineHeight,
                  textShadowColor: "rgba(0,0,0,0.35)",
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 6,
                }}
              >
                {card.text}
              </StyledText>
            </Animated.View>
            <Animated.View
              {...badgePanResponder.panHandlers}
              style={[
                styles.badgeContainer,
                {
                  position: "absolute",
                  left: badgeLeft,
                  top: badgeTop,
                  zIndex: 10,
                },
              ]}
              onLayout={({ nativeEvent }) => {
                const { width, height } = nativeEvent.layout;
                if (
                  Math.abs(width - badgeSize.width) > 0.5 ||
                  Math.abs(height - badgeSize.height) > 0.5
                ) {
                  setBadgeSize({ width, height });
                  // Push left when expanding near the right edge (within same container)
                  const maxLeft = Math.max(0, containerSize.width - width);
                  const currentLeft = (badgeLeft as any)._value ?? 0;
                  const clampedLeft = Math.max(
                    0,
                    Math.min(maxLeft, currentLeft)
                  );
                  if (clampedLeft !== currentLeft) {
                    Animated.spring(badgeLeft, {
                      toValue: clampedLeft,
                      useNativeDriver: false,
                    }).start();
                  }
                  const maxTop = Math.max(0, containerSize.height - height);
                  const currentTop = (badgeTop as any)._value ?? 0;
                  const clampedTop = Math.max(0, Math.min(maxTop, currentTop));
                  if (clampedTop !== currentTop) {
                    Animated.spring(badgeTop, {
                      toValue: clampedTop,
                      useNativeDriver: false,
                    }).start();
                  }
                }
              }}
            >
              <CountdownBadge
                progress={timeStats.progress}
                label={timeStats.longLabel}
                backgroundColor={badgeBackground}
                trackColor={trackColor}
                strokeColor={strokeColor}
                textColor={badgeLabelColor}
                fontFamily={COUNTDOWN_FONT_FAMILY}
              />
            </Animated.View>
          </StyledView>
        </StyledSafeAreaView>
      </StyledImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  draggableContainer: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  badgeContainer: {
    position: "absolute",
  },
});

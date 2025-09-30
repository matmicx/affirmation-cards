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

  const badgePan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

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
    // Reset badge position on card change
    badgePan.setValue({ x: 0, y: 0 });
    badgePan.setOffset({ x: 0, y: 0 });
    updateTime();
  }, [card.id, badgePan, updateTime]);

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
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > 4 || Math.abs(gestureState.dy) > 4,
        onPanResponderGrant: () => {
          badgePan.extractOffset();
        },
        onPanResponderMove: Animated.event(
          [null, { dx: badgePan.x, dy: badgePan.y }],
          {
            useNativeDriver: false,
          }
        ),
        onPanResponderRelease: () => {
          // Compute total translation = offset + value
          const xNode: any = badgePan.x as any;
          const yNode: any = badgePan.y as any;
          const totalX = (xNode._offset || 0) + (xNode._value || 0);
          const totalY = (yNode._offset || 0) + (yNode._value || 0);

          const badgeWidth = 60;
          const badgeHeight = 60;

          const constrained = constrainToScreen(
            totalX,
            totalY,
            badgeWidth,
            badgeHeight
          );

          // Persist constrained position as offset and zero the value
          badgePan.setOffset({ x: constrained.x, y: constrained.y });
          badgePan.setValue({ x: 0, y: 0 });
        },
      }),
    [badgePan, constrainToScreen]
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
          </StyledView>

          <Animated.View
            {...badgePanResponder.panHandlers}
            style={[
              styles.badgeContainer,
              { transform: badgePan.getTranslateTransform() },
            ]}
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
    top: "10%",
    left: "10%",
  },
});

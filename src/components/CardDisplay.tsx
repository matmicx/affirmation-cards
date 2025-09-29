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
  Pressable,
  StyleSheet,
  ImageBackground,
} from "react-native";
import Svg, { Circle, Rect } from "react-native-svg";
import { styled } from "nativewind";

import { Card } from "../data/cards";
import { useSettings } from "../context/SettingsContext";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledImageBackground = styled(ImageBackground);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

const CIRCLE_RADIUS = 26;
const CIRCLE_DIAMETER = CIRCLE_RADIUS * 2;
const STROKE_PADDING = 6;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;
const BADGE_SIZE = 76;

type CardDisplayProps = {
  card: Card;
};

function calculateTimeStats() {
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
      shortLabel: "Ready",
      longLabel: "A new affirmation is ready",
    };
  }

  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

  const hourPart = hours > 0 ? `${hours} ${hours === 1 ? "hour" : "hours"}` : "";
  const minutePart = minutes > 0 ? `${minutes} ${minutes === 1 ? "minute" : "minutes"}` : "";
  const parts = [hourPart, minutePart].filter(Boolean);
  const longLabel =
    parts.length > 0
      ? `${parts.join(" and ")} until next affirmation`
      : `${seconds} ${seconds === 1 ? "second" : "seconds"} until next affirmation`;

  let shortLabel: string;
  if (hours > 0) {
    shortLabel = `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    shortLabel = `${minutes}m ${seconds}s`;
  } else {
    shortLabel = `${seconds}s`;
  }

  return { progress, shortLabel, longLabel };
}

export default function CardDisplay({ card }: CardDisplayProps) {
  const { font, cycleFont } = useSettings();

  const [showTimer, setShowTimer] = useState(false);

  const [chipSize, setChipSize] = useState({ width: BADGE_SIZE, height: BADGE_SIZE });

  const textPan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const badgePan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const modeAnim = useRef(new Animated.Value(0)).current;
  const initialStatsRef = useRef(calculateTimeStats());
  const progressAnim = useRef(new Animated.Value(initialStatsRef.current.progress)).current;
  const [timeLabel, setTimeLabel] = useState(initialStatsRef.current.longLabel);

  const resolvedTone = card.preferredTone ?? "light";
  const textColor = resolvedTone === "light" ? "#f8fafc" : "#0f172a";
  const overlayColor = resolvedTone === "light" ? "rgba(15, 23, 42, 0.22)" : "rgba(255, 255, 255, 0.32)";
  const badgeBackground = resolvedTone === "light" ? "rgba(15,23,42,0.7)" : "rgba(255,255,255,0.82)";
  const trackColor = resolvedTone === "light" ? "rgba(248,250,252,0.25)" : "rgba(17,24,39,0.25)";
  const strokeColor = resolvedTone === "light" ? "#38bdf8" : "#0f172a";
  const badgeLabelColor = resolvedTone === "light" ? "#f8fafc" : "#0f172a";
  const controlLabelColor = resolvedTone === "light" ? "#f1f5f9" : "#0f172a";

  const updateTime = useCallback(
    (animate = true) => {
      const stats = calculateTimeStats();
      initialStatsRef.current = stats;
      setTimeLabel(stats.longLabel);
      if (animate) {
        Animated.timing(progressAnim, {
          toValue: stats.progress,
          duration: 500,
          useNativeDriver: false,
        }).start();
      } else {
        progressAnim.setValue(stats.progress);
      }
    },
    [progressAnim]
  );

  useEffect(() => {
    setShowTimer(false);
    modeAnim.setValue(0);
    textPan.setValue({ x: 0, y: 0 });
    textPan.setOffset({ x: 0, y: 0 });
    badgePan.setValue({ x: 0, y: 0 });
    badgePan.setOffset({ x: 0, y: 0 });
    updateTime(false);
  }, [card.id, textPan, badgePan, modeAnim, updateTime]);

  useEffect(() => {
    updateTime(false);
    const interval = setInterval(() => updateTime(true), 30000);
    return () => clearInterval(interval);
  }, [updateTime]);

  const textPanResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          textPan.extractOffset();
        },
        onPanResponderMove: Animated.event(
          [null, { dx: textPan.x, dy: textPan.y }],
          { useNativeDriver: false }
        ),
        onPanResponderRelease: () => {
          textPan.flattenOffset();
        },
      }),
    [textPan]
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
          { useNativeDriver: false }
        ),
        onPanResponderRelease: () => {
          badgePan.flattenOffset();
        },
      }),
    [badgePan]
  );

  const strokeDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  const chipPerimeter = useMemo(() => {
    const w = Math.max(chipSize.width - 4, 0);
    const h = Math.max(chipSize.height - 4, 0);
    if (w <= 0 || h <= 0) {
      return CIRCUMFERENCE;
    }
    const straight = Math.max(0, w - h);
    return 2 * straight + Math.PI * h;
  }, [chipSize]);

  const chipDashoffset = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [chipPerimeter, 0],
  });

  const circleOpacity = modeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const circleScale = modeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.9],
  });
  const textOpacity = modeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const textScale = modeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  const handleBadgeToggle = () => {
    const nextValue = showTimer ? 0 : 1;
    setShowTimer(!showTimer);
    Animated.spring(modeAnim, {
      toValue: nextValue,
      useNativeDriver: true,
      damping: 14,
      stiffness: 140,
    }).start();
  };

  return (
    <StyledSafeAreaView className="flex-1">
      <StyledImageBackground source={card.image} resizeMode="cover" style={styles.background}>
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { backgroundColor: overlayColor }]}
        />

        <StyledView className="absolute top-4 right-4">
          <StyledPressable
            onPress={cycleFont}
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: badgeBackground }}
          >
            <StyledText
              className="text-xs font-semibold"
              style={{ color: controlLabelColor }}
            >
              Font: {font.label}
            </StyledText>
          </StyledPressable>
        </StyledView>

        <StyledView className="flex-1 justify-end p-8">
          <Animated.View
            {...textPanResponder.panHandlers}
            style={[
              styles.draggableContainer,
              { transform: textPan.getTranslateTransform() },
            ]}
          >
            <StyledText
              className="text-4xl text-center font-bold mb-4"
              style={{
                color: textColor,
                fontFamily: font.fontFamily,
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
          <Pressable onPress={handleBadgeToggle} style={styles.badgePressable}>
            <View pointerEvents="none">
              <Animated.View
                style={[
                  styles.circleWrapper,
                  {
                    opacity: circleOpacity,
                    transform: [{ scale: circleScale }],
                  },
                ]}
              >
                <Svg
                  width={CIRCLE_DIAMETER + STROKE_PADDING}
                  height={CIRCLE_DIAMETER + STROKE_PADDING}
                >
                  <Circle
                    cx={CIRCLE_RADIUS + STROKE_PADDING / 2}
                    cy={CIRCLE_RADIUS + STROKE_PADDING / 2}
                    r={CIRCLE_RADIUS}
                    stroke={trackColor}
                    strokeWidth={4}
                    fill="none"
                  />
                  <AnimatedCircle
                    cx={CIRCLE_RADIUS + STROKE_PADDING / 2}
                    cy={CIRCLE_RADIUS + STROKE_PADDING / 2}
                    r={CIRCLE_RADIUS}
                    stroke={strokeColor}
                    strokeWidth={4}
                    strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="none"
                  />
                </Svg>
              </Animated.View>

              <Animated.View
                style={[
                  styles.textWrapper,
                  {
                    backgroundColor: badgeBackground,
                    opacity: textOpacity,
                    transform: [{ scale: textScale }],
                  },
                ]}
                onLayout={({ nativeEvent }) => {
                  const { width, height } = nativeEvent.layout;
                  if (
                    width > 0 &&
                    height > 0 &&
                    (Math.abs(width - chipSize.width) > 0.5 ||
                      Math.abs(height - chipSize.height) > 0.5)
                  ) {
                    setChipSize({ width, height });
                  }
                }}
              >
                {chipSize.width > 0 && chipSize.height > 0 ? (
                  <Svg
                    width={chipSize.width}
                    height={chipSize.height}
                    style={styles.chipStroke}
                  >
                    <Rect
                      x={2}
                      y={2}
                      width={chipSize.width - 4}
                      height={chipSize.height - 4}
                      rx={(chipSize.height - 4) / 2}
                      ry={(chipSize.height - 4) / 2}
                      stroke={trackColor}
                      strokeWidth={4}
                      fill="none"
                    />
                    <AnimatedRect
                      x={2}
                      y={2}
                      width={chipSize.width - 4}
                      height={chipSize.height - 4}
                      rx={(chipSize.height - 4) / 2}
                      ry={(chipSize.height - 4) / 2}
                      stroke={strokeColor}
                      strokeWidth={4}
                      strokeDasharray={`${chipPerimeter} ${chipPerimeter}`}
                      strokeDashoffset={chipDashoffset}
                      strokeLinecap="round"
                      fill="none"
                    />
                  </Svg>
                ) : null}

                <Text
                  style={[
                    styles.badgeLabel,
                    { color: badgeLabelColor, fontFamily: font.fontFamily },
                  ]}
                >
                  {timeLabel}
                </Text>
              </Animated.View>
            </View>
          </Pressable>
        </Animated.View>
      </StyledImageBackground>
    </StyledSafeAreaView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  draggableContainer: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  badgeContainer: {
    position: "absolute",
    bottom: 32,
    left: 24,
  },
  badgePressable: {
    minWidth: BADGE_SIZE,
    minHeight: BADGE_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  circleWrapper: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    borderRadius: BADGE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  textWrapper: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 999,
    maxWidth: 260,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  chipStroke: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  badgeLabel: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
});

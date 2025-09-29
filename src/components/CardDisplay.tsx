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
  Pressable,
} from "react-native";
import { styled } from "nativewind";

import { Card } from "../data/cards";
import { useSettings } from "../context/SettingsContext";
import { CountdownBadge } from "./CountdownBadge";

const StyledSafeAreaView = styled(SafeAreaView);
const StyledImageBackground = styled(ImageBackground);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

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
  const { font, cycleFont } = useSettings();

  const [timeStats, setTimeStats] = useState<TimeStats>(() =>
    calculateTimeStats()
  );

  const textPan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const badgePan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const updateTime = useCallback(() => {
    setTimeStats(calculateTimeStats());
  }, []);

  useEffect(() => {
    textPan.setValue({ x: 0, y: 0 });
    textPan.setOffset({ x: 0, y: 0 });
    badgePan.setValue({ x: 0, y: 0 });
    badgePan.setOffset({ x: 0, y: 0 });
    updateTime();
  }, [card.id, textPan, badgePan, updateTime]);

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
          textPan.extractOffset();
        },
        onPanResponderMove: Animated.event(
          [null, { dx: textPan.x, dy: textPan.y }],
          {
            useNativeDriver: false,
          }
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
          {
            useNativeDriver: false,
          }
        ),
        onPanResponderRelease: () => {
          badgePan.flattenOffset();
        },
      }),
    [badgePan]
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
  const controlLabelColor = resolvedTone === "light" ? "#f1f5f9" : "#0f172a";

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
          <StyledView className="absolute top-4 right-4">
            <StyledPressable
              onPress={cycleFont}
              style={[styles.fontButton, { backgroundColor: badgeBackground }]}
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
            <CountdownBadge
              progress={timeStats.progress}
              label={timeStats.longLabel}
              backgroundColor={badgeBackground}
              trackColor={trackColor}
              strokeColor={strokeColor}
              textColor={badgeLabelColor}
              fontFamily={font.fontFamily}
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
  fontButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
});

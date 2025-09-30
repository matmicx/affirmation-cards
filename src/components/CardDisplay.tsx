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
  Easing,
  Platform,
  useWindowDimensions,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { styled } from "nativewind";
import {
  resolveBadgeColors,
  resolveOverlayColor,
  resolveTextColor,
} from "../theme/colors";

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
const BADGE_INIT_LEFT_PCT = 0.05;
const BADGE_INIT_TOP_PCT = 0.1;

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
  const badgeInitializedRef = useRef(false);
  const badgeUserMovedRef = useRef(false);
  const lastContainerSizeRef = useRef({ width: 0, height: 0 });

  // Initialize badge position once when both container and badge sizes are known
  useEffect(() => {
    if (badgeInitializedRef.current) return;
    if (containerSize.width <= 0 || containerSize.height <= 0) return;
    if (badgeSize.width <= 0 || badgeSize.height <= 0) return;

    const maxLeft = Math.max(0, containerSize.width - badgeSize.width);
    const maxTop = Math.max(0, containerSize.height - badgeSize.height);

    const desired = resolveDesiredBadgePosition(
      containerSize.width,
      containerSize.height
    );

    // Defer to next frame to avoid being overridden by concurrent layout clamps
    requestAnimationFrame(() => {
      badgeLeft.setValue(Math.max(0, Math.min(maxLeft, desired.left)));
      badgeTop.setValue(Math.max(0, Math.min(maxTop, desired.top)));
      badgeInitializedRef.current = true;
    });
  }, [
    containerSize,
    badgeSize,
    badgeLeft,
    badgeTop,
    resolveDesiredBadgePosition,
  ]);

  // Reset badge initialization on card change or significant container size change (e.g., rotation)
  useEffect(() => {
    badgeInitializedRef.current = false;
  }, [card.id]);

  useEffect(() => {
    const prev = lastContainerSizeRef.current;
    if (
      Math.abs(prev.width - containerSize.width) > 20 ||
      Math.abs(prev.height - containerSize.height) > 20
    ) {
      badgeInitializedRef.current = false;
      lastContainerSizeRef.current = containerSize;
    }
  }, [containerSize]);

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
        onMoveShouldSetPanResponderCapture: (_, g) =>
          Math.abs(g.dx) > 6 || Math.abs(g.dy) > 6,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => {
          startBadgeLeftRef.current = (badgeLeft as any)._value ?? 0;
          startBadgeTopRef.current = (badgeTop as any)._value ?? 0;
          badgeUserMovedRef.current = true;
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
          badgeUserMovedRef.current = true;
        },
      }),
    [badgeLeft, badgeTop, clamp, containerSize, badgeSize]
  );

  const resolvedTone = card.preferredTone ?? "light";
  const textColor = resolveTextColor(resolvedTone);
  const overlayColor = resolveOverlayColor(resolvedTone);
  const badgeColors = resolveBadgeColors(resolvedTone, card as any);
  const badgeBackground = badgeColors.background;
  const trackColor = badgeColors.track;
  const strokeColor = badgeColors.stroke;
  const badgeLabelColor = resolveTextColor(resolvedTone);
  const cardFontSize = useMemo(
    () =>
      CARD_FONT_MIN_SIZE +
      (CARD_FONT_MAX_SIZE - CARD_FONT_MIN_SIZE) * fontScale,
    [fontScale]
  );
  const cardLineHeight = cardFontSize * 1.25;

  // Press-and-hold state and timers
  const [isPressing, setIsPressing] = useState(false);
  const [pressedForMs, setPressedForMs] = useState(0);
  const pressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const THREE_MIN_MS = 3 * 60 * 1000;
  const THREE_SEC_MS = 3 * 1000;

  // Transition animation for fade-in/out over the first 3 seconds
  const transitionAnim = useRef(new Animated.Value(0)).current; // 0 -> 1 over 3s when pressing
  const [showingOverlay, setShowingOverlay] = useState(false);
  const [videoShouldPlay, setVideoShouldPlay] = useState(false);

  const beginFadeIn = useCallback(() => {
    setShowingOverlay(true);
    setVideoShouldPlay(true);
    transitionAnim.stopAnimation();
    Animated.timing(transitionAnim, {
      toValue: 1,
      duration: THREE_SEC_MS,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, [THREE_SEC_MS, transitionAnim]);

  const beginFadeOut = useCallback(() => {
    transitionAnim.stopAnimation();
    Animated.timing(transitionAnim, {
      toValue: 0,
      duration: THREE_SEC_MS,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        setShowingOverlay(false);
        setVideoShouldPlay(false);
      }
    });
  }, [THREE_SEC_MS, transitionAnim]);

  const startPressTimer = useCallback(() => {
    if (pressIntervalRef.current) return;
    setPressedForMs(0);
    pressIntervalRef.current = setInterval(() => {
      setPressedForMs((prev) => prev + 250);
    }, 250);
  }, []);

  const stopPressTimer = useCallback(() => {
    if (pressIntervalRef.current) {
      clearInterval(pressIntervalRef.current);
      pressIntervalRef.current = null;
    }
    setPressedForMs(0);
  }, []);

  useEffect(() => {
    return () => {
      if (pressIntervalRef.current) {
        clearInterval(pressIntervalRef.current);
      }
    };
  }, []);

  // Resolve desired initial badge position (supports card-level overrides)
  function resolveDesiredBadgePosition(containerW: number, containerH: number) {
    const c: any = card as any;
    // Absolute pixels take priority if provided
    if (typeof c.badgeLeft === "number" || typeof c.badgeTop === "number") {
      return {
        left: Math.max(0, c.badgeLeft ?? 0),
        top: Math.max(0, c.badgeTop ?? 0),
      };
    }
    const leftPct =
      typeof c.badgeLeftPct === "number" ? c.badgeLeftPct : BADGE_INIT_LEFT_PCT;
    const topPct =
      typeof c.badgeTopPct === "number" ? c.badgeTopPct : BADGE_INIT_TOP_PCT;
    return {
      left: Math.round(containerW * leftPct),
      top: Math.round(containerH * topPct),
    };
  }

  // Use generated optional video fields if present
  const [animatedPrimary, animatedSecondary] = useMemo(() => {
    const primary = (card as any).video;
    const secondary = (card as any).videoAfter3m;
    return [primary, secondary];
  }, [card]);

  return (
    <View style={styles.root}>
      <StyledImageBackground
        source={card.image}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        {/* Black fade layer below the video: darkens only the background image */}
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "#000",
              opacity: transitionAnim,
            },
          ]}
        />
        {/* Video overlay fades in above the black layer */}
        {showingOverlay && (animatedPrimary || animatedSecondary) ? (
          <Animated.View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, { opacity: transitionAnim }]}
          >
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                {
                  left: (card as any).videoOffsetX ?? 0,
                  top: (card as any).videoOffsetY ?? 0,
                  transform: [
                    {
                      scale: (card as any).videoScale ?? 1,
                    },
                  ],
                },
              ]}
            >
              <Video
                source={
                  pressedForMs >= THREE_MIN_MS && animatedSecondary
                    ? animatedSecondary
                    : animatedPrimary
                }
                style={StyleSheet.absoluteFill}
                resizeMode={
                  ((card as any).videoResizeMode as any) ?? ResizeMode.COVER
                }
                isLooping
                shouldPlay={videoShouldPlay}
                isMuted
              />
            </Animated.View>
          </Animated.View>
        ) : null}
        {/* Static tint above both layers */}
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
                if (badgeInitializedRef.current) {
                  const currentLeft = (badgeLeft as any)._value ?? 0;
                  const currentTop = (badgeTop as any)._value ?? 0;
                  const clampedLeft = Math.max(
                    0,
                    Math.min(maxLeft, currentLeft)
                  );
                  const clampedTop = Math.max(0, Math.min(maxTop, currentTop));
                  if (clampedLeft !== currentLeft) {
                    badgeLeft.setValue(clampedLeft);
                  }
                  if (clampedTop !== currentTop) {
                    badgeTop.setValue(clampedTop);
                  }
                  if (!badgeUserMovedRef.current) {
                    const desiredLeft = Math.round(width * BADGE_INIT_LEFT_PCT);
                    const desiredTop = Math.round(height * BADGE_INIT_TOP_PCT);
                    badgeLeft.setValue(
                      Math.max(0, Math.min(maxLeft, desiredLeft))
                    );
                    badgeTop.setValue(
                      Math.max(0, Math.min(maxTop, desiredTop))
                    );
                  }
                }
                // Initialize badge once when sizes are known
                if (
                  !badgeInitializedRef.current &&
                  badgeSize.width > 0 &&
                  badgeSize.height > 0
                ) {
                  const desiredLeft = Math.round(width * BADGE_INIT_LEFT_PCT);
                  const desiredTop = Math.round(height * BADGE_INIT_TOP_PCT);
                  badgeLeft.setValue(
                    Math.max(0, Math.min(maxLeft, desiredLeft))
                  );
                  badgeTop.setValue(Math.max(0, Math.min(maxTop, desiredTop)));
                  badgeInitializedRef.current = true;
                } else {
                  // Clamp to bounds if resized
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
                  const currentTop = (badgeTop as any)._value ?? 0;
                  const clampedTop = Math.max(0, Math.min(maxTop, currentTop));
                  if (clampedTop !== currentTop) {
                    Animated.spring(badgeTop, {
                      toValue: clampedTop,
                      useNativeDriver: false,
                    }).start();
                  }
                }
              }
            }}
          >
            {/* Full-screen pressable to control animation */}
            <Pressable
              onPressIn={() => {
                setIsPressing(true);
                startPressTimer();
                beginFadeIn();
              }}
              onPressOut={() => {
                setIsPressing(false);
                stopPressTimer();
                beginFadeOut();
              }}
              style={[StyleSheet.absoluteFill, { right: 72 }]}
            />
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
                  opacity: (card as any).textOpacity ?? 1,
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
                  const maxLeft = Math.max(0, containerSize.width - width);
                  const maxTop = Math.max(0, containerSize.height - height);
                  // Initialize when container known and not yet initialized
                  if (
                    !badgeInitializedRef.current &&
                    containerSize.width > 0 &&
                    containerSize.height > 0
                  ) {
                    const desiredLeft = Math.round(
                      containerSize.width * BADGE_INIT_LEFT_PCT
                    );
                    const desiredTop = Math.round(
                      containerSize.height * BADGE_INIT_TOP_PCT
                    );
                    badgeLeft.setValue(
                      Math.max(0, Math.min(maxLeft, desiredLeft))
                    );
                    badgeTop.setValue(
                      Math.max(0, Math.min(maxTop, desiredTop))
                    );
                    badgeInitializedRef.current = true;
                  } else {
                    // Clamp to bounds if resized
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
                    const currentTop = (badgeTop as any)._value ?? 0;
                    const clampedTop = Math.max(
                      0,
                      Math.min(maxTop, currentTop)
                    );
                    if (clampedTop !== currentTop) {
                      Animated.spring(badgeTop, {
                        toValue: clampedTop,
                        useNativeDriver: false,
                      }).start();
                    }
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

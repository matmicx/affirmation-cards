import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
  Image,
  Platform,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import {
  resolveTextColor,
  resolveOverlayColor,
  resolveFontToggleColors,
} from "../theme/colors";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export type WelcomeScreenProps = {
  onGetStarted: () => void;
};

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const buttonColors = resolveFontToggleColors("light");
  const SCRIPT_FONT = Platform.select({
    ios: "Snell Roundhand",
    android: "serif",
    default: "serif",
  });
  const pages = useMemo(
    () => [
      {
        key: "intro",
        title: "Daily Wisdom",
        subtitle: "Your daily dose of mindful reflection",
      },
      {
        key: "one",
        title: "✨ One Card Per Day",
        body: "Receive a wisdom card every 24 hours—short, focused guidance to start your day.",
      },
      {
        key: "visuals",
        title: "🎨 Beautiful & Immersive",
        body: "Gentle visuals and subtle motion create a calm, immersive moment for reflection.",
      },
      {
        key: "timer",
        title: "⏰ Perfect Timing",
        body: "A simple countdown shows when the next card arrives—space to sit with today’s message.",
      },
      {
        key: "mindful",
        title: "🎯 Mindful Living",
        body: "Timeless wisdom to cultivate awareness and steadiness in your daily life.",
      },
      {
        key: "cta",
        title: "Ready?",
        body: "Begin a gentle, daily practice.",
      },
    ],
    []
  );

  const [pageIndex, setPageIndex] = useState(0);
  const listRef = useRef<FlatList<any>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;
  const pulse1 = useRef(new Animated.Value(0)).current; // 0..1
  const pulse2 = useRef(new Animated.Value(0)).current; // staggered

  // Fade-in CTA when last page becomes active
  useEffect(() => {
    if (pageIndex === pages.length - 1) {
      Animated.timing(ctaOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    } else {
      ctaOpacity.setValue(0);
    }
  }, [ctaOpacity, pageIndex, pages.length]);

  // Pulsing background (two rings) like a subtle Siri/noise aura
  useEffect(() => {
    const loop = () => {
      pulse1.setValue(0);
      pulse2.setValue(0);
      Animated.parallel([
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulse1, {
              toValue: 1,
              duration: 1600,
              useNativeDriver: true,
            }),
            Animated.delay(400),
          ])
        ),
        Animated.loop(
          Animated.sequence([
            Animated.delay(400),
            Animated.timing(pulse2, {
              toValue: 1,
              duration: 1600,
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    };
    loop();
  }, [pulse1, pulse2]);

  const handleGetStarted = () => {
    onGetStarted();
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const next = Math.round(x / screenWidth);
    if (next !== pageIndex) setPageIndex(next);
  };

  // Parallax background movement from left to right across all pages
  // Resolve the actual image dimensions so swapping the file (same name) keeps layout correct
  const welcomeImage = useMemo(
    () => require("../assets/images/Welcome screen.png"),
    []
  );
  const resolved = Image.resolveAssetSource(welcomeImage) as
    | { width: number; height: number }
    | undefined;
  const IMAGE_AR =
    resolved && resolved.height > 0 ? resolved.width / resolved.height : 16 / 9;
  const imageWidth = useMemo(() => {
    const byHeight = Math.round(screenHeight * IMAGE_AR);
    return Math.max(screenWidth, byHeight);
  }, [screenWidth, screenHeight, IMAGE_AR]);
  const totalScroll = (pages.length - 1) * screenWidth;
  const maxShift = Math.max(0, imageWidth - screenWidth);
  const bgTranslateX = scrollX.interpolate({
    inputRange: [0, totalScroll],
    outputRange: [0, -maxShift],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      {/* Animated parallax background (image or video) */}
      <Animated.View
        style={[
          styles.parallaxImage,
          {
            width: imageWidth,
            height: screenHeight,
            transform: [{ translateX: bgTranslateX }],
          },
        ]}
      >
        {/* Switch between video and image by toggling USE_VIDEO_BG */}
        {/* @ts-ignore */}
        {true ? (
          <Video
            // @ts-ignore optional asset; place at src/assets/videos/Welcome screen.mp4
            source={require("../assets/videos/Welcome screen.mp4")}
            style={{ width: "100%", height: "100%" }}
            resizeMode={ResizeMode.COVER}
            isLooping
            shouldPlay
            isMuted
          />
        ) : (
          <Image
            source={welcomeImage}
            resizeMode="cover"
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </Animated.View>
      {/* Dark overlay */}
      <View style={styles.darkOverlay} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <Animated.FlatList
            // @ts-ignore RN types sometimes omit ref typing here
            ref={listRef}
            data={pages}
            keyExtractor={(i) => i.key}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true, listener: onScroll }
            )}
            scrollEventThrottle={16}
            bounces={false}
            snapToInterval={screenWidth}
            snapToAlignment="center"
            decelerationRate="fast"
            renderItem={({ item, index }) => (
              <View style={{ width: screenWidth }}>
                <View style={{ flex: 1, paddingHorizontal: 24 }}>
                  <View style={styles.header}>
                    <Text style={index === 0 ? styles.titleMain : styles.title}>
                      {index === 0 ? item.title : item.title}
                    </Text>
                    {index === 0 ? (
                      <Text style={styles.subtitle}>{pages[0].subtitle}</Text>
                    ) : null}
                  </View>

                  {index !== 0 && index !== pages.length - 1 ? (
                    <View style={styles.mainContent}>
                      <View style={styles.featureCard}>
                        <Text style={styles.featureTitle}>{item.title}</Text>
                        {item.body ? (
                          <Text
                            style={styles.featureDescription}
                            numberOfLines={4}
                          >
                            {item.body}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  ) : null}

                  {index === pages.length - 1 ? (
                    <View style={styles.centerArea}>
                      {/* Pulsing aura */}
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Animated.View
                          pointerEvents="none"
                          style={[
                            styles.pulse,
                            {
                              transform: [
                                {
                                  scale: pulse1.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [1, 1.35],
                                  }),
                                },
                              ],
                              opacity: pulse1.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.35, 0],
                              }),
                            },
                          ]}
                        />
                        <Animated.View
                          pointerEvents="none"
                          style={[
                            styles.pulse,
                            {
                              transform: [
                                {
                                  scale: pulse2.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [1, 1.6],
                                  }),
                                },
                              ],
                              opacity: pulse2.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.25, 0],
                              }),
                            },
                          ]}
                        />
                        <Animated.View style={[{ opacity: ctaOpacity }]}>
                          <Pressable
                            style={[
                              styles.getStartedButton,
                              {
                                borderWidth: 1,
                                borderColor: buttonColors.border,
                                backgroundColor: buttonColors.background,
                              },
                            ]}
                            onPress={handleGetStarted}
                            android_ripple={{
                              color: "rgba(255, 255, 255, 0.1)",
                            }}
                          >
                            <Text style={styles.getStartedText}>
                              Begin Your Journey
                            </Text>
                          </Pressable>
                        </Animated.View>
                      </View>
                    </View>
                  ) : null}
                </View>
              </View>
            )}
            ListFooterComponent={<View />}
          />

          {/* Page indicators */}
          <View style={styles.dots}>
            {pages.map((_, i) => (
              <View
                // @ts-ignore allow key on View for indicator list
                key={`dot-${i}`}
                style={[
                  styles.dot,
                  i === pageIndex ? styles.dotActive : undefined,
                ]}
              />
            ))}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  parallaxImage: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: Math.round(screenHeight * 0.18),
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: resolveTextColor("light"),
    textAlign: "center",
    marginBottom: 6,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    // Regular sans-serif for non-main titles
    fontFamily: Platform.OS === "android" ? "sans-serif" : undefined,
  },
  titleMain: {
    fontSize: 56,
    fontWeight: Platform.OS === "ios" ? "400" : "700",
    color: resolveTextColor("light"),
    textAlign: "center",
    marginBottom: 6,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    // Script font for the primary app title only (replace with loaded Great Vibes when added)
    fontFamily: Platform.OS === "ios" ? "Snell Roundhand" : "serif",
  },
  subtitle: {
    fontSize: 16,
    color: resolveTextColor("light"),
    textAlign: "center",
    opacity: 0.85,
    fontWeight: "300",
  },
  mainContent: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 24,
    paddingBottom: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  halfCard: {
    flex: 1,
  },
  featureCard: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: resolveTextColor("light"),
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 14,
    color: resolveTextColor("light"),
    lineHeight: 20,
    opacity: 0.9,
  },
  footer: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: Math.round(screenHeight * 0.2),
    paddingBottom: 24,
  },
  centerArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 40,
    marginTop: Math.round(screenHeight * 0.4),
  },
  dots: {
    position: "absolute",
    bottom: 28,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.35)",
  },
  dotActive: {
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  pulse: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  getStartedButton: {
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    borderRadius: 25,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.7)",
    marginBottom: 16,
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: "600",
    color: resolveTextColor("light"),
    textAlign: "center",
  },
  footerText: {
    fontSize: 14,
    color: resolveTextColor("light"),
    opacity: 0.7,
    textAlign: "center",
  },
});

import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
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
import { useWelcomeText } from "../i18n/hooks";
import { ANIMATION_CONFIG } from "@/theme/animations";
import { createFontStyle, FONT_PRESETS } from "@/theme/typography";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export type WelcomeScreenProps = {
  onGetStarted: () => void;
};

export default function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const buttonColors = resolveFontToggleColors("light");
  const welcomeText = useWelcomeText();

  const SCRIPT_FONT = Platform.select({
    ios: "Snell Roundhand",
    android: "serif",
    default: "serif",
  });
  const pages = useMemo(
    () => [
      {
        key: "intro",
        title: welcomeText.title,
        subtitle: welcomeText.subtitle,
      },
      {
        key: "explainer",
        title: welcomeText.explainer.title,
        body: welcomeText.explainer.body,
      },
      {
        key: "cta",
        title: welcomeText.cta.title,
        body: welcomeText.cta.body,
      },
    ],
    [welcomeText]
  );

  const [pageIndex, setPageIndex] = useState(0);
  const listRef = useRef<FlatList<any>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const ctaOpacity = useRef(new Animated.Value(0)).current;
  const pulse1 = useRef(new Animated.Value(0)).current; // 0..1
  const pulse2 = useRef(new Animated.Value(0)).current; // staggered
  const orbit = useRef(new Animated.Value(0)).current; // 0..1, 20s loop
  const auraOpacity = useRef(new Animated.Value(0)).current; // fade-in for aura
  // no manual edge snap; rely on native paging + snapToInterval

  // Fade-in CTA when last page becomes active
  useEffect(() => {
    if (pageIndex === pages.length - 1) {
      Animated.timing(ctaOpacity, {
        toValue: 1,
        duration: ANIMATION_CONFIG.duration.slow,
        useNativeDriver: true,
      }).start();
      auraOpacity.setValue(0);
      Animated.sequence([
        Animated.delay(ANIMATION_CONFIG.cta.fadeIn.delay),
        Animated.timing(auraOpacity, {
          toValue: 1,
          duration: ANIMATION_CONFIG.cta.fadeIn.duration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      ctaOpacity.setValue(0);
      auraOpacity.setValue(0);
    }
  }, [ctaOpacity, auraOpacity, pageIndex, pages.length]);

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
              duration: ANIMATION_CONFIG.duration.pulse,
              easing: Easing.out(Easing.quad),
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
              duration: ANIMATION_CONFIG.duration.pulse,
              easing: Easing.out(Easing.quad),
              useNativeDriver: true,
            }),
          ])
        ),
      ]).start();
    };
    loop();
  }, [pulse1, pulse2]);

  // Orbiting dot animation around the CTA circle (one revolution ~20s)
  useEffect(() => {
    orbit.setValue(0);
    const spin = Animated.loop(
      Animated.timing(orbit, {
        toValue: 1,
        duration: ANIMATION_CONFIG.duration.orbit,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spin.start();
    return () => {
      spin.stop();
    };
  }, [orbit]);

  const handleGetStarted = () => {
    onGetStarted();
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const next = Math.round(x / screenWidth);
    if (next !== pageIndex) setPageIndex(next);
  };

  // no custom scroll end handlers

  // Provide stable layout metrics for better virtualization performance
  const getItemLayout = (_: any, index: number) => ({
    length: screenWidth,
    offset: screenWidth * index,
    index,
  });

  // No custom edge clamping — rely on native paging + snapToInterval

  // Remove custom snapping; rely on FlatList paging + snapToInterval

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
            overScrollMode="never"
            contentInsetAdjustmentBehavior="never"
            automaticallyAdjustContentInsets={false}
            snapToInterval={screenWidth}
            snapToAlignment="center"
            decelerationRate="fast"
            disableIntervalMomentum
            onLayout={() =>
              listRef.current?.scrollToOffset({ offset: 0, animated: false })
            }
            // rely on native snapping only
            getItemLayout={getItemLayout}
            initialNumToRender={2}
            maxToRenderPerBatch={2}
            windowSize={3}
            removeClippedSubviews
            // no custom edge handlers; rely on native snapping
            renderItem={({ item, index }) => (
              <View style={{ width: screenWidth }}>
                {index === pages.length - 1 ? (
                  <View style={styles.ctaContainer}>
                    <View
                      style={{ alignItems: "center", justifyContent: "center" }}
                    >
                      <View style={styles.ctaFrame}>
                        {/* Orbit path container rotated continuously */}
                        <Animated.View
                          pointerEvents="none"
                          style={[
                            styles.orbitPath,
                            {
                              transform: [
                                {
                                  rotate: orbit.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ["0deg", "360deg"],
                                  }),
                                },
                              ],
                            },
                          ]}
                        >
                          <View style={styles.orbitGlowLarge} />
                          <View style={styles.orbitGlowSmall} />
                          <View style={styles.orbitDot} />
                        </Animated.View>
                        {/* Aura behind button: fade in, then grow & fade out in loop */}
                        <Animated.View
                          style={[styles.pulseGroup, { opacity: auraOpacity }]}
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
                                      outputRange: [0.9, 1.35],
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
                                      outputRange: [0.9, 1.6],
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
                        </Animated.View>
                        <Animated.View style={[{ opacity: ctaOpacity }]}>
                          <Pressable
                            style={[
                              styles.getStartedButton,
                              {
                                backgroundColor: buttonColors.background,
                                borderWidth: StyleSheet.hairlineWidth,
                                borderColor: buttonColors.border,
                              },
                            ]}
                            onPress={handleGetStarted}
                            android_ripple={{
                              color: "rgba(255, 255, 255, 0.1)",
                            }}
                          >
                            <Text style={styles.getStartedText}>
                              {welcomeText.cta.button}
                            </Text>
                          </Pressable>
                        </Animated.View>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={{ flex: 1, paddingHorizontal: 24 }}>
                    <View style={styles.header}>
                      <Text
                        style={index === 0 ? styles.titleMain : styles.title}
                      >
                        {index === 0 ? item.title : item.title}
                      </Text>
                      {index === 0 ? (
                        <Text style={styles.subtitle}>{pages[0].subtitle}</Text>
                      ) : null}
                    </View>
                    {index === 1 ? (
                      <View style={styles.explainerContainer}>
                        <Text style={styles.explainerTitle}>{item.title}</Text>
                        {item.body ? (
                          <Text style={styles.explainerBody}>{item.body}</Text>
                        ) : null}
                      </View>
                    ) : null}
                  </View>
                )}
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
    ...FONT_PRESETS.welcomeTitle,
    color: resolveTextColor("light"),
    textAlign: "center",
    marginBottom: 6,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    ...FONT_PRESETS.welcomeSubtitle,
    color: resolveTextColor("light"),
    textAlign: "center",
    opacity: 0.85,
  },
  mainContent: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: 24,
    paddingBottom: 16,
  },
  explainerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  explainerTitle: {
    ...createFontStyle("sans", "2xl", "bold"),
    color: resolveTextColor("light"),
    marginBottom: 12,
    textAlign: "center",
  },
  explainerBody: {
    ...FONT_PRESETS.welcomeBody,
    color: resolveTextColor("light"),
    opacity: 0.9,
    lineHeight: 22,
    textAlign: "center",
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
  },
  ctaContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  ctaFrame: {
    width: ANIMATION_CONFIG.cta.button.size,
    height: ANIMATION_CONFIG.cta.button.size,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseGroup: {
    position: "absolute",
    width: ANIMATION_CONFIG.cta.aura.size,
    height: ANIMATION_CONFIG.cta.aura.size,
    top: 0,
    left: 0,
  },
  orbitPath: {
    position: "absolute",
    width: ANIMATION_CONFIG.cta.button.size,
    height: ANIMATION_CONFIG.cta.button.size,
    top: 0,
    left: 0,
  },
  orbitDot: {
    position: "absolute",
    width: ANIMATION_CONFIG.cta.orbitDot.size,
    height: ANIMATION_CONFIG.cta.orbitDot.size,
    borderRadius: ANIMATION_CONFIG.cta.orbitDot.radius,
    backgroundColor: "#fff",
    top: -ANIMATION_CONFIG.cta.orbitDot.radius, // centered on top edge
    left:
      ANIMATION_CONFIG.cta.button.radius - ANIMATION_CONFIG.cta.orbitDot.radius,
    shadowColor: "#fff",
    shadowOpacity: 0.6,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  orbitGlowSmall: {
    position: "absolute",
    width: ANIMATION_CONFIG.cta.orbitDot.glowSmall.size,
    height: ANIMATION_CONFIG.cta.orbitDot.glowSmall.size,
    borderRadius: ANIMATION_CONFIG.cta.orbitDot.glowSmall.radius,
    backgroundColor: `rgba(255,255,255,${ANIMATION_CONFIG.cta.orbitDot.glowSmall.opacity})`,
    top: -ANIMATION_CONFIG.cta.orbitDot.glowSmall.radius,
    left:
      ANIMATION_CONFIG.cta.button.radius -
      ANIMATION_CONFIG.cta.orbitDot.glowSmall.radius,
  },
  orbitGlowLarge: {
    position: "absolute",
    width: ANIMATION_CONFIG.cta.orbitDot.glowLarge.size,
    height: ANIMATION_CONFIG.cta.orbitDot.glowLarge.size,
    borderRadius: ANIMATION_CONFIG.cta.orbitDot.glowLarge.radius,
    backgroundColor: `rgba(255,255,255,${ANIMATION_CONFIG.cta.orbitDot.glowLarge.opacity})`,
    top: -ANIMATION_CONFIG.cta.orbitDot.glowLarge.radius,
    left:
      ANIMATION_CONFIG.cta.button.radius -
      ANIMATION_CONFIG.cta.orbitDot.glowLarge.radius,
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
    width: ANIMATION_CONFIG.cta.aura.size,
    height: ANIMATION_CONFIG.cta.aura.size,
    borderRadius: ANIMATION_CONFIG.cta.aura.radius,
    backgroundColor: "rgba(255,255,255,0.08)",
    top: 0,
    left: 0,
  },
  getStartedButton: {
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    borderRadius: ANIMATION_CONFIG.cta.button.radius,
    width: ANIMATION_CONFIG.cta.button.size,
    height: ANIMATION_CONFIG.cta.button.size,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0,
  },
  getStartedText: {
    ...FONT_PRESETS.welcomeButton,
    color: resolveTextColor("light"),
    textAlign: "center",
    paddingHorizontal: 12,
  },
  footerText: {
    fontSize: 14,
    color: resolveTextColor("light"),
    opacity: 0.7,
    textAlign: "center",
  },
});

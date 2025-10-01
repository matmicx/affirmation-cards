import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, Text, StyleSheet, View, Animated } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Card } from "./data/cards";
import { cards } from "./data/cards";
import { getDailyCard } from "./utils/cardManager";
import CardDisplay from "./components/CardDisplay";
import WelcomeScreen from "./components/WelcomeScreen";
import { SettingsProvider } from "./context/SettingsContext";

const HAS_SEEN_WELCOME_KEY = "@wisdom_cards:has_seen_welcome";

export default function App() {
  const [dailyCard, setDailyCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [initializing, setInitializing] = useState(false); // Start as false for now
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lastLoadedDateRef = useRef(new Date().toDateString());

  // Animation values for smooth transition
  const welcomeOpacity = useRef(new Animated.Value(1)).current;
  const mainScreenOpacity = useRef(new Animated.Value(0)).current;

  const loadDailyCard = useCallback(async () => {
    try {
      console.log("Loading daily card...");
      const card = await getDailyCard();
      console.log("Daily card loaded:", card.id);
      setDailyCard(card);
    } catch (error) {
      console.error("Error loading daily card:", error);
      // Fallback to first card if there's an error
      setDailyCard(cards[0]);
    } finally {
      lastLoadedDateRef.current = new Date().toDateString();
      setLoading(false);
    }
  }, []);

  // Check if user has seen welcome screen - temporarily disabled for debugging
  // useEffect(() => {
  //   const checkWelcomeStatus = async () => {
  //     try {
  //       const hasSeenWelcome = await AsyncStorage.getItem(HAS_SEEN_WELCOME_KEY);
  //       console.log("Welcome status check:", hasSeenWelcome);
  //       setShowWelcome(hasSeenWelcome !== "true");
  //       setInitializing(false);
  //     } catch (error) {
  //       console.error("Error checking welcome status:", error);
  //       // Default to showing welcome screen if there's an error
  //       setShowWelcome(true);
  //       setInitializing(false);
  //     }
  //   };

  //   // Add a timeout to prevent hanging
  //   const timeout = setTimeout(() => {
  //     console.log("Initialization timeout - defaulting to welcome screen");
  //     setShowWelcome(true);
  //     setInitializing(false);
  //   }, 3000);

  //   checkWelcomeStatus().finally(() => {
  //     clearTimeout(timeout);
  //   });
  // }, []);

  useEffect(() => {
    setLoading(true);
    loadDailyCard();
  }, [loadDailyCard]);

  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date().toDateString();
      if (today !== lastLoadedDateRef.current) {
        loadDailyCard();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [loadDailyCard]);

  const handleGetStarted = async () => {
    try {
      setIsTransitioning(true);

      // Start the crossfade transition (no scaling to avoid white edges)
      Animated.parallel([
        Animated.timing(welcomeOpacity, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(mainScreenOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // After animation completes, update state and save preference
        setShowWelcome(false);
        setIsTransitioning(false);
        AsyncStorage.setItem(HAS_SEEN_WELCOME_KEY, "true");
      });
    } catch (error) {
      console.error("Error during transition:", error);
      setShowWelcome(false);
      setIsTransitioning(false);
    }
  };

  const resetWelcomeScreen = async () => {
    try {
      await AsyncStorage.removeItem(HAS_SEEN_WELCOME_KEY);
      setShowWelcome(true);
      // Reset animation values for next time
      welcomeOpacity.setValue(1);
      mainScreenOpacity.setValue(0);
    } catch (error) {
      console.error("Error resetting welcome status:", error);
    }
  };

  const cardToDisplay: Card = loading
    ? {
        id: 0,
        text: "Loading your daily wisdom...",
        image: cards[0].image,
      }
    : dailyCard ?? {
        id: 0,
        text: "Something went wrong. Please try again.",
        image: cards[0].image,
      };

  console.log("App render state:", {
    initializing,
    showWelcome,
    isTransitioning,
    loading,
  });

  return (
    <SettingsProvider>
      <View style={styles.container}>
        {/* Welcome Screen - animated */}
        {(showWelcome || isTransitioning) && (
          <Animated.View
            style={[styles.animatedScreen, { opacity: welcomeOpacity }]}
          >
            <WelcomeScreen onGetStarted={handleGetStarted} />
          </Animated.View>
        )}

        {/* Main Screen - animated */}
        {(!showWelcome || isTransitioning) && (
          <Animated.View
            style={[
              styles.animatedScreen,
              {
                opacity: mainScreenOpacity,
              },
            ]}
          >
            <CardDisplay
              card={cardToDisplay}
              isTransitioning={isTransitioning}
            />
            {/* Development reset button - only visible in development */}
            {__DEV__ && (
              <Pressable
                style={styles.resetButton}
                onPress={resetWelcomeScreen}
              >
                <Text style={styles.resetButtonText}>Reset Welcome Screen</Text>
              </Pressable>
            )}
          </Animated.View>
        )}
      </View>
      <StatusBar style="light" />
    </SettingsProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  animatedScreen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent",
  },
  resetButton: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 1000,
  },
  resetButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

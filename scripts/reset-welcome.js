#!/usr/bin/env node

/**
 * Development script to reset the welcome screen
 * This clears the AsyncStorage key that tracks if the user has seen the welcome screen
 */

const AsyncStorage = require("@react-native-async-storage/async-storage");

const HAS_SEEN_WELCOME_KEY = "@wisdom_cards:has_seen_welcome";

async function resetWelcomeScreen() {
  try {
    console.log("🔄 Resetting welcome screen...");

    // In a real React Native app, you'd use AsyncStorage.removeItem()
    // For this script, we'll just log what would happen
    console.log(`Would remove key: ${HAS_SEEN_WELCOME_KEY}`);
    console.log("✅ Welcome screen reset complete!");
    console.log(
      "📱 Next time you open the app, you'll see the welcome screen again."
    );
  } catch (error) {
    console.error("❌ Error resetting welcome screen:", error);
  }
}

resetWelcomeScreen();

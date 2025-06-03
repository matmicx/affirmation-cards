import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { styled } from "nativewind";
import { useEffect, useState } from "react";
import { Card } from "./data/cards";
import { getDailyCard } from "./utils/cardManager";
import CardDisplay from "./components/CardDisplay";

const StyledView = styled(View);

export default function App() {
  const [dailyCard, setDailyCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDailyCard();
  }, []);

  async function loadDailyCard() {
    try {
      const card = await getDailyCard();
      setDailyCard(card);
    } catch (error) {
      console.error("Error loading daily card:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <CardDisplay
        card={{
          id: 0,
          text: "Loading your daily affirmation...",
          illustration: "✨",
          illustrationPath: "src/assets/illustrations/card1.png",
        }}
      />
    );
  }

  if (!dailyCard) {
    return (
      <CardDisplay
        card={{
          id: 0,
          text: "Something went wrong. Please try again.",
          illustration: "⚠️",
          illustrationPath: "src/assets/illustrations/card2.png",
        }}
      />
    );
  }

  return (
    <>
      <CardDisplay card={dailyCard} />
      <StatusBar style="light" />
    </>
  );
}

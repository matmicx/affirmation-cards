import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Card, cards } from "./data/cards";
import { getDailyCard } from "./utils/cardManager";
import CardDisplay from "./components/CardDisplay";
import { SettingsProvider } from "./context/SettingsContext";

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

  const cardToDisplay: Card = loading
    ? {
        id: 0,
        text: "Loading your daily affirmation...",
        image: cards[0].image,
      }
    : dailyCard ?? {
        id: 0,
        text: "Something went wrong. Please try again.",
        image: cards[0].image,
      };

  return (
    <SettingsProvider>
      <CardDisplay card={cardToDisplay} />
      <StatusBar style="light" />
    </SettingsProvider>
  );
}

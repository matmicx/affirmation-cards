import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import { Card, cards } from "./data/cards";
import { getDailyCard } from "./utils/cardManager";
import CardDisplay from "./components/CardDisplay";
import { SettingsProvider } from "./context/SettingsContext";

export default function App() {
  const [dailyCard, setDailyCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);
  const lastLoadedDateRef = useRef(new Date().toDateString());

  const loadDailyCard = useCallback(async () => {
    try {
      const card = await getDailyCard();
      setDailyCard(card);
    } catch (error) {
      console.error("Error loading daily card:", error);
    } finally {
      lastLoadedDateRef.current = new Date().toDateString();
      setLoading(false);
    }
  }, []);

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

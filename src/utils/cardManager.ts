import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card, cards } from "../data/cards";

const LAST_CARD_KEY = "@wisdom_cards:last_card";
const LAST_DATE_KEY = "@wisdom_cards:last_date";

export async function getDailyCard(): Promise<Card> {
  const today = new Date().toDateString();

  // Get the last card and date from storage
  const lastCardId = await AsyncStorage.getItem(LAST_CARD_KEY);
  const lastDate = await AsyncStorage.getItem(LAST_DATE_KEY);

  // If we already have a card for today, return it
  if (lastDate === today && lastCardId) {
    const card = cards.find((c) => c.id === parseInt(lastCardId));
    if (card) return card;
  }

  // Get a new random card, excluding the last one
  const availableCards = cards.filter(
    (card) => !lastCardId || card.id !== parseInt(lastCardId)
  );
  const randomIndex = Math.floor(Math.random() * availableCards.length);
  const selectedCard = availableCards[randomIndex];

  // Save the new card and date
  await AsyncStorage.setItem(LAST_CARD_KEY, selectedCard.id.toString());
  await AsyncStorage.setItem(LAST_DATE_KEY, today);

  return selectedCard;
}

import type { ImageSourcePropType } from "react-native";
import { generatedCards } from "./cards.generated";

export type Card = {
  id: number;
  text: string;
  image: ImageSourcePropType;
  preferredTone?: "light" | "dark";
};

export const cards: Card[] = generatedCards;

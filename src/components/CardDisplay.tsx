// src/components/CardDisplay.tsx
import React from "react";
import { View, Text, Image, Dimensions, SafeAreaView } from "react-native";
import { styled } from "nativewind";
import { Card } from "../data/cards";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledImage = styled(Image);
const StyledSafeAreaView = styled(SafeAreaView);

type CardDisplayProps = {
  card: Card;
};

export default function CardDisplay({ card }: CardDisplayProps) {
  const getImageSource = (path: string) => {
    switch (path) {
      case "src/assets/illustrations/card1.png":
        return require("../assets/illustrations/card1.png");
      case "src/assets/illustrations/card2.png":
        return require("../assets/illustrations/card2.png");
      default:
        return require("../assets/illustrations/card1.png"); // Fallback to card1
    }
  };

  const getTimeUntilNextCard = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m until your next card`;
  };

  return (
    <StyledSafeAreaView className="flex-1">
      <StyledView className="flex-1">
        <StyledImage
          source={getImageSource(card.illustrationPath)}
          className="absolute w-full h-full"
          resizeMode="cover"
        />
        <StyledView className="flex-1 bg-black/30 justify-end p-8">
          <StyledText className="text-white text-4xl text-center font-bold mb-4">
            {card.text}
          </StyledText>
          <StyledText className="text-white text-sm text-center opacity-80">
            {getTimeUntilNextCard()}
          </StyledText>
        </StyledView>
      </StyledView>
    </StyledSafeAreaView>
  );
}

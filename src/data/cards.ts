export type Card = {
  id: number;
  text: string;
  illustration: string;
  illustrationPath: string;
};

export const cards: Card[] = [
  {
    id: 1,
    text: "I am capable of achieving anything I set my mind to",
    illustration: "🌟",
    illustrationPath: "src/assets/illustrations/card1.png",
  },
  {
    id: 2,
    text: "I choose to be confident and self-assured",
    illustration: "💫",
    illustrationPath: "src/assets/illustrations/card2.png",
  },
];

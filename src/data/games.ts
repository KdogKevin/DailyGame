export type GameMeta = {
  slug: string;
  name: string;
  tagline: string;
  /** Gradient swatch shown on the home page card. */
  colors: string[];
};

export const GAMES: GameMeta[] = [
  {
    slug: "dailyguess",
    name: "DailyGuess",
    tagline: "Guess real-world numbers. How close can you get?",
    colors: ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"],
  },
  {
    slug: "blindtrader",
    name: "BlindTrader",
    tagline: "Real headlines, a mystery stock, $10,000 to invest.",
    colors: ["#22c55e", "#0ea5e9", "#6366f1", "#a855f7", "#ef4444"],
  },
];

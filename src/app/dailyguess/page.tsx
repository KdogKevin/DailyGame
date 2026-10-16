import type { Metadata } from "next";
import Game from "@/components/Game";

export const metadata: Metadata = {
  title: "DailyGuess",
  description: "A daily estimation game — how close can you get?",
};

export default function DailyGuessPage() {
  return <Game />;
}

import type { Metadata } from "next";
import BlindTrader from "@/components/BlindTrader";

export const metadata: Metadata = {
  title: "BlindTrader",
  description:
    "A daily trading game — real headlines, a mystery stock, and $10,000 to invest.",
};

export default function BlindTraderPage() {
  return <BlindTrader />;
}

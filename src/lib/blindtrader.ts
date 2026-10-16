import { STOCK_EVENTS, type StockEvent } from "@/data/blindtrader-events";

const EPOCH = new Date(2026, 9, 16); // 2026-10-16, day 1

export const STARTING_CASH = 10000;
export const TRADING_DAYS = 10;

export type Action = "buy" | "short" | "wait";

export type DayTrade = {
  day: number;
  action: Action;
  pct: number;
  priceBefore: number;
  priceAfter: number;
  equityBefore: number;
  equityAfter: number;
};

export type Portfolio = {
  cash: number;
  shares: number;
};

export type RunResult = {
  dateKey: string;
  dayNumber: number;
  eventId: string;
  trades: DayTrade[];
  finalEquity: number;
  bankrupt: boolean;
};

export type InProgress = {
  dateKey: string;
  dayIndex: number; // 0-based, next day to play
  cash: number;
  shares: number;
  trades: DayTrade[];
  bankrupt: boolean;
};

export type Stats = {
  streak: number;
  lastPlayedDateKey: string | null;
  history: Record<string, RunResult>;
  inProgress: InProgress | null;
};

const STORAGE_KEY = "blindtrader-stats-v1";

export function getTodayDateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function getDayNumber(dateKey: string): number {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const diffDays = Math.floor((date.getTime() - EPOCH.getTime()) / 86400000);
  return diffDays + 1;
}

export function getEventForDate(dateKey: string): StockEvent {
  const dayNumber = getDayNumber(dateKey);
  const index = ((dayNumber - 1) % STOCK_EVENTS.length + STOCK_EVENTS.length) % STOCK_EVENTS.length;
  return STOCK_EVENTS[index];
}

export function equityOf(portfolio: Portfolio, price: number): number {
  return portfolio.cash + portfolio.shares * price;
}

/**
 * Applies a buy/short order sized as a percentage of CURRENT equity at the
 * current price. Because the order is always sized off equity you already
 * have, any pct from 0-100 is inherently affordable — there's no way for the
 * player to pick an action their wallet/position can't support.
 */
export function applyAction(
  portfolio: Portfolio,
  action: Action,
  pct: number,
  price: number
): Portfolio {
  if (action === "wait" || pct <= 0) return portfolio;
  const equity = equityOf(portfolio, price);
  const amount = (Math.min(100, Math.max(0, pct)) / 100) * Math.max(0, equity);
  if (amount <= 0) return portfolio;
  const qty = amount / price;
  if (action === "buy") {
    return { cash: portfolio.cash - amount, shares: portfolio.shares + qty };
  }
  return { cash: portfolio.cash + amount, shares: portfolio.shares - qty };
}

export function formatMoney(n: number): string {
  const sign = n < 0 ? "-" : "";
  return `${sign}$${Math.abs(n).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function formatPct(n: number): string {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}

const EMPTY_STATS: Stats = {
  streak: 0,
  lastPlayedDateKey: null,
  history: {},
  inProgress: null,
};

export function loadStats(): Stats {
  if (typeof window === "undefined") return { ...EMPTY_STATS };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_STATS };
    const parsed = JSON.parse(raw) as Partial<Stats>;
    return {
      streak: parsed.streak ?? 0,
      lastPlayedDateKey: parsed.lastPlayedDateKey ?? null,
      history: parsed.history ?? {},
      inProgress: parsed.inProgress ?? null,
    };
  } catch {
    return { ...EMPTY_STATS };
  }
}

function saveStats(stats: Stats) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // ignore storage errors (private mode, quota, etc.)
  }
}

function isConsecutiveDay(prevKey: string | null, currentKey: string): boolean {
  if (!prevKey) return false;
  const prev = new Date(prevKey);
  const current = new Date(currentKey);
  const diffDays = Math.round((current.getTime() - prev.getTime()) / 86400000);
  return diffDays === 1;
}

export function recordRunResult(dateKey: string, result: RunResult): Stats {
  const stats = loadStats();

  if (!stats.history[dateKey]) {
    if (isConsecutiveDay(stats.lastPlayedDateKey, dateKey)) {
      stats.streak += 1;
    } else if (stats.lastPlayedDateKey !== dateKey) {
      stats.streak = 1;
    }
    stats.lastPlayedDateKey = dateKey;
  }

  stats.history[dateKey] = result;
  stats.inProgress = null;
  saveStats(stats);
  return stats;
}

export function saveInProgress(progress: InProgress): Stats {
  const stats = loadStats();
  stats.inProgress = progress;
  saveStats(stats);
  return stats;
}

export const SITE_URL = "https://daily.kcnguyen.com/blindtrader";

export function buildShareText(result: RunResult, streak: number): string {
  const grid = result.trades
    .map((t) => (t.equityAfter >= t.equityBefore ? "🟩" : "🟥"))
    .join("");
  const pctReturn = ((result.finalEquity - STARTING_CASH) / STARTING_CASH) * 100;
  return [
    `BlindTrader #${result.dayNumber} — ${formatMoney(result.finalEquity)} (${formatPct(pctReturn)})`,
    grid,
    `🔥 ${streak} day streak`,
    SITE_URL,
  ].join("\n");
}

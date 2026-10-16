import { QUESTION_DAYS, type Question, type QuestionDay } from "@/data/questions";

const EPOCH = new Date(2026, 9, 16); // 2026-10-16, day 1

export type Scale = { value: number; label: string };

/**
 * Derives the input scale for a question from the size of its answer, so
 * new questions don't need a manually-authored `scale` to avoid asking
 * players to type out a huge number digit by digit. A question can still
 * set its own `scale` to override this.
 */
export function resolveScale(question: Question): Scale | undefined {
  if (question.scale) return question.scale;
  if (question.answer >= 1_000_000_000) return { value: 1_000_000_000, label: "billion" };
  if (question.answer >= 1_000_000) return { value: 1_000_000, label: "million" };
  return undefined;
}

export type Tier = {
  emoji: string;
  label: string;
  /** Tailwind background color class used for in-app badges. */
  color: string;
};

export type QuestionResult = {
  guess: number;
  actual: number;
  relativeError: number;
  points: number;
  tier: Tier;
};

export type DayResult = {
  dateKey: string;
  dayNumber: number;
  results: QuestionResult[];
  totalPoints: number;
};

export type InProgress = {
  dateKey: string;
  questionIndex: number;
  results: QuestionResult[];
  pendingResult: QuestionResult | null;
};

export type Stats = {
  streak: number;
  lastPlayedDateKey: string | null;
  history: Record<string, DayResult>;
  inProgress: InProgress | null;
};

const STORAGE_KEY = "dailyguess-stats-v1";
const MAX_POINTS_PER_QUESTION = 100;
const LOG_TOLERANCE = 3; // 3 orders of magnitude (1000x) off = 0 points

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
  const index = ((diffDays % QUESTION_DAYS.length) + QUESTION_DAYS.length) % QUESTION_DAYS.length;
  return index + 1;
}

export function getQuestionsForDate(dateKey: string): QuestionDay {
  const dayNumber = getDayNumber(dateKey);
  return QUESTION_DAYS[dayNumber - 1];
}

export function scoreGuess(guess: number, actual: number): QuestionResult {
  const relativeError = Math.abs(guess - actual) / actual;

  const safeGuess = Math.max(guess, 0.0001);
  const logDiff = Math.abs(Math.log10(safeGuess) - Math.log10(actual));
  const points = Math.round(
    Math.max(0, 1 - logDiff / LOG_TOLERANCE) * MAX_POINTS_PER_QUESTION
  );

  return {
    guess,
    actual,
    relativeError,
    points,
    tier: tierFor(relativeError),
  };
}

export function tierFor(relativeError: number): Tier {
  if (relativeError <= 0.05)
    return { emoji: "🟩", label: "Nailed it", color: "bg-green-500" };
  if (relativeError <= 0.2)
    return { emoji: "🟩", label: "Great", color: "bg-lime-500" };
  if (relativeError <= 0.5)
    return { emoji: "🟨", label: "Close", color: "bg-yellow-500" };
  if (relativeError <= 1.2)
    return { emoji: "🟧", label: "Ballpark", color: "bg-orange-500" };
  return { emoji: "🟥", label: "Way off", color: "bg-red-500" };
}

const EMPTY_STATS: Stats = {
  streak: 0,
  lastPlayedDateKey: null,
  history: {},
  inProgress: null,
};

export function loadStats(): Stats {
  if (typeof window === "undefined") {
    return { ...EMPTY_STATS };
  }
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

export function recordDayResult(dateKey: string, dayResult: DayResult): Stats {
  const stats = loadStats();

  if (!stats.history[dateKey]) {
    if (isConsecutiveDay(stats.lastPlayedDateKey, dateKey)) {
      stats.streak += 1;
    } else if (stats.lastPlayedDateKey !== dateKey) {
      stats.streak = 1;
    }
    stats.lastPlayedDateKey = dateKey;
  }

  stats.history[dateKey] = dayResult;
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

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export const SITE_URL = "https://daily.kcnguyen.com";

export function buildShareText(dayResult: DayResult, streak: number): string {
  const grid = dayResult.results.map((r) => r.tier.emoji).join("");
  return [
    `DailyGuess #${dayResult.dayNumber} — ${dayResult.totalPoints}/500`,
    grid,
    `🔥 ${streak} day streak`,
    SITE_URL,
  ].join("\n");
}

"use client";

import { useEffect, useState } from "react";
import type { Question, QuestionDay } from "@/data/questions";
import {
  buildShareText,
  formatNumber,
  getQuestionsForDate,
  getTodayDateKey,
  loadStats,
  recordDayResult,
  scoreGuess,
  type DayResult,
  type QuestionResult,
  type Stats,
} from "@/lib/game";

type Phase = "intro" | "playing" | "summary";

type Loaded = {
  dateKey: string;
  questionDay: QuestionDay;
  stats: Stats;
};

export default function Game() {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [phase, setPhase] = useState<Phase>("intro");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);
  const [guessInput, setGuessInput] = useState("");
  const [shareCopied, setShareCopied] = useState(false);

  useEffect(() => {
    // `new Date()` and localStorage only make sense client-side, so the
    // "today" lookup and stats load happen here on mount rather than
    // during render.
    const dateKey = getTodayDateKey();
    const questionDay = getQuestionsForDate(dateKey);
    const stats = loadStats();

    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage/Date on mount
    setLoaded({ dateKey, questionDay, stats });
    if (stats.history[dateKey]) {
      setResults(stats.history[dateKey].results);
      setPhase("summary");
    }
  }, []);

  if (!loaded) {
    return (
      <main className="flex-1 flex items-center justify-center p-6">
        <p className="text-sm opacity-60">Loading...</p>
      </main>
    );
  }

  const { dateKey, questionDay, stats } = loaded;

  const currentQuestion: Question | undefined =
    questionDay.questions[questionIndex];

  function startGame() {
    setResults([]);
    setQuestionIndex(0);
    setGuessInput("");
    setPhase("playing");
  }

  function submitGuess(e: React.FormEvent) {
    e.preventDefault();
    if (!currentQuestion) return;
    const parsed = Number(guessInput.replace(/,/g, ""));
    if (!Number.isFinite(parsed) || parsed < 0) return;

    const result = scoreGuess(parsed, currentQuestion.answer);
    const nextResults = [...results, result];
    setResults(nextResults);
    setGuessInput("");

    if (questionIndex + 1 < questionDay.questions.length) {
      setQuestionIndex(questionIndex + 1);
    } else {
      const totalPoints = nextResults.reduce((sum, r) => sum + r.points, 0);
      const dayResult: DayResult = {
        dateKey,
        dayNumber: questionDay.day,
        results: nextResults,
        totalPoints,
      };
      const updatedStats = recordDayResult(dateKey, dayResult);
      setLoaded({ dateKey, questionDay, stats: updatedStats });
      setPhase("summary");
    }
  }

  async function handleShare() {
    if (!stats) return;
    const dayResult = stats.history[dateKey];
    if (!dayResult) return;
    const text = buildShareText(dayResult, stats.streak);

    if (navigator.share) {
      try {
        await navigator.share({ text });
        return;
      } catch {
        // user cancelled or share failed; fall back to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(text);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch {
      // clipboard unavailable; nothing more we can do
    }
  }

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">DailyGuess</h1>
          <p className="text-sm opacity-60 mt-1">
            Day #{questionDay.day} · How close can you get?
          </p>
        </header>

        {phase === "intro" && (
          <IntroScreen stats={stats} onStart={startGame} />
        )}

        {phase === "playing" && currentQuestion && (
          <PlayingScreen
            question={currentQuestion}
            index={questionIndex}
            total={questionDay.questions.length}
            guessInput={guessInput}
            onChangeGuess={setGuessInput}
            onSubmit={submitGuess}
          />
        )}

        {phase === "summary" && (
          <SummaryScreen
            results={results}
            questions={questionDay.questions}
            streak={stats.streak}
            dayNumber={questionDay.day}
            onShare={handleShare}
            shareCopied={shareCopied}
          />
        )}
      </div>
    </main>
  );
}

function IntroScreen({
  stats,
  onStart,
}: {
  stats: Stats;
  onStart: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <p className="opacity-80">
        5 real-world quantities. One guess each. Score is based on how close
        you get, not whether you&apos;re exactly right.
      </p>
      {stats.streak > 0 && (
        <p className="text-sm">
          🔥 Current streak: <span className="font-semibold">{stats.streak}</span>{" "}
          day{stats.streak === 1 ? "" : "s"}
        </p>
      )}
      <button
        onClick={onStart}
        className="w-full rounded-lg bg-foreground text-background font-semibold py-3 px-6 hover:opacity-90 transition"
      >
        Play today&apos;s round
      </button>
    </div>
  );
}

function PlayingScreen({
  question,
  index,
  total,
  guessInput,
  onChangeGuess,
  onSubmit,
}: {
  question: Question;
  index: number;
  total: number;
  guessInput: string;
  onChangeGuess: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between text-sm opacity-60">
        <span>
          Question {index + 1} of {total}
        </span>
        <span>{question.category}</span>
      </div>

      <p className="text-lg font-medium leading-snug">{question.prompt}</p>

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div className="flex items-center gap-2 border border-black/15 dark:border-white/20 rounded-lg px-3 py-3 focus-within:border-foreground/60">
          <input
            type="text"
            inputMode="decimal"
            autoFocus
            placeholder="Your guess"
            value={guessInput}
            onChange={(e) => onChangeGuess(e.target.value)}
            className="flex-1 bg-transparent outline-none text-lg"
          />
          <span className="text-sm opacity-60 whitespace-nowrap">
            {question.unit}
          </span>
        </div>
        <button
          type="submit"
          disabled={guessInput.trim() === ""}
          className="w-full rounded-lg bg-foreground text-background font-semibold py-3 px-6 hover:opacity-90 transition disabled:opacity-40"
        >
          {index + 1 === total ? "Submit final guess" : "Submit guess"}
        </button>
      </form>
    </div>
  );
}

function SummaryScreen({
  results,
  questions,
  streak,
  dayNumber,
  onShare,
  shareCopied,
}: {
  results: QuestionResult[];
  questions: readonly Question[];
  streak: number;
  dayNumber: number;
  onShare: () => void;
  shareCopied: boolean;
}) {
  const totalPoints = results.reduce((sum, r) => sum + r.points, 0);
  const maxPoints = results.length * 100;

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <p className="text-3xl font-bold">
          {totalPoints}
          <span className="text-lg opacity-50">/{maxPoints}</span>
        </p>
        <p className="text-2xl mt-2 tracking-widest">
          {results.map((r, i) => (
            <span key={i}>{r.tier.emoji}</span>
          ))}
        </p>
        <p className="text-sm opacity-60 mt-2">
          🔥 {streak} day streak
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {results.map((r, i) => (
          <li
            key={i}
            className="border border-black/10 dark:border-white/15 rounded-lg px-4 py-3"
          >
            <p className="text-sm opacity-70">{questions[i].prompt}</p>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-sm">
                You said{" "}
                <span className="font-semibold">
                  {formatNumber(r.guess)}
                </span>{" "}
                · Actual{" "}
                <span className="font-semibold">
                  {formatNumber(r.actual)}
                </span>{" "}
                {questions[i].unit}
              </span>
              <span className="text-sm font-medium whitespace-nowrap ml-2">
                {r.tier.emoji} {r.points} pts
              </span>
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={onShare}
        className="w-full rounded-lg bg-foreground text-background font-semibold py-3 px-6 hover:opacity-90 transition"
      >
        {shareCopied ? "Copied!" : "Share results"}
      </button>

      <p className="text-center text-xs opacity-50">
        Come back tomorrow for day #{dayNumber + 1}.
      </p>
    </div>
  );
}

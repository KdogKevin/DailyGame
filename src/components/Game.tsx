"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Question, QuestionDay } from "@/data/questions";
import {
  buildShareText,
  formatNumber,
  getQuestionsForDate,
  getTodayDateKey,
  loadStats,
  recordDayResult,
  resolveScale,
  saveInProgress,
  scoreGuess,
  type DayResult,
  type QuestionResult,
  type Stats,
} from "@/lib/game";

type Phase = "intro" | "playing" | "summary";

function formatGuessInput(raw: string): string {
  let cleaned = raw.replace(/[^0-9.]/g, "");

  const firstDot = cleaned.indexOf(".");
  if (firstDot !== -1) {
    cleaned =
      cleaned.slice(0, firstDot + 1) +
      cleaned.slice(firstDot + 1).replace(/\./g, "");
  }

  const [intPart, decPart] = cleaned.split(".");
  const formattedInt =
    intPart === "" ? "" : Number(intPart).toLocaleString("en-US");

  return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
}

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
  const [pendingResult, setPendingResult] = useState<QuestionResult | null>(
    null
  );
  const [shareModalOpen, setShareModalOpen] = useState(false);

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
    } else if (stats.inProgress && stats.inProgress.dateKey === dateKey) {
      setQuestionIndex(stats.inProgress.questionIndex);
      setResults(stats.inProgress.results);
      setPendingResult(stats.inProgress.pendingResult);
      setPhase("playing");
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
    setPendingResult(null);
    setPhase("playing");
    saveInProgress({ dateKey, questionIndex: 0, results: [], pendingResult: null });
  }

  function submitGuess(e: React.FormEvent) {
    e.preventDefault();
    if (!currentQuestion || pendingResult) return;
    const entered = Number(guessInput.replace(/,/g, ""));
    if (!Number.isFinite(entered) || entered < 0) return;

    const parsed = entered * (resolveScale(currentQuestion)?.value ?? 1);
    const result = scoreGuess(parsed, currentQuestion.answer);
    const nextResults = [...results, result];
    setResults(nextResults);
    setPendingResult(result);
    saveInProgress({ dateKey, questionIndex, results: nextResults, pendingResult: result });
  }

  function continueAfterFeedback() {
    if (!pendingResult) return;
    setPendingResult(null);
    setGuessInput("");

    if (questionIndex + 1 < questionDay.questions.length) {
      const nextIndex = questionIndex + 1;
      setQuestionIndex(nextIndex);
      saveInProgress({ dateKey, questionIndex: nextIndex, results, pendingResult: null });
    } else {
      const totalPoints = results.reduce((sum, r) => sum + r.points, 0);
      const dayResult: DayResult = {
        dateKey,
        dayNumber: questionDay.day,
        results,
        totalPoints,
      };
      const updatedStats = recordDayResult(dateKey, dayResult);
      setLoaded({ dateKey, questionDay, stats: updatedStats });
      setPhase("summary");
    }
  }

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="text-center">
          <Link
            href="/"
            className="text-xs opacity-50 hover:opacity-80 transition"
          >
            ← Daily Games
          </Link>
          <h1 className="text-2xl font-bold tracking-tight mt-1">
            DailyGuess
          </h1>
          <p className="text-sm opacity-60 mt-1">
            Day #{questionDay.day} · How close can you get?
          </p>
        </header>

        {phase === "intro" && (
          <IntroScreen stats={stats} onStart={startGame} />
        )}

        {phase === "playing" && currentQuestion && !pendingResult && (
          <PlayingScreen
            question={currentQuestion}
            index={questionIndex}
            total={questionDay.questions.length}
            guessInput={guessInput}
            onChangeGuess={setGuessInput}
            onSubmit={submitGuess}
          />
        )}

        {phase === "playing" && currentQuestion && pendingResult && (
          <FeedbackScreen
            question={currentQuestion}
            result={pendingResult}
            isLastQuestion={questionIndex + 1 === questionDay.questions.length}
            onContinue={continueAfterFeedback}
          />
        )}

        {phase === "summary" && (
          <SummaryScreen
            results={results}
            questions={questionDay.questions}
            streak={stats.streak}
            dayNumber={questionDay.day}
            onShare={() => setShareModalOpen(true)}
          />
        )}
      </div>

      {shareModalOpen && stats.history[dateKey] && (
        <ShareModal
          text={buildShareText(stats.history[dateKey], stats.streak)}
          onClose={() => setShareModalOpen(false)}
        />
      )}
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
  const scale = resolveScale(question);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between text-sm opacity-60">
        <span>
          Question {index + 1} of {total}
        </span>
        <span>{question.category}</span>
      </div>

      <p className="text-lg font-medium leading-snug">{question.prompt}</p>

      {scale && (
        <p className="text-sm opacity-60 -mt-3">
          Answer in {scale.label} (e.g. &quot;5&quot; means 5 {scale.label}{" "}
          {question.unit})
        </p>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <div className="flex items-center gap-2 border border-black/15 dark:border-white/20 rounded-lg px-3 py-3 focus-within:border-foreground/60">
          <input
            type="text"
            inputMode="decimal"
            autoFocus
            placeholder="Your guess"
            value={guessInput}
            onChange={(e) => onChangeGuess(formatGuessInput(e.target.value))}
            className="flex-1 bg-transparent outline-none text-lg"
          />
          <span className="text-sm opacity-60 whitespace-nowrap">
            {scale ? `${scale.label} ${question.unit}` : question.unit}
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

function FeedbackScreen({
  question,
  result,
  isLastQuestion,
  onContinue,
}: {
  question: Question;
  result: QuestionResult;
  isLastQuestion: boolean;
  onContinue: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-lg font-medium leading-snug">{question.prompt}</p>

      <div className="border border-black/10 dark:border-white/15 rounded-lg px-4 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm opacity-60">Your guess</span>
          <span className="font-semibold">
            {formatNumber(result.guess)} {question.unit}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm opacity-60">Actual</span>
          <span className="font-semibold">
            {formatNumber(result.actual)} {question.unit}
          </span>
        </div>
        <div className="h-px bg-black/10 dark:bg-white/15" />
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-white ${result.tier.color}`}
          >
            {result.tier.label}
          </span>
          <span className="font-bold text-lg">{result.points} pts</span>
        </div>
      </div>

      <button
        onClick={onContinue}
        autoFocus
        className="w-full rounded-lg bg-foreground text-background font-semibold py-3 px-6 hover:opacity-90 transition"
      >
        {isLastQuestion ? "See results" : "Next question"}
      </button>
    </div>
  );
}

function SummaryScreen({
  results,
  questions,
  streak,
  dayNumber,
  onShare,
}: {
  results: QuestionResult[];
  questions: readonly Question[];
  streak: number;
  dayNumber: number;
  onShare: () => void;
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
        <p className="flex items-center justify-center gap-1.5 mt-3">
          {results.map((r, i) => (
            <span
              key={i}
              className={`inline-block w-4 h-4 rounded ${r.tier.color}`}
              aria-hidden
            />
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
              <span className="flex items-center gap-1.5 text-sm font-medium whitespace-nowrap ml-2">
                <span
                  className={`inline-block w-2.5 h-2.5 rounded-full ${r.tier.color}`}
                  aria-hidden
                />
                {r.points} pts
              </span>
            </div>
          </li>
        ))}
      </ul>

      <button
        onClick={onShare}
        className="w-full rounded-lg bg-foreground text-background font-semibold py-3 px-6 hover:opacity-90 transition"
      >
        Share results
      </button>

      <p className="text-center text-xs opacity-50">
        Come back tomorrow for day #{dayNumber + 1}.
      </p>
    </div>
  );
}

function ShareModal({ text, onClose }: { text: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const encoded = encodeURIComponent(text);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable; user can still select the text manually
    }
  }

  async function handleNativeShare() {
    if (!navigator.share) return;
    try {
      await navigator.share({ text });
    } catch {
      // user cancelled; nothing to do
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-background border border-black/10 dark:border-white/15 rounded-xl p-5 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-semibold">Share your results</h2>

        <pre className="whitespace-pre-wrap text-sm border border-black/10 dark:border-white/15 rounded-lg px-3 py-3 font-sans">
          {text}
        </pre>

        <button
          onClick={handleCopy}
          className="w-full rounded-lg bg-foreground text-background font-semibold py-2.5 px-4 hover:opacity-90 transition"
        >
          {copied ? "Copied!" : "Copy to clipboard"}
        </button>

        <div className="flex gap-2">
          <a
            href={`https://twitter.com/intent/tweet?text=${encoded}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-sm rounded-lg border border-black/15 dark:border-white/20 py-2.5 hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            Share to X
          </a>
          <a
            href={`https://wa.me/?text=${encoded}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center text-sm rounded-lg border border-black/15 dark:border-white/20 py-2.5 hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            WhatsApp
          </a>
          {typeof navigator !== "undefined" && !!navigator.share && (
            <button
              onClick={handleNativeShare}
              className="flex-1 text-center text-sm rounded-lg border border-black/15 dark:border-white/20 py-2.5 hover:bg-black/5 dark:hover:bg-white/10 transition"
            >
              More
            </button>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-sm opacity-60 hover:opacity-100 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { StockEvent } from "@/data/blindtrader-events";
import {
  STARTING_CASH,
  TRADING_DAYS,
  applyAction,
  buildShareText,
  equityOf,
  formatMoney,
  formatPct,
  getEventForDate,
  getTodayDateKey,
  loadStats,
  recordRunResult,
  saveInProgress,
  type Action,
  type DayTrade,
  type Portfolio,
  type RunResult,
  type Stats,
} from "@/lib/blindtrader";

type Phase = "intro" | "choosing" | "sizing" | "feedback" | "summary";

type Loaded = {
  dateKey: string;
  event: StockEvent;
  stats: Stats;
};

export default function BlindTrader() {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [phase, setPhase] = useState<Phase>("intro");
  const [dayIndex, setDayIndex] = useState(0); // 0-based, which trading day is next
  const [portfolio, setPortfolio] = useState<Portfolio>({
    cash: STARTING_CASH,
    shares: 0,
  });
  const [trades, setTrades] = useState<DayTrade[]>([]);
  const [bankrupt, setBankrupt] = useState(false);
  const [pendingAction, setPendingAction] = useState<Action | null>(null);
  const [pct, setPct] = useState(50);
  const [lastTrade, setLastTrade] = useState<DayTrade | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    const dateKey = getTodayDateKey();
    const event = getEventForDate(dateKey);
    const stats = loadStats();

    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage/Date on mount
    setLoaded({ dateKey, event, stats });

    if (stats.history[dateKey]) {
      setTrades(stats.history[dateKey].trades);
      setBankrupt(stats.history[dateKey].bankrupt);
      setPhase("summary");
    } else if (stats.inProgress && stats.inProgress.dateKey === dateKey) {
      setDayIndex(stats.inProgress.dayIndex);
      setPortfolio({ cash: stats.inProgress.cash, shares: stats.inProgress.shares });
      setTrades(stats.inProgress.trades);
      setBankrupt(stats.inProgress.bankrupt);
      setPhase(stats.inProgress.bankrupt ? "summary" : "choosing");
    }
  }, []);

  if (!loaded) {
    return (
      <main className="flex-1 flex items-center justify-center p-6">
        <p className="text-sm opacity-60">Loading...</p>
      </main>
    );
  }

  const { dateKey, event, stats } = loaded;
  const priceBefore = event.closes[dayIndex];
  const priceAfter = event.closes[dayIndex + 1];
  const equity = equityOf(portfolio, priceBefore);
  const headline = event.headlines[dayIndex];

  function startGame() {
    setPortfolio({ cash: STARTING_CASH, shares: 0 });
    setTrades([]);
    setBankrupt(false);
    setDayIndex(0);
    setPendingAction(null);
    setPct(50);
    setPhase("choosing");
    saveInProgress({
      dateKey,
      dayIndex: 0,
      cash: STARTING_CASH,
      shares: 0,
      trades: [],
      bankrupt: false,
    });
  }

  function chooseAction(action: Action) {
    if (action === "wait") {
      resolveDay(action, 0);
      return;
    }
    setPendingAction(action);
    setPct(50);
    setPhase("sizing");
  }

  function resolveDay(action: Action, sizePct: number) {
    const equityBefore = equityOf(portfolio, priceBefore);
    const nextPortfolio = applyAction(portfolio, action, sizePct, priceBefore);
    const equityAfter = equityOf(nextPortfolio, priceAfter);

    const trade: DayTrade = {
      day: dayIndex + 1,
      action,
      pct: sizePct,
      priceBefore,
      priceAfter,
      equityBefore,
      equityAfter,
    };

    const nextTrades = [...trades, trade];
    const wentBankrupt = equityAfter <= 0;

    setPortfolio(nextPortfolio);
    setTrades(nextTrades);
    setLastTrade(trade);
    setBankrupt(wentBankrupt);
    setPendingAction(null);
    setPhase("feedback");

    const nextDayIndex = dayIndex + 1;
    if (wentBankrupt || nextDayIndex >= TRADING_DAYS) {
      finishRun(nextTrades, Math.max(0, equityAfter), wentBankrupt);
    } else {
      saveInProgress({
        dateKey,
        dayIndex: nextDayIndex,
        cash: nextPortfolio.cash,
        shares: nextPortfolio.shares,
        trades: nextTrades,
        bankrupt: false,
      });
    }
  }

  function finishRun(finalTrades: DayTrade[], finalEquity: number, wentBankrupt: boolean) {
    const result: RunResult = {
      dateKey,
      dayNumber: getRunDayNumber(dateKey),
      eventId: event.id,
      trades: finalTrades,
      finalEquity,
      bankrupt: wentBankrupt,
    };
    const updatedStats = recordRunResult(dateKey, result);
    setLoaded({ dateKey, event, stats: updatedStats });
  }

  function continueAfterFeedback() {
    const nextDayIndex = dayIndex + 1;
    if (bankrupt || nextDayIndex >= TRADING_DAYS) {
      setPhase("summary");
      return;
    }
    setDayIndex(nextDayIndex);
    setPhase("choosing");
  }

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-md flex flex-col gap-6">
        <header className="text-center">
          <Link href="/" className="text-xs opacity-50 hover:opacity-80 transition">
            ← Daily Games
          </Link>
          <h1 className="text-2xl font-bold tracking-tight mt-1">BlindTrader</h1>
          <p className="text-sm opacity-60 mt-1">
            Day #{getRunDayNumber(dateKey)} · Mystery stock, real headlines
          </p>
        </header>

        {phase === "intro" && <IntroScreen stats={stats} onStart={startGame} />}

        {(phase === "choosing" || phase === "sizing") && (
          <PlayingScreen
            dayIndex={dayIndex}
            headline={headline}
            price={priceBefore}
            portfolio={portfolio}
            equity={equity}
            phase={phase}
            pendingAction={pendingAction}
            pct={pct}
            onChangePct={setPct}
            onChooseAction={chooseAction}
            onBack={() => {
              setPendingAction(null);
              setPhase("choosing");
            }}
            onConfirm={() => pendingAction && resolveDay(pendingAction, pct)}
          />
        )}

        {phase === "feedback" && lastTrade && (
          <FeedbackScreen
            trade={lastTrade}
            isLastDay={bankrupt || dayIndex + 1 >= TRADING_DAYS}
            bankrupt={bankrupt}
            onContinue={continueAfterFeedback}
          />
        )}

        {phase === "summary" && stats.history[dateKey] && (
          <SummaryScreen
            result={stats.history[dateKey]}
            event={event}
            streak={stats.streak}
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

function getRunDayNumber(dateKey: string): number {
  const EPOCH = new Date(2026, 9, 16);
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return Math.floor((date.getTime() - EPOCH.getTime()) / 86400000) + 1;
}

function IntroScreen({ stats, onStart }: { stats: Stats; onStart: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <p className="opacity-80">
        You have {formatMoney(STARTING_CASH)} and a mystery stock going through
        10 real, volatile trading days. Each day you get a real headline from
        that stock&apos;s history — buy, short, or wait, sizing your bet as a
        percent of your wallet. The stock&apos;s identity is revealed at the end.
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
  dayIndex,
  headline,
  price,
  portfolio,
  equity,
  phase,
  pendingAction,
  pct,
  onChangePct,
  onChooseAction,
  onBack,
  onConfirm,
}: {
  dayIndex: number;
  headline: { dateLabel: string; headline: string };
  price: number;
  portfolio: Portfolio;
  equity: number;
  phase: Phase;
  pendingAction: Action | null;
  pct: number;
  onChangePct: (v: number) => void;
  onChooseAction: (a: Action) => void;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const positionLabel =
    portfolio.shares > 0.0001
      ? `Long ${portfolio.shares.toFixed(2)} sh`
      : portfolio.shares < -0.0001
      ? `Short ${Math.abs(portfolio.shares).toFixed(2)} sh`
      : "No position";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between text-sm opacity-60">
        <span>
          Trading day {dayIndex + 1} of {TRADING_DAYS}
        </span>
        <span>{headline.dateLabel}</span>
      </div>

      <div className="border border-black/10 dark:border-white/15 rounded-lg px-4 py-4 flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide opacity-50">Headline</p>
        <p className="text-lg font-medium leading-snug">{headline.headline}</p>
      </div>

      <div className="flex items-center justify-between text-sm border border-black/10 dark:border-white/15 rounded-lg px-4 py-3">
        <div>
          <p className="opacity-60">Price</p>
          <p className="font-semibold">${price.toFixed(2)}</p>
        </div>
        <div>
          <p className="opacity-60">Position</p>
          <p className="font-semibold">{positionLabel}</p>
        </div>
        <div className="text-right">
          <p className="opacity-60">Wallet</p>
          <p className="font-semibold">{formatMoney(equity)}</p>
        </div>
      </div>

      {phase === "choosing" && (
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onChooseAction("buy")}
            className="rounded-lg bg-green-600 text-white font-semibold py-3 hover:opacity-90 transition"
          >
            Buy
          </button>
          <button
            onClick={() => onChooseAction("short")}
            className="rounded-lg bg-red-600 text-white font-semibold py-3 hover:opacity-90 transition"
          >
            Short
          </button>
          <button
            onClick={() => onChooseAction("wait")}
            className="rounded-lg border border-black/15 dark:border-white/20 font-semibold py-3 hover:bg-black/5 dark:hover:bg-white/10 transition"
          >
            Wait
          </button>
        </div>
      )}

      {phase === "sizing" && pendingAction && (
        <div className="flex flex-col gap-4">
          <p className="text-sm opacity-70">
            How much of your wallet do you want to{" "}
            {pendingAction === "buy" ? "put long" : "put short"}?
          </p>
          <div className="flex flex-col gap-2">
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={pct}
              onChange={(e) => onChangePct(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm">
              <span className="opacity-60">{pct}% of wallet</span>
              <span className="font-semibold">{formatMoney((pct / 100) * equity)}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onBack}
              className="flex-1 rounded-lg border border-black/15 dark:border-white/20 font-semibold py-3 hover:bg-black/5 dark:hover:bg-white/10 transition"
            >
              Back
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 rounded-lg bg-foreground text-background font-semibold py-3 hover:opacity-90 transition"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FeedbackScreen({
  trade,
  isLastDay,
  bankrupt,
  onContinue,
}: {
  trade: DayTrade;
  isLastDay: boolean;
  bankrupt: boolean;
  onContinue: () => void;
}) {
  const dayChangePct = ((trade.priceAfter - trade.priceBefore) / trade.priceBefore) * 100;
  const equityChangePct =
    trade.equityBefore > 0
      ? ((trade.equityAfter - trade.equityBefore) / trade.equityBefore) * 100
      : 0;
  const up = trade.equityAfter >= trade.equityBefore;

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm opacity-60">Day {trade.day} result</p>

      <div className="border border-black/10 dark:border-white/15 rounded-lg px-4 py-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm opacity-60">Price moved</span>
          <span className="font-semibold">{formatPct(dayChangePct)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm opacity-60">Your action</span>
          <span className="font-semibold capitalize">
            {trade.action}
            {trade.action !== "wait" ? ` ${trade.pct}%` : ""}
          </span>
        </div>
        <div className="h-px bg-black/10 dark:bg-white/15" />
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold text-white ${
              up ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {formatPct(equityChangePct)}
          </span>
          <span className="font-bold text-lg">{formatMoney(trade.equityAfter)}</span>
        </div>
      </div>

      {bankrupt && (
        <p className="text-sm text-red-500 font-medium text-center">
          Wiped out — your wallet hit $0. Game over early.
        </p>
      )}

      <button
        onClick={onContinue}
        autoFocus
        className="w-full rounded-lg bg-foreground text-background font-semibold py-3 px-6 hover:opacity-90 transition"
      >
        {isLastDay ? "See results" : "Next day"}
      </button>
    </div>
  );
}

function SummaryScreen({
  result,
  event,
  streak,
  onShare,
}: {
  result: RunResult;
  event: StockEvent;
  streak: number;
  onShare: () => void;
}) {
  const pctReturn = ((result.finalEquity - STARTING_CASH) / STARTING_CASH) * 100;
  const up = result.finalEquity >= STARTING_CASH;

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center">
        <p className="text-3xl font-bold">{formatMoney(result.finalEquity)}</p>
        <p className={`text-sm font-semibold mt-1 ${up ? "text-green-500" : "text-red-500"}`}>
          {formatPct(pctReturn)} from {formatMoney(STARTING_CASH)}
        </p>
        <p className="flex items-center justify-center gap-1.5 mt-3">
          {result.trades.map((t, i) => (
            <span
              key={i}
              className={`inline-block w-4 h-4 rounded ${
                t.equityAfter >= t.equityBefore ? "bg-green-500" : "bg-red-500"
              }`}
              aria-hidden
            />
          ))}
        </p>
        <p className="text-sm opacity-60 mt-2">🔥 {streak} day streak</p>
      </div>

      <div className="border border-black/10 dark:border-white/15 rounded-lg px-4 py-4 flex flex-col gap-2">
        <p className="text-xs uppercase tracking-wide opacity-50">Revealed</p>
        <p className="font-semibold">
          {event.companyName} ({event.ticker})
        </p>
        <p className="text-sm opacity-70">{event.periodLabel}</p>
        <p className="text-sm opacity-80 mt-1">{event.summary}</p>
      </div>

      <ul className="flex flex-col gap-3">
        {result.trades.map((t, i) => (
          <li
            key={i}
            className="border border-black/10 dark:border-white/15 rounded-lg px-4 py-3"
          >
            <p className="text-xs opacity-50">{event.headlines[i].dateLabel}</p>
            <p className="text-sm opacity-80 mt-0.5">{event.headlines[i].headline}</p>
            <p className="text-xs opacity-50 mt-0.5">— {event.headlines[i].source}</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-sm capitalize">
                {t.action}
                {t.action !== "wait" ? ` ${t.pct}%` : ""} at ${t.priceBefore.toFixed(2)}
              </span>
              <span className="flex items-center gap-1.5 text-sm font-medium whitespace-nowrap ml-2">
                <span
                  className={`inline-block w-2.5 h-2.5 rounded-full ${
                    t.equityAfter >= t.equityBefore ? "bg-green-500" : "bg-red-500"
                  }`}
                  aria-hidden
                />
                {formatMoney(t.equityAfter)}
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

      <p className="text-center text-xs opacity-50">Come back tomorrow for another mystery stock.</p>
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

        <button onClick={onClose} className="text-sm opacity-60 hover:opacity-100 transition">
          Close
        </button>
      </div>
    </div>
  );
}

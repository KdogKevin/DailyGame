<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## This repo: Daily Games

A Next.js (App Router) site hosting a small collection of daily
puzzle games, each at its own route, plus a home page that lists
them. Deployed on Vercel at **daily.kcnguyen.com**, auto-deploying
from `main` via Vercel's git integration — just `git push`, never
call the Vercel deploy API/MCP tools directly.

### Layout

```
src/
  app/
    layout.tsx        root layout — global <html>/<body>, shared metadata ("Daily Games")
    page.tsx           home page — lists every game from src/data/games.ts
    icon.svg            shared favicon for the whole site (bullseye, all routes)
    globals.css         Tailwind v4 theme (light/dark via prefers-color-scheme)
    <slug>/page.tsx      one route per game, e.g. app/dailyguess/page.tsx
  components/
    <Game>.tsx            each game's UI as a client component ("use client")
  lib/
    <game>.ts              each game's logic: scoring, persistence, share text
  data/
    games.ts               registry of all games shown on the home page
    <game>-questions.ts      each game's content, if it has a question bank
```

Each game is self-contained: its own route folder, its own component,
its own lib file, its own data file. Nothing is shared between games
except the home page registry, the root layout, and the favicon.

### Adding a new game

1. **Route**: create `src/app/<slug>/page.tsx`. Give it its own
   `export const metadata: Metadata = { title, description }` — the
   root layout's title is just the generic "Daily Games" fallback.
   The page itself should just render the game's client component,
   e.g.:
   ```tsx
   import type { Metadata } from "next";
   import MyGame from "@/components/MyGame";

   export const metadata: Metadata = { title: "MyGame", description: "..." };

   export default function MyGamePage() {
     return <MyGame />;
   }
   ```

2. **Register it**: add an entry to `src/data/games.ts` —
   `{ slug, name, tagline, colors }`. `slug` must match the route
   folder name exactly; the home page links to `/${slug}`. That's
   the only change needed to make a new game show up on the home
   page.

3. **Build the game as a client component** (`"use client"`) in
   `src/components/`. Model it on `Game.tsx`:
   - Add a small back link to the home page in the header:
     `<Link href="/">← Daily Games</Link>`.
   - **Never call `new Date()` or touch `localStorage` during
     render.** Next's `cacheComponents`/Turbopack prerendering will
     error ("unstable value `new Date()`") if a client component
     reads either synchronously in the render body. Do it inside a
     `useEffect` on mount instead (see `Game.tsx`'s first effect) and
     show a lightweight loading state until that effect has run.

4. **Game logic goes in `src/lib/<game>.ts`**, not in the component.
   For `dailyguess` this covers: scoring, which day's content to show
   (date → day index), reading/writing progress to `localStorage`,
   and building the shareable results text.

   - **Namespace your localStorage key** — `dailyguess` uses
     `dailyguess-stats-v1`. A new game needs its own distinct key
     (e.g. `<slug>-stats-v1`) or it will silently read/write
     DailyGuess's save data. Bump the version suffix if you ever
     change the stored shape in a way older saved data can't satisfy.
   - If the game shares a result players can post elsewhere, build a
     `SITE_URL`-style constant that includes the game's own path
     (`https://daily.kcnguyen.com/<slug>`), not just the bare domain
     — a share link should land directly back on the game, not the
     home page.

5. **Content/data** (question banks, puzzle sets, whatever the game
   needs) goes in `src/data/<game>-....ts`, typed, with a `source`
   field per fact/item when the content is a verifiable claim —
   `dailyguess`'s `questions.ts` is the pattern to follow.

6. **Local dev**: `.claude/launch.json` already runs `npm run dev` on
   port 3000 (config name `dailygame-dev`) — this covers every route,
   no per-game dev config needed. Before committing, run
   `npx tsc --noEmit` and `npx eslint src`; both must be clean.

### Conventions worth keeping

- **Scoring/feedback that uses a magnitude gradient** (like
  DailyGuess's tier colors) should use real CSS color classes
  (`bg-green-500`, etc.), not emoji glyphs, for in-app UI — emoji
  square colors render inconsistently across platforms/fonts. Emoji
  *is* fine for share text meant to be pasted into Twitter/WhatsApp/SMS,
  since those render with a proper emoji font.
- **Auto-derive quirky input handling from the data itself** instead
  of hand-flagging it per item — see `resolveScale()` in
  `lib/game.ts`, which picks a million/billion input scale from the
  size of the answer rather than requiring every large-number
  question to be manually tagged. Prefer this pattern over anything
  that needs remembering to update "every time we add content."
- Keep per-day/per-round progress resumable: save progress to
  `localStorage` after every state-changing action (not just on
  completion), so a refresh mid-round resumes where the player left
  off instead of restarting.

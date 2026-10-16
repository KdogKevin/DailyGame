import Link from "next/link";
import { GAMES } from "@/data/games";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-md flex flex-col gap-8">
        <header className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Daily Games</h1>
          <p className="text-sm opacity-60 mt-2">
            A new puzzle every day. Pick a game to play today&apos;s round.
          </p>
        </header>

        <div className="flex flex-col gap-4">
          {GAMES.map((game) => (
            <Link
              key={game.slug}
              href={`/${game.slug}`}
              className="group border border-black/10 dark:border-white/15 rounded-xl p-5 flex items-center gap-4 hover:border-foreground/40 transition"
            >
              <div className="flex -space-x-2 shrink-0">
                {game.colors.map((color, i) => (
                  <span
                    key={i}
                    className="w-4 h-4 rounded-full border-2 border-background"
                    style={{ backgroundColor: color }}
                    aria-hidden
                  />
                ))}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{game.name}</p>
                <p className="text-sm opacity-60">{game.tagline}</p>
              </div>
              <span className="opacity-40 group-hover:opacity-80 transition">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

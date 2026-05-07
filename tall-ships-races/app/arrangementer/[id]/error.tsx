"use client";

import Link from "next/link";
import { AlertTriangle, Loader } from "lucide-react";

// Vises hvis detaljsiden krasjer. Vi gir både en "prøv igjen"-knapp
// og en lenke tilbake til hele programmet.
export default function EventDetailError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="bg-paper text-ink">
      <div className="mx-auto max-w-[700px] px-5 py-32 sm:py-40">
        <div className="flex items-center gap-3 text-cobalt">
          <AlertTriangle size={28} strokeWidth={1.6} />
          <span className="font-display text-sm uppercase tracking-[0.2em]">
            Noe feilet
          </span>
        </div>
        <h1 className="mt-4 font-display text-3xl uppercase leading-tight tracking-tight sm:text-5xl">
          Kunne ikke laste arrangementet.
        </h1>
        <p className="mt-4 text-base text-ink/70">
          Prøv igjen senere, eller gå tilbake til programmet.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-display text-sm uppercase tracking-[0.2em] text-paper hover:bg-cobalt"
          >
            <Loader size={16} strokeWidth={1.8} />
            Prøv på nytt
          </button>
          <Link
            href="/arrangementer"
            className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-5 py-3 font-display text-sm uppercase tracking-[0.2em] text-ink hover:border-ink"
          >
            Tilbake til programmet
          </Link>
        </div>
      </div>
    </main>
  );
}

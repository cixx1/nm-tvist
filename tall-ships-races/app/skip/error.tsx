"use client";

import { AlertTriangle, Loader } from "lucide-react";

// Vises hvis listingen feiler. Knappen kjører reset() som forsøker å
// rendre siden på nytt.
export default function SkipListingError({
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
          Kunne ikke laste skipsdata.
        </h1>
        <p className="mt-4 text-base text-ink/70">
          Prøv igjen senere. Hvis det fortsetter å feile, gi beskjed til
          arrangøren.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-display text-sm uppercase tracking-[0.2em] text-paper hover:bg-cobalt"
        >
          <Loader size={16} strokeWidth={1.8} />
          Prøv på nytt
        </button>
      </div>
    </main>
  );
}

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Vises når notFound() kalles fra detaljsiden — id-en i URL-en matcher
// ingen post i data/events.json.
export default function EventNotFound() {
  return (
    <main className="bg-paper text-ink">
      <div className="mx-auto max-w-[700px] px-5 py-32 sm:py-40">
        <p className="font-display text-sm uppercase tracking-[0.25em] text-ink/55">
          404
        </p>
        <h1 className="mt-3 font-display text-4xl uppercase leading-tight tracking-tight sm:text-6xl">
          Arrangementet finnes ikke.
        </h1>
        <p className="mt-4 text-base text-ink/70">
          Sjekk om lenken er riktig, eller gå tilbake til programmet og finn
          noe annet å gå på.
        </p>
        <Link
          href="/arrangementer"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-display text-sm uppercase tracking-[0.2em] text-paper hover:bg-cobalt"
        >
          <ArrowLeft size={16} strokeWidth={1.8} />
          Tilbake til programmet
        </Link>
      </div>
    </main>
  );
}

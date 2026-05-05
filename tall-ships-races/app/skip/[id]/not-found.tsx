import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Vises når notFound() kalles fra detaljsiden — altså når id-en
// i URL-en ikke matcher noe skip i data/ships.json.
export default function ShipNotFound() {
  return (
    <main className="bg-paper text-ink">
      <div className="mx-auto max-w-[700px] px-5 py-32 sm:py-40">
        <p className="font-display text-sm uppercase tracking-[0.25em] text-ink/55">
          404
        </p>
        <h1 className="mt-3 font-display text-4xl uppercase leading-tight tracking-tight sm:text-6xl">
          Skipet finnes ikke.
        </h1>
        <p className="mt-4 text-base text-ink/70">
          Sjekk om lenken er riktig, eller gå tilbake og velg et annet skip.
        </p>
        <Link
          href="/skip"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 font-display text-sm uppercase tracking-[0.2em] text-paper hover:bg-cobalt"
        >
          <ArrowLeft size={16} strokeWidth={1.8} />
          Tilbake til alle skip
        </Link>
      </div>
    </main>
  );
}

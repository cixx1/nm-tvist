import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getShips } from "@/lib/data";
import { flag } from "@/lib/format";
import ShipImage from "@/components/ShipImage";
import ShipClassFilter from "@/components/ShipClassFilter";
import type { Ship, ShipClass } from "@/types";

// Listingside for alle skipene. Filtrering på klasse skjer via ?klasse=A
// i URL-en, slik at filteret kan deles og bokmerkes.

export const metadata = {
  title: "Skip | Tall Ships Races Kristiansand 2025",
  description:
    "Åtte deltakerskip i Tall Ships Races 2025: klasse, byggeår, lengde og hjemmehavn.",
};

const VALID: ShipClass[] = ["A", "B", "C", "D"];

function filterShips(ships: Ship[], klasse: string | undefined): Ship[] {
  if (!klasse) return ships;
  const v = klasse.toUpperCase() as ShipClass;
  if (!VALID.includes(v)) return ships;
  return ships.filter((s) => s.shipClass === v);
}

export default async function SkipListing({
  searchParams,
}: {
  searchParams: Promise<{ klasse?: string }>;
}) {
  const { klasse } = await searchParams;
  const allShips = await getShips();
  const ships = filterShips(allShips, klasse);

  return (
    <main className="bg-paper text-ink">
      {/* HEADER */}
      <section className="bg-deep text-paper">
        <div className="mx-auto max-w-[1400px] px-5 pt-32 pb-16 sm:px-8 sm:pt-40 sm:pb-24">
          <p className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-paper/70">
            <span className="inline-block h-1.5 w-1.5 rotate-45 bg-lime" />
            Flåten i havn
          </p>
          <h1 className="mt-6 font-display text-[clamp(3rem,9vw,8rem)] font-black uppercase leading-[0.9] tracking-tight">
            Åtte skip,
            <br />
            fire klasser.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-paper/80 sm:text-lg">
            Skipene som ligger ved Lagholmen under Tall Ships Races
            Kristiansand. Fra fullriggere til en liten skonnert.
          </p>
        </div>
      </section>

      {/* FILTER + LISTE */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <div className="flex flex-col gap-5 border-b border-ink/10 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-10">
          <ShipClassFilter />
          <p className="text-xs uppercase tracking-[0.25em] text-ink/55">
            {ships.length} skip
          </p>
        </div>

        {ships.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-lg text-ink/70">
              Ingen skip i klasse {klasse?.toUpperCase()}.
            </p>
            <Link
              href="/skip"
              className="mt-4 inline-block font-display text-sm uppercase tracking-wider underline"
            >
              Vis alle
            </Link>
          </div>
        ) : (
          <ol>
            {ships.map((s, i) => (
              <li
                key={s.id}
                className="border-b border-ink/10 last:border-b-0"
              >
                <Link
                  href={`/skip/${s.id}`}
                  className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-6 transition-colors hover:bg-cobalt hover:text-paper sm:grid-cols-[auto_auto_1fr_auto_auto] sm:gap-8 sm:py-8"
                >
                  <span className="font-display text-xl tabular-nums tracking-tight sm:text-2xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="hidden h-20 w-32 overflow-hidden sm:block">
                    <ShipImage
                      shipId={s.id}
                      shipName={s.name}
                      shipClass={s.shipClass}
                      imageSrc={s.image}
                      size="thumbnail"
                      className="h-full w-full"
                    />
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-display text-2xl uppercase leading-none tracking-tight sm:text-4xl md:text-5xl">
                      {s.name}
                    </h2>
                    <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.18em] text-ink/65 group-hover:text-paper/75 sm:text-sm">
                      <span>
                        <span aria-hidden>{flag(s.countryCode)}</span>{" "}
                        {s.country}
                      </span>
                      <span aria-hidden>·</span>
                      <span>{s.type}</span>
                      <span aria-hidden>·</span>
                      <span>{s.yearBuilt}</span>
                      <span aria-hidden>·</span>
                      <span>{s.length} m</span>
                    </p>
                  </div>

                  <span
                    className={`hidden shrink-0 rounded-full border px-3 py-1 font-display text-xs uppercase tracking-[0.2em] sm:inline-block ${classBadge(
                      s.shipClass,
                    )}`}
                  >
                    Klasse {s.shipClass}
                  </span>

                  <ArrowUpRight
                    className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    size={24}
                    strokeWidth={1.5}
                  />
                </Link>
              </li>
            ))}
          </ol>
        )}

        <div className="py-12 sm:py-20" />
      </section>
    </main>
  );
}

function classBadge(c: ShipClass): string {
  switch (c) {
    case "A":
      return "border-current text-current group-hover:bg-paper group-hover:text-cobalt";
    case "B":
      return "border-current text-current group-hover:bg-paper group-hover:text-cobalt";
    case "C":
      return "border-lime bg-lime text-deep";
    case "D":
      return "border-fog bg-fog text-deep";
  }
}

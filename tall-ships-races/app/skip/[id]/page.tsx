import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { getEvents, getLocations, getShips } from "@/lib/data";
import { flag, formatEventDate, shipAge } from "@/lib/format";
import ShipImage from "@/components/ShipImage";
import type { Ship } from "@/types";

// Detaljside for ett skip. Bruker lib/data direkte siden vi rendrer
// på serveren — det er raskere enn å gå om HTTP. /api-rutene finnes
// fortsatt for klient- eller eksternt bruk.

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { id } = await params;
  const ships = await getShips();
  const ship = ships.find((s) => s.id === id);
  if (!ship) {
    return {
      title: "Skipet finnes ikke | Tall Ships Races Kristiansand 2025",
    };
  }
  return {
    title: `${ship.name} | Tall Ships Races Kristiansand 2025`,
    description: ship.description.slice(0, 150),
  };
}

export default async function ShipDetail({ params }: RouteParams) {
  const { id } = await params;

  const [ships, events, locations] = await Promise.all([
    getShips(),
    getEvents(),
    getLocations(),
  ]);

  const ship = ships.find((s) => s.id === id);
  if (!ship) notFound();

  const related = events.filter((e) => e.shipId === ship.id);
  const locById = Object.fromEntries(locations.map((l) => [l.id, l]));

  return (
    <main>
      <ShipHero ship={ship} />
      <FactsGrid ship={ship} />
      <Description ship={ship} />
      <WhereToFind ship={ship} />
      <RelatedEvents
        events={related}
        locationName={(locId) => locById[locId]?.name ?? locId}
      />
      <BackLink />
    </main>
  );
}

function ShipHero({ ship }: { ship: Ship }) {
  return (
    <section className="relative isolate overflow-hidden bg-deep text-paper">
      <div className="absolute inset-0">
        <ShipImage
          shipId={ship.id}
          shipName={ship.name}
          shipClass={ship.shipClass}
          size="hero"
          className="h-full w-full opacity-65"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.18 0.04 245 / 0.35) 0%, oklch(0.10 0.03 245 / 0.85) 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-5 pt-32 pb-16 sm:px-8 sm:pt-40 sm:pb-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-paper/35 bg-paper/10 px-3 py-1 font-display text-xs uppercase tracking-[0.2em] backdrop-blur-md">
          Klasse {ship.shipClass}
        </span>
        <h1 className="mt-6 font-display text-[clamp(3.25rem,11vw,10rem)] font-black uppercase leading-[0.85] tracking-tight">
          {ship.name}
        </h1>
        <p className="mt-4 font-display text-xl uppercase tracking-wide text-paper/85 sm:text-2xl">
          {ship.type} fra {ship.country}
        </p>
      </div>
    </section>
  );
}

function FactsGrid({ ship }: { ship: Ship }) {
  const age = shipAge(ship.yearBuilt);
  const facts: Array<{ label: string; value: string }> = [
    { label: "Land", value: `${flag(ship.countryCode)} ${ship.country}` },
    { label: "Hjemmehavn", value: ship.homePort },
    {
      label: "Bygget",
      value: `${ship.yearBuilt} (${age} år gammel)`,
    },
    { label: "Lengde", value: `${ship.length} m` },
    { label: "Type", value: ship.type },
    { label: "Kaptein", value: ship.captain },
    { label: "Mannskap", value: `${ship.crewSize} personer` },
  ];

  return (
    <section className="bg-paper text-ink">
      <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20">
        <h2 className="font-display text-xs uppercase tracking-[0.25em] text-ink/55">
          Fakta
        </h2>
        <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="border-t border-ink/15 pt-4">
              <dt className="text-xs uppercase tracking-[0.2em] text-ink/55">
                {f.label}
              </dt>
              <dd className="mt-2 font-display text-2xl leading-tight tracking-tight sm:text-3xl">
                {f.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Description({ ship }: { ship: Ship }) {
  return (
    <section className="bg-paper text-ink">
      <div className="mx-auto max-w-[1400px] px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="grid gap-8 md:grid-cols-12 md:gap-16">
          <h2 className="font-display text-xs uppercase tracking-[0.25em] text-ink/55 md:col-span-3">
            Om skipet
          </h2>
          <p className="text-lg leading-relaxed text-ink/85 md:col-span-9 md:text-xl">
            {ship.description}
          </p>
        </div>
      </div>
    </section>
  );
}

function WhereToFind({ ship }: { ship: Ship }) {
  return (
    <section className="bg-cobalt text-paper">
      <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end md:gap-12">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-paper/70">
              Hvor ligger skipet?
            </p>
            <p className="mt-3 font-display text-2xl uppercase leading-tight tracking-tight sm:text-4xl">
              Du finner {ship.name} ved Lagholmen i havna under TSR
              30. juli – 2. august.
            </p>
          </div>
          <Link
            href="/kart"
            className="inline-flex items-center gap-2 self-start rounded-full bg-paper px-5 py-3 font-display text-sm uppercase tracking-[0.2em] text-cobalt transition-colors hover:bg-lime hover:text-deep md:self-end"
          >
            <MapPin size={16} strokeWidth={1.8} />
            Se på kart
          </Link>
        </div>
      </div>
    </section>
  );
}

function RelatedEvents({
  events,
  locationName,
}: {
  events: Array<{
    id: string;
    title: string;
    date: string;
    locationId: string;
  }>;
  locationName: (id: string) => string;
}) {
  return (
    <section className="bg-paper text-ink">
      <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-20">
        <h2 className="font-display text-xs uppercase tracking-[0.25em] text-ink/55">
          Relaterte arrangementer
        </h2>
        {events.length === 0 ? (
          <p className="mt-6 max-w-xl text-base text-ink/70">
            Ingen registrerte arrangementer for dette skipet.
          </p>
        ) : (
          <ul className="mt-6 border-t border-ink/15">
            {events.map((e) => (
              <li key={e.id} className="border-b border-ink/15">
                <Link
                  href={`/arrangementer/${e.id}`}
                  className="group grid grid-cols-1 items-baseline gap-2 py-5 transition-colors hover:bg-ink hover:text-paper sm:grid-cols-[1fr_auto_auto] sm:gap-6 sm:py-6"
                >
                  <span className="font-display text-xl uppercase leading-tight tracking-tight sm:text-2xl">
                    {e.title}
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] text-ink/60 group-hover:text-paper/70 sm:text-sm">
                    {formatEventDate(e.date)}
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] text-ink/60 group-hover:text-paper/70 sm:text-sm">
                    {locationName(e.locationId)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function BackLink() {
  return (
    <section className="bg-paper text-ink">
      <div className="mx-auto max-w-[1400px] px-5 pb-20 sm:px-8 sm:pb-28">
        <Link
          href="/skip"
          className="inline-flex items-center gap-2 font-display text-sm uppercase tracking-[0.2em] text-ink/80 underline-offset-4 hover:underline"
        >
          <ArrowLeft size={16} strokeWidth={1.8} />
          Tilbake til alle skip
        </Link>
      </div>
    </section>
  );
}

import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { getEvents, getLocations } from "@/lib/data";
import { formatEventDate } from "@/lib/format";
import MapWrapper from "@/components/MapWrapper";
import type { Event, Location } from "@/types";

// Kartside. Selve kartet kjører klient-side via MapWrapper.
// Lokasjonslisten under kartet rendres på serveren med events
// gruppert per locationId. Hver lokasjon har en anchor-id som
// popup-lenken i kartet scroller til.

export const metadata = {
  title: "Kart | Tall Ships Races Kristiansand 2025",
  description:
    "Hvor ligger skipene og hvor foregår arrangementene under Tall Ships Races 2025.",
};

export default async function KartPage() {
  const [locations, events] = await Promise.all([getLocations(), getEvents()]);

  // Grupperer events per locationId for raskt oppslag i renderen.
  const eventsByLocation = new Map<string, Event[]>();
  for (const e of events) {
    const list = eventsByLocation.get(e.locationId) ?? [];
    list.push(e);
    eventsByLocation.set(e.locationId, list);
  }

  return (
    <main className="bg-paper text-ink">
      {/* HEADER */}
      <section className="bg-deep text-paper">
        <div className="mx-auto max-w-[1400px] px-5 pt-32 pb-16 sm:px-8 sm:pt-40 sm:pb-20">
          <p className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-paper/70">
            <span className="inline-block h-1.5 w-1.5 rotate-45 bg-lime" />
            Sentrum og havna
          </p>
          <h1 className="mt-6 font-display text-[clamp(3rem,9vw,8rem)] font-black uppercase leading-[0.9] tracking-tight">
            Hvor er det
            <br />
            som skjer.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-paper/80 sm:text-lg">
            Kartet viser hvor skipene ligger ved kai og hvor arrangementene
            foregår under festivalen.
          </p>
        </div>
      </section>

      {/* KART */}
      <section className="relative">
        <MapWrapper />
      </section>

      {/* LOKASJONSLISTE */}
      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-8 border-b border-ink/10 pb-12 md:grid-cols-[1fr_auto] md:items-end md:gap-16">
          <h2 className="font-display text-[clamp(2.25rem,6vw,4.5rem)] font-bold uppercase leading-[0.95] tracking-tight">
            Seks steder
            <br />i sentrum.
          </h2>
          <p className="max-w-sm text-base leading-relaxed text-ink/70">
            Klikk på en markør i kartet for å åpne stedet, eller bla deg ned i
            listen.
          </p>
        </div>

        <ul className="mt-8 grid gap-12 sm:gap-16">
          {locations.map((loc, i) => (
            <LocationBlock
              key={loc.id}
              index={i + 1}
              location={loc}
              events={(eventsByLocation.get(loc.id) ?? []).sort((a, b) =>
                a.date.localeCompare(b.date),
              )}
            />
          ))}
        </ul>
      </section>
    </main>
  );
}

function LocationBlock({
  index,
  location,
  events,
}: {
  index: number;
  location: Location;
  events: Event[];
}) {
  return (
    <li
      id={`lokasjon-${location.id}`}
      className="scroll-mt-28 border-t border-ink/15 pt-8 sm:scroll-mt-32"
    >
      <div className="grid gap-8 md:grid-cols-12 md:gap-12">
        {/* Venstre kolonne: lokasjonsinfo */}
        <div className="md:col-span-5">
          <p className="font-display text-xs uppercase tracking-[0.25em] text-ink/55">
            Lokasjon {String(index).padStart(2, "0")}
          </p>
          <h3 className="mt-3 font-display text-3xl uppercase leading-tight tracking-tight sm:text-5xl">
            {location.name}
          </h3>
          <p className="mt-3 flex items-center gap-2 text-sm text-ink/65">
            <MapPin size={14} strokeWidth={1.7} />
            {location.address}
          </p>
          <p className="mt-5 max-w-md text-base leading-relaxed text-ink/80">
            {location.description}
          </p>
        </div>

        {/* Høyre kolonne: events her */}
        <div className="md:col-span-7">
          <p className="font-display text-xs uppercase tracking-[0.25em] text-ink/55">
            Arrangementer her ({events.length})
          </p>
          {events.length === 0 ? (
            <p className="mt-4 text-sm text-ink/65">
              Ingen registrerte arrangementer på denne lokasjonen.
            </p>
          ) : (
            <ul className="mt-4 border-t border-ink/15">
              {events.map((e) => (
                <li key={e.id} className="border-b border-ink/15">
                  <Link
                    href={`/arrangementer/${e.id}`}
                    className="group grid grid-cols-1 items-baseline gap-1 py-4 transition-colors hover:bg-ink hover:text-paper sm:grid-cols-[auto_1fr_auto] sm:gap-6 sm:py-5"
                  >
                    <span className="text-xs uppercase tracking-[0.2em] text-ink/55 group-hover:text-paper/70 sm:w-44">
                      {formatEventDate(e.date)}
                    </span>
                    <span className="font-display text-lg uppercase leading-tight tracking-tight sm:text-2xl">
                      {e.title}
                    </span>
                    <ArrowUpRight
                      size={18}
                      strokeWidth={1.6}
                      className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </li>
  );
}

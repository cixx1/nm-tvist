import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { getEvents, getLocations } from "@/lib/data";
import {
  formatEventDateLong,
  formatEventTime,
  groupEventsByDate,
  isOngoing,
} from "@/lib/format";
import EventFilters from "@/components/EventFilters";
import type { Event, EventType, Location } from "@/types";

// Listingside for hele programmet. Filtrering på type og dato leses
// fra URL-en og gjøres på serveren før vi grupperer per dag og rendrer.

export const metadata = {
  title: "Program | Tall Ships Races Kristiansand 2025",
  description:
    "Alt som skjer i Kristiansand 30. juli til 2. august 2025: konserter, omvisninger, workshops og seremonier.",
};

const VALID_TYPES: EventType[] = [
  "konsert",
  "omvisning",
  "workshop",
  "seremoni",
  "aktivitet",
];

function normaliseType(raw: string | undefined): "alle" | EventType {
  const v = (raw ?? "").toLowerCase();
  if (VALID_TYPES.includes(v as EventType)) return v as EventType;
  return "alle";
}

function normaliseDate(raw: string | undefined): string {
  // Tillater bare YYYY-MM-DD i juli–august 2025-vinduet.
  if (!raw) return "alle";
  if (/^2025-07-3[012]$/.test(raw)) return raw;
  if (/^2025-08-0[12]$/.test(raw)) return raw;
  return "alle";
}

function filterEvents(
  events: Event[],
  type: "alle" | EventType,
  date: string,
): Event[] {
  return events.filter((e) => {
    if (type !== "alle" && e.type !== type) return false;
    if (date !== "alle" && !e.date.startsWith(date)) return false;
    return true;
  });
}

export default async function ProgramListing({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; dato?: string }>;
}) {
  const sp = await searchParams;
  const activeType = normaliseType(sp.type);
  const activeDate = normaliseDate(sp.dato);

  const [events, locations] = await Promise.all([getEvents(), getLocations()]);
  const filtered = filterEvents(events, activeType, activeDate);
  const grouped = groupEventsByDate(filtered);
  const locById = Object.fromEntries(locations.map((l) => [l.id, l]));

  return (
    <main className="bg-paper text-ink">
      {/* HEADER */}
      <section className="bg-deep text-paper">
        <div className="mx-auto max-w-[1400px] px-5 pt-32 pb-16 sm:px-8 sm:pt-40 sm:pb-24">
          <p className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-paper/70">
            <span className="inline-block h-1.5 w-1.5 rotate-45 bg-lime" />
            Fire dager, tolv programposter
          </p>
          <h1 className="mt-6 font-display text-[clamp(3rem,9vw,8rem)] font-black uppercase leading-[0.9] tracking-tight">
            Program.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-paper/80 sm:text-lg">
            Alt som skjer i Kristiansand 30. juli til 2. august 2025.
          </p>
        </div>
      </section>

      {/* FILTER + LISTE */}
      <section className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <EventFilters
          activeType={activeType}
          activeDate={activeDate}
          totalCount={filtered.length}
        />

        {filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="pb-16 sm:pb-24">
            {grouped.map(({ date, events: dayEvents }) => (
              <DayBlock
                key={date}
                date={date}
                events={dayEvents}
                locById={locById}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function DayBlock({
  date,
  events,
  locById,
}: {
  date: string;
  events: Event[];
  locById: Record<string, Location>;
}) {
  return (
    <div className="border-b border-ink/10 py-12 last:border-b-0 sm:py-16">
      <h2 className="font-display text-[clamp(1.75rem,4vw,3rem)] font-black uppercase leading-[0.95] tracking-tight">
        {formatEventDateLong(date + "T00:00:00")}
      </h2>
      <ol className="mt-8 border-t border-ink/15">
        {events.map((e) => (
          <li key={e.id} className="border-b border-ink/15">
            <EventRow event={e} location={locById[e.locationId]} />
          </li>
        ))}
      </ol>
    </div>
  );
}

function EventRow({
  event,
  location,
}: {
  event: Event;
  location: Location | undefined;
}) {
  return (
    <Link
      href={`/arrangementer/${event.id}`}
      className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-6 transition-colors hover:bg-cobalt hover:text-paper sm:grid-cols-[auto_1fr_auto_auto] sm:gap-8 sm:py-8"
    >
      <span className="font-display text-2xl tabular-nums leading-none tracking-tight sm:text-4xl">
        {formatEventTime(event.date)}
      </span>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <TypeTag type={event.type} />
          {location ? (
            <span className="flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-ink/60 group-hover:text-paper/70 sm:text-sm">
              <MapPin size={12} strokeWidth={1.8} />
              {location.name}
            </span>
          ) : null}
        </div>
        <h3 className="mt-2 font-display text-xl uppercase leading-tight tracking-tight sm:text-3xl">
          {event.title}
        </h3>
      </div>

      <EventStatus event={event} />

      <ArrowUpRight
        className="hidden transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 sm:block"
        size={22}
        strokeWidth={1.5}
      />
    </Link>
  );
}

function TypeTag({ type }: { type: EventType }) {
  const styles: Record<EventType, string> = {
    konsert: "bg-lime text-deep",
    omvisning: "bg-cobalt text-paper",
    workshop: "bg-sage text-paper",
    seremoni: "bg-deep text-paper",
    aktivitet: "bg-cobalt-deep text-paper",
  };
  const labels: Record<EventType, string> = {
    konsert: "Konsert",
    omvisning: "Omvisning",
    workshop: "Workshop",
    seremoni: "Seremoni",
    aktivitet: "Aktivitet",
  };
  return (
    <span
      className={`inline-block px-2 py-0.5 font-display text-[0.7rem] uppercase tracking-[0.2em] ${styles[type]}`}
    >
      {labels[type]}
    </span>
  );
}

function EventStatus({ event }: { event: Event }) {
  // Tre tilstander: live, drop-in, eller plasser igjen.
  // Vi bruker booked === 0 som signal på "drop-in / ingen påmelding",
  // siden flere events har stor kapasitet uten reservasjon.
  if (isOngoing(event)) {
    return (
      <span className="hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-cobalt sm:inline-flex">
        <span className="inline-block h-2 w-2 rounded-full bg-cobalt" />
        Pågår
      </span>
    );
  }
  if (event.booked === 0) {
    return (
      <span className="hidden text-xs uppercase tracking-[0.18em] text-ink/60 group-hover:text-paper/70 sm:inline-block">
        Drop-in
      </span>
    );
  }
  const left = Math.max(0, event.capacity - event.booked);
  if (left === 0) {
    return (
      <span className="hidden text-xs uppercase tracking-[0.18em] text-ink/60 group-hover:text-paper/70 sm:inline-block">
        Fullt
      </span>
    );
  }
  return (
    <span className="hidden text-xs uppercase tracking-[0.18em] text-ink/60 tabular-nums group-hover:text-paper/70 sm:inline-block">
      {left} ledige plasser
    </span>
  );
}

function EmptyState() {
  return (
    <div className="py-24 text-center sm:py-32">
      <p className="font-display text-2xl uppercase leading-tight tracking-tight sm:text-3xl">
        Ingen arrangementer matcher.
      </p>
      <p className="mt-3 text-base text-ink/65">
        Prøv et annet filter, eller se hele programmet.
      </p>
      <Link
        href="/arrangementer"
        className="mt-8 inline-block font-display text-sm uppercase tracking-[0.2em] underline underline-offset-4"
      >
        Vis alle
      </Link>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { getEvents, getLocations, getShips } from "@/lib/data";
import {
  formatEventDateTime,
  formatEventTime,
  isOngoing,
} from "@/lib/format";
import type { Event, EventType, Location, Ship } from "@/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { id } = await params;
  const events = await getEvents();
  const event = events.find((e) => e.id === id);
  if (!event) {
    return {
      title: "Arrangementet finnes ikke | Tall Ships Races Kristiansand 2025",
    };
  }
  return {
    title: `${event.title} | Tall Ships Races Kristiansand 2025`,
    description: event.description.slice(0, 150),
  };
}

export default async function EventDetail({ params }: RouteParams) {
  const { id } = await params;

  const [events, locations, ships] = await Promise.all([
    getEvents(),
    getLocations(),
    getShips(),
  ]);

  const event = events.find((e) => e.id === id);
  if (!event) notFound();

  const location = locations.find((l) => l.id === event.locationId);
  const ship = event.shipId
    ? ships.find((s) => s.id === event.shipId)
    : undefined;

  const sameDay = events.filter(
    (e) => e.id !== event.id && e.date.slice(0, 10) === event.date.slice(0, 10),
  );
  const locById = Object.fromEntries(locations.map((l) => [l.id, l]));

  return (
    <main>
      <Hero event={event} location={location} />
      <Status event={event} />
      <Description event={event} />
      {location ? <LocationBox location={location} /> : null}
      {ship ? <RelatedShip ship={ship} /> : null}
      <SameDayEvents
        events={sameDay.slice(0, 3)}
        locById={locById}
      />
      <BackLink />
    </main>
  );
}

function Hero({
  event,
  location,
}: {
  event: Event;
  location: Location | undefined;
}) {
  return (
    <section className="bg-deep text-paper">
      <div className="mx-auto max-w-[1400px] px-5 pt-32 pb-16 sm:px-8 sm:pt-40 sm:pb-24">
        <div className="flex flex-wrap items-center gap-3">
          <TypeTag type={event.type} />
          {isOngoing(event) ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-lime bg-lime px-3 py-1 font-display text-[0.7rem] font-bold uppercase tracking-[0.2em] text-deep">
              <span className="inline-block h-2 w-2 rounded-full bg-deep" />
              Pågår nå
            </span>
          ) : null}
        </div>

        <h1 className="mt-6 font-display text-[clamp(2.75rem,8vw,7rem)] font-black uppercase leading-[0.9] tracking-tight">
          {event.title}
        </h1>

        <div className="mt-8 grid gap-4 text-paper/85 sm:grid-cols-[auto_auto] sm:gap-x-12">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-paper/55">
              Når
            </p>
            <p className="mt-2 font-display text-xl uppercase leading-tight tracking-tight sm:text-2xl">
              {formatEventDateTime(event.date, event.endDate)}
            </p>
          </div>
          {location ? (
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-paper/55">
                Hvor
              </p>
              <p className="mt-2 flex items-center gap-2 font-display text-xl uppercase leading-tight tracking-tight sm:text-2xl">
                <MapPin size={18} strokeWidth={1.8} />
                {location.name}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Status({ event }: { event: Event }) {
  const facts: Array<{ label: string; value: string }> = [];
  const dropIn = event.booked === 0;
  if (event.price > 0) {
    facts.push({ label: "Pris", value: `${event.price} kr` });
  } else {
    facts.push({ label: "Pris", value: "Gratis" });
  }
  if (event.ageLimit) {
    facts.push({
      label: "Aldersgrense",
      value: `${event.ageLimit} år og over`,
    });
  }
  facts.push({
    label: "Påmelding",
    value: dropIn ? "Drop-in. Ingen påmelding." : "Påmelding kreves",
  });

  return (
    <section className="bg-paper text-ink">
      <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 sm:py-16">
        <h2 className="font-display text-xs uppercase tracking-[0.25em] text-ink/55">
          Praktisk
        </h2>

        <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="border-t border-ink/15 pt-4">
              <dt className="text-xs uppercase tracking-[0.2em] text-ink/55">
                {f.label}
              </dt>
              <dd className="mt-2 font-display text-xl leading-tight tracking-tight sm:text-2xl">
                {f.value}
              </dd>
            </div>
          ))}
          {!dropIn ? (
            <div className="col-span-2 border-t border-ink/15 pt-4 sm:col-span-4">
              <CapacityBar capacity={event.capacity} booked={event.booked} />
            </div>
          ) : null}
        </dl>
      </div>
    </section>
  );
}

function CapacityBar({
  capacity,
  booked,
}: {
  capacity: number;
  booked: number;
}) {
  const pct = Math.min(100, Math.round((booked / capacity) * 100));
  const left = Math.max(0, capacity - booked);
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-display text-xl uppercase leading-tight tracking-tight tabular-nums sm:text-2xl">
          {booked} av {capacity} plasser tatt
        </p>
        <p className="text-sm tabular-nums text-ink/65">
          {left} ledige plasser
        </p>
      </div>
      <div
        className="mt-3 h-2 w-full overflow-hidden bg-ink/10"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${pct} prosent fullt`}
      >
        <div
          className="h-full bg-cobalt"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Description({ event }: { event: Event }) {
  return (
    <section className="bg-paper text-ink">
      <div className="mx-auto max-w-[1400px] px-5 pb-16 sm:px-8 sm:pb-24">
        <div className="grid gap-8 md:grid-cols-12 md:gap-16">
          <h2 className="font-display text-xs uppercase tracking-[0.25em] text-ink/55 md:col-span-3">
            Om arrangementet
          </h2>
          <p className="text-lg leading-relaxed text-ink/85 md:col-span-9 md:text-xl">
            {event.description}
          </p>
        </div>
      </div>
    </section>
  );
}

function LocationBox({ location }: { location: Location }) {
  return (
    <section className="bg-cobalt text-paper">
      <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end md:gap-12">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-paper/70">
              Lokasjon
            </p>
            <p className="mt-3 font-display text-3xl uppercase leading-tight tracking-tight sm:text-5xl">
              {location.name}
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm text-paper/85 sm:text-base">
              <MapPin size={14} strokeWidth={1.8} />
              {location.address}
            </p>
          </div>
          <Link
            href={`/kart#lokasjon-${location.id}`}
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

function RelatedShip({ ship }: { ship: Ship }) {
  return (
    <section className="bg-paper text-ink">
      <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 sm:py-16">
        <h2 className="font-display text-xs uppercase tracking-[0.25em] text-ink/55">
          Knyttet til skip
        </h2>
        <Link
          href={`/skip/${ship.id}`}
          className="group mt-6 grid grid-cols-[1fr_auto] items-center gap-5 border-t border-ink/15 py-6 transition-colors hover:bg-ink hover:text-paper sm:gap-8 sm:py-8"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-ink/55 group-hover:text-paper/65">
              Klasse {ship.shipClass} · {ship.type} · {ship.country}
            </p>
            <p className="mt-2 font-display text-3xl uppercase leading-tight tracking-tight sm:text-5xl">
              {ship.name}
            </p>
          </div>
          <ArrowUpRight
            size={26}
            strokeWidth={1.5}
            className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </Link>
      </div>
    </section>
  );
}

function SameDayEvents({
  events,
  locById,
}: {
  events: Event[];
  locById: Record<string, Location>;
}) {
  if (events.length === 0) return null;
  return (
    <section className="bg-paper text-ink">
      <div className="mx-auto max-w-[1400px] px-5 py-14 sm:px-8 sm:py-16">
        <h2 className="font-display text-xs uppercase tracking-[0.25em] text-ink/55">
          Andre arrangementer samme dag
        </h2>
        <ul className="mt-6 border-t border-ink/15">
          {events.map((e) => (
            <li key={e.id} className="border-b border-ink/15">
              <Link
                href={`/arrangementer/${e.id}`}
                className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 py-5 transition-colors hover:bg-cobalt hover:text-paper sm:gap-8 sm:py-6"
              >
                <span className="font-display text-xl tabular-nums leading-none tracking-tight sm:text-2xl">
                  {formatEventTime(e.date)}
                </span>
                <div>
                  <h3 className="font-display text-lg uppercase leading-tight tracking-tight sm:text-2xl">
                    {e.title}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-ink/55 group-hover:text-paper/70">
                    {locById[e.locationId]?.name ?? "—"}
                  </p>
                </div>
                <ArrowUpRight
                  size={20}
                  strokeWidth={1.5}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function BackLink() {
  return (
    <section className="bg-paper text-ink">
      <div className="mx-auto max-w-[1400px] px-5 pb-20 sm:px-8 sm:pb-28">
        <Link
          href="/arrangementer"
          className="inline-flex items-center gap-2 font-display text-sm uppercase tracking-[0.2em] text-ink/80 underline-offset-4 hover:underline"
        >
          <ArrowLeft size={16} strokeWidth={1.8} />
          Tilbake til programmet
        </Link>
      </div>
    </section>
  );
}

function TypeTag({ type }: { type: EventType }) {
  const styles: Record<EventType, string> = {
    konsert: "bg-lime text-deep",
    omvisning: "bg-paper text-cobalt",
    workshop: "bg-sage text-paper",
    seremoni: "bg-paper text-deep",
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
      className={`inline-block px-3 py-1 font-display text-xs uppercase tracking-[0.2em] ${styles[type]}`}
    >
      {labels[type]}
    </span>
  );
}

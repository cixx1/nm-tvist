// Felles formatterings-hjelpere for visning av skip og arrangementer.

import type { Event } from "@/types";

// Lager flagg-emoji fra ISO-2 landskode (f.eks. "NO" -> 🇳🇴).
export function flag(countryCode: string): string {
  const cc = countryCode.toUpperCase();
  if (cc.length !== 2) return "";
  const A = 0x1f1e6 - "A".charCodeAt(0);
  return String.fromCodePoint(cc.charCodeAt(0) + A, cc.charCodeAt(1) + A);
}

// Norsk måned- og ukedagsleksikon. Brukt i flere format-funksjoner under.
const months = [
  "januar",
  "februar",
  "mars",
  "april",
  "mai",
  "juni",
  "juli",
  "august",
  "september",
  "oktober",
  "november",
  "desember",
];

const weekdays = [
  "søndag",
  "mandag",
  "tirsdag",
  "onsdag",
  "torsdag",
  "fredag",
  "lørdag",
];

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function formatEventDate(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate();
  const month = months[d.getMonth()];
  return `${day}. ${month} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

// "Torsdag 31. juli, 19:00 — 21:00" — hovedformat på detaljsiden.
export function formatEventDateTime(start: string, end: string): string {
  const a = new Date(start);
  const b = new Date(end);
  const weekday = weekdays[a.getDay()];
  const cap = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  const dateLabel = `${cap} ${a.getDate()}. ${months[a.getMonth()]}`;
  const startTime = `${pad2(a.getHours())}:${pad2(a.getMinutes())}`;
  const endTime = `${pad2(b.getHours())}:${pad2(b.getMinutes())}`;

  // Hvis arrangementet går over flere dager (f.eks. åpent skip), tar vi
  // med sluttdatoen òg så det ikke ser ut som et 12-timers maraton.
  const sameDay =
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  if (sameDay) {
    return `${dateLabel}, ${startTime} – ${endTime}`;
  }
  const endDateLabel = `${b.getDate()}. ${months[b.getMonth()]}`;
  return `${dateLabel} ${startTime} – ${endDateLabel} ${endTime}`;
}

// "Torsdag 31. juli 2025" — brukt i dagheaders i listing.
export function formatEventDateLong(iso: string): string {
  const d = new Date(iso);
  const weekday = weekdays[d.getDay()];
  const cap = weekday.charAt(0).toUpperCase() + weekday.slice(1);
  return `${cap} ${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// "19:00" — kun klokkeslett, brukt i listing-radene.
export function formatEventTime(iso: string): string {
  const d = new Date(iso);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

// Grupperer events per kalenderdato (basert på startdato), sortert
// kronologisk. Innenfor hver gruppe sorteres event-ene på starttid.
export function groupEventsByDate(
  events: Event[],
): Array<{ date: string; events: Event[] }> {
  const map = new Map<string, Event[]>();
  for (const e of events) {
    const key = e.date.slice(0, 10); // YYYY-MM-DD
    const arr = map.get(key) ?? [];
    arr.push(e);
    map.set(key, arr);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, list]) => ({
      date,
      events: list.slice().sort((a, b) => a.date.localeCompare(b.date)),
    }));
}

// Beregner alder på et skip basert på byggeår og dagens dato.
export function shipAge(yearBuilt: number, now: Date = new Date()): number {
  return now.getFullYear() - yearBuilt;
}

// Sjekker om et arrangement er live nå. Brukes for å vise "Pågår"-status.
export function isOngoing(event: Event, now: Date = new Date()): boolean {
  const start = new Date(event.date).getTime();
  const end = new Date(event.endDate).getTime();
  const t = now.getTime();
  return t >= start && t <= end;
}

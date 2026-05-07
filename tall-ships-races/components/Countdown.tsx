"use client";

import { useSyncExternalStore } from "react";

// Mål-dato for nedtellingen: torsdag 30. juli 2025, kl. 12:00 lokal tid.
const TARGET = new Date("2025-07-30T12:00:00").getTime();

// Sentinel-verdier for snapshot. Vi bruker en primitiv (number) slik
// at useSyncExternalStore kan sammenligne med Object.is uten at vi
// må cache objektreferanser manuelt.
const PRE_TICK = -1; // Brukes på server og under hydrering.
const PASSED = -2; // Mål-tidspunktet er passert.

interface Parts {
  d: number;
  h: number;
  m: number;
  s: number;
}

function subscribe(callback: () => void): () => void {
  const id = setInterval(callback, 1000);
  return () => clearInterval(id);
}

function getSnapshot(): number {
  const ms = TARGET - Date.now();
  if (ms <= 0) return PASSED;
  return Math.floor(ms / 1000);
}

function getServerSnapshot(): number {
  return PRE_TICK;
}

function partsFromSeconds(sec: number): Parts {
  const safe = sec < 0 ? 0 : sec;
  return {
    d: Math.floor(safe / 86400),
    h: Math.floor((safe % 86400) / 3600),
    m: Math.floor((safe % 3600) / 60),
    s: safe % 60,
  };
}

const labels: Array<{ key: keyof Parts; label: string }> = [
  { key: "d", label: "Dager" },
  { key: "h", label: "Timer" },
  { key: "m", label: "Min" },
  { key: "s", label: "Sek" },
];

export default function Countdown() {
  const sec = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (sec === PASSED) {
    return (
      <p className="font-display text-2xl uppercase tracking-wide text-paper sm:text-3xl">
        Arrangementet er over — takk for besøket.
      </p>
    );
  }

  const parts = partsFromSeconds(sec);

  return (
    <div
      className="grid grid-cols-4 gap-3 sm:gap-5"
      aria-label="Tid igjen til Tall Ships Races starter"
    >
      {labels.map(({ key, label }) => (
        <div
          key={key}
          className="rounded-2xl bg-paper/10 px-3 py-4 text-center backdrop-blur-md sm:px-5 sm:py-5"
        >
          <div className="font-display text-3xl leading-none text-paper tabular-nums sm:text-5xl">
            {String(parts[key]).padStart(2, "0")}
          </div>
          <div className="mt-2 text-[0.7rem] uppercase tracking-[0.2em] text-paper/70 sm:text-xs">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}

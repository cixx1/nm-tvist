"use client";

import { useEffect, useState } from "react";

// Mål-dato for nedtellingen: torsdag 30. juli 2025, kl. 12:00 lokal tid.
const TARGET = new Date("2025-07-30T12:00:00").getTime();

interface Parts {
  d: number;
  h: number;
  m: number;
  s: number;
}

function diff(now: number): Parts | null {
  const ms = TARGET - now;
  if (ms <= 0) return null;
  const sec = Math.floor(ms / 1000);
  return {
    d: Math.floor(sec / 86400),
    h: Math.floor((sec % 86400) / 3600),
    m: Math.floor((sec % 3600) / 60),
    s: sec % 60,
  };
}

const labels: Array<{ key: keyof Parts; label: string }> = [
  { key: "d", label: "Dager" },
  { key: "h", label: "Timer" },
  { key: "m", label: "Min" },
  { key: "s", label: "Sek" },
];

export default function Countdown() {
  // Vi starter med null på server slik at hydreringen ikke krasjer
  // dersom serverens og browserens klokke er ulike.
  const [parts, setParts] = useState<Parts | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setParts(diff(Date.now()));
    const id = setInterval(() => {
      setParts(diff(Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  if (mounted && parts === null) {
    return (
      <p className="font-display text-2xl uppercase tracking-wide text-paper sm:text-3xl">
        Arrangementet er over — takk for besøket.
      </p>
    );
  }

  return (
    <div
      className="grid grid-cols-4 gap-3 sm:gap-5"
      aria-label="Tid igjen til Tall Ships Races starter"
    >
      {labels.map(({ key, label }) => {
        const value = parts ? parts[key] : 0;
        return (
          <div
            key={key}
            className="rounded-2xl bg-paper/10 px-3 py-4 text-center backdrop-blur-md sm:px-5 sm:py-5"
          >
            <div className="font-display text-3xl leading-none text-paper tabular-nums sm:text-5xl">
              {String(value).padStart(2, "0")}
            </div>
            <div className="mt-2 text-[0.7rem] uppercase tracking-[0.2em] text-paper/70 sm:text-xs">
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

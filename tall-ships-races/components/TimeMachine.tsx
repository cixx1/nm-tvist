"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Tidskontroll for animert race-avspilling. Holder selv state for
// klokken og spillehastighet, og sender oppdatert tidspunkt ut via
// onTimeChange. setInterval kjører bare når skipet faktisk spiller,
// og ryddes opp på pause / unmount.

export const RACE_START = new Date("2025-08-01T16:00:00Z");
export const RACE_END = new Date("2025-08-06T00:00:00Z");

const SPEEDS = [1, 20, 60, 240] as const;
type Speed = (typeof SPEEDS)[number];

interface Preset {
  label: string;
  iso: string;
}

const PRESETS: Preset[] = [
  { label: "Avgang Kristiansand", iso: "2025-08-01T16:00:00Z" },
  { label: "Parade of Sail", iso: "2025-08-01T17:00:00Z" },
  { label: "Midt i Skagerrak", iso: "2025-08-02T12:00:00Z" },
  { label: "Nordsjøen", iso: "2025-08-03T18:00:00Z" },
  { label: "Ankomst Esbjerg", iso: "2025-08-05T06:00:00Z" },
];

const TICK_MS = 100;

function formatClock(d: Date): { date: string; time: string } {
  const dateFmt = new Intl.DateTimeFormat("nb-NO", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/Oslo",
  });
  const timeFmt = new Intl.DateTimeFormat("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Oslo",
  });
  return {
    date: dateFmt.format(d).replace(/\.$/, ""),
    time: timeFmt.format(d),
  };
}

interface Props {
  onTimeChange: (t: Date) => void;
}

export default function TimeMachine({ onTimeChange }: Props) {
  const [currentTime, setCurrentTime] = useState<Date>(RACE_START);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<Speed>(60);

  // onTimeChange holdes i en ref slik at vi ikke må re-binde
  // setInterval når foreldre lager en ny callback per render.
  const onTimeChangeRef = useRef(onTimeChange);
  useEffect(() => {
    onTimeChangeRef.current = onTimeChange;
  }, [onTimeChange]);

  // Send ut hver gang klokken endres.
  useEffect(() => {
    onTimeChangeRef.current(currentTime);
  }, [currentTime]);

  // Avspillings-loop. Stoppes ved unmount, ved pause, og ved hastighets-
  // bytte (ny effect-run starter en ny intervall med riktig multiplier).
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      setCurrentTime((prev) => {
        const next = new Date(prev.getTime() + TICK_MS * speed);
        if (next.getTime() >= RACE_END.getTime()) {
          setIsPlaying(false);
          return RACE_END;
        }
        return next;
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [isPlaying, speed]);

  const sliderMin = RACE_START.getTime();
  const sliderMax = RACE_END.getTime();
  const sliderValue = currentTime.getTime();
  const progress = (sliderValue - sliderMin) / (sliderMax - sliderMin);

  const { date, time } = formatClock(currentTime);

  return (
    <section
      aria-label="Tidskontroll for race-avspilling"
      className="bg-deep px-5 pt-7 pb-6 text-paper sm:px-8 sm:pt-9 sm:pb-7"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
        {/* Klokke + speed-label */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-paper/65">
              <span className="inline-block h-1.5 w-1.5 rotate-45 bg-lime" />
              Race 4 — Kristiansand til Esbjerg
            </p>
            <p className="mt-3 font-display text-xl uppercase tracking-tight text-paper/80 sm:text-2xl">
              {date}
            </p>
            <p className="mt-1 font-display text-5xl font-black leading-none tabular-nums text-paper sm:text-7xl">
              {time}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.25em] text-paper/65">
              Hastighet
            </p>
            <p className="font-display text-3xl font-black leading-none tabular-nums text-lime sm:text-5xl">
              {speed}×
            </p>
            <p className="mt-1 text-xs text-paper/55">
              {speed === 1
                ? "sanntid"
                : `1 sek = ${formatSpeedHint(speed)} race-tid`}
            </p>
          </div>
        </div>

        {/* Slider */}
        <div>
          <input
            type="range"
            min={sliderMin}
            max={sliderMax}
            step={60_000}
            value={sliderValue}
            onChange={(e) => {
              const t = new Date(Number(e.target.value));
              setIsPlaying(false);
              setCurrentTime(t);
            }}
            aria-label="Hopp til tidspunkt i racet"
            className="w-full accent-lime"
            style={{
              background: `linear-gradient(to right,
                oklch(0.93 0.21 113) 0%,
                oklch(0.93 0.21 113) ${progress * 100}%,
                oklch(0.96 0.012 95 / 0.18) ${progress * 100}%,
                oklch(0.96 0.012 95 / 0.18) 100%)`,
              borderRadius: 4,
              height: 6,
              appearance: "none",
            }}
          />
          <div className="mt-2 flex justify-between font-display text-[0.7rem] uppercase tracking-[0.2em] text-paper/55">
            <span>1. aug 18:00</span>
            <span>6. aug 02:00</span>
          </div>
        </div>

        {/* Play + speed */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (currentTime.getTime() >= RACE_END.getTime()) {
                setCurrentTime(RACE_START);
              }
              setIsPlaying((v) => !v);
            }}
            aria-label={isPlaying ? "Pause avspilling" : "Spill av racet"}
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
              isPlaying
                ? "bg-lime text-deep hover:bg-lime-deep"
                : "bg-paper text-deep hover:bg-paper-warm"
            }`}
          >
            {isPlaying ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" />
            )}
          </button>

          <div className="flex flex-wrap gap-2">
            {SPEEDS.map((s) => {
              const active = s === speed;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpeed(s)}
                  aria-pressed={active}
                  className={`rounded-full border px-4 py-2 font-display text-sm font-bold uppercase tracking-wider transition-colors ${
                    active
                      ? "border-lime bg-lime text-deep"
                      : "border-paper/30 bg-paper/5 text-paper hover:border-paper/60"
                  }`}
                >
                  {s}×
                </button>
              );
            })}
          </div>
        </div>

        {/* Presets */}
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.25em] text-paper/55">
            Hopp til
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.iso}
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentTime(new Date(p.iso));
                }}
                className="rounded-full border border-paper/25 bg-paper/5 px-3.5 py-1.5 text-sm tracking-wide text-paper/90 transition-colors hover:border-lime hover:text-lime"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function formatSpeedHint(speed: number): string {
  if (speed >= 3600) return `${Math.round(speed / 3600)} t`;
  if (speed >= 60) return `${Math.round(speed / 60)} min`;
  return `${speed} sek`;
}

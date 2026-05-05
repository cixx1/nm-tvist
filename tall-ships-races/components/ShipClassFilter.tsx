"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

// Filter-chips for skipsklasse. Skriver valget til ?klasse= i URL,
// slik at filteret kan deles med andre.

type FilterKey = "alle" | "A" | "B" | "C" | "D";

const classes: Array<{ key: FilterKey; label: string }> = [
  { key: "alle", label: "Alle" },
  { key: "A", label: "A" },
  { key: "B", label: "B" },
  { key: "C", label: "C" },
  { key: "D", label: "D" },
];

function activeKey(raw: string | null): FilterKey {
  const v = (raw ?? "").toUpperCase();
  if (v === "A" || v === "B" || v === "C" || v === "D") return v;
  return "alle";
}

export default function ShipClassFilter() {
  const params = useSearchParams();
  const active = activeKey(params.get("klasse"));

  return (
    <nav
      aria-label="Filtrer på skipsklasse"
      className="flex flex-wrap items-center gap-2"
    >
      <span className="mr-1 text-xs uppercase tracking-[0.25em] text-ink/60">
        Klasse
      </span>
      {classes.map((c) => {
        const isActive = c.key === active;
        const href = c.key === "alle" ? "/skip" : `/skip?klasse=${c.key}`;
        return (
          <Link
            key={c.key}
            href={href}
            scroll={false}
            className={`rounded-full border px-4 py-1.5 font-display text-sm uppercase tracking-wider transition-colors ${
              isActive
                ? "border-ink bg-ink text-paper"
                : "border-ink/20 bg-paper text-ink hover:border-ink/60"
            }`}
            aria-current={isActive ? "true" : undefined}
          >
            {c.label}
          </Link>
        );
      })}
    </nav>
  );
}

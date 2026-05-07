"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { EventType } from "@/types";

// Filter-chips for arrangementslisten. Filtervalget skrives til URL-en
// (?type=konsert&dato=2025-07-31) slik at det kan deles og bokmerkes,
// og slik at server-siden kan filtrere før render.

interface DateOption {
  iso: string; // YYYY-MM-DD
  label: string;
}

const TYPES: Array<{ key: EventType | "alle"; label: string }> = [
  { key: "alle", label: "Alle" },
  { key: "konsert", label: "Konsert" },
  { key: "omvisning", label: "Omvisning" },
  { key: "workshop", label: "Workshop" },
  { key: "seremoni", label: "Seremoni" },
  { key: "aktivitet", label: "Aktivitet" },
];

const DATES: DateOption[] = [
  { iso: "alle", label: "Alle dager" },
  { iso: "2025-07-30", label: "30. juli" },
  { iso: "2025-07-31", label: "31. juli" },
  { iso: "2025-08-01", label: "1. august" },
  { iso: "2025-08-02", label: "2. august" },
];

interface Props {
  activeType: string;
  activeDate: string;
  totalCount: number;
}

export default function EventFilters({
  activeType,
  activeDate,
  totalCount,
}: Props) {
  const pathname = usePathname();
  const params = useSearchParams();

  function hrefWith(updates: Record<string, string | null>): string {
    const next = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v === null || v === "alle" || v === "") next.delete(k);
      else next.set(k, v);
    }
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  return (
    <div className="flex flex-col gap-5 border-b border-ink/10 py-8 sm:py-10">
      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-ink/55">
          Type
        </p>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => {
            const isActive =
              t.key === "alle" ? activeType === "alle" : activeType === t.key;
            return (
              <Link
                key={t.key}
                href={hrefWith({ type: t.key })}
                scroll={false}
                aria-current={isActive ? "true" : undefined}
                className={`rounded-full border px-4 py-1.5 font-display text-sm uppercase tracking-wider transition-colors ${
                  isActive
                    ? "border-lime bg-lime text-deep"
                    : "border-ink/20 bg-paper text-ink hover:border-ink/60"
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-ink/55">
          Dato
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {DATES.map((d) => {
            const isActive =
              d.iso === "alle" ? activeDate === "alle" : activeDate === d.iso;
            return (
              <Link
                key={d.iso}
                href={hrefWith({ dato: d.iso })}
                scroll={false}
                aria-current={isActive ? "true" : undefined}
                className={`rounded-full border px-4 py-1.5 font-display text-sm uppercase tracking-wider transition-colors ${
                  isActive
                    ? "border-lime bg-lime text-deep"
                    : "border-ink/20 bg-paper text-ink hover:border-ink/60"
                }`}
              >
                {d.label}
              </Link>
            );
          })}
          <p className="ml-auto text-xs uppercase tracking-[0.25em] text-ink/55">
            {totalCount} arrangement{totalCount === 1 ? "" : "er"}
          </p>
        </div>
      </div>
    </div>
  );
}

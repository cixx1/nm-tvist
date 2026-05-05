"use client";

import Image from "next/image";
import { useState } from "react";
import type { ShipClass } from "@/types";

// Viser et skipsbilde fra /ships/{id}.jpg. Hvis bildet ikke finnes,
// faller komponenten tilbake til en farget plate med skipets initial.
// Fargen avhenger av klassen (A til D).

type Size = "thumbnail" | "card" | "hero";

interface Props {
  shipId: string;
  shipName: string;
  shipClass: ShipClass;
  size?: Size;
  className?: string;
}

const dims: Record<Size, { w: number; h: number; letter: string }> = {
  thumbnail: { w: 96, h: 96, letter: "text-3xl" },
  card: { w: 800, h: 560, letter: "text-7xl" },
  hero: { w: 1600, h: 900, letter: "text-[clamp(6rem,18vw,16rem)]" },
};

const classColors: Record<
  ShipClass,
  { bg: string; fg: string }
> = {
  A: { bg: "bg-deep", fg: "text-paper" },
  B: { bg: "bg-cobalt", fg: "text-paper" },
  C: { bg: "bg-lime", fg: "text-deep" },
  D: { bg: "bg-fog", fg: "text-deep" },
};

export default function ShipImage({
  shipId,
  shipName,
  shipClass,
  size = "card",
  className = "",
}: Props) {
  const [failed, setFailed] = useState(false);
  const { w, h, letter } = dims[size];
  const colors = classColors[shipClass];
  const initial = shipName.charAt(0).toUpperCase();

  if (failed) {
    return (
      <div
        className={`relative grid place-items-center overflow-hidden ${colors.bg} ${className}`}
        aria-label={`${shipName} (placeholder)`}
        role="img"
        style={{ aspectRatio: `${w} / ${h}` }}
      >
        <span
          className={`font-display ${letter} font-black uppercase leading-none tracking-tight ${colors.fg}`}
        >
          {initial}
        </span>
        <span
          className={`absolute right-3 top-3 font-display text-xs uppercase tracking-[0.25em] ${colors.fg} opacity-70`}
        >
          Klasse {shipClass}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={`/ships/${shipId}.jpg`}
      alt={shipName}
      width={w}
      height={h}
      className={`object-cover ${className}`}
      onError={() => setFailed(true)}
      unoptimized
    />
  );
}

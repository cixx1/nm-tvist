"use client";

import dynamic from "next/dynamic";

// Wrapper som dynamisk laster Map-komponenten uten SSR. Leaflet
// snakker direkte med window/document og kan derfor ikke kjøres
// på serveren. ssr: false fjerner serverforsøket helt.
const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-deep text-paper">
      <span className="font-display text-sm uppercase tracking-[0.25em] text-paper/70">
        Laster kart…
      </span>
    </div>
  ),
});

export default function MapWrapper() {
  return (
    <div className="h-[70vh] min-h-[600px] w-full overflow-hidden">
      <Map />
    </div>
  );
}

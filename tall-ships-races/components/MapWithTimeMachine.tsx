"use client";

import { useState } from "react";
import MapWrapper from "@/components/MapWrapper";
import TimeMachine, { RACE_START } from "@/components/TimeMachine";

// Bindeledd mellom TimeMachine og kart-komponenten. Holder shared
// currentTime-state slik at slider/play/presets driver markørene
// i Map.

export default function MapWithTimeMachine() {
  const [currentTime, setCurrentTime] = useState<Date>(RACE_START);

  return (
    <>
      <TimeMachine onTimeChange={setCurrentTime} />
      <MapWrapper currentTime={currentTime} />
    </>
  );
}

import type { Waypoint } from "@/types";

// Posisjonsberegning for skip langs en rute. Rene funksjoner uten
// avhengigheter — gjenbrukes både på server (API-rute) og klient.

export type ShipStatus = "before" | "moving" | "docked" | "after";

export interface ShipPosition {
  lat: number;
  lng: number;
  status: ShipStatus;
}

function isSamePoint(a: Waypoint, b: Waypoint): boolean {
  return a.lat === b.lat && a.lng === b.lng;
}

export function getShipPosition(
  route: Waypoint[] | undefined,
  atTime: Date,
): ShipPosition | null {
  if (!route || route.length === 0) return null;

  const t = atTime.getTime();
  const first = route[0];
  const last = route[route.length - 1];
  const tFirst = new Date(first.timestamp).getTime();
  const tLast = new Date(last.timestamp).getTime();

  if (t <= tFirst) {
    return { lat: first.lat, lng: first.lng, status: "before" };
  }
  if (t >= tLast) {
    return { lat: last.lat, lng: last.lng, status: "after" };
  }

  for (let i = 0; i < route.length - 1; i++) {
    const wp1 = route[i];
    const wp2 = route[i + 1];
    const t1 = new Date(wp1.timestamp).getTime();
    const t2 = new Date(wp2.timestamp).getTime();
    if (t < t1 || t > t2) continue;

    if (isSamePoint(wp1, wp2)) {
      return { lat: wp1.lat, lng: wp1.lng, status: "docked" };
    }

    const span = t2 - t1;
    const f = span === 0 ? 0 : (t - t1) / span;
    return {
      lat: wp1.lat + (wp2.lat - wp1.lat) * f,
      lng: wp1.lng + (wp2.lng - wp1.lng) * f,
      status: "moving",
    };
  }

  // Skal ikke nås — defensivt fallback til siste punkt.
  return { lat: last.lat, lng: last.lng, status: "after" };
}

// Returnerer kursretning i grader, der 0 = nord, 90 = øst.
// For ikke-bevegende segmenter returnerer vi forrige reelle bearing
// hvis vi finner et — ellers 0.
export function getShipBearing(
  route: Waypoint[] | undefined,
  atTime: Date,
): number {
  if (!route || route.length < 2) return 0;

  const t = atTime.getTime();
  const tFirst = new Date(route[0].timestamp).getTime();
  const tLast = new Date(route[route.length - 1].timestamp).getTime();

  // Før start: pek mot første bevegelse
  if (t <= tFirst) return firstMovingBearing(route);
  // Etter slutt: behold siste bevegelses-bearing
  if (t >= tLast) return lastMovingBearing(route);

  for (let i = 0; i < route.length - 1; i++) {
    const wp1 = route[i];
    const wp2 = route[i + 1];
    const t1 = new Date(wp1.timestamp).getTime();
    const t2 = new Date(wp2.timestamp).getTime();
    if (t < t1 || t > t2) continue;

    if (isSamePoint(wp1, wp2)) {
      // Står stille — bruk forrige reelle bearing hvis vi har en.
      return previousMovingBearing(route, i);
    }
    return bearingBetween(wp1, wp2);
  }

  return 0;
}

function bearingBetween(a: Waypoint, b: Waypoint): number {
  const latMid = ((a.lat + b.lat) / 2) * (Math.PI / 180);
  const dLng = b.lng - a.lng;
  const dLat = b.lat - a.lat;
  // x = øst-komponent, y = nord-komponent. atan2(x, y) gir 0 = nord,
  // 90 = øst, vokser med klokka — det vi vil ha for kompasskurs.
  const deg = Math.atan2(dLng * Math.cos(latMid), dLat) * (180 / Math.PI);
  return (deg + 360) % 360;
}

function firstMovingBearing(route: Waypoint[]): number {
  for (let i = 0; i < route.length - 1; i++) {
    if (!isSamePoint(route[i], route[i + 1])) {
      return bearingBetween(route[i], route[i + 1]);
    }
  }
  return 0;
}

function lastMovingBearing(route: Waypoint[]): number {
  for (let i = route.length - 1; i > 0; i--) {
    if (!isSamePoint(route[i - 1], route[i])) {
      return bearingBetween(route[i - 1], route[i]);
    }
  }
  return 0;
}

function previousMovingBearing(route: Waypoint[], from: number): number {
  for (let i = from - 1; i >= 0; i--) {
    if (!isSamePoint(route[i], route[i + 1])) {
      return bearingBetween(route[i], route[i + 1]);
    }
  }
  // Ingen tidligere bevegelse — kikk fremover så skipet ikke peker
  // helt feil ved kai-stillstand før avgang.
  for (let i = from + 1; i < route.length - 1; i++) {
    if (!isSamePoint(route[i], route[i + 1])) {
      return bearingBetween(route[i], route[i + 1]);
    }
  }
  return 0;
}

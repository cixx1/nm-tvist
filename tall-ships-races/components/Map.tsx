"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import type { Location, ShipClass } from "@/types";
import { SHIP_CLASS_COLOR, shipMarkerSvg } from "@/components/ShipMarker";

// Leaflet er browser-only. Hele filen markeres som klient-komponent,
// og MapWrapper laster den med ssr: false slik at vi unngår
// "window is not defined" på serveren.

// Sentreres mellom Kristiansand og Esbjerg slik at hele Race 4-strekket
// er synlig som default. Brukeren kan zoome inn til sentrum.
const RACE_VIEW: { center: [number, number]; zoom: number } = {
  center: [57.0, 8.0],
  zoom: 7,
};

interface ShipPosition {
  id: string;
  name: string;
  shipClass: ShipClass;
  type: string;
  position: { lat: number; lng: number; status: ShipStatus } | null;
  bearing: number;
  status: ShipStatus | null;
  berthName?: string;
  raceResult?: { position: number; note?: string };
}

type ShipStatus = "before" | "moving" | "docked" | "after";

interface Props {
  currentTime: Date;
}

// Lager en cobalt-farget rund markør med nummer i. Vi bruker inline
// styles slik at Leaflet kan injisere html-en uten å være avhengig
// av Tailwinds class-scanner.
function makeLocationIcon(number: number): L.DivIcon {
  return L.divIcon({
    html: `
      <div style="
        width:34px;height:34px;
        background:oklch(0.45 0.24 263);
        color:oklch(0.96 0.012 95);
        border:2px solid oklch(0.96 0.012 95);
        border-radius:9999px;
        display:grid;place-items:center;
        font-family:var(--font-display),system-ui,sans-serif;
        font-weight:800;font-size:15px;line-height:1;
        box-shadow:0 4px 10px oklch(0.10 0.03 245 / 0.45);
      ">${number}</div>
    `,
    className: "tsr-location-marker",
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });
}

function makeShipIcon(shipClass: ShipClass, bearing: number): L.DivIcon {
  const color = SHIP_CLASS_COLOR[shipClass];
  return L.divIcon({
    html: shipMarkerSvg({ color, bearing, size: 44 }),
    className: "tsr-ship-marker",
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -20],
  });
}

// Lager en egen pane for skip slik at de alltid ligger over
// lokasjonsmarkørene i z-stacken.
function ShipPane() {
  const map = useMap();
  useEffect(() => {
    if (!map.getPane("shipPane")) {
      const pane = map.createPane("shipPane");
      pane.style.zIndex = "650";
    }
  }, [map]);
  return null;
}

function statusLabel(s: ShipStatus | null, berthName?: string): string {
  switch (s) {
    case "before":
    case "docked":
      return berthName ? `Ved kai: ${berthName}` : "Ved kai";
    case "moving":
      return "Underveis";
    case "after":
      return "I mål i Esbjerg";
    default:
      return "";
  }
}

function statusColor(s: ShipStatus | null): { bg: string; fg: string } {
  switch (s) {
    case "moving":
      return { bg: "oklch(0.93 0.21 113)", fg: "oklch(0.18 0.04 245)" };
    case "after":
      return { bg: "oklch(0.45 0.24 263)", fg: "oklch(0.96 0.012 95)" };
    case "docked":
    case "before":
      return { bg: "oklch(0.86 0.04 80)", fg: "oklch(0.10 0.03 245)" };
    default:
      return { bg: "oklch(0.82 0.02 240)", fg: "oklch(0.10 0.03 245)" };
  }
}

export default function Map({ currentTime }: Props) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [ships, setShips] = useState<ShipPosition[]>([]);
  const [failed, setFailed] = useState(false);
  const lastFetchKeyRef = useRef<number>(-1);

  // Hent lokasjoner én gang.
  useEffect(() => {
    let aborted = false;
    fetch("/api/locations")
      .then((r) => {
        if (!r.ok) throw new Error("Status " + r.status);
        return r.json() as Promise<Location[]>;
      })
      .then((data) => {
        if (!aborted) setLocations(data);
      })
      .catch(() => {
        if (!aborted) setFailed(true);
      });
    return () => {
      aborted = true;
    };
  }, []);

  // Hent skipsposisjoner reaktivt på currentTime. Vi runder
  // currentTime til nærmeste 200 ms slik at vi maks fyrer 5 fetches
  // per sekund selv om TimeMachine ticker hvert 100. ms.
  useEffect(() => {
    const key = Math.floor(currentTime.getTime() / 200);
    if (key === lastFetchKeyRef.current) return;
    lastFetchKeyRef.current = key;

    const ctrl = new AbortController();
    const iso = new Date(key * 200).toISOString();
    fetch(`/api/ships/positions?at=${encodeURIComponent(iso)}`, {
      signal: ctrl.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error("Status " + r.status);
        return r.json() as Promise<ShipPosition[]>;
      })
      .then((data) => setShips(data))
      .catch((err) => {
        if (err?.name !== "AbortError") {
          // Stille — vi viser ikke feilbanner for posisjons-fetch,
          // det vil flicke for mye under avspilling.
        }
      });
    return () => ctrl.abort();
  }, [currentTime]);

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <MapContainer
        center={RACE_VIEW.center}
        zoom={RACE_VIEW.zoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        aria-label="Animert kart over Race 4 (Kristiansand–Esbjerg) og lokasjoner i Kristiansand"
      >
        <ShipPane />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        {locations.map((loc, i) => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={makeLocationIcon(i + 1)}
          >
            <Popup>
              <div style={{ padding: "16px" }}>
                <p
                  style={{
                    fontSize: "11px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "oklch(0.10 0.03 245 / 0.55)",
                    margin: 0,
                  }}
                >
                  Lokasjon {i + 1}
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    fontSize: "22px",
                    lineHeight: 1.05,
                    letterSpacing: "-0.01em",
                    margin: "6px 0 8px",
                  }}
                >
                  {loc.name}
                </h3>
                <p
                  style={{
                    fontSize: "12px",
                    color: "oklch(0.10 0.03 245 / 0.7)",
                    margin: "0 0 10px",
                  }}
                >
                  {loc.address}
                </p>
                <p style={{ fontSize: "13px", lineHeight: 1.45, margin: 0 }}>
                  {loc.description}
                </p>
                <a
                  href={`#lokasjon-${loc.id}`}
                  style={{
                    display: "inline-block",
                    marginTop: "12px",
                    fontFamily: "var(--font-display), system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    color: "oklch(0.45 0.24 263)",
                    borderBottom: "1px solid oklch(0.45 0.24 263)",
                    paddingBottom: "2px",
                    textDecoration: "none",
                  }}
                >
                  Se arrangementer her →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}

        {ships.map((s) => {
          if (!s.position) return null;
          const status = s.status ?? s.position.status;
          const colors = statusColor(status);
          const label = statusLabel(status, s.berthName);
          return (
            <Marker
              key={s.id}
              position={[s.position.lat, s.position.lng]}
              icon={makeShipIcon(s.shipClass, s.bearing)}
              pane="shipPane"
            >
              <Popup>
                <div style={{ padding: "16px" }}>
                  <p
                    style={{
                      fontSize: "11px",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "oklch(0.10 0.03 245 / 0.55)",
                      margin: 0,
                    }}
                  >
                    Klasse {s.shipClass} — {s.type}
                  </p>
                  <h3
                    style={{
                      fontFamily: "var(--font-display), system-ui, sans-serif",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      fontSize: "22px",
                      lineHeight: 1.05,
                      letterSpacing: "-0.01em",
                      margin: "6px 0 10px",
                    }}
                  >
                    {s.name}
                  </h3>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "3px 10px",
                      background: colors.bg,
                      color: colors.fg,
                      fontFamily: "var(--font-display), system-ui, sans-serif",
                      fontWeight: 700,
                      fontSize: "11px",
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                    }}
                  >
                    {label}
                  </span>
                  {status === "after" && s.raceResult ? (
                    <div style={{ marginTop: "12px" }}>
                      <p
                        style={{
                          fontFamily:
                            "var(--font-display), system-ui, sans-serif",
                          fontWeight: 800,
                          fontSize: "16px",
                          margin: 0,
                          color: "oklch(0.10 0.03 245)",
                        }}
                      >
                        🏆 {s.raceResult.position}. plass i klassen
                      </p>
                      {s.raceResult.note ? (
                        <p
                          style={{
                            fontSize: "12px",
                            color: "oklch(0.10 0.03 245 / 0.7)",
                            margin: "4px 0 0",
                          }}
                        >
                          {s.raceResult.note}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                  <a
                    href={`/skip/${s.id}`}
                    style={{
                      display: "inline-block",
                      marginTop: "14px",
                      fontFamily: "var(--font-display), system-ui, sans-serif",
                      fontWeight: 700,
                      fontSize: "12px",
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                      color: "oklch(0.45 0.24 263)",
                      borderBottom: "1px solid oklch(0.45 0.24 263)",
                      paddingBottom: "2px",
                      textDecoration: "none",
                    }}
                  >
                    Se skipet →
                  </a>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {failed && (
        <div
          role="status"
          style={{
            position: "absolute",
            left: 12,
            right: 12,
            bottom: 12,
            background: "oklch(0.96 0.012 95)",
            color: "oklch(0.10 0.03 245)",
            padding: "10px 14px",
            zIndex: 1000,
            fontSize: "13px",
            fontFamily: "var(--font-sans), system-ui, sans-serif",
          }}
        >
          Kunne ikke laste lokasjoner.
        </div>
      )}
    </div>
  );
}

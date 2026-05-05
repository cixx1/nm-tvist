"use client";

import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import type { Location } from "@/types";

// Leaflet er browser-only. Hele filen markeres som klient-komponent,
// og MapWrapper laster den med ssr: false slik at vi unngår
// "window is not defined" på serveren.

const KRISTIANSAND: [number, number] = [58.1467, 8.0];

// Lager en cobalt-farget rund markør med nummer i. Vi bruker inline
// styles slik at Leaflet kan injisere html-en uten å være avhengig
// av Tailwinds class-scanner.
function makeIcon(number: number): L.DivIcon {
  return L.divIcon({
    html: `
      <div style="
        width:40px;height:40px;
        background:oklch(0.45 0.24 263);
        color:oklch(0.96 0.012 95);
        border:2px solid oklch(0.96 0.012 95);
        border-radius:9999px;
        display:grid;place-items:center;
        font-family:var(--font-display),system-ui,sans-serif;
        font-weight:800;font-size:18px;line-height:1;
        box-shadow:0 6px 16px oklch(0.10 0.03 245 / 0.45);
      ">${number}</div>
    `,
    className: "tsr-marker",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -22],
  });
}

export default function Map() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [failed, setFailed] = useState(false);

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

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <MapContainer
        center={KRISTIANSAND}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        aria-label="Kart over Tall Ships Races-lokasjoner i Kristiansand"
      >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {locations.map((loc, i) => (
        <Marker
          key={loc.id}
          position={[loc.lat, loc.lng]}
          icon={makeIcon(i + 1)}
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

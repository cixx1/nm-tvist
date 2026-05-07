import type { ShipClass } from "@/types";

// Seilbåt-SVG. Tegnes med baugen pekende rett opp (nord) i nøytral
// tilstand, slik at en ekstra `transform: rotate(<bearing>deg)`
// stemmer 1:1 med kompasskursen.
//
// Vi eksporterer både en React-komponent og en string-versjon.
// String-versjonen brukes i Leaflets `L.divIcon`, som tar HTML
// som tekst. Da kan vi ikke bruke Tailwind-klasser, så all styling
// er inline.

const SAIL_FILL = "oklch(0.96 0.012 95)";
const HULL_STROKE = "oklch(0.10 0.03 245 / 0.85)";

export const SHIP_CLASS_COLOR: Record<ShipClass, string> = {
  A: "oklch(0.18 0.04 245)",
  B: "oklch(0.45 0.24 263)",
  C: "oklch(0.78 0.22 118)",
  D: "oklch(0.62 0.04 240)",
};

interface SvgArgs {
  color: string;
  bearing: number;
  size: number;
  dimmed?: boolean;
}

// Selvinneholdende SVG som string. Sett opp som en topp-ned-figur
// (slik man ser et skip ovenfra på et kart): pekende skrog-form med
// baugen rett opp i nøytral tilstand. Det gjør at kompasskursen
// 0–360° kan brukes direkte som rotasjon — skipet ser riktig ut
// uansett retning, ikke bare når det seiler vestover.
function svgBody(color: string, dimmed: boolean): string {
  const opacity = dimmed ? "0.55" : "1";
  return `
    <g opacity="${opacity}">
      <!-- skrog: spiss baug øverst, rundere akterende nederst -->
      <path d="M 0 -12 C 5 -8 6 -2 5 4 C 4 8 2 10 0 10 C -2 10 -4 8 -5 4 C -6 -2 -5 -8 0 -12 Z"
            fill="${color}" stroke="${HULL_STROKE}" stroke-width="1"
            stroke-linejoin="round" />
      <!-- seil sett ovenfra: smal trekant midt i skroget -->
      <path d="M 0 -8 L -3 3 L 3 3 Z"
            fill="${SAIL_FILL}" stroke="${HULL_STROKE}" stroke-width="0.5"
            opacity="0.95" />
      <!-- liten stripe akter for å skille front/bak når skipet er stille -->
      <path d="M -3.5 6 L 3.5 6"
            stroke="${HULL_STROKE}" stroke-width="0.7" stroke-linecap="round"
            opacity="0.7" />
    </g>
  `;
}

export function shipMarkerSvg({
  color,
  bearing,
  size,
  dimmed = false,
}: SvgArgs): string {
  // Wrapping i en ekstra div lar oss rotere uten at Leaflets egne
  // transform-justeringer kommer i veien.
  return `
    <div style="
      width:${size}px;height:${size}px;
      display:grid;place-items:center;
      transform:rotate(${bearing}deg);
      transform-origin:center;
      transition:transform 220ms linear;
      filter:drop-shadow(0 4px 6px oklch(0.10 0.03 245 / 0.45));
      pointer-events:auto;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="-14 -14 28 28"
           width="${size}" height="${size}" aria-hidden="true">
        ${svgBody(color, dimmed)}
      </svg>
    </div>
  `;
}

interface Props {
  shipClass: ShipClass;
  bearing?: number;
  size?: number;
  dimmed?: boolean;
}

// React-komponent for evt. bruk utenfor Leaflet (f.eks. legend).
export default function ShipMarker({
  shipClass,
  bearing = 0,
  size = 40,
  dimmed = false,
}: Props) {
  const color = SHIP_CLASS_COLOR[shipClass];
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "grid",
        placeItems: "center",
        transform: `rotate(${bearing}deg)`,
        transformOrigin: "center",
        transition: "transform 220ms linear",
      }}
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="-14 -14 28 28"
        width={size}
        height={size}
        dangerouslySetInnerHTML={{ __html: svgBody(color, dimmed) }}
      />
    </div>
  );
}

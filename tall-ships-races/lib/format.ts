// Felles formatterings-hjelpere for visning av skip og arrangementer.

// Lager flagg-emoji fra ISO-2 landskode (f.eks. "NO" -> 🇳🇴).
export function flag(countryCode: string): string {
  const cc = countryCode.toUpperCase();
  if (cc.length !== 2) return "";
  const A = 0x1f1e6 - "A".charCodeAt(0);
  return String.fromCodePoint(cc.charCodeAt(0) + A, cc.charCodeAt(1) + A);
}

// Formaterer en ISO-dato til norsk: "31. juli 14:00".
const months = [
  "januar",
  "februar",
  "mars",
  "april",
  "mai",
  "juni",
  "juli",
  "august",
  "september",
  "oktober",
  "november",
  "desember",
];

export function formatEventDate(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate();
  const month = months[d.getMonth()];
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${day}. ${month} ${hh}:${mm}`;
}

// Beregner alder på et skip basert på byggeår og dagens dato.
export function shipAge(yearBuilt: number, now: Date = new Date()): number {
  return now.getFullYear() - yearBuilt;
}

# Tall Ships Races Kristiansand 2025

Skoleprosjekt: nettside for Tall Ships Races når regattaen stopper i Kristiansand 30. juli til 2. august 2025. Forsiden viser nedtelling, oversikt og lenker videre til skip, arrangementer og kart med animert race-sporing.

Laget av Cornelius og Elias, IT-driftsfag VG2, Tangen VGS. Presentasjon mai 2026.

## Tech stack

- Next.js 16.2 (App Router, Turbopack)
- React 19.2
- TypeScript 5
- Tailwind CSS v4 (PostCSS plugin)
- lucide-react (ikoner)
- leaflet 1.9 + react-leaflet 5 (kart)
- date-fns 4

## Kjør lokalt

```bash
npm install
npm run dev
```

Standardport er 3000 (eller første ledige). Andre kommandoer:

```bash
npm run build       # produksjonsbygg
npm run start       # serv produksjonsbygget
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
```

Krever Node 20.9 eller nyere.

## Sider

| Rute | Innhold |
| ---- | ------- |
| `/` | Hero med nedtelling, oversikt over de tre undersidene, om-Tall-Ships-blokk, footer. |
| `/skip` | Listing av alle åtte deltakerskip med klassefilter via URL (`?klasse=A`). |
| `/skip/[id]` | Detaljside med bilde, fakta-grid, beskrivelse og knyttede arrangementer. |
| `/arrangementer` | Program gruppert per dag, filtrerbart på type og dato (`?type=konsert&dato=2025-07-31`). |
| `/arrangementer/[id]` | Detaljside med tid, lokasjon, beskrivelse, kapasitet, knyttet skip og andre samme dag. |
| `/kart` | Leaflet-kart med animert Race 4-sporing (Kristiansand → Esbjerg) og 6 sentrumslokasjoner. TimeMachine over kartet med play, slider, 4 hastigheter og presets. |

## Mappestruktur

```
app/                Sider og API-ruter (App Router)
  api/              Route handlers (ships, events, locations, bookings, ships/positions)
  arrangementer/    Programlisting + detaljside
  kart/             Kartside
  skip/             Skipsliste + detaljside
  layout.tsx        Rotlayout, fonter og navbar
  page.tsx          Forside
  globals.css       Tailwind v4 + fargepalett (oklch)
components/         Klient- og UI-komponenter
data/               JSON-filer med skip, arrangementer, lokasjoner, bookinger
lib/                data.ts, format.ts, shipPosition.ts (race-interpolasjon)
public/             Statiske filer (hero.png, ships/*.jpg)
types/              Felles TypeScript-typer
```

## API

Alt er JSON over HTTP. Data ligger i `data/*.json` og leses med `fs/promises` ved hver request.

| Endepunkt | Hva |
| --------- | --- |
| `GET /api/ships` | Liste med alle skip. |
| `GET /api/ships/[id]` | Ett skip, 404 hvis id ikke finnes. |
| `GET /api/ships/positions?at=ISO` | Interpolert posisjon og kursretning for hvert skip i Race 4. Brukes av kartanimasjonen. |
| `GET /api/events` | Alle arrangementer, kan filtreres med `?type=konsert`. |
| `GET /api/events/[id]` | Ett arrangement, 404 hvis id ikke finnes. |
| `GET /api/locations` | Lokasjoner med koordinater for kartet. |
| `POST /api/bookings` | Validerer og lager booking. **Krever skrivbart filsystem — fungerer kun lokalt** (se under). |

### Eksempel: posisjons-API

```
GET /api/ships/positions?at=2025-08-03T18:00:00Z
```

```json
[
  {
    "id": "fryderyk-chopin",
    "name": "Fryderyk Chopin",
    "shipClass": "A",
    "type": "Brigantin",
    "position": { "lat": 56.27, "lng": 7.03, "status": "moving" },
    "bearing": 195.3,
    "status": "moving",
    "berthName": "Lagholmen, Kai 8",
    "raceResult": { "position": 1, "note": "Line honours og beste elapsed time" }
  }
]
```

## Deployment til Vercel

Prosjektet er klargjort for Vercel:

1. Push til GitHub.
2. Importer repo på <https://vercel.com/new>.
3. Vercel oppdager Next.js automatisk — ingen ekstra konfig nødvendig.
4. Klikk Deploy.

Ingen miljøvariabler kreves. Build-kommandoen er `next build`, output er Next.js standard.

### Begrensninger på Vercel

- **`POST /api/bookings`** skriver til `data/bookings.json` via `fs.writeFile`. Vercel sine serverless-funksjoner har read-only filsystem, så endepunktet returnerer `503` med en tydelig melding i produksjon. Lokal utvikling fungerer som vanlig. Dette er bevisst — full booking-flyt er ikke en del av elev-demoen.
- Alle `data/*.json` leses ved hver request, så enhver endring i kildefilen krever et nytt deploy.

## Status

Alle planlagte sider og funksjoner er ferdig: forside, skip, arrangementer, kart med animert race-sporing, og alle API-endepunkter. Klar for innlevering og demo.

# Tall Ships Races Kristiansand 2025

Skoleprosjekt: nettside for Tall Ships Races når regattaen stopper i Kristiansand 30. juli til 2. august 2025. Forsiden viser nedtelling, oversikt og lenker videre til skip, arrangementer og kart med animert race-sporing.

Laget av **Cornelius og Elias**, IT-driftsfag VG2, Tangen VGS. Presentasjon mai 2026.

---

## For læreren — sånn starter du prosjektet

### 1. Forutsetninger

Du trenger **Node.js 20.9 eller nyere** installert. Sjekk versjonen med:

```bash
node --version
```

Hvis du ikke har Node, last ned fra <https://nodejs.org> (velg LTS-versjonen).

### 2. Installer avhengigheter

Åpne en terminal i `tall-ships-races/`-mappen og kjør:

```bash
npm install
```

Dette tar 30–60 sekunder første gang og laster ned alle pakkene prosjektet bruker. Du kan se advarsler — det er normalt, så lenge det ikke står `ERR!`.

### 3. Start utviklingsserveren

```bash
npm run dev
```

Du får en melding som ligner:

```
▲ Next.js 16.2.5
- Local:    http://localhost:3000
✓ Ready in 1.2s
```

Åpne **<http://localhost:3000>** i nettleseren. Hvis port 3000 er opptatt velger Next.js neste ledige port (3001, 3002 …) — sjekk meldingen i terminalen.

For å stoppe serveren: trykk `Ctrl + C` i terminalen.

### 4. Hva du bør klikke deg gjennom

| Side | URL | Hva å se etter |
| ---- | --- | -------------- |
| **Forside** | `/` | Hero-bilde, nedtelling til 30. juli 2025, tre kort som lenker videre, om-Tall-Ships-blokk og footer. |
| **Skip** | `/skip` | Liste over alle åtte deltakerskip. Klikk på filter-knappene (Klasse A/B/C/D) — URL-en endres til `?klasse=A` slik at filteret kan bokmerkes. |
| **Skip-detalj** | `/skip/[id]` | Klikk et hvilket som helst skip. Du får bilde, fakta-grid, beskrivelse og hvilke arrangementer skipet er knyttet til. |
| **Arrangementer** | `/arrangementer` | Programmet gruppert per dag. Bruk filtrene for type (konsert, parade, omvisning …) og dato — URL-en oppdateres på samme måte (`?type=konsert&dato=2025-07-31`). |
| **Arrangement-detalj** | `/arrangementer/[id]` | Klikk et arrangement. Du får tid, sted, beskrivelse, kapasitet og andre arrangementer samme dag. |
| **Kart** | `/kart` | Leaflet-kart med 6 sentrumslokasjoner og animert sporing av Race 4 (Kristiansand → Esbjerg). Bruk **TimeMachine**-panelet over kartet: trykk play, dra slideren, bytt mellom 4 hastigheter, eller bruk presets for å hoppe direkte til viktige tidspunkter. |

### 5. Hvis noe ikke fungerer

| Problem | Løsning |
| ------- | ------- |
| `command not found: npm` | Node.js er ikke installert. Se punkt 1. |
| Feil ved `npm install` | Slett `node_modules/`-mappen og `package-lock.json`, og kjør `npm install` på nytt. |
| `EADDRINUSE` / port opptatt | En annen app bruker port 3000. Next.js velger neste ledige port — les terminalen. |
| Kart-siden er blank | Sjekk at du har internett (kartfliser hentes fra OpenStreetMap). |
| `npm run dev` henger | Trykk `Ctrl + C`, og prøv `npm run build && npm run start` i stedet. |

---

## Andre kommandoer

```bash
npm run build       # produksjonsbygg (sjekker også typer og bygger optimalisert)
npm run start       # serv produksjonsbygget på port 3000
npm run lint        # ESLint — sjekker kodekvalitet
npm run typecheck   # tsc --noEmit — sjekker TypeScript-typer uten å bygge
```

## Tech stack

- **Next.js 16.2** (App Router, Turbopack)
- **React 19.2**
- **TypeScript 5**
- **Tailwind CSS v4** (PostCSS plugin)
- **lucide-react** — ikoner
- **leaflet 1.9 + react-leaflet 5** — kart
- **date-fns 4** — datohåndtering

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
components/         Klient- og UI-komponenter (Countdown, Map, TimeMachine, Navbar …)
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

Du kan teste API-ene direkte i nettleseren mens dev-serveren kjører, f.eks. <http://localhost:3000/api/ships>.

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

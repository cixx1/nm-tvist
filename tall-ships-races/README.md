# Tall Ships Races Kristiansand 2025

Skoleprosjekt: nettside for Tall Ships Races når regattaen stopper i Kristiansand 30. juli til 2. august 2025. Forsiden viser nedtelling, oversikt og lenker videre til skip, arrangementer og kart.

Laget av Cornelius og Elias, IT-driftsfag VG2, Tangen VGS. Presentasjon 13. mai 2025.

## Tech stack

- Next.js 16 (App Router) med Turbopack
- TypeScript
- Tailwind CSS v4
- React 19
- lucide-react (ikoner)
- date-fns
- leaflet og react-leaflet (klar for kartsiden)

## Kjør lokalt

```bash
npm install
npm run dev
```

Standard URL: <http://localhost:3000>

## Mappestruktur

```
app/                Sider og API-ruter (App Router)
  api/              Route handlers (ships, events, locations, bookings)
  layout.tsx        Rotlayout, fonter og navbar
  page.tsx          Forside
  globals.css       Tailwind v4 + fargepalett (oklch)
components/         Klient- og UI-komponenter
data/               JSON-filer med skip, arrangementer, lokasjoner, bookinger
lib/data.ts         Lese- og skrivehjelpere for data/
public/             Statiske filer (hero.png m.m.)
references/         Bildereferanser brukt under designarbeidet
types/              Felles TypeScript-typer
```

## API

Alt er JSON over HTTP. Data ligger i `data/*.json` og leses med `fs/promises` ved hver request.

### `GET /api/ships`

Liste med alle skip.

```json
[
  {
    "id": "sorlandet",
    "name": "Sørlandet",
    "country": "Norge",
    "countryCode": "NO",
    "shipClass": "A",
    "type": "Fullrigger",
    "length": 64,
    "yearBuilt": 1927,
    "homePort": "Kristiansand",
    "image": "/ships/sorlandet.jpg",
    "description": "Bygget i Kristiansand i 1927 …",
    "captain": "Tor Heinrich Andersen",
    "crewSize": 70
  }
]
```

### `GET /api/ships/[id]`

Ett skip. `404` hvis id ikke finnes.

### `GET /api/events`

Liste med alle arrangementer. Kan filtreres på type med `?type=konsert` (gyldige verdier: `konsert`, `omvisning`, `workshop`, `seremoni`, `aktivitet`).

```json
[
  {
    "id": "shantykor",
    "title": "Shantykor-konsert",
    "type": "konsert",
    "date": "2025-07-31T19:00:00",
    "endDate": "2025-07-31T21:00:00",
    "locationId": "kilden",
    "description": "Sjømannsviser og shanties …",
    "capacity": 200,
    "booked": 142,
    "price": 0
  }
]
```

### `GET /api/events/[id]`

Ett arrangement. `404` hvis id ikke finnes.

### `GET /api/locations`

Liste med lokasjoner og koordinater for kartet.

```json
[
  {
    "id": "lagholmen",
    "name": "Lagholmen",
    "lat": 58.1428,
    "lng": 8.0072,
    "description": "Hovedhavn for skipene …",
    "address": "Lagmannsholmen, 4611 Kristiansand"
  }
]
```

### `POST /api/bookings`

Lager en ny booking. Validerer at arrangementet finnes og har nok ledige plasser.

Body:

```json
{
  "eventId": "shantykor",
  "name": "Kari Nordmann",
  "email": "kari@example.com",
  "phone": "12345678",
  "numberOfPeople": 2
}
```

Svar ved suksess (`201`):

```json
{
  "id": "uuid",
  "eventId": "shantykor",
  "name": "Kari Nordmann",
  "email": "kari@example.com",
  "phone": "12345678",
  "numberOfPeople": 2,
  "createdAt": "2025-05-13T10:00:00.000Z"
}
```

Svar ved feil (`400`):

```json
{ "error": "Ikke nok ledige plasser. 12 igjen." }
```

## Status

Forsiden, navigasjon, fargepalett, fonter og alle API-rutene er på plass. Skip-, arrangement- og kart-siden er ikke laget enda — det kommer i neste runde.

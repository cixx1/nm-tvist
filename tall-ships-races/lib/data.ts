import { promises as fs } from "node:fs";
import path from "node:path";
import type { Booking, Event, Location, Ship } from "@/types";

// Hjelpefunksjoner som leser og skriver JSON-filene i data/.
// Vi bruker fs/promises slik at API-rutene kan oppdatere filer
// uten å trenge en ekte database — fint for et skoleprosjekt.

const DATA_DIR = path.join(process.cwd(), "data");

async function readJson<T>(file: string): Promise<T> {
  const full = path.join(DATA_DIR, file);
  const raw = await fs.readFile(full, "utf-8");
  return JSON.parse(raw) as T;
}

export function getShips(): Promise<Ship[]> {
  return readJson<Ship[]>("ships.json");
}

export function getEvents(): Promise<Event[]> {
  return readJson<Event[]>("events.json");
}

export function getLocations(): Promise<Location[]> {
  return readJson<Location[]>("locations.json");
}

export function getBookings(): Promise<Booking[]> {
  return readJson<Booking[]>("bookings.json");
}

export async function writeBookings(bookings: Booking[]): Promise<void> {
  const full = path.join(DATA_DIR, "bookings.json");
  await fs.writeFile(full, JSON.stringify(bookings, null, 2) + "\n", "utf-8");
}

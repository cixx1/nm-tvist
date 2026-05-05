import { type NextRequest } from "next/server";
import { getEvents } from "@/lib/data";
import type { EventType } from "@/types";

const VALID_TYPES: EventType[] = [
  "konsert",
  "omvisning",
  "workshop",
  "seremoni",
  "aktivitet",
];

// Returnerer arrangementer. Kan filtreres med ?type=konsert og/eller ?shipId=sorlandet.
// Filtrene kombineres (AND).
export async function GET(request: NextRequest) {
  const events = await getEvents();
  const type = request.nextUrl.searchParams.get("type");
  const shipId = request.nextUrl.searchParams.get("shipId");

  let result = events;
  if (type && (VALID_TYPES as string[]).includes(type)) {
    result = result.filter((e) => e.type === type);
  }
  if (shipId) {
    result = result.filter((e) => e.shipId === shipId);
  }

  return Response.json(result);
}

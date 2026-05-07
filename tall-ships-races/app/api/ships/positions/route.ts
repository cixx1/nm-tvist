import { getShips } from "@/lib/data";
import { getShipPosition, getShipBearing } from "@/lib/shipPosition";
import type { NextRequest } from "next/server";

// GET /api/ships/positions?at=2025-08-02T12:00:00Z
// Returnerer interpolert posisjon og kursretning for hvert skip
// med definert rute.

export async function GET(request: NextRequest) {
  const at = request.nextUrl.searchParams.get("at");
  if (!at) {
    return Response.json(
      { error: "Mangler 'at'-parameter — bruk en ISO-timestamp" },
      { status: 400 },
    );
  }
  const atTime = new Date(at);
  if (Number.isNaN(atTime.getTime())) {
    return Response.json(
      { error: "Ugyldig 'at'-parameter — bruk en ISO-timestamp" },
      { status: 400 },
    );
  }

  const ships = await getShips();
  const data = ships
    .filter((s) => s.route && s.route.length > 0)
    .map((s) => {
      const position = getShipPosition(s.route, atTime);
      const bearing = getShipBearing(s.route, atTime);
      return {
        id: s.id,
        name: s.name,
        shipClass: s.shipClass,
        type: s.type,
        position,
        bearing,
        status: position?.status ?? null,
        berthName: s.berthName,
        raceResult: s.raceResult,
      };
    });

  return Response.json(data);
}

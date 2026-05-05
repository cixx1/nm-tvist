import { getShips } from "@/lib/data";

// Returnerer alle skipene som JSON.
export async function GET() {
  const ships = await getShips();
  return Response.json(ships);
}

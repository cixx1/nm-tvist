import { getLocations } from "@/lib/data";

// Returnerer alle lokasjoner med koordinater for kartet.
export async function GET() {
  const locations = await getLocations();
  return Response.json(locations);
}

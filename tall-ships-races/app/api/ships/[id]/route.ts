import { getShips } from "@/lib/data";

// Henter ett enkelt skip basert på id.
// I Next.js 15+/16 er params en Promise, derfor await.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const ships = await getShips();
  const ship = ships.find((s) => s.id === id);

  if (!ship) {
    return Response.json({ error: "Skipet finnes ikke" }, { status: 404 });
  }

  return Response.json(ship);
}

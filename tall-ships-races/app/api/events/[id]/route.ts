import { getEvents } from "@/lib/data";

// Henter ett enkelt arrangement basert på id.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const events = await getEvents();
  const event = events.find((e) => e.id === id);

  if (!event) {
    return Response.json(
      { error: "Arrangementet finnes ikke" },
      { status: 404 },
    );
  }

  return Response.json(event);
}

import { randomUUID } from "node:crypto";
import { getBookings, getEvents, writeBookings } from "@/lib/data";
import type { Booking } from "@/types";

// Lager en ny booking. Sjekker at arrangementet finnes
// og at det er nok ledige plasser igjen.
// Validerer alle feltene og returnerer norsk feilmelding ved 400.

interface BookingInput {
  eventId?: unknown;
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  numberOfPeople?: unknown;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  let body: BookingInput;
  try {
    body = (await request.json()) as BookingInput;
  } catch {
    return Response.json(
      { error: "Ugyldig forespørsel: kunne ikke lese JSON" },
      { status: 400 },
    );
  }

  if (!isNonEmptyString(body.eventId)) {
    return Response.json({ error: "eventId mangler" }, { status: 400 });
  }
  if (!isNonEmptyString(body.name)) {
    return Response.json({ error: "Navn mangler" }, { status: 400 });
  }
  if (!isNonEmptyString(body.email) || !body.email.includes("@")) {
    return Response.json({ error: "Ugyldig e-post" }, { status: 400 });
  }
  if (!isNonEmptyString(body.phone)) {
    return Response.json({ error: "Telefon mangler" }, { status: 400 });
  }
  if (
    typeof body.numberOfPeople !== "number" ||
    !Number.isInteger(body.numberOfPeople) ||
    body.numberOfPeople < 1
  ) {
    return Response.json(
      { error: "Antall personer må være et helt tall større enn 0" },
      { status: 400 },
    );
  }

  // Sjekk at arrangementet finnes og har plass igjen.
  const events = await getEvents();
  const event = events.find((e) => e.id === body.eventId);
  if (!event) {
    return Response.json(
      { error: "Arrangementet finnes ikke" },
      { status: 400 },
    );
  }

  const ledig = event.capacity - event.booked;
  if (body.numberOfPeople > ledig) {
    return Response.json(
      {
        error: `Ikke nok ledige plasser. ${ledig} igjen.`,
      },
      { status: 400 },
    );
  }

  // Lagre booking i bookings.json. På serverless-plattformer (Vercel)
  // er filsystemet read-only, så skrivingen kan kaste EROFS/EACCES.
  // Vi fanger det og returnerer en tydelig 503 i stedet for å krasje.
  const bookings = await getBookings();
  const booking: Booking = {
    id: randomUUID(),
    eventId: event.id,
    name: body.name.trim(),
    email: body.email.trim(),
    phone: body.phone.trim(),
    numberOfPeople: body.numberOfPeople,
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);
  try {
    await writeBookings(bookings);
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code;
    if (code === "EROFS" || code === "EACCES") {
      return Response.json(
        {
          error:
            "Booking er ikke tilgjengelig i denne demoen. Endepunktet fungerer kun lokalt.",
        },
        { status: 503 },
      );
    }
    throw err;
  }

  return Response.json(booking, { status: 201 });
}

// Domenetypene for Tall Ships Races Kristiansand 2025.
// Brukes både i API-rutene og i komponentene som henter data.

export type ShipClass = "A" | "B" | "C" | "D";

export type ShipType =
  | "Fullrigger"
  | "Bark"
  | "Skonnert"
  | "Brigg"
  | "Brigantin";

export interface Waypoint {
  lat: number;
  lng: number;
  timestamp: string;
  label?: string;
}

export interface RaceResult {
  position: number;
  note?: string;
}

export interface Ship {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  shipClass: ShipClass;
  type: ShipType;
  length: number;
  yearBuilt: number;
  homePort: string;
  image: string;
  description: string;
  captain: string;
  crewSize: number;
  route?: Waypoint[];
  berthName?: string;
  raceResult?: RaceResult;
}

export type EventType =
  | "konsert"
  | "omvisning"
  | "workshop"
  | "seremoni"
  | "aktivitet";

export interface Event {
  id: string;
  title: string;
  type: EventType;
  date: string;
  endDate: string;
  locationId: string;
  description: string;
  capacity: number;
  booked: number;
  price: number;
  ageLimit?: number;
  shipId?: string;
}

export interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  address: string;
}

export interface Booking {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone: string;
  numberOfPeople: number;
  createdAt: string;
}

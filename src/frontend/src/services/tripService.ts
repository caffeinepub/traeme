import type { backendInterface, Trip, TripStatus } from '../backend';

export async function getAllTrips(actor: backendInterface): Promise<Trip[]> {
  return await actor.getAllTrips();
}

export async function getTrip(actor: backendInterface, id: string): Promise<Trip | null> {
  return await actor.getTrip(id);
}

export async function getTripsForVehicle(actor: backendInterface, vehicleId: string): Promise<Trip[]> {
  return await actor.getTripsForVehicle(vehicleId);
}

export async function createTrip(actor: backendInterface, trip: Trip): Promise<void> {
  return await actor.createTrip(trip);
}

export async function updateTripStatus(actor: backendInterface, tripId: string, status: TripStatus): Promise<void> {
  return await actor.updateTripStatus(tripId, status);
}

export async function startTripExplicit(actor: backendInterface, vehicleId: string, routeId: string): Promise<void> {
  return await actor.startTripExplicit(vehicleId, routeId);
}

export async function endTripExplicit(actor: backendInterface, vehicleId: string, routeId: string): Promise<void> {
  return await actor.endTripExplicit(vehicleId, routeId);
}

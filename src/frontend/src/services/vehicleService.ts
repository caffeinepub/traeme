import type { backendInterface, VehicleLocation } from '../backend';

export async function getAllVehicleLocations(actor: backendInterface): Promise<VehicleLocation[]> {
  return await actor.getAllVehicleLocations();
}

export async function getVehicleLocation(actor: backendInterface, vehicleId: string): Promise<VehicleLocation | null> {
  return await actor.getVehicleLocation(vehicleId);
}

export async function updateVehicleLocation(actor: backendInterface, location: VehicleLocation): Promise<void> {
  return await actor.updateVehicleLocation(location);
}

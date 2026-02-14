import type { backendInterface } from '../backend';
import { Principal } from '@dfinity/principal';

export async function assignDriverVehicleAndRoute(
  actor: backendInterface,
  driver: Principal,
  vehicleId: string | null,
  routeId: string | null
): Promise<void> {
  return await actor.assignDriverVehicleAndRoute(driver, vehicleId, routeId);
}

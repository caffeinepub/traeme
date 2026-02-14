import type { Trip, VehicleLocation } from '../backend';

export function calculateEta(trip?: Trip, location?: VehicleLocation): string {
  if (!trip || !location) {
    return 'ETA not available';
  }

  const now = Date.now();
  const lastUpdated = Number(location.lastUpdated) / 1000000;
  const timeSinceUpdate = now - lastUpdated;

  if (timeSinceUpdate > 300000) {
    return 'ETA not available';
  }

  if (trip.status === 'completed') {
    return 'Trip completed';
  }

  if (trip.status === 'delayed') {
    return 'Delayed';
  }

  if (trip.status === 'arrived') {
    return 'Arrived';
  }

  if (trip.status === 'enRoute') {
    return '10-15 minutes';
  }

  if (trip.status === 'scheduled') {
    return 'Not started';
  }

  return 'ETA not available';
}

import type { backendInterface, Alert } from '../backend';

export async function getAllAlerts(actor: backendInterface): Promise<Alert[]> {
  return await actor.getAllAlerts();
}

export async function getAlert(actor: backendInterface, id: string): Promise<Alert | null> {
  return await actor.getAlert(id);
}

export async function getAlertsForVehicle(actor: backendInterface, vehicleId: string): Promise<Alert[]> {
  return await actor.getAlertsForVehicle(vehicleId);
}

export async function getAlertsForRoute(actor: backendInterface, routeId: string): Promise<Alert[]> {
  return await actor.getAlertsForRoute(routeId);
}

export async function createAlert(actor: backendInterface, alert: Alert): Promise<void> {
  return await actor.createAlert(alert);
}

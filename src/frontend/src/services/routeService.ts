import type { backendInterface, Route } from '../backend';

export async function getAllRoutes(actor: backendInterface): Promise<Route[]> {
  return await actor.getAllRoutes();
}

export async function getActiveRoutes(actor: backendInterface): Promise<Route[]> {
  return await actor.getActiveRoutes();
}

export async function getRoute(actor: backendInterface, id: string): Promise<Route | null> {
  return await actor.getRoute(id);
}

export async function createRoute(actor: backendInterface, route: Route): Promise<void> {
  return await actor.createRoute(route);
}

export async function updateRoute(actor: backendInterface, route: Route): Promise<void> {
  return await actor.updateRoute(route);
}

export async function deactivateRoute(actor: backendInterface, routeId: string): Promise<void> {
  return await actor.deactivateRoute(routeId);
}

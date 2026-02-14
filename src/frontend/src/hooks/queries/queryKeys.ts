import { Principal } from '@dfinity/principal';

export const queryKeys = {
  currentUser: ['currentUserProfile'] as const,
  userProfile: (principal: Principal) => ['userProfile', principal.toString()] as const,
  allUserProfiles: ['allUserProfiles'] as const,
  vehicles: ['vehicles'] as const,
  vehicle: (id: string) => ['vehicle', id] as const,
  routes: ['routes'] as const,
  activeRoutes: ['activeRoutes'] as const,
  route: (id: string) => ['route', id] as const,
  trips: ['trips'] as const,
  trip: (id: string) => ['trip', id] as const,
  tripsForVehicle: (vehicleId: string) => ['trips', 'vehicle', vehicleId] as const,
  activeTrip: (vehicleId: string) => ['activeTrip', vehicleId] as const,
  alerts: ['alerts'] as const,
  alert: (id: string) => ['alert', id] as const,
  alertsForVehicle: (vehicleId: string) => ['alerts', 'vehicle', vehicleId] as const,
  alertsForRoute: (routeId: string) => ['alerts', 'route', routeId] as const,
  pickupDropoff: ['pickupDropoff'] as const,
  pickupDropoffRecord: (id: string) => ['pickupDropoff', id] as const,
  pickupDropoffForStudent: (studentId: Principal) => ['pickupDropoff', 'student', studentId.toString()] as const,
};

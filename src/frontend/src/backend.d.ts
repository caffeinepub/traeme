import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Route {
    id: string;
    name: string;
    isActive: boolean;
    stops: Array<string>;
}
export interface Trip {
    id: string;
    status: TripStatus;
    lastUpdated: Time;
    routeId: string;
    vehicleId: string;
}
export type Time = bigint;
export interface PickupDropoffRecord {
    id: string;
    status: string;
    stopId: string;
    studentId: Principal;
    tripId: string;
    time: Time;
    notes?: string;
}
export interface VehicleLocation {
    latitude: number;
    assignedRoute?: string;
    lastUpdated: Time;
    longitude: number;
    driver: Principal;
    vehicleId: string;
}
export interface Alert {
    id: string;
    tripId?: string;
    routeId?: string;
    message: string;
    timestamp: Time;
    vehicleId?: string;
}
export interface TripLifecycleAction {
    action: string;
    routeName: string;
    routeId: string;
    timestamp: Time;
    driver: Principal;
    vehicleId: string;
}
export interface UserProfile {
    assignedRoute?: string;
    principal: Principal;
    name: string;
    role: UserRole;
    assignedVehicle?: string;
}
export enum TripStatus {
    scheduled = "scheduled",
    delayed = "delayed",
    arrived = "arrived",
    completed = "completed",
    enRoute = "enRoute"
}
export enum UserRole {
    admin = "admin",
    student = "student",
    driver = "driver",
    parent = "parent"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    assignDriverVehicleAndRoute(driver: Principal, vehicleId: string | null, routeId: string | null): Promise<void>;
    assignUserRole(user: Principal, role: UserRole): Promise<void>;
    createAlert(alert: Alert): Promise<void>;
    createPickupDropoffRecord(record: PickupDropoffRecord): Promise<void>;
    createRoute(route: Route): Promise<void>;
    createTrip(trip: Trip): Promise<void>;
    deactivateRoute(routeId: string): Promise<void>;
    endTripExplicit(vehicleId: string, routeId: string): Promise<void>;
    getActiveRoutes(): Promise<Array<Route>>;
    getActiveTripsForDriver(driverId: Principal): Promise<Array<Trip>>;
    getAlert(id: string): Promise<Alert | null>;
    getAlertsForRoute(routeId: string): Promise<Array<Alert>>;
    getAlertsForVehicle(vehicleId: string): Promise<Array<Alert>>;
    getAllAlerts(): Promise<Array<Alert>>;
    getAllPickupDropoffRecords(): Promise<Array<PickupDropoffRecord>>;
    getAllRoutes(): Promise<Array<Route>>;
    getAllTrips(): Promise<Array<Trip>>;
    getAllUserProfiles(): Promise<Array<UserProfile>>;
    getAllVehicleLocations(): Promise<Array<VehicleLocation>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getDriverTripHistory(driverId: Principal): Promise<Array<TripLifecycleAction>>;
    getPickupDropoffRecord(id: string): Promise<PickupDropoffRecord | null>;
    getPickupDropoffRecordsForStudent(studentId: Principal): Promise<Array<PickupDropoffRecord>>;
    getRoute(id: string): Promise<Route | null>;
    getTrip(id: string): Promise<Trip | null>;
    getTripsForVehicle(vehicleId: string): Promise<Array<Trip>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVehicleLocation(vehicleId: string): Promise<VehicleLocation | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(name: string): Promise<void>;
    startTripExplicit(vehicleId: string, routeId: string): Promise<void>;
    updatePickupDropoffRecord(record: PickupDropoffRecord): Promise<void>;
    updateRoute(route: Route): Promise<void>;
    updateTripStatus(tripId: string, status: TripStatus): Promise<void>;
    updateVehicleLocation(location: VehicleLocation): Promise<void>;
}

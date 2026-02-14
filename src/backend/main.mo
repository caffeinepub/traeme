import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type UserRole = {
    #admin;
    #driver;
    #parent;
    #student;
  };

  type UserProfile = {
    principal : Principal;
    name : Text;
    role : UserRole;
    assignedVehicle : ?Text;
    assignedRoute : ?Text;
  };

  type VehicleLocation = {
    vehicleId : Text;
    latitude : Float;
    longitude : Float;
    lastUpdated : Time.Time;
    assignedRoute : ?Text;
    driver : Principal;
  };

  type Route = {
    id : Text;
    name : Text;
    stops : [Text];
    isActive : Bool;
  };

  type TripStatus = {
    #scheduled;
    #enRoute;
    #arrived;
    #delayed;
    #completed;
  };

  type Trip = {
    id : Text;
    vehicleId : Text;
    routeId : Text;
    status : TripStatus;
    lastUpdated : Time.Time;
  };

  type Alert = {
    id : Text;
    message : Text;
    timestamp : Time.Time;
    vehicleId : ?Text;
    routeId : ?Text;
    tripId : ?Text;
  };

  type PickupDropoffRecord = {
    id : Text;
    studentId : Principal;
    stopId : Text;
    tripId : Text;
    status : Text;
    time : Time.Time;
    notes : ?Text;
  };

  type TripLifecycleAction = {
    vehicleId : Text;
    routeId : Text;
    action : Text;
    driver : Principal;
    timestamp : Time.Time;
    routeName : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let vehicleLocations = Map.empty<Text, VehicleLocation>();
  let routes = Map.empty<Text, Route>();
  let trips = Map.empty<Text, Trip>();
  let alerts = Map.empty<Text, Alert>();
  let pickupDropoffRecords = Map.empty<Text, PickupDropoffRecord>();
  let tripLifecycleActions = List.empty<TripLifecycleAction>();

  func getCustomRole(caller : Principal) : ?UserRole {
    switch (userProfiles.get(caller)) {
      case (null) { null };
      case (?profile) { ?profile.role };
    };
  };

  func isCustomAdmin(caller : Principal) : Bool {
    switch (getCustomRole(caller)) {
      case (?#admin) { true };
      case (_) { false };
    };
  };

  func isDriver(caller : Principal) : Bool {
    switch (getCustomRole(caller)) {
      case (?#driver) { true };
      case (_) { false };
    };
  };

  func isParent(caller : Principal) : Bool {
    switch (getCustomRole(caller)) {
      case (?#parent) { true };
      case (_) { false };
    };
  };

  func isStudent(caller : Principal) : Bool {
    switch (getCustomRole(caller)) {
      case (?#student) { true };
      case (_) { false };
    };
  };

  func requireAuthenticated(caller : Principal) {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Authentication required");
    };
  };

  func requireCustomAdmin(caller : Principal) {
    if (not isCustomAdmin(caller)) {
      Runtime.trap("Unauthorized: Only administrators can perform this action");
    };
  };

  func requireDriverOrAdmin(caller : Principal) {
    if (not (isDriver(caller) or isCustomAdmin(caller))) {
      Runtime.trap("Unauthorized: Only drivers or administrators can perform this action");
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(name : Text) : async () {
    requireAuthenticated(caller);

    switch (userProfiles.get(caller)) {
      case (null) {
        let profile : UserProfile = {
          principal = caller;
          name;
          role = #parent;
          assignedVehicle = null;
          assignedRoute = null;
        };
        userProfiles.add(caller, profile);
      };
      case (?existingProfile) {
        let updatedProfile : UserProfile = {
          principal = caller;
          name;
          role = existingProfile.role;
          assignedVehicle = existingProfile.assignedVehicle;
          assignedRoute = existingProfile.assignedRoute;
        };
        userProfiles.add(caller, updatedProfile);
      };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    requireAuthenticated(caller);
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    requireAuthenticated(caller);
    if (caller != user and not isCustomAdmin(caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public query ({ caller }) func getAllUserProfiles() : async [UserProfile] {
    requireCustomAdmin(caller);
    userProfiles.values().toArray();
  };

  public shared ({ caller }) func assignUserRole(user : Principal, role : UserRole) : async () {
    requireCustomAdmin(caller);

    switch (userProfiles.get(user)) {
      case (null) {
        Runtime.trap("User profile not found");
      };
      case (?profile) {
        let updatedProfile : UserProfile = {
          principal = profile.principal;
          name = profile.name;
          role;
          assignedVehicle = profile.assignedVehicle;
          assignedRoute = profile.assignedRoute;
        };
        userProfiles.add(user, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func assignDriverVehicleAndRoute(
    driver : Principal,
    vehicleId : ?Text,
    routeId : ?Text
  ) : async () {
    requireCustomAdmin(caller);

    switch (userProfiles.get(driver)) {
      case (null) {
        Runtime.trap("Driver profile not found");
      };
      case (?profile) {
        if (profile.role != #driver) {
          Runtime.trap("User is not a driver");
        };
        let updatedProfile : UserProfile = {
          principal = profile.principal;
          name = profile.name;
          role = profile.role;
          assignedVehicle = vehicleId;
          assignedRoute = routeId;
        };
        userProfiles.add(driver, updatedProfile);
      };
    };
  };

  public shared ({ caller }) func updateVehicleLocation(location : VehicleLocation) : async () {
    requireAuthenticated(caller);

    if (not isCustomAdmin(caller)) {
      if (location.driver != caller) {
        Runtime.trap("Unauthorized: Can only update your own vehicle location");
      };
      if (not isDriver(caller)) {
        Runtime.trap("Unauthorized: Only drivers can update vehicle locations");
      };
      switch (userProfiles.get(caller)) {
        case (?profile) {
          switch (profile.assignedVehicle) {
            case (?assignedVehicle) {
              if (assignedVehicle != location.vehicleId) {
                Runtime.trap("Unauthorized: Can only update your assigned vehicle");
              };
            };
            case (null) {
              Runtime.trap("Unauthorized: No vehicle assigned to you");
            };
          };
        };
        case (null) {
          Runtime.trap("Unauthorized: Profile not found");
        };
      };
    };

    vehicleLocations.add(location.vehicleId, location);
  };

  public query ({ caller }) func getVehicleLocation(vehicleId : Text) : async ?VehicleLocation {
    requireAuthenticated(caller);
    vehicleLocations.get(vehicleId);
  };

  public query ({ caller }) func getAllVehicleLocations() : async [VehicleLocation] {
    requireAuthenticated(caller);
    vehicleLocations.values().toArray();
  };

  public shared ({ caller }) func createRoute(route : Route) : async () {
    requireCustomAdmin(caller);
    routes.add(route.id, route);
  };

  public shared ({ caller }) func updateRoute(route : Route) : async () {
    requireCustomAdmin(caller);
    switch (routes.get(route.id)) {
      case (null) { Runtime.trap("Route not found") };
      case (?_) { routes.add(route.id, route) };
    };
  };

  public shared ({ caller }) func deactivateRoute(routeId : Text) : async () {
    requireCustomAdmin(caller);
    switch (routes.get(routeId)) {
      case (null) { Runtime.trap("Route not found") };
      case (?route) {
        let updatedRoute : Route = {
          id = route.id;
          name = route.name;
          stops = route.stops;
          isActive = false;
        };
        routes.add(routeId, updatedRoute);
      };
    };
  };

  public query ({ caller }) func getRoute(id : Text) : async ?Route {
    requireAuthenticated(caller);
    routes.get(id);
  };

  public query ({ caller }) func getAllRoutes() : async [Route] {
    requireAuthenticated(caller);
    routes.values().toArray();
  };

  public query ({ caller }) func getActiveRoutes() : async [Route] {
    requireAuthenticated(caller);
    let activeRoutes = routes.values().filter(func(route) { route.isActive });
    activeRoutes.toArray();
  };

  public shared ({ caller }) func createTrip(trip : Trip) : async () {
    requireCustomAdmin(caller);
    trips.add(trip.id, trip);
  };

  public shared ({ caller }) func updateTripStatus(tripId : Text, status : TripStatus) : async () {
    requireDriverOrAdmin(caller);

    switch (trips.get(tripId)) {
      case (null) { Runtime.trap("Trip not found") };
      case (?trip) {
        if (not isCustomAdmin(caller)) {
          switch (userProfiles.get(caller)) {
            case (?profile) {
              switch (profile.assignedVehicle) {
                case (?assignedVehicle) {
                  if (assignedVehicle != trip.vehicleId) {
                    Runtime.trap("Unauthorized: Can only update trips for your assigned vehicle");
                  };
                };
                case (null) {
                  Runtime.trap("Unauthorized: No vehicle assigned to you");
                };
              };
            };
            case (null) {
              Runtime.trap("Unauthorized: Profile not found");
            };
          };
        };

        let updatedTrip : Trip = {
          id = trip.id;
          vehicleId = trip.vehicleId;
          routeId = trip.routeId;
          status;
          lastUpdated = Time.now();
        };
        trips.add(tripId, updatedTrip);
      };
    };
  };

  public query ({ caller }) func getTrip(id : Text) : async ?Trip {
    requireAuthenticated(caller);
    trips.get(id);
  };

  public query ({ caller }) func getAllTrips() : async [Trip] {
    requireAuthenticated(caller);
    trips.values().toArray();
  };

  public query ({ caller }) func getTripsForVehicle(vehicleId : Text) : async [Trip] {
    requireAuthenticated(caller);
    let filteredTrips = trips.values().filter(func(trip) { trip.vehicleId == vehicleId });
    filteredTrips.toArray();
  };

  public shared ({ caller }) func startTripExplicit(vehicleId : Text, routeId : Text) : async () {
    requireDriverOrAdmin(caller);

    switch (trips.get(vehicleId)) {
      case (null) { Runtime.trap("Trip not found") };
      case (?trip) {
        switch (routes.get(routeId)) {
          case (null) { Runtime.trap("Route not found") };
          case (?route) {
            if (trip.routeId != routeId) {
              Runtime.trap("Vehicle is not assigned to this route");
            };
            if (trip.status == #enRoute or trip.status == #arrived) {
              Runtime.trap("Trip is already in progress");
            };
            switch (userProfiles.get(caller)) {
              case (null) { Runtime.trap("Driver profile not found") };
              case (?profile) { addTripLifecycleAction(vehicleId, routeId, "START", caller, route.name) };
            };
          };
        };
      };
    };
  };

  public shared ({ caller }) func endTripExplicit(vehicleId : Text, routeId : Text) : async () {
    requireDriverOrAdmin(caller);

    switch (trips.get(vehicleId)) {
      case (null) { Runtime.trap("Trip not found") };
      case (?trip) {
        switch (routes.get(routeId)) {
          case (null) { Runtime.trap("Route not found") };
          case (?route) {
            if (trip.routeId != routeId) {
              Runtime.trap("Vehicle is not assigned to this route");
            };
            if (trip.status == #completed) { Runtime.trap("Trip is already completed") };
            switch (userProfiles.get(caller)) {
              case (null) { Runtime.trap("Driver profile not found") };
              case (?profile) { addTripLifecycleAction(vehicleId, routeId, "END", caller, route.name) };
            };
          };
        };
      };
    };
  };

  func addTripLifecycleAction(vehicleId : Text, routeId : Text, action : Text, driver : Principal, routeName : Text) {
    let newAction : TripLifecycleAction = {
      vehicleId;
      routeId;
      action;
      driver;
      timestamp = Time.now();
      routeName : Text;
    };
    tripLifecycleActions.add(newAction);
  };

  public query ({ caller }) func getDriverTripHistory(driverId : Principal) : async [TripLifecycleAction] {
    requireAuthenticated(caller);

    let filteredActions = tripLifecycleActions.filter(
      func(action) {
        action.driver == driverId;
      }
    );
    filteredActions.toArray();
  };

  public query ({ caller }) func getActiveTripsForDriver(driverId : Principal) : async [Trip] {
    requireAuthenticated(caller);

    let filteredTrips = trips.values().filter(
      func(trip) {
        switch (getVehicleLocationForDriver(driverId, trip.vehicleId)) {
          case (null) { false };
          case (?location) {
            trip.status != #completed and trip.status != #delayed and location.driver == driverId;
          };
        };
      }
    );
    filteredTrips.toArray();
  };

  func getVehicleLocationForDriver(driverId : Principal, vehicleId : Text) : ?VehicleLocation {
    vehicleLocations.get(vehicleId);
  };

  public shared ({ caller }) func createAlert(alert : Alert) : async () {
    requireDriverOrAdmin(caller);
    alerts.add(alert.id, alert);
  };

  public query ({ caller }) func getAlert(id : Text) : async ?Alert {
    requireAuthenticated(caller);
    alerts.get(id);
  };

  public query ({ caller }) func getAllAlerts() : async [Alert] {
    requireAuthenticated(caller);
    alerts.values().toArray();
  };

  public query ({ caller }) func getAlertsForVehicle(vehicleId : Text) : async [Alert] {
    requireAuthenticated(caller);
    let filteredAlerts = alerts.values().filter(
      func(alert) {
        switch (alert.vehicleId) {
          case (null) { false };
          case (?id) { id == vehicleId };
        };
      }
    );
    filteredAlerts.toArray();
  };

  public query ({ caller }) func getAlertsForRoute(routeId : Text) : async [Alert] {
    requireAuthenticated(caller);
    let filteredAlerts = alerts.values().filter(
      func(alert) {
        switch (alert.routeId) {
          case (null) { false };
          case (?id) { id == routeId };
        };
      }
    );
    filteredAlerts.toArray();
  };

  public shared ({ caller }) func createPickupDropoffRecord(record : PickupDropoffRecord) : async () {
    requireDriverOrAdmin(caller);
    pickupDropoffRecords.add(record.id, record);
  };

  public shared ({ caller }) func updatePickupDropoffRecord(record : PickupDropoffRecord) : async () {
    requireDriverOrAdmin(caller);
    switch (pickupDropoffRecords.get(record.id)) {
      case (null) { Runtime.trap("Record not found") };
      case (?_) { pickupDropoffRecords.add(record.id, record) };
    };
  };

  public query ({ caller }) func getPickupDropoffRecord(id : Text) : async ?PickupDropoffRecord {
    requireAuthenticated(caller);

    switch (pickupDropoffRecords.get(id)) {
      case (null) { null };
      case (?record) {
        if (caller == record.studentId or isCustomAdmin(caller) or isDriver(caller)) {
          ?record;
        } else {
          Runtime.trap("Unauthorized: Can only view your own records");
        };
      };
    };
  };

  public query ({ caller }) func getPickupDropoffRecordsForStudent(studentId : Principal) : async [PickupDropoffRecord] {
    requireAuthenticated(caller);

    if (caller != studentId and not isCustomAdmin(caller) and not isDriver(caller)) {
      Runtime.trap("Unauthorized: Can only view your own records");
    };

    let filteredRecords = pickupDropoffRecords.values().filter(
      func(record) {
        record.studentId == studentId;
      }
    );
    filteredRecords.toArray();
  };

  public query ({ caller }) func getAllPickupDropoffRecords() : async [PickupDropoffRecord] {
    requireDriverOrAdmin(caller);
    pickupDropoffRecords.values().toArray();
  };
};

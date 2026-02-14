import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  public type OldActor = {
    userProfiles : Map.Map<Principal, { principal : Principal; name : Text; role : { #admin; #driver; #parent; #student }; assignedVehicle : ?Text; assignedRoute : ?Text }>;
    vehicleLocations : Map.Map<Text, { vehicleId : Text; latitude : Float; longitude : Float; lastUpdated : Int; assignedRoute : ?Text; driver : Principal }>;
    routes : Map.Map<Text, { id : Text; name : Text; stops : [Text]; isActive : Bool }>;
    trips : Map.Map<Text, { id : Text; vehicleId : Text; routeId : Text; status : { #scheduled; #enRoute; #arrived; #delayed; #completed }; lastUpdated : Int }>;
    alerts : Map.Map<Text, { id : Text; message : Text; timestamp : Int; vehicleId : ?Text; routeId : ?Text; tripId : ?Text }>;
    pickupDropoffRecords : Map.Map<Text, { id : Text; studentId : Principal; stopId : Text; tripId : Text; status : Text; time : Int; notes : ?Text }>;
  };

  public type NewActor = {
    userProfiles : Map.Map<Principal, { principal : Principal; name : Text; role : { #admin; #driver; #parent; #student }; assignedVehicle : ?Text; assignedRoute : ?Text }>;
    vehicleLocations : Map.Map<Text, { vehicleId : Text; latitude : Float; longitude : Float; lastUpdated : Int; assignedRoute : ?Text; driver : Principal }>;
    routes : Map.Map<Text, { id : Text; name : Text; stops : [Text]; isActive : Bool }>;
    trips : Map.Map<Text, { id : Text; vehicleId : Text; routeId : Text; status : { #scheduled; #enRoute; #arrived; #delayed; #completed }; lastUpdated : Int }>;
    alerts : Map.Map<Text, { id : Text; message : Text; timestamp : Int; vehicleId : ?Text; routeId : ?Text; tripId : ?Text }>;
    pickupDropoffRecords : Map.Map<Text, { id : Text; studentId : Principal; stopId : Text; tripId : Text; status : Text; time : Int; notes : ?Text }>;
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};

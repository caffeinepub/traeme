import { useGetCallerUserProfile } from '../../hooks/queries/useCurrentUser';
import AssignedRouteSummaryWidget from '../../components/dashboard/AssignedRouteSummaryWidget';
import DriverTripControls from '../../components/dashboard/DriverTripControls';
import GpsTrackingControls from '../../components/dashboard/GpsTrackingControls';
import PickupChecklistPanel from '../../components/dashboard/PickupChecklistPanel';

export default function DriverDashboard() {
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {userProfile?.name}!</h1>
        <p className="text-muted-foreground mt-2">Driver Dashboard</p>
        {userProfile?.assignedVehicle && (
          <p className="text-sm text-muted-foreground mt-1">
            Assigned Vehicle: <span className="font-medium">{userProfile.assignedVehicle}</span>
          </p>
        )}
        {userProfile?.assignedRoute && (
          <p className="text-sm text-muted-foreground">
            Assigned Route: <span className="font-medium">{userProfile.assignedRoute}</span>
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AssignedRouteSummaryWidget assignedRoute={userProfile?.assignedRoute} />
        <DriverTripControls 
          assignedVehicle={userProfile?.assignedVehicle} 
          assignedRoute={userProfile?.assignedRoute}
        />
        <GpsTrackingControls 
          assignedVehicle={userProfile?.assignedVehicle}
          assignedRoute={userProfile?.assignedRoute}
        />
        <PickupChecklistPanel />
      </div>
    </div>
  );
}

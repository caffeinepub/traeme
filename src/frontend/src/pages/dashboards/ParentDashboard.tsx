import { useGetCallerUserProfile } from '../../hooks/queries/useCurrentUser';
import VehicleLocationWidget from '../../components/dashboard/VehicleLocationWidget';
import AlertsPreviewWidget from '../../components/dashboard/AlertsPreviewWidget';
import PickupDropoffPreviewWidget from '../../components/dashboard/PickupDropoffPreviewWidget';
import AssignedRouteSummaryWidget from '../../components/dashboard/AssignedRouteSummaryWidget';

export default function ParentDashboard() {
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {userProfile?.name}!</h1>
        <p className="text-muted-foreground mt-2">Parent Dashboard</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <VehicleLocationWidget assignedRoute={userProfile?.assignedRoute} />
        <AlertsPreviewWidget assignedRoute={userProfile?.assignedRoute} />
        <PickupDropoffPreviewWidget />
        <AssignedRouteSummaryWidget assignedRoute={userProfile?.assignedRoute} />
      </div>
    </div>
  );
}

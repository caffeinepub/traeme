import { useGetCallerUserProfile } from '../../hooks/queries/useCurrentUser';
import VehicleLocationWidget from '../../components/dashboard/VehicleLocationWidget';
import EtaSummaryWidget from '../../components/dashboard/EtaSummaryWidget';
import AssignedRouteSummaryWidget from '../../components/dashboard/AssignedRouteSummaryWidget';

export default function StudentDashboard() {
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {userProfile?.name}!</h1>
        <p className="text-muted-foreground mt-2">Student Dashboard</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <VehicleLocationWidget assignedRoute={userProfile?.assignedRoute} />
        <EtaSummaryWidget assignedRoute={userProfile?.assignedRoute} />
        <AssignedRouteSummaryWidget assignedRoute={userProfile?.assignedRoute} />
      </div>
    </div>
  );
}

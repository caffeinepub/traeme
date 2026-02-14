import { useGetAllVehicleLocations } from '../hooks/queries/useVehicleLocations';
import { useGetActiveRoutes } from '../hooks/queries/useRoutes';
import { useIsDriver } from '../hooks/queries/useCurrentUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { MapPin, Clock } from 'lucide-react';
import DriverLocationUpdater from '../components/tracking/DriverLocationUpdater';

export default function TrackingPage() {
  const { data: vehicles = [], isLoading } = useGetAllVehicleLocations(10000);
  const { data: routes = [] } = useGetActiveRoutes();
  const isDriver = useIsDriver();

  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Vehicle Tracking</h1>
        <p className="text-muted-foreground mt-2">Real-time bus location monitoring</p>
      </div>

      {isDriver && (
        <Card>
          <CardHeader>
            <CardTitle>Update Your Location</CardTitle>
            <CardDescription>Update your vehicle's current position</CardDescription>
          </CardHeader>
          <CardContent>
            <DriverLocationUpdater />
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading vehicle locations...</p>
        </div>
      ) : vehicles.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No vehicles are currently being tracked</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => {
            const route = routes.find((r) => r.id === vehicle.assignedRoute);
            const lastUpdate = new Date(Number(vehicle.lastUpdated) / 1000000);
            const minutesAgo = Math.floor((Date.now() - lastUpdate.getTime()) / 60000);
            const isRecent = minutesAgo < 5;

            return (
              <Card key={vehicle.vehicleId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Vehicle {vehicle.vehicleId}</CardTitle>
                    <div
                      className={`h-3 w-3 rounded-full ${isRecent ? 'bg-green-500' : 'bg-yellow-500'}`}
                      title={isRecent ? 'Active' : 'Last seen over 5 minutes ago'}
                    />
                  </div>
                  {route && <CardDescription>Route: {route.name}</CardDescription>}
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {vehicle.latitude.toFixed(6)}, {vehicle.longitude.toFixed(6)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {minutesAgo === 0 ? 'Just now' : `${minutesAgo} min ago`}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{formatTime(vehicle.lastUpdated)}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Map View</CardTitle>
          <CardDescription>Interactive map coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg h-96 flex items-center justify-center">
            <p className="text-muted-foreground">Map visualization will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

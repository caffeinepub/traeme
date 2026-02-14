import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Clock } from 'lucide-react';
import { useGetAllVehicleLocations } from '../../hooks/queries/useVehicleLocations';
import { useGetAllTrips } from '../../hooks/queries/useTrips';
import { calculateEta } from '../../utils/eta';

interface EtaSummaryWidgetProps {
  assignedRoute?: string;
}

export default function EtaSummaryWidget({ assignedRoute }: EtaSummaryWidgetProps) {
  const { data: locations = [], isLoading: locationsLoading } = useGetAllVehicleLocations(10000);
  const { data: trips = [], isLoading: tripsLoading } = useGetAllTrips();

  const isLoading = locationsLoading || tripsLoading;

  const relevantLocation = assignedRoute
    ? locations.find((loc) => loc.assignedRoute === assignedRoute)
    : locations[0];

  const relevantTrip = relevantLocation
    ? trips.find((trip) => trip.vehicleId === relevantLocation.vehicleId && trip.status !== 'completed')
    : undefined;

  const eta = calculateEta(relevantTrip, relevantLocation);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <CardTitle>Estimated Arrival</CardTitle>
        </div>
        <CardDescription>When your bus will arrive</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-3xl font-bold text-primary mb-2">{eta}</p>
            {relevantTrip && (
              <p className="text-sm text-muted-foreground">
                Status: <span className="capitalize">{relevantTrip.status}</span>
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

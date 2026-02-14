import { useGetAllTrips } from '../hooks/queries/useTrips';
import { useIsDriver, useIsAdmin } from '../hooks/queries/useCurrentUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Bus, Clock } from 'lucide-react';
import { TripStatus } from '../backend';

export default function TripsPage() {
  const { data: trips = [], isLoading } = useGetAllTrips();
  const isDriver = useIsDriver();
  const isAdmin = useIsAdmin();

  const canEdit = isDriver || isAdmin;

  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  const getStatusColor = (status: TripStatus) => {
    switch (status) {
      case TripStatus.scheduled:
        return 'bg-blue-500';
      case TripStatus.enRoute:
        return 'bg-green-500';
      case TripStatus.arrived:
        return 'bg-purple-500';
      case TripStatus.delayed:
        return 'bg-yellow-500';
      case TripStatus.completed:
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: TripStatus) => {
    switch (status) {
      case TripStatus.scheduled:
        return 'Scheduled';
      case TripStatus.enRoute:
        return 'En Route';
      case TripStatus.arrived:
        return 'Arrived';
      case TripStatus.delayed:
        return 'Delayed';
      case TripStatus.completed:
        return 'Completed';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Trips</h1>
        <p className="text-muted-foreground mt-2">View and manage trip status</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading trips...</p>
        </div>
      ) : trips.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No trips available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <Card key={trip.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Trip {trip.id}</CardTitle>
                  <Badge className={getStatusColor(trip.status)}>{getStatusLabel(trip.status)}</Badge>
                </div>
                <CardDescription>Vehicle: {trip.vehicleId}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Bus className="h-4 w-4 text-muted-foreground" />
                  <span>Route: {trip.routeId}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Updated: {formatTime(trip.lastUpdated)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

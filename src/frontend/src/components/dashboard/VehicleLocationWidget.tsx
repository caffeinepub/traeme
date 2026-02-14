import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { MapPin, ExternalLink } from 'lucide-react';
import { useGetAllVehicleLocations } from '../../hooks/queries/useVehicleLocations';

interface VehicleLocationWidgetProps {
  assignedRoute?: string;
}

export default function VehicleLocationWidget({ assignedRoute }: VehicleLocationWidgetProps) {
  const { data: locations = [], isLoading } = useGetAllVehicleLocations(10000);

  const relevantLocation = assignedRoute
    ? locations.find((loc) => loc.assignedRoute === assignedRoute)
    : locations[0];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <CardTitle>Vehicle Location</CardTitle>
          </div>
          <Link to="/tracking">
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <CardDescription>Real-time bus location tracking</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : relevantLocation ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Vehicle ID:</span>
              <span className="text-sm text-muted-foreground">{relevantLocation.vehicleId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Latitude:</span>
              <span className="text-sm text-muted-foreground">{relevantLocation.latitude.toFixed(6)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Longitude:</span>
              <span className="text-sm text-muted-foreground">{relevantLocation.longitude.toFixed(6)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Last Updated:</span>
              <span className="text-sm text-muted-foreground">
                {new Date(Number(relevantLocation.lastUpdated) / 1000000).toLocaleTimeString()}
              </span>
            </div>
            <Link to="/tracking" className="block mt-4">
              <Button className="w-full" variant="outline">
                View on Map
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No vehicle location available</p>
            <Link to="/tracking" className="block mt-4">
              <Button variant="outline">Go to Tracking</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

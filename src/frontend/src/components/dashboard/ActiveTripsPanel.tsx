import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Bus, ExternalLink } from 'lucide-react';
import { useGetAllTrips } from '../../hooks/queries/useTrips';

export default function ActiveTripsPanel() {
  const { data: allTrips = [], isLoading } = useGetAllTrips();

  const activeTrips = allTrips.filter((trip) => trip.status !== 'completed');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bus className="h-5 w-5 text-primary" />
            <CardTitle>Active Trips</CardTitle>
          </div>
          <Link to="/trips">
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <CardDescription>Monitor ongoing trips</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : activeTrips.length > 0 ? (
          <div className="space-y-3">
            {activeTrips.slice(0, 5).map((trip) => (
              <div key={trip.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="text-sm font-medium">Vehicle: {trip.vehicleId}</p>
                  <p className="text-xs text-muted-foreground">Route: {trip.routeId}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium capitalize">{trip.status}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(Number(trip.lastUpdated) / 1000000).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            <Link to="/trips" className="block mt-4">
              <Button className="w-full" variant="outline">
                View All Trips
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Bus className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No active trips</p>
            <Link to="/trips" className="block mt-4">
              <Button variant="outline">Go to Trips</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

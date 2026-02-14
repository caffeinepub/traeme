import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Play, Square, AlertCircle } from 'lucide-react';
import { useStartTrip, useEndTrip, useGetActiveTrip } from '../../hooks/queries/useTrips';
import { toast } from 'sonner';

interface DriverTripControlsProps {
  assignedVehicle?: string;
  assignedRoute?: string;
}

export default function DriverTripControls({ assignedVehicle, assignedRoute }: DriverTripControlsProps) {
  const { data: activeTrip, isLoading } = useGetActiveTrip(assignedVehicle || '');
  const startTripMutation = useStartTrip();
  const endTripMutation = useEndTrip();

  const hasActiveTrip = !!activeTrip;

  const handleStartTrip = async () => {
    if (!assignedVehicle || !assignedRoute) {
      toast.error('Cannot start trip: No vehicle or route assigned');
      return;
    }

    try {
      await startTripMutation.mutateAsync({ vehicleId: assignedVehicle, routeId: assignedRoute });
      toast.success('Trip started successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to start trip');
    }
  };

  const handleEndTrip = async () => {
    if (!assignedVehicle || !assignedRoute) {
      toast.error('Cannot end trip: No vehicle or route assigned');
      return;
    }

    try {
      await endTripMutation.mutateAsync({ vehicleId: assignedVehicle, routeId: assignedRoute });
      toast.success('Trip ended successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to end trip');
    }
  };

  if (!assignedVehicle) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trip Controls</CardTitle>
          <CardDescription>Start and end your trips</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No vehicle assigned</p>
            <p className="text-xs mt-2">GPS tracking and trip controls require an assigned vehicle.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trip Controls</CardTitle>
        <CardDescription>Start and end your trips</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center py-4">
              <p className="text-sm font-medium mb-2">Current Status:</p>
              <p className="text-lg font-bold text-primary">
                {hasActiveTrip ? 'Trip In Progress' : 'No Active Trip'}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleStartTrip}
                disabled={hasActiveTrip || startTripMutation.isPending}
                className="w-full"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Trip
              </Button>
              <Button
                onClick={handleEndTrip}
                disabled={!hasActiveTrip || endTripMutation.isPending}
                variant="destructive"
                className="w-full"
              >
                <Square className="h-4 w-4 mr-2" />
                End Trip
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

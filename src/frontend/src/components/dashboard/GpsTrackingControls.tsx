import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { MapPin, AlertCircle } from 'lucide-react';
import { useGpsVehicleTracking } from '../../hooks/useGpsVehicleTracking';

interface GpsTrackingControlsProps {
  assignedVehicle?: string;
  assignedRoute?: string;
}

export default function GpsTrackingControls({ assignedVehicle, assignedRoute }: GpsTrackingControlsProps) {
  const { isTracking, error, startTracking, stopTracking } = useGpsVehicleTracking(
    assignedVehicle || '',
    assignedRoute || ''
  );

  if (!assignedVehicle) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>GPS Tracking</CardTitle>
          <CardDescription>Enable location tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No vehicle assigned</p>
            <p className="text-xs mt-2">GPS tracking requires an assigned vehicle.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>GPS Tracking</CardTitle>
        <CardDescription>Enable location tracking</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center py-4">
            <MapPin className={`h-12 w-12 mx-auto mb-2 ${isTracking ? 'text-green-600 animate-pulse' : 'text-muted-foreground'}`} />
            <p className="text-sm font-medium mb-2">GPS Status:</p>
            <p className="text-lg font-bold text-primary">
              {isTracking ? 'Tracking Active' : 'Tracking Disabled'}
            </p>
          </div>
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
              {error}
            </div>
          )}
          <Button
            onClick={isTracking ? stopTracking : startTracking}
            variant={isTracking ? 'destructive' : 'default'}
            className="w-full"
          >
            {isTracking ? 'Stop Tracking' : 'Start Tracking'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

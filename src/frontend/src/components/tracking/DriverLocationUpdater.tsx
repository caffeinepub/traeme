import { useState } from 'react';
import { useGetCallerUserProfile } from '../../hooks/queries/useCurrentUser';
import { useUpdateVehicleLocation } from '../../hooks/queries/useVehicleLocations';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import type { VehicleLocation } from '../../backend';

export default function DriverLocationUpdater() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { identity } = useInternetIdentity();
  const updateMutation = useUpdateVehicleLocation();
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile?.assignedVehicle || !identity) return;

    const location: VehicleLocation = {
      vehicleId: userProfile.assignedVehicle,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      lastUpdated: BigInt(Date.now() * 1000000),
      assignedRoute: userProfile.assignedRoute || undefined,
      driver: identity.getPrincipal(),
    };

    updateMutation.mutate(location, {
      onSuccess: () => {
        setLatitude('');
        setLongitude('');
      },
    });
  };

  if (!userProfile?.assignedVehicle) {
    return <p className="text-muted-foreground">No vehicle assigned to you</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="latitude">Latitude</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            placeholder="19.2345"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            required
            disabled={updateMutation.isPending}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="longitude">Longitude</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            placeholder="-70.5678"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            required
            disabled={updateMutation.isPending}
          />
        </div>
      </div>
      <Button type="submit" disabled={updateMutation.isPending || !latitude || !longitude}>
        {updateMutation.isPending ? 'Updating...' : 'Update Location'}
      </Button>
      {updateMutation.isError && (
        <p className="text-sm text-destructive">
          {updateMutation.error instanceof Error ? updateMutation.error.message : 'Failed to update location'}
        </p>
      )}
      {updateMutation.isSuccess && (
        <p className="text-sm text-green-600">Location updated successfully!</p>
      )}
    </form>
  );
}

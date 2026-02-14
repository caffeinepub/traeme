import { useState, useEffect, useRef } from 'react';
import { useUpdateVehicleLocation } from './queries/useVehicleLocations';
import { useInternetIdentity } from './useInternetIdentity';
import type { VehicleLocation } from '../backend';

export function useGpsVehicleTracking(vehicleId: string, assignedRoute: string) {
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { identity } = useInternetIdentity();
  const updateLocationMutation = useUpdateVehicleLocation();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateLocation = async () => {
    if (!vehicleId || !identity) return;

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const location: VehicleLocation = {
        vehicleId,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        lastUpdated: BigInt(Date.now() * 1000000),
        assignedRoute: assignedRoute || undefined,
        driver: identity.getPrincipal(),
      };

      await updateLocationMutation.mutateAsync(location);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.code === 1
        ? 'Location permission denied. Please enable location access.'
        : err.code === 2
        ? 'Location unavailable. Please check your device settings.'
        : err.code === 3
        ? 'Location request timed out. Please try again.'
        : 'Failed to update location. Please try again.';
      setError(errorMessage);
    }
  };

  const startTracking = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    if (!vehicleId) {
      setError('No vehicle assigned.');
      return;
    }

    setIsTracking(true);
    setError(null);

    await updateLocation();

    intervalRef.current = setInterval(updateLocation, 30000);
  };

  const stopTracking = () => {
    setIsTracking(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isTracking,
    error,
    startTracking,
    stopTracking,
  };
}

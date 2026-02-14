import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { assignDriverVehicleAndRoute } from '../../services/driverService';
import { useGetAllRoutes } from '../../hooks/queries/useRoutes';
import { queryKeys } from '../../hooks/queries/queryKeys';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import PrincipalInput from '../../components/admin/PrincipalInput';
import { Principal } from '@dfinity/principal';

export default function AdminDriverAssignmentsPage() {
  const [driverPrincipal, setDriverPrincipal] = useState('');
  const [vehicleId, setVehicleId] = useState('');
  const [routeId, setRouteId] = useState('');
  const { actor } = useActor();
  const { data: routes = [] } = useGetAllRoutes();
  const queryClient = useQueryClient();

  const assignMutation = useMutation({
    mutationFn: async ({
      driver,
      vehicle,
      route,
    }: {
      driver: Principal;
      vehicle: string | null;
      route: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return assignDriverVehicleAndRoute(actor, driver, vehicle, route);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
      setDriverPrincipal('');
      setVehicleId('');
      setRouteId('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverPrincipal.trim()) return;

    try {
      const principal = Principal.fromText(driverPrincipal.trim());
      assignMutation.mutate({
        driver: principal,
        vehicle: vehicleId.trim() || null,
        route: routeId || null,
      });
    } catch (error) {
      console.error('Invalid principal:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Assign Drivers</h1>
        <p className="text-muted-foreground mt-2">Assign vehicles and routes to drivers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Driver Assignment</CardTitle>
          <CardDescription>Assign a vehicle and route to a driver</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <PrincipalInput
              value={driverPrincipal}
              onChange={setDriverPrincipal}
              label="Driver Principal ID"
              placeholder="Enter the driver's principal ID"
            />

            <div className="space-y-2">
              <Label htmlFor="vehicleId">Vehicle ID</Label>
              <Input
                id="vehicleId"
                type="text"
                placeholder="e.g., BUS-001"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="routeId">Route</Label>
              <Select value={routeId} onValueChange={setRouteId}>
                <SelectTrigger id="routeId">
                  <SelectValue placeholder="Select a route (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {routes.map((route) => (
                    <SelectItem key={route.id} value={route.id}>
                      {route.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={assignMutation.isPending || !driverPrincipal.trim()}>
              {assignMutation.isPending ? 'Assigning...' : 'Assign Driver'}
            </Button>

            {assignMutation.isError && (
              <p className="text-sm text-destructive">
                {assignMutation.error instanceof Error ? assignMutation.error.message : 'Failed to assign driver'}
              </p>
            )}
            {assignMutation.isSuccess && (
              <p className="text-sm text-green-600">Driver assigned successfully!</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

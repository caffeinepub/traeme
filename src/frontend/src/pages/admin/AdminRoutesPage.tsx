import { useState } from 'react';
import { useGetAllRoutes, useCreateRoute, useUpdateRoute, useDeactivateRoute } from '../../hooks/queries/useRoutes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';
import { Route as RouteIcon, Plus, Trash2 } from 'lucide-react';
import type { Route } from '../../backend';

export default function AdminRoutesPage() {
  const { data: routes = [], isLoading } = useGetAllRoutes();
  const createMutation = useCreateRoute();
  const updateMutation = useUpdateRoute();
  const deactivateMutation = useDeactivateRoute();

  const [isCreating, setIsCreating] = useState(false);
  const [routeName, setRouteName] = useState('');
  const [stops, setStops] = useState<string[]>(['']);

  const handleAddStop = () => {
    setStops([...stops, '']);
  };

  const handleRemoveStop = (index: number) => {
    setStops(stops.filter((_, i) => i !== index));
  };

  const handleStopChange = (index: number, value: string) => {
    const newStops = [...stops];
    newStops[index] = value;
    setStops(newStops);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeName.trim() || stops.filter((s) => s.trim()).length === 0) return;

    const route: Route = {
      id: `route-${Date.now()}`,
      name: routeName.trim(),
      stops: stops.filter((s) => s.trim()),
      isActive: true,
    };

    createMutation.mutate(route, {
      onSuccess: () => {
        setRouteName('');
        setStops(['']);
        setIsCreating(false);
      },
    });
  };

  const handleDeactivate = (routeId: string) => {
    if (confirm('Are you sure you want to deactivate this route?')) {
      deactivateMutation.mutate(routeId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Routes</h1>
          <p className="text-muted-foreground mt-2">Create and manage bus routes</p>
        </div>
        <Button onClick={() => setIsCreating(!isCreating)}>
          <Plus className="h-4 w-4 mr-2" />
          {isCreating ? 'Cancel' : 'Create Route'}
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Route</CardTitle>
            <CardDescription>Add a new bus route with stops</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="routeName">Route Name</Label>
                <Input
                  id="routeName"
                  type="text"
                  placeholder="e.g., Morning Route A"
                  value={routeName}
                  onChange={(e) => setRouteName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Stops</Label>
                {stops.map((stop, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="text"
                      placeholder={`Stop ${index + 1}`}
                      value={stop}
                      onChange={(e) => handleStopChange(index, e.target.value)}
                      required
                    />
                    {stops.length > 1 && (
                      <Button type="button" variant="outline" size="icon" onClick={() => handleRemoveStop(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={handleAddStop}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Stop
                </Button>
              </div>

              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Creating...' : 'Create Route'}
              </Button>

              {createMutation.isError && (
                <p className="text-sm text-destructive">
                  {createMutation.error instanceof Error ? createMutation.error.message : 'Failed to create route'}
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading routes...</p>
        </div>
      ) : routes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <RouteIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No routes created yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {routes.map((route) => (
            <Card key={route.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <RouteIcon className="h-5 w-5" />
                    {route.name}
                  </CardTitle>
                  <Badge variant={route.isActive ? 'default' : 'secondary'}>
                    {route.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <CardDescription>{route.stops.length} stops</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Stops:</p>
                  <ul className="space-y-1">
                    {route.stops.map((stop, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {index + 1}. {stop}
                      </li>
                    ))}
                  </ul>
                </div>
                {route.isActive && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeactivate(route.id)}
                    disabled={deactivateMutation.isPending}
                  >
                    Deactivate Route
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

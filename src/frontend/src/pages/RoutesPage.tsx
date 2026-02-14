import { useGetActiveRoutes } from '../hooks/queries/useRoutes';
import { useIsAdmin } from '../hooks/queries/useCurrentUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from '@tanstack/react-router';
import { Route as RouteIcon, MapPin } from 'lucide-react';

export default function RoutesPage() {
  const { data: routes = [], isLoading } = useGetActiveRoutes();
  const isAdmin = useIsAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Routes</h1>
          <p className="text-muted-foreground mt-2">View bus routes and stops</p>
        </div>
        {isAdmin && (
          <Link to="/admin/routes">
            <Button>Manage Routes</Button>
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading routes...</p>
        </div>
      ) : routes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <RouteIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No active routes available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {routes.map((route) => (
            <Card key={route.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RouteIcon className="h-5 w-5" />
                  {route.name}
                </CardTitle>
                <CardDescription>{route.stops.length} stops</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Stops:</p>
                  <ul className="space-y-1">
                    {route.stops.map((stop, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {index + 1}. {stop}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

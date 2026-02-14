import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Route as RouteIcon } from 'lucide-react';
import { useGetRoute } from '../../hooks/queries/useRoutes';

interface AssignedRouteSummaryWidgetProps {
  assignedRoute?: string;
}

export default function AssignedRouteSummaryWidget({ assignedRoute }: AssignedRouteSummaryWidgetProps) {
  const { data: route, isLoading } = useGetRoute(assignedRoute || '');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <RouteIcon className="h-5 w-5 text-primary" />
          <CardTitle>Assigned Route</CardTitle>
        </div>
        <CardDescription>Your route information</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : route ? (
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-1">Route Name:</p>
              <p className="text-lg font-bold text-primary">{route.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Stops:</p>
              <div className="space-y-1">
                {route.stops.map((stop, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {index + 1}
                    </span>
                    <span>{stop}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-2">
              <p className="text-xs text-muted-foreground">
                Status: <span className={route.isActive ? 'text-green-600' : 'text-red-600'}>
                  {route.isActive ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <RouteIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No route assigned</p>
            <p className="text-xs mt-2">Please contact your administrator to assign a route.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Bell, ExternalLink } from 'lucide-react';
import { useGetAllAlerts } from '../../hooks/queries/useAlerts';

interface AlertsPreviewWidgetProps {
  assignedRoute?: string;
}

export default function AlertsPreviewWidget({ assignedRoute }: AlertsPreviewWidgetProps) {
  const { data: allAlerts = [], isLoading } = useGetAllAlerts(30000);

  const relevantAlerts = assignedRoute
    ? allAlerts.filter((alert) => alert.routeId === assignedRoute).slice(0, 3)
    : allAlerts.slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <CardTitle>Recent Alerts</CardTitle>
          </div>
          <Link to="/alerts">
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <CardDescription>Latest notifications and updates</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : relevantAlerts.length > 0 ? (
          <div className="space-y-3">
            {relevantAlerts.map((alert) => (
              <div key={alert.id} className="border-l-2 border-primary pl-3 py-2">
                <p className="text-sm font-medium">{alert.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(Number(alert.timestamp) / 1000000).toLocaleString()}
                </p>
              </div>
            ))}
            <Link to="/alerts" className="block mt-4">
              <Button className="w-full" variant="outline">
                View All Alerts
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No alerts available</p>
            <Link to="/alerts" className="block mt-4">
              <Button variant="outline">Go to Alerts</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

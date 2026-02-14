import { useEffect } from 'react';
import { useGetAllAlerts, useUnseenAlertsCount } from '../hooks/queries/useAlerts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Bell, Clock } from 'lucide-react';

export default function AlertsPage() {
  const { data: alerts = [], isLoading } = useGetAllAlerts(30000);
  const { markAsSeen } = useUnseenAlertsCount();

  useEffect(() => {
    markAsSeen();
  }, [markAsSeen]);

  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  const sortedAlerts = [...alerts].sort((a, b) => Number(b.timestamp - a.timestamp));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Alerts & Notifications</h1>
        <p className="text-muted-foreground mt-2">Stay updated with important information</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading alerts...</p>
        </div>
      ) : alerts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No alerts at this time</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedAlerts.map((alert) => (
            <Card key={alert.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Alert
                    </CardTitle>
                    <CardDescription className="mt-2">{alert.message}</CardDescription>
                  </div>
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(alert.timestamp)}
                  </Badge>
                </div>
              </CardHeader>
              {(alert.vehicleId || alert.routeId || alert.tripId) && (
                <CardContent>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    {alert.vehicleId && <span>Vehicle: {alert.vehicleId}</span>}
                    {alert.routeId && <span>Route: {alert.routeId}</span>}
                    {alert.tripId && <span>Trip: {alert.tripId}</span>}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

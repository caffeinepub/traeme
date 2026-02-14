import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Users, ExternalLink } from 'lucide-react';
import { useGetAllPickupDropoffRecords } from '../../hooks/queries/usePickupDropoff';

export default function PickupDropoffPreviewWidget() {
  const { data: allRecords = [], isLoading } = useGetAllPickupDropoffRecords();

  const recentRecords = allRecords
    .sort((a, b) => Number(b.time) - Number(a.time))
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle>Pickup/Drop-off</CardTitle>
          </div>
          <Link to="/pickup-dropoff">
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <CardDescription>Recent student pickup records</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : recentRecords.length > 0 ? (
          <div className="space-y-3">
            {recentRecords.map((record) => (
              <div key={record.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="text-sm font-medium">{record.status}</p>
                  <p className="text-xs text-muted-foreground">Stop: {record.stopId}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(Number(record.time) / 1000000).toLocaleTimeString()}
                </p>
              </div>
            ))}
            <Link to="/pickup-dropoff" className="block mt-4">
              <Button className="w-full" variant="outline">
                View All Records
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No pickup/drop-off records available</p>
            <Link to="/pickup-dropoff" className="block mt-4">
              <Button variant="outline">Go to Records</Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

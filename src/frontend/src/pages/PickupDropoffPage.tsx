import { useGetAllPickupDropoffRecords } from '../hooks/queries/usePickupDropoff';
import { useIsDriver, useIsAdmin } from '../hooks/queries/useCurrentUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Users, Clock } from 'lucide-react';

export default function PickupDropoffPage() {
  const { data: records = [], isLoading } = useGetAllPickupDropoffRecords();
  const isDriver = useIsDriver();
  const isAdmin = useIsAdmin();

  const canEdit = isDriver || isAdmin;

  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString();
  };

  const sortedRecords = [...records].sort((a, b) => Number(b.time - a.time));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pickup & Drop-off</h1>
        <p className="text-muted-foreground mt-2">Student pickup and drop-off records</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading records...</p>
        </div>
      ) : records.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No pickup/drop-off records available</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedRecords.map((record) => (
            <Card key={record.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg">Record {record.id}</CardTitle>
                    <CardDescription>
                      Student: {record.studentId.toString().slice(0, 10)}...
                    </CardDescription>
                  </div>
                  <Badge>{record.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Stop:</span> {record.stopId}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Trip:</span> {record.tripId}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{formatTime(record.time)}</span>
                </div>
                {record.notes && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Notes:</span> {record.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

import { useGetCallerUserProfile } from '../hooks/queries/useCurrentUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { User, Bus, Route } from 'lucide-react';

export default function DriverProfilePage() {
  const { data: userProfile, isLoading } = useGetCallerUserProfile();

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">Profile not found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Driver Profile</h1>
        <p className="text-muted-foreground mt-2">Your driver information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{userProfile.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium capitalize">{userProfile.role}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Principal ID</p>
              <p className="font-mono text-xs break-all">{userProfile.principal.toString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bus className="h-5 w-5" />
              Assignment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Assigned Vehicle</p>
              <p className="font-medium">{userProfile.assignedVehicle || 'Not assigned'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Assigned Route</p>
              <p className="font-medium">{userProfile.assignedRoute || 'Not assigned'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

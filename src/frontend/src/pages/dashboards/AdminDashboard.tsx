import { Link } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '../../hooks/queries/useCurrentUser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Settings, Route, User, MapPin, Bus, Bell, Users as UsersIcon, Image, Info } from 'lucide-react';
import ActiveTripsPanel from '../../components/dashboard/ActiveTripsPanel';
import { Button } from '../../components/ui/button';

export default function AdminDashboard() {
  const { data: userProfile } = useGetCallerUserProfile();

  const adminFeatures = [
    { title: 'Manage Users', description: 'View and manage all users', icon: UsersIcon, to: '/admin/users' },
    { title: 'Manage Roles', description: 'Assign roles to users', icon: Settings, to: '/admin/roles' },
    { title: 'Manage Routes', description: 'Create and edit routes', icon: Route, to: '/admin/routes' },
    { title: 'Assign Drivers', description: 'Assign vehicles to drivers', icon: User, to: '/admin/drivers' },
  ];

  const generalFeatures = [
    { title: 'Tracking', description: 'View all vehicle locations', icon: MapPin, to: '/tracking' },
    { title: 'Trips', description: 'View all trips', icon: Bus, to: '/trips' },
    { title: 'Alerts', description: 'View all alerts', icon: Bell, to: '/alerts' },
    { title: 'Pickup/Dropoff', description: 'View all records', icon: UsersIcon, to: '/pickup-dropoff' },
    { title: 'Gallery', description: 'View team photos', icon: Image, to: '/gallery' },
    { title: 'About Us', description: 'Learn about the team', icon: Info, to: '/about' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome, {userProfile?.name}!</h1>
        <p className="text-muted-foreground mt-2">Administrator Dashboard</p>
      </div>

      <ActiveTripsPanel />

      <div>
        <h2 className="text-xl font-semibold mb-4">Administration</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {adminFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.to} to={feature.to}>
                <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">General</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {generalFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.to} to={feature.to}>
                <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

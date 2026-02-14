import { Link } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '../../hooks/queries/useCurrentUser';
import { Home, MapPin, Route, Bus, Bell, User, Users, Settings, Image, Info } from 'lucide-react';

export default function RoleNav() {
  const { data: userProfile } = useGetCallerUserProfile();

  if (!userProfile) return null;

  const role = userProfile.role;

  const commonLinks = [
    { to: '/tracking', label: 'Tracking', icon: MapPin },
    { to: '/routes', label: 'Routes', icon: Route },
    { to: '/trips', label: 'Trips', icon: Bus },
    { to: '/alerts', label: 'Alerts', icon: Bell },
    { to: '/pickup-dropoff', label: 'Pickup/Dropoff', icon: Users },
    { to: '/gallery', label: 'Gallery', icon: Image },
    { to: '/about', label: 'About', icon: Info },
  ];

  const roleSpecificLinks: Record<string, Array<{ to: string; label: string; icon: any }>> = {
    parent: [{ to: '/parent', label: 'Dashboard', icon: Home }, ...commonLinks],
    student: [{ to: '/student', label: 'Dashboard', icon: Home }, ...commonLinks],
    driver: [
      { to: '/driver', label: 'Dashboard', icon: Home },
      { to: '/driver-profile', label: 'Profile', icon: User },
      ...commonLinks,
    ],
    admin: [
      { to: '/admin', label: 'Dashboard', icon: Home },
      { to: '/admin/users', label: 'Manage Users', icon: Users },
      { to: '/admin/roles', label: 'Manage Roles', icon: Settings },
      { to: '/admin/routes', label: 'Manage Routes', icon: Route },
      { to: '/admin/drivers', label: 'Assign Drivers', icon: User },
      ...commonLinks,
    ],
  };

  const links = roleSpecificLinks[role] || commonLinks;

  return (
    <nav className="flex flex-col md:flex-row gap-1 md:gap-4">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.to}
            to={link.to}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            activeProps={{ className: 'bg-accent text-accent-foreground' }}
          >
            <Icon className="h-4 w-4" />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

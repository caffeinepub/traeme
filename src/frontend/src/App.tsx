import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/queries/useCurrentUser';
import SplashScreen from './pages/SplashScreen';
import LoginPage from './pages/LoginPage';
import ParentDashboard from './pages/dashboards/ParentDashboard';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import DriverDashboard from './pages/dashboards/DriverDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import TrackingPage from './pages/TrackingPage';
import RoutesPage from './pages/RoutesPage';
import TripsPage from './pages/TripsPage';
import AlertsPage from './pages/AlertsPage';
import PickupDropoffPage from './pages/PickupDropoffPage';
import DriverProfilePage from './pages/DriverProfilePage';
import GalleryPage from './pages/GalleryPage';
import AboutPage from './pages/AboutPage';
import AdminRoleManagementPage from './pages/admin/AdminRoleManagementPage';
import AdminRoutesPage from './pages/admin/AdminRoutesPage';
import AdminDriverAssignmentsPage from './pages/admin/AdminDriverAssignmentsPage';
import AdminUserManagementPage from './pages/admin/AdminUserManagementPage';
import AccessDeniedPage from './pages/AccessDeniedPage';
import AppLayout from './components/layout/AppLayout';
import ProfileSetupModal from './components/auth/ProfileSetupModal';
import RolePendingScreen from './components/auth/RolePendingScreen';

function RootComponent() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity;

  if (isInitializing || (isAuthenticated && profileLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Outlet />;
  }

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;
  const showRolePending = isAuthenticated && userProfile && !userProfile.role;

  if (showProfileSetup) {
    return <ProfileSetupModal />;
  }

  if (showRolePending) {
    return <RolePendingScreen />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const splashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: SplashScreen,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const parentDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/parent',
  component: ParentDashboard,
});

const studentDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/student',
  component: StudentDashboard,
});

const driverDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/driver',
  component: DriverDashboard,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboard,
});

const trackingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tracking',
  component: TrackingPage,
});

const routesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/routes',
  component: RoutesPage,
});

const tripsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/trips',
  component: TripsPage,
});

const alertsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/alerts',
  component: AlertsPage,
});

const pickupDropoffRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pickup-dropoff',
  component: PickupDropoffPage,
});

const driverProfileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/driver-profile',
  component: DriverProfilePage,
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/gallery',
  component: GalleryPage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const adminRoleManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/roles',
  component: AdminRoleManagementPage,
});

const adminRoutesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/routes',
  component: AdminRoutesPage,
});

const adminDriverAssignmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/drivers',
  component: AdminDriverAssignmentsPage,
});

const adminUserManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/users',
  component: AdminUserManagementPage,
});

const accessDeniedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/access-denied',
  component: AccessDeniedPage,
});

const routeTree = rootRoute.addChildren([
  splashRoute,
  loginRoute,
  parentDashboardRoute,
  studentDashboardRoute,
  driverDashboardRoute,
  adminDashboardRoute,
  trackingRoute,
  routesRoute,
  tripsRoute,
  alertsRoute,
  pickupDropoffRoute,
  driverProfileRoute,
  galleryRoute,
  aboutRoute,
  adminRoleManagementRoute,
  adminRoutesRoute,
  adminDriverAssignmentsRoute,
  adminUserManagementRoute,
  accessDeniedRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}

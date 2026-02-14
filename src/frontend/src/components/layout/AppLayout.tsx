import { Link, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/queries/useCurrentUser';
import { useQueryClient } from '@tanstack/react-query';
import { logout } from '../../services/authService';
import { Button } from '../ui/button';
import { Menu, Bell, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { ASSETS } from '../../constants/assets';
import RoleNav from '../navigation/RoleNav';
import AlertsBadge from '../alerts/AlertsBadge';
import { useEffect } from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { clear, identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity && userProfile?.role) {
      const roleRoutes: Record<string, string> = {
        parent: '/parent',
        student: '/student',
        driver: '/driver',
        admin: '/admin',
      };
      const currentPath = window.location.pathname;
      if (currentPath === '/' || currentPath === '/login') {
        navigate({ to: roleRoutes[userProfile.role] || '/' });
      }
    }
  }, [identity, userProfile, navigate]);

  const handleLogout = async () => {
    await logout(clear, queryClient);
    navigate({ to: '/login' });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="mb-6">
                  <Link to="/">
                    <img src={ASSETS.logo} alt="Traeme" className="h-10" />
                  </Link>
                </div>
                <RoleNav />
              </SheetContent>
            </Sheet>
            <Link to="/" className="flex items-center gap-2">
              <img src={ASSETS.logo} alt="Traeme" className="h-8" />
              <span className="font-lobster text-2xl text-primary hidden sm:inline">Traeme</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <RoleNav />
          </nav>

          <div className="flex items-center gap-2">
            <AlertsBadge />
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Sign Out">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">{children}</main>

      <footer className="border-t mt-auto">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Traeme. Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground"
            >
              caffeine.ai
            </a>
          </p>
          <p className="mt-2">Politécnico Reverendo Andrés Amengual Fe y Alegría</p>
          <p>Jima Arriba, La Vega, Dominican Republic</p>
        </div>
      </footer>
    </div>
  );
}

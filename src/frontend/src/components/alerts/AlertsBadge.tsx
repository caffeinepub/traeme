import { Link } from '@tanstack/react-router';
import { Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { useUnseenAlertsCount } from '../../hooks/queries/useAlerts';
import { useEffect } from 'react';

export default function AlertsBadge() {
  const { unseenCount, markAsSeen } = useUnseenAlertsCount();

  useEffect(() => {
    if (window.location.pathname === '/alerts') {
      markAsSeen();
    }
  }, [window.location.pathname, markAsSeen]);

  return (
    <Link to="/alerts">
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-5 w-5" />
        {unseenCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center font-bold">
            {unseenCount > 9 ? '9+' : unseenCount}
          </span>
        )}
      </Button>
    </Link>
  );
}

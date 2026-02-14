import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { logout } from '../../services/authService';
import { Clock } from 'lucide-react';
import TraemeWordmark from '../branding/TraemeWordmark';

export default function RolePendingScreen() {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await logout(clear, queryClient);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <TraemeWordmark size="lg" />
          </div>
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-muted p-4">
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          <CardTitle>Access Pending</CardTitle>
          <CardDescription>
            Your account has been created, but you don't have a role assigned yet. Please contact an administrator to
            assign you a role (Parent, Student, Driver, or Administrator).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLogout} variant="outline" className="w-full">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

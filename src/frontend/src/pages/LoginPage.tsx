import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ASSETS } from '../constants/assets';
import TraemeWordmark from '../components/branding/TraemeWordmark';

export default function LoginPage() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) {
      navigate({ to: '/parent' });
    }
  }, [identity, navigate]);

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img src={ASSETS.logo} alt="Traeme Logo" className="h-24" />
          </div>
          <TraemeWordmark size="lg" className="justify-center" />
          <CardTitle className="text-2xl">Welcome to Traeme</CardTitle>
          <CardDescription>
            Sign in with Internet Identity to access the school transportation system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleAuth} disabled={disabled} className="w-full" size="lg">
            {disabled ? 'Signing in...' : isAuthenticated ? 'Sign Out' : 'Sign In with Internet Identity'}
          </Button>
          {loginStatus === 'loginError' && (
            <p className="text-sm text-destructive text-center mt-4">
              Failed to sign in. Please try again.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

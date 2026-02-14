import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '../components/ui/button';
import { ASSETS } from '../constants/assets';
import TraemeWordmark from '../components/branding/TraemeWordmark';

export default function SplashScreen() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) {
      navigate({ to: '/parent' });
    }
  }, [identity, navigate]);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${ASSETS.splashBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
      <div className="relative z-10 text-center space-y-8 max-w-2xl">
        <TraemeWordmark size="xl" className="justify-center" />
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Safe School Transportation
        </h1>
        <p className="text-xl text-muted-foreground">
          Real-time tracking for Politécnico Reverendo Andrés Amengual Fe y Alegría
        </p>
        <p className="text-lg text-muted-foreground">
          Jima Arriba, La Vega, Dominican Republic
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={() => navigate({ to: '/login' })}>
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
}

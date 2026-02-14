import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { saveCallerUserProfile } from '../../services/userService';
import { queryKeys } from '../../hooks/queries/queryKeys';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import TraemeWordmark from '../branding/TraemeWordmark';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (userName: string) => {
      if (!actor) throw new Error('Actor not available');
      return saveCallerUserProfile(actor, userName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      saveMutation.mutate(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <TraemeWordmark size="lg" />
          </div>
          <CardTitle>Welcome to Traeme!</CardTitle>
          <CardDescription>Please tell us your name to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={saveMutation.isPending}
              />
            </div>
            <Button type="submit" className="w-full" disabled={saveMutation.isPending || !name.trim()}>
              {saveMutation.isPending ? 'Saving...' : 'Continue'}
            </Button>
            {saveMutation.isError && (
              <p className="text-sm text-destructive text-center">
                {saveMutation.error instanceof Error ? saveMutation.error.message : 'Failed to save profile'}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

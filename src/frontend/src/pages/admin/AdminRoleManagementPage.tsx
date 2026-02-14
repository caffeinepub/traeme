import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { assignUserRole } from '../../services/userService';
import { queryKeys } from '../../hooks/queries/queryKeys';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import PrincipalInput from '../../components/admin/PrincipalInput';
import { Principal } from '@dfinity/principal';
import { UserRole } from '../../backend';

export default function AdminRoleManagementPage() {
  const [principalText, setPrincipalText] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const assignMutation = useMutation({
    mutationFn: async ({ principal, role }: { principal: Principal; role: UserRole }) => {
      if (!actor) throw new Error('Actor not available');
      return assignUserRole(actor, principal, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
      setPrincipalText('');
      setSelectedRole('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!principalText.trim() || !selectedRole) return;

    try {
      const principal = Principal.fromText(principalText.trim());
      assignMutation.mutate({ principal, role: selectedRole });
    } catch (error) {
      console.error('Invalid principal:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Manage User Roles</h1>
        <p className="text-muted-foreground mt-2">Assign roles to users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assign Role</CardTitle>
          <CardDescription>Assign a role to a user by their Principal ID</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <PrincipalInput
              value={principalText}
              onChange={setPrincipalText}
              label="User Principal ID"
              placeholder="Enter the user's principal ID"
            />

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={assignMutation.isPending || !principalText.trim() || !selectedRole}>
              {assignMutation.isPending ? 'Assigning...' : 'Assign Role'}
            </Button>

            {assignMutation.isError && (
              <p className="text-sm text-destructive">
                {assignMutation.error instanceof Error ? assignMutation.error.message : 'Failed to assign role'}
              </p>
            )}
            {assignMutation.isSuccess && (
              <p className="text-sm text-green-600">Role assigned successfully!</p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

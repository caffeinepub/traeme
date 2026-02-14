import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Search, Settings, User } from 'lucide-react';
import { useGetAllUserProfiles } from '../../hooks/queries/useUserProfiles';

export default function AdminUserManagementPage() {
  const { data: users = [], isLoading } = useGetAllUserProfiles();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.principal.toString().toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-2">View and manage all users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Users</CardTitle>
          <CardDescription>Filter users by name or principal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or principal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.principal.toString()}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{user.name}</h3>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 font-mono break-all">
                      {user.principal.toString()}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {user.assignedVehicle && (
                        <div>
                          <span className="font-medium">Vehicle:</span>{' '}
                          <span className="text-muted-foreground">{user.assignedVehicle}</span>
                        </div>
                      )}
                      {user.assignedRoute && (
                        <div>
                          <span className="font-medium">Route:</span>{' '}
                          <span className="text-muted-foreground">{user.assignedRoute}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to="/admin/roles">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Role
                      </Button>
                    </Link>
                    {user.role === 'driver' && (
                      <Link to="/admin/drivers">
                        <Button variant="outline" size="sm">
                          <User className="h-4 w-4 mr-1" />
                          Assign
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredUsers.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <p>No users found matching your search.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

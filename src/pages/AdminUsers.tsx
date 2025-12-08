import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Search, User as UserIcon, Shield } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

interface UserProfile {
    id: string;
    email: string | null;
    full_name: string | null;
    created_at: string;
    role: 'admin' | 'user';
}

export default function AdminUsers() {
    const { user, loading, isAdmin } = useAuth();
    const { toast } = useToast();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        if (user && isAdmin) fetchUsers();
    }, [user, isAdmin]);

    useEffect(() => {
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            const filtered = users.filter(u =>
                (u.full_name?.toLowerCase() || '').includes(lowerTerm) ||
                (u.email?.toLowerCase() || '').includes(lowerTerm)
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    }, [searchTerm, users]);

    const fetchUsers = async () => {
        setIsLoadingData(true);
        try {
            // Fetch profiles
            const { data: profiles, error: profilesError } = await supabase
                .from('profiles')
                .select('*');

            if (profilesError) throw profilesError;

            // Fetch roles
            const { data: roles, error: rolesError } = await supabase
                .from('user_roles')
                .select('*');

            if (rolesError) throw rolesError;

            // Combine data
            const combinedUsers: UserProfile[] = profiles.map(profile => {
                const userRole = roles.find(r => r.user_id === profile.id);
                return {
                    id: profile.id,
                    email: profile.email,
                    full_name: profile.full_name,
                    created_at: profile.created_at,
                    role: userRole?.role || 'user',
                };
            });

            setUsers(combinedUsers);
            setFilteredUsers(combinedUsers);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error fetching users',
                description: error.message,
            });
        } finally {
            setIsLoadingData(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!user || !isAdmin) return <Navigate to="/" replace />;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <Breadcrumbs />

            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <Link to="/admin" className="text-primary hover:underline mb-2 inline-block">← Back to Admin</Link>
                        <h1 className="text-4xl font-bold text-foreground">User Management</h1>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>All Users ({users.length})</CardTitle>
                            <div className="relative w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoadingData ? (
                            <div className="text-center py-8">Loading users...</div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>User</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Role</TableHead>
                                            <TableHead>Joined Date</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredUsers.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                                    No users found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <TableRow key={user.id}>
                                                    <TableCell className="font-medium">
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                                <UserIcon className="h-4 w-4 text-primary" />
                                                            </div>
                                                            {user.full_name || 'N/A'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{user.email}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            {user.role === 'admin' ? (
                                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                                                    <Shield className="h-3 w-3" />
                                                                    Admin
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                                                                    User
                                                                </span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {new Date(user.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

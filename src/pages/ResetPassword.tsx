import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ResetPassword() {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // If no session, wait a brief moment for the client to process the URL fragment
                // or listen for the initial auth state change
                const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                    if (!session) {
                        navigate('/auth');
                    }
                });
                return () => subscription.unsubscribe();
            }
        };

        checkSession();
    }, [navigate]);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            toast({
                variant: 'destructive',
                title: 'Error updating password',
                description: error.message,
            });
        } else {
            toast({
                title: 'Success!',
                description: 'Your password has been updated.',
            });
            navigate('/');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <nav className="bg-card border-b border-border">
                <div className="container mx-auto px-4 py-4">
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
                        <GraduationCap className="h-8 w-8 text-primary" />
                        Future Path
                    </Link>
                </div>
            </nav>

            <div className="flex-1 flex items-center justify-center p-4 bg-muted/30">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Set New Password</CardTitle>
                        <CardDescription>Enter your new password below</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Updating...' : 'Update Password'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

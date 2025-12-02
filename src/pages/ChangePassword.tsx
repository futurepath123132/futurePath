import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

export default function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast({
                variant: 'destructive',
                title: 'Passwords do not match',
                description: 'Please make sure your new passwords match.',
            });
            return;
        }

        if (newPassword.length < 6) {
            toast({
                variant: 'destructive',
                title: 'Password too short',
                description: 'Password must be at least 6 characters long.',
            });
            return;
        }

        setLoading(true);

        try {
            // Update password
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) throw error;

            toast({
                title: 'Success!',
                description: 'Your password has been changed.',
            });

            // Clear form
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            // Optional: redirect to dashboard after a delay
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error changing password',
                description: error.message || 'Failed to change password.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-4 bg-muted/30">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>Update your account password</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                    placeholder="Confirm new password"
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Changing Password...' : 'Change Password'}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => navigate('/dashboard')}
                            >
                                Cancel
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

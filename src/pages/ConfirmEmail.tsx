import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { GraduationCap, Mail, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function ConfirmEmail() {
    const [loading, setLoading] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useAuth();

    useEffect(() => {
        // Check if user is already verified
        if (user?.email_confirmed_at) {
            navigate('/');
        }

        // Listen for auth state changes (email confirmation)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
                toast({
                    title: 'Email confirmed!',
                    description: 'Redirecting you to the home page...',
                });
                setTimeout(() => navigate('/'), 1500);
            }
        });

        return () => subscription.unsubscribe();
    }, [user, navigate, toast]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setResendDisabled(false);
        }
    }, [countdown]);

    const handleResendEmail = async () => {
        if (!user?.email) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'No email address found. Please sign up again.',
            });
            return;
        }

        setLoading(true);
        setResendDisabled(true);

        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: user.email,
        });

        if (error) {
            toast({
                variant: 'destructive',
                title: 'Error sending email',
                description: error.message,
            });
            setResendDisabled(false);
        } else {
            toast({
                title: 'Email sent!',
                description: 'Please check your inbox for the confirmation link.',
            });
            setCountdown(60); // 60 second cooldown
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
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <Mail className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle>Confirm Your Email</CardTitle>
                        <CardDescription>
                            We've sent a confirmation email to{' '}
                            <span className="font-semibold text-foreground">{user?.email}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                            <h4 className="font-semibold flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                Next Steps:
                            </h4>
                            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                                <li>Check your email inbox</li>
                                <li>Click the confirmation link in the email</li>
                                <li>You'll be automatically redirected to the home page</li>
                            </ol>
                        </div>

                        <div className="text-center space-y-3">
                            <p className="text-sm text-muted-foreground">
                                Didn't receive the email?
                            </p>
                            <Button
                                onClick={handleResendEmail}
                                disabled={loading || resendDisabled}
                                variant="outline"
                                className="w-full"
                            >
                                {loading
                                    ? 'Sending...'
                                    : countdown > 0
                                        ? `Resend in ${countdown}s`
                                        : 'Resend Confirmation Email'}
                            </Button>
                        </div>

                        <div className="pt-4 border-t text-center">
                            <p className="text-sm text-muted-foreground">
                                Already confirmed?{' '}
                                <Link to="/" className="text-primary hover:underline">
                                    Go to Home
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

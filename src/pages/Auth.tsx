import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function Auth() {
  const { signIn, signUp, user, resetPassword } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ email: '', password: '', fullName: '' });

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(signInData.email, signInData.password);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error signing in',
        description: error.message,
      });
    } else {
      toast({
        title: 'Success!',
        description: 'You have been signed in.',
      });
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://futurepath-sigma.vercel.app/"
      }
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Google Login Error",
        description: error.message,
      });
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!signUpData.fullName) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter your full name',
      });
      setLoading(false);
      return;
    }

    const { error } = await signUp(signUpData.email, signUpData.password, signUpData.fullName);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error signing up',
        description: error.message,
      });
    } else {
      toast({
        title: 'Success!',
        description: 'Your account has been created.',
      });
    }

    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await resetPassword(resetEmail);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error sending reset link',
        description: error.message,
      });
    } else {
      toast({
        title: 'Check your email',
        description: 'We sent you a password reset link.',
      });
      setShowForgotPassword(false);
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
            <CardTitle>
              {showForgotPassword ? 'Reset Password' : 'Welcome to Future Path'}
            </CardTitle>
            <CardDescription>
              {showForgotPassword
                ? 'Enter your email to receive a password reset link'
                : 'Discover universities and scholarships in Punjab'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showForgotPassword ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="your@email.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setShowForgotPassword(false)}
                  disabled={loading}
                >
                  Back to Sign In
                </Button>
              </form>
            ) : (
              <Tabs defaultValue="signin">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input
                        id="signin-email"
                        type="email"
                        placeholder="your@email.com"
                        value={signInData.email}
                        onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="signin-password">Password</Label>
                        
                      </div>
                      <Input
                        id="signin-password"
                        type="password"
                        placeholder="Enter your password"
                        value={signInData.password}
                        onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                        required
                      />
                      <Button
                          type="button"
                          variant="link"
                          className="px-0 h-auto text-xs text-muted-foreground"
                          onClick={() => setShowForgotPassword(true)}
                        >
                          Forgot password?
                        </Button>
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                    <Button
                      type="button"
                      className="w-full flex items-center gap-2"
                      variant="outline"
                      onClick={handleGoogleLogin}
                    >
                      <img src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="google"
                        className="w-5 h-5" />
                      Continue with Google
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name">Full Name</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        value={signUpData.fullName}
                        onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder='Enter your password'
                        value={signUpData.password}
                        onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                        required
                        minLength={6}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Creating account...' : 'Sign Up'}
                    </Button>
                    <Button
                      type="button"
                      className="w-full flex items-center gap-2"
                      variant="outline"
                      onClick={handleGoogleLogin}
                    >
                      <img src="https://www.svgrepo.com/show/475656/google-color.svg"
                        alt="google"
                        className="w-5 h-5" />
                      Continue with Google
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Link, Navigate } from 'react-router-dom';
import { Heart, GraduationCap, Award } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

interface Profile {
  full_name: string;
  email: string;
  city: string;
}

interface Favorite {
  id: string;
  item_type: string;
  item_id: string;
  item_name: string;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile>({ full_name: '', email: '', city: '' });
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [saving, setSaving] = useState(false);
  
  const emailVerified = user?.email_confirmed_at !== null;
  const emailPending = (user as any)?.new_email;
  
  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchFavorites();
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile({
          full_name: data.full_name || '',
          email: data.email || '',
          city: data.city || '',
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchFavorites = async () => {
    try {
      const { data: favData, error } = await supabase
        .from('favorites')
        .select('id, item_type, item_id')
        .eq('user_id', user?.id);

      if (error) throw error;

      const enrichedFavorites: Favorite[] = [];

      for (const fav of favData || []) {
        if (fav.item_type === 'university') {
          const { data: uni } = await supabase
            .from('universities')
            .select('name')
            .eq('id', fav.item_id)
            .single();
          
          if (uni) {
            enrichedFavorites.push({
              ...fav,
              item_name: uni.name,
            });
          }
        } else if (fav.item_type === 'scholarship') {
          const { data: sch } = await supabase
            .from('scholarships')
            .select('title')
            .eq('id', fav.item_id)
            .single();
          
          if (sch) {
            enrichedFavorites.push({
              ...fav,
              item_name: sch.title,
            });
          }
        }
      }

      setFavorites(enrichedFavorites);
    } catch (error: any) {
      console.error('Error fetching favorites:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
  e.preventDefault();
  setSaving(true);

  try {
    // Update email (Supabase sends verification email automatically)
    const { error: emailError } = await supabase.auth.updateUser({
      email: profile.email,
    });

    if (emailError) throw emailError;

    // Show toast for email verification
    toast({
      title: 'Verification Required',
      description: `A verification link has been sent to ${profile.email}. Please verify to complete the email change.`,
    });

    // Update profile table
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        city: profile.city,
        email: profile.email,
      })
      .eq('id', user?.id);

    if (error) throw error;

    toast({
      title: 'Success',
      description: 'Profile updated successfully',
    });
  } catch (error: any) {
    toast({
      variant: 'destructive',
      title: 'Error',
      description: error.message,
    });
  } finally {
    setSaving(false);
  }
};

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;

      setFavorites(favorites.filter(f => f.id !== favoriteId));
      toast({
        title: 'Removed from favorites',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Breadcrumbs />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">Dashboard</h1>
    
        <div className="grid md:grid-cols-2 gap-8">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.full_name}
                    onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
               
               <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled={emailPending ? true : false}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />

                {emailPending && (
                  <p className="text-sm text-yellow-500 mt-1">
                    Verification pending: Check <b>{emailPending}</b> to confirm email change.
                  </p>
                )}

                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    placeholder="e.g., Lahore"
                  />
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Favorites Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-destructive" />
                Saved Favorites
              </CardTitle>
            </CardHeader>
            <CardContent>
              {favorites.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No favorites saved yet. Start exploring!
                </p>
              ) : (
                <div className="space-y-3">
                  {favorites.map((favorite) => (
                    <div
                      key={favorite.id}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        {favorite.item_type === 'university' ? (
                          <GraduationCap className="h-4 w-4 text-primary" />
                        ) : (
                          <Award className="h-4 w-4 text-primary" />
                        )}
                        <div>
                          <p className="font-medium text-sm">{favorite.item_name}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {favorite.item_type}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          to={
                            favorite.item_type === 'university'
                              ? `/universities/${favorite.item_id}`
                              : `/scholarships`
                          }
                        >
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeFavorite(favorite.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

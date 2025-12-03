import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { useToast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';
import Breadcrumbs from '@/components/Breadcrumbs';
import DashboardProfile from '@/components/dashboard/DashboardProfile';
import DashboardSuggestedUniversities from '@/components/dashboard/DashboardSuggestedUniversities';
import DashboardFavorites from '@/components/dashboard/DashboardFavorites';
import { Profile } from '@/components/dashboard/types';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile>({
    full_name: '',
    email: '',
    city: '',
    date_of_birth: '',
    gender: '',
    nationality: '',
    phone: '',
    state: '',
    zip_code: '',
    address: '',
    preferred_discipline: '',
    profilepic: null,
  });

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      // Ignore error if it's just that the row doesn't exist (PGRST116)
      if (error && error.code !== 'PGRST116') throw error;

      // Use user metadata as fallback
      const userMetaData = user?.user_metadata || {};

      if (data) {
        setProfile({
          full_name: data.full_name || userMetaData.full_name || userMetaData.name || '',
          email: data.email || user?.email || '',
          city: data.city || '',
          date_of_birth: data.date_of_birth || '',
          gender: data.gender || '',
          nationality: data.nationality || '',
          phone: data.phone || '',
          state: data.state || '',
          zip_code: data.zip_code || '',
          address: data.address || '',
          preferred_discipline: data.preferred_discipline || '',
          profilepic: data.profilepic || null,
        });
      } else {
        // If no profile exists yet, pre-fill from auth data
        setProfile({
          full_name: userMetaData.full_name || userMetaData.name || '',
          email: user?.email || '',
          city: '',
          date_of_birth: '',
          gender: '',
          nationality: '',
          phone: '',
          state: '',
          zip_code: '',
          address: '',
          preferred_discipline: '',
          profilepic: null,
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error fetching profile',
        description: error.message,
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Breadcrumbs />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">Dashboard</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Section - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-8">
            <DashboardProfile
              user={user}
              profile={profile}
              setProfile={setProfile}
              onProfileUpdate={() => {
                // Trigger any necessary updates after profile save
                // Currently DashboardSuggestedUniversities updates automatically via props
              }}
            />

            {/* Suggested Universities Section */}
            <DashboardSuggestedUniversities
              city={profile.city}
              preferred_discipline={profile.preferred_discipline}
            />
          </div>

          {/* Favorites Section - Right Sidebar */}
          <div className="space-y-8">
            <DashboardFavorites userId={user.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

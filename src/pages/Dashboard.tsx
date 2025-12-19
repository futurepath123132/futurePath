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
import { Loader } from '@/components/ui/loader';
import KanbanBoard from '@/components/dashboard/kanban/KanbanBoard';
import UserDocuments from '@/components/dashboard/UserDocuments';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    preferred_location: '',
    preferred_fee: '',
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
        const profileData = data as any;
        setProfile({
          full_name: profileData.full_name || userMetaData.full_name || userMetaData.name || '',
          email: profileData.email || user?.email || '',
          city: profileData.city || '',
          date_of_birth: profileData.date_of_birth || '',
          gender: profileData.gender || '',
          nationality: profileData.nationality || '',
          phone: profileData.phone || '',
          state: profileData.state || '',
          zip_code: profileData.zip_code || '',
          address: profileData.address || '',
          preferred_discipline: profileData.preferred_discipline || '',
          preferred_location: profileData.preferred_location || '',
          preferred_fee: profileData.preferred_fee || '',
          profilepic: profileData.profilepic || null,
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
          preferred_location: '',
          preferred_fee: '',
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
    return <Loader center />;
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

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8 p-1 bg-muted/30 border rounded-xl overflow-hidden">
            <TabsTrigger
              value="profile"
              className="px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
            >
              Profile Settings
            </TabsTrigger>
            <TabsTrigger
              value="applications"
              className="px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
            >
              My Applications
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg transition-all"
            >
              My Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="animate-in fade-in-50 duration-300">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <DashboardProfile
                  user={user}
                  profile={profile}
                  setProfile={setProfile}
                  onProfileUpdate={() => {
                    // Refresh profile data if needed
                    fetchProfile();
                  }}
                />
              </div>
              <div className="space-y-8">
                <DashboardFavorites userId={user.id} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-10 animate-in fade-in-50 duration-300">
            <div>
              <h2 className="text-2xl font-bold mb-6">Application Tracker</h2>
              <div className="border rounded-xl bg-muted/10 p-4 shadow-sm">
                <KanbanBoard userId={user.id} />
              </div>
            </div>

            <DashboardSuggestedUniversities
              city={profile.preferred_location || profile.city}
              preferred_discipline={profile.preferred_discipline}
            />
          </TabsContent>

          <TabsContent value="documents" className="animate-in fade-in-50 duration-300">
            <UserDocuments userId={user.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

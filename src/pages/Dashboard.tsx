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
import { Heart, GraduationCap, Award, MapPin, CalendarDays, ExternalLink, X } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface Profile {
  full_name: string;
  email: string;
  city: string;
  date_of_birth: string;
  gender: string;
  nationality: string;
  phone: string;
  state: string;
  zip_code: string;
  address: string;
  preferred_discipline: string;
}

interface Favorite {
  id: string;
  item_type: string;
  item_id: string;
  item_name: string;
}

interface University {
  id: string;
  name: string;
  city: string;
  tuition_range?: string;
  study_mode?: string;
  application_deadline?: string;
  disciplines?: string[];
  images?: string[];
  icon_url?: string;
}

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
  });
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [suggestedUniversities, setSuggestedUniversities] = useState<University[]>([]);
  const [saving, setSaving] = useState(false);
  
  const emailVerified = user?.email_confirmed_at !== null;
  const emailPending = (user as any)?.new_email;
  
  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchFavorites();
    }
  }, [user]);

  useEffect(() => {
    if (profile.city || profile.preferred_discipline) {
      fetchSuggestedUniversities();
    }
  }, [profile.city, profile.preferred_discipline]);

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
          date_of_birth: data.date_of_birth || '',
          gender: data.gender || '',
          nationality: data.nationality || '',
          phone: data.phone || '',
          state: data.state || '',
          zip_code: data.zip_code || '',
          address: data.address || '',
          preferred_discipline: data.preferred_discipline || '',
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

  const fetchSuggestedUniversities = async () => {
    try {
      let query = supabase
        .from('universities')
        .select('id, name, city, tuition_range, study_mode, application_deadline, disciplines, images, icon_url')
        .limit(6);

      // Filter by city if available
      if (profile.city) {
        // We use ilike for case-insensitive matching
        query = query.ilike('city', `%${profile.city}%`);
      }

      // Note: Filtering by array column 'disciplines' containing 'preferred_discipline'
      // requires specific syntax. If preferred_discipline is set:
      if (profile.preferred_discipline) {
         query = query.contains('disciplines', [profile.preferred_discipline]);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Filter out past deadlines
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const currentDate = `${year}-${month}-${day}`;

      const filteredData = (data || []).filter((uni: any) => {
        if (!uni.application_deadline) return true;
        return uni.application_deadline >= currentDate;
      });

      setSuggestedUniversities(filteredData);
    } catch (error) {
      console.error('Error fetching suggested universities:', error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Update email (Supabase sends verification email automatically)
      if (profile.email !== user?.email) {
          const { error: emailError } = await supabase.auth.updateUser({
            email: profile.email,
          });
          if (emailError) throw emailError;
           toast({
            title: 'Verification Required',
            description: `A verification link has been sent to ${profile.email}. Please verify to complete the email change.`,
          });
      }

      // Update profile table
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          city: profile.city,
          email: profile.email,
          date_of_birth: profile.date_of_birth || null,
          gender: profile.gender || null,
          nationality: profile.nationality || null,
          phone: profile.phone || null,
          state: profile.state || null,
          zip_code: profile.zip_code || null,
          address: profile.address || null,
          preferred_discipline: profile.preferred_discipline || null,
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      
      // Refresh suggestions
      fetchSuggestedUniversities();

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
    
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Section - Takes up 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form id="profile-form" onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={profile.full_name}
                        onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                        placeholder="e.g. Shaveer Sajjad"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dob">Date Of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={profile.date_of_birth}
                        onChange={(e) => setProfile({ ...profile, date_of_birth: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select 
                        value={profile.gender} 
                        onValueChange={(value) => setProfile({ ...profile, gender: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nationality">Nationality</Label>
                      <Select 
                        value={profile.nationality} 
                        onValueChange={(value) => setProfile({ ...profile, nationality: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pakistani">Pakistani</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="preferred_discipline">Preferred Discipline</Label>
                      <Select 
                        value={profile.preferred_discipline} 
                        onValueChange={(value) => setProfile({ ...profile, preferred_discipline: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="Arts">Arts</SelectItem>
                          <SelectItem value="Medical">Medical</SelectItem>
                          <SelectItem value="Computer Science">Computer Science</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Contact Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
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
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          placeholder="----------"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                         <Select 
                            value={profile.state} 
                            onValueChange={(value) => setProfile({ ...profile, state: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Punjab">Punjab</SelectItem>
                              <SelectItem value="Sindh">Sindh</SelectItem>
                              <SelectItem value="KPK">KPK</SelectItem>
                              <SelectItem value="Balochistan">Balochistan</SelectItem>
                              <SelectItem value="Gilgit-Baltistan">Gilgit-Baltistan</SelectItem>
                              <SelectItem value="Azad Kashmir">Azad Kashmir</SelectItem>
                            </SelectContent>
                          </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                         <Input
                            id="city"
                            value={profile.city}
                            onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                            placeholder="e.g., Lahore"
                          />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip_code">Zip Code</Label>
                        <Input
                          id="zip_code"
                          value={profile.zip_code}
                          onChange={(e) => setProfile({ ...profile, zip_code: e.target.value })}
                          placeholder="------"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input
                          id="address"
                          value={profile.address}
                          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                          placeholder="------"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={saving} className="bg-[#2700D3] hover:bg-[#2700D3]/90">
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

             {/* Suggested Universities Section */}
            {suggestedUniversities.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Suggested Universities</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {suggestedUniversities.map((university) => (
                    <Card key={university.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                      <div className="h-40 relative">
                         {university.images && university.images.length > 0 ? (
                          <img
                            src={university.images[0]}
                            alt={university.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted/20 flex items-center justify-center text-muted-foreground">
                            <span className="text-4xl">🏛️</span>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                           <h3 className="font-bold line-clamp-1">{university.name}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                          <MapPin className="h-3 w-3" />
                          <span>{university.city}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium text-primary mb-4">
                          <CalendarDays className="h-4 w-4" />
                          <span>
                            {university.application_deadline 
                              ? new Date(university.application_deadline).toLocaleDateString() 
                              : "Open"}
                          </span>
                        </div>
                        <Link to={`/universities/${university.id}`}>
                          <Button className="w-full bg-[#2700D3] hover:bg-[#2700D3]/90 text-white">
                            View Details
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Favorites Section - Right Sidebar */}
          <div className="space-y-8">
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
                            <p className="font-medium text-sm line-clamp-1">{favorite.item_name}</p>
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
                            <Button size="icon" variant="ghost" className="h-8 w-8">
                               <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => removeFavorite(favorite.id)}
                          >
                            <X className="h-4 w-4" />
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
    </div>
  );
}

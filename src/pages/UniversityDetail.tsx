import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { UniversityDetail as IUniversityDetail } from '@/components/university-detail/types';
import { UniversityHero } from '@/components/university-detail/UniversityHero';
import { UniversityStats } from '@/components/university-detail/UniversityStats';
import { UniversityInfo } from '@/components/university-detail/UniversityInfo';
import { UniversityGallery } from '@/components/university-detail/UniversityGallery';
import { UniversitySidebar } from '@/components/university-detail/UniversitySidebar';

export default function UniversityDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [university, setUniversity] = useState<IUniversityDetail | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchUniversity();
      if (user) checkFavorite();
    }
  }, [id, user]);

  const fetchUniversity = async () => {
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      const universityData = data as IUniversityDetail;
      setUniversity(universityData);
      setImages(universityData.images || []);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load university details',
      });
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('item_type', 'university')
        .eq('item_id', id)
        .maybeSingle();

      if (error) throw error;
      setIsFavorite(!!data);
    } catch (error: any) {
      console.error('Error checking favorite:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Sign in required',
        description: 'Please sign in to save favorites',
      });
      return;
    }

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('item_type', 'university')
          .eq('item_id', id);

        if (error) throw error;
        setIsFavorite(false);
        toast({ title: 'Removed from favorites' });
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            item_type: 'university',
            item_id: id,
            item_name: university?.name || 'Unknown',
          });

        if (error) throw error;
        setIsFavorite(true);
        toast({ title: 'Added to favorites' });
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Breadcrumbs />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Breadcrumbs />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">University not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Breadcrumbs />

      <UniversityHero
        university={university}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
      />

      <div className="container mx-auto px-4 -mt-8 relative z-10 pb-12">
        <UniversityStats university={university} />

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            <UniversityInfo university={university} />
            <UniversityGallery images={images} />
          </div>

          {/* Sidebar */}
          <UniversitySidebar university={university} />
        </div>
      </div>
    </div>
  );
}

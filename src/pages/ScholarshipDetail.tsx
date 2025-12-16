import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Loader } from '@/components/ui/loader';
import { Scholarship } from '@/components/scholarship-detail/types';
import { ScholarshipHero } from '@/components/scholarship-detail/ScholarshipHero';
import { ScholarshipStats } from '@/components/scholarship-detail/ScholarshipStats';
import { ScholarshipInfo } from '@/components/scholarship-detail/ScholarshipInfo';
import { ScholarshipSidebar } from '@/components/scholarship-detail/ScholarshipSidebar';

export default function ScholarshipDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchScholarship();
      if (user) checkFavorite();
    }
  }, [id, user]);

  const fetchScholarship = async () => {
    try {
      const { data, error } = await supabase
        .from('scholarships')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setScholarship(data);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load scholarship details',
      });
    } finally {
      setLoading(false);
    }
  };

  const checkFavorite = async () => {
    if (!user || !id) return;
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('item_type', 'scholarship')
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

    if (!scholarship) return;

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('item_type', 'scholarship')
          .eq('item_id', id);

        if (error) throw error;
        setIsFavorite(false);
        toast({ title: 'Removed from favorites' });
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            item_type: 'scholarship',
            item_id: id,
            item_name: scholarship.title,
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
        <Loader center />
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Breadcrumbs />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Scholarship not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Breadcrumbs />

      <ScholarshipHero
        scholarship={scholarship}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
      />

      <div className="container mx-auto px-4 -mt-8 relative z-10 pb-12">
        <ScholarshipStats scholarship={scholarship} />

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            <ScholarshipInfo scholarship={scholarship} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ScholarshipSidebar scholarship={scholarship} />
          </div>
        </div>
      </div>
    </div>
  );
}

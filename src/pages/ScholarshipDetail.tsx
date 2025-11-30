import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DollarSign, Calendar, ExternalLink, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import Breadcrumbs from '@/components/Breadcrumbs';

interface Scholarship {
  id: string;
  title: string;
  provider: string;
  amount: string;
  deadline: string;
  eligibility: string;
  link: string;
  image_url?: string;
}

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
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Loading...</p>
        </div>
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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link to="/scholarships" className="text-primary hover:underline">
            ← Back to Scholarships
          </Link>
        </div>

        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{scholarship.title}</h1>
              <p className="text-muted-foreground mb-2">{scholarship.provider}</p>
              {scholarship.image_url && (
                <img
                  src={scholarship.image_url}
                  alt={scholarship.title}
                  className="w-full md:w-96 h-64 object-cover rounded"
                />
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={toggleFavorite} variant="outline">
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current text-destructive' : ''}`} />
              </Button>
              {scholarship.link && (
                <Button asChild>
                  <a href={scholarship.link} target="_blank" rel="noopener noreferrer">
                    Apply Now
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {scholarship.amount && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Amount</h3>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{scholarship.amount}</span>
                  </div>
                </CardContent>
              </Card>
            )}
            {scholarship.deadline && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Deadline</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {format(new Date(scholarship.deadline), 'MMM dd, yyyy')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
            {scholarship.eligibility && (
              <Card className="md:col-span-2">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2">Eligibility</h3>
                  <p className="text-sm">{scholarship.eligibility}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

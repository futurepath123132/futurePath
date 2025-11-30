import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Globe, Phone, Mail, ExternalLink, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import Breadcrumbs from '@/components/Breadcrumbs';

interface UniversityDetail {
  id: string;
  name: string;
  city: string;
  address: string;
  website: string;
  tuition_range: string;
  ranking: number;
  programs: string[];
  disciplines: string[];
  contact_email: string;
  contact_phone: string;
  description: string;
  apply_link: string;
  images?: string[];
  icon_url?: string;
  size?: string;
}

export default function UniversityDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [university, setUniversity] = useState<UniversityDetail | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchUniversity();
      if (user) checkFavorite();
    }
  }, [id, user]);

  const handleAddFavorite = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Please sign in",
        description: "You must be logged in to save favorites.",
      });
      return;
    }

    const { error } = await supabase
      .from("favorites")
      .insert([
        {
          user_id: user.id,
          item_type: "university",
          item_id: university.id,
          item_name: university.name,
        },
      ]);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error adding favorite",
        description: error.message,
      });
    } else {
      toast({
        title: "Added to favorites!",
        description: `${university.name} has been saved.`,
      });
    }
  };
  const fetchUniversity = async () => {
    try {
      const { data, error } = await supabase
        .from('universities')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      const universityData = data as UniversityDetail;
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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <Link to="/universities" className="text-primary hover:underline">
            ← Back to Universities
          </Link>
        </div>

        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{university.name}</h1>
              {university.icon_url && (
                <img src={university.icon_url} alt="University Icon" className="w-10 h-10 object-contain mt-1 mb-2" />
              )}
              <div
                onClick={() => {
                  const query = encodeURIComponent(university.address || university.city);
                  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                }}
                className="flex items-center gap-2 text-muted-foreground cursor-pointer hover:text-primary transition-colors"
              >
                <MapPin className="h-4 w-4" />
                <span>{university.city}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={toggleFavorite} variant="outline">
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current text-destructive' : ''}`} />
              </Button>
              {university.apply_link && (
                <Button asChild>
                  <a href={university.apply_link} target="_blank" rel="noopener noreferrer">
                    Apply Now
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
          {images.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Gallery</h2>
              <div className={`grid ${images.length === 1 ? 'md:grid-cols-1' : 'md:grid-cols-3'} gap-4`}>
                {images.map((img, i) => (
                  <Card key={i} className="overflow-hidden">
                    <img src={img} alt={`${university.name} image ${i + 1}`} className="w-full aspect-square object-cover" />
                  </Card>
                ))}
              </div>
            </div>
          )}

          {university.description && (
            <Card>
              <CardContent className="pt-6">
                <p className="text-foreground">{university.description}</p>
              </CardContent>
            </Card>
          )}



          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-xl font-semibold text-foreground mb-4">Details</h3>
                {university.tuition_range && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Tuition Range</p>
                    <p className="text-foreground">{university.tuition_range}</p>
                  </div>
                )}
                {university.ranking && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ranking</p>
                    <p className="text-foreground">#{university.ranking}</p>
                  </div>
                )}
                {university.address && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Address</p>
                    <p className="text-foreground">{university.address}</p>
                  </div>
                )}
                {university.size && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Size</p>
                    <p className="text-foreground">{university.size} sq ft</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-xl font-semibold text-foreground mb-4">Contact</h3>
                {university.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <a href={university.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Visit Website
                    </a>
                  </div>
                )}
                {university.contact_email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <a href={`mailto:${university.contact_email}`} className="text-primary hover:underline">
                      {university.contact_email}
                    </a>
                  </div>
                )}
                {university.contact_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{university.contact_phone}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {university.disciplines && university.disciplines.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Disciplines</h3>
                  <div className="flex flex-wrap gap-2">
                    {university.disciplines.map((discipline, idx) => (
                      <span key={idx} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        {discipline}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {university.programs && university.programs.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Programs</h3>
                  <div className="flex flex-wrap gap-2">
                    {university.programs.map((program, idx) => (
                      <span key={idx} className="bg-secondary/10 text-secondary-foreground px-3 py-1 rounded-full text-sm">
                        {program}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

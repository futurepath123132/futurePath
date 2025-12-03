import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Globe, Phone, Mail, ExternalLink, Heart, Clock, Calendar, Users, BookOpen } from 'lucide-react';
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
  credit_hours?: number;
  starting_date?: string;
  available_seats?: number;
  admission_requirements?: string;
  application_deadline?: string;
  study_mode?: string;
}

export default function UniversityDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [university, setUniversity] = useState<UniversityDetail | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
          item_id: university?.id,
          item_name: university?.name,
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
        description: `${university?.name} has been saved.`,
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

      {/* Hero Section */}
      <div className="w-full h-[400px] relative overflow-hidden">
        {images.length > 0 ? (
          <img
            src={images[0]}
            alt={university.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-primary/10 flex items-center justify-center">
            <span className="text-6xl">🏛️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
          <div className="container mx-auto px-4 py-8 text-white">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">{university.name}</h1>
                <div className="flex items-center gap-2 text-white/90">
                  <MapPin className="h-5 w-5" />
                  <span className="text-lg">{university.city}, {university.address}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={toggleFavorite} variant="secondary" size="lg" className="gap-2">
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  {isFavorite ? 'Saved' : 'Save'}
                </Button>
                {university.apply_link && (
                  <Button asChild size="lg" className="gap-2">
                    <a href={university.apply_link} target="_blank" rel="noopener noreferrer">
                      Apply Now
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 relative z-10 pb-12">
        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card shadow-lg border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{university.credit_hours || "N/A"}</p>
                <p className="text-sm text-muted-foreground">Credit Hours</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-lg border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {university.starting_date
                    ? new Date(university.starting_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                    : "TBD"}
                </p>
                <p className="text-xs text-muted-foreground">Starting Date</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-lg border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {university.application_deadline
                    ? new Date(university.application_deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                    : "Open"}
                </p>
                <p className="text-xs text-muted-foreground">Deadline</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-lg border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{university.available_seats || "Open"}</p>
                <p className="text-sm text-muted-foreground">Available Seats</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">
            {/* About University */}
            <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <h2 className="text-xl font-bold mb-6 text-foreground">About University</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-3xl font-bold text-primary mb-1">{university.ranking || "N/A"}</p>
                  <p className="text-sm text-muted-foreground">Ranking</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-lg font-bold text-primary mb-1 line-clamp-1">{university.city}</p>
                  <p className="text-sm text-muted-foreground">Campus</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-lg font-bold text-primary mb-1">{university.study_mode || "On-site"}</p>
                  <p className="text-sm text-muted-foreground">Study Mode</p>
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <h2 className="text-xl font-bold mb-4 text-foreground">Description</h2>
              <div className="prose max-w-none text-muted-foreground dark:text-gray-300">
                <p>{university.description || "No description available."}</p>
              </div>
            </section>

            {/* Admission Requirements */}
            <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <h2 className="text-xl font-bold mb-4 text-foreground">Admission Requirements</h2>
              <div className="prose max-w-none text-muted-foreground dark:text-gray-300 bg-muted/30 p-4 rounded-lg border border-border/50">
                <p className="whitespace-pre-line">{university.admission_requirements || "Contact university for admission requirements."}</p>
              </div>
            </section>

            {/* Fee Structure */}
            <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
              <h2 className="text-xl font-bold mb-4 text-foreground">Fee Structure</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg border border-border/50">
                  <div>
                    <p className="font-semibold text-primary text-lg">Tuition Fee</p>
                    <p className="text-sm text-muted-foreground">Per Semester (Estimated)</p>
                  </div>
                  <p className="text-xl font-bold text-foreground">{university.tuition_range || "Contact University"}</p>
                </div>
              </div>
            </section>

            {/* Gallery */}
            {images.length > 0 && (
              <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
                <h2 className="text-xl font-bold mb-4 text-foreground">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(img)}
                    >
                      <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="bg-card border-border">
              <CardContent className="pt-6 space-y-4">
                <h3 className="text-xl font-semibold mb-4 text-foreground">Contact Information</h3>
                {university.website && (
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                      <Globe className="h-4 w-4" />
                    </div>
                    <a href={university.website} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-primary truncate text-foreground">
                      Visit Website
                    </a>
                  </div>
                )}
                {university.contact_email && (
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                      <Mail className="h-4 w-4" />
                    </div>
                    <a href={`mailto:${university.contact_email}`} className="text-sm font-medium hover:text-primary truncate text-foreground">
                      {university.contact_email}
                    </a>
                  </div>
                )}
                {university.contact_phone && (
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                      <Phone className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{university.contact_phone}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Disciplines Tags */}
            {university.disciplines && university.disciplines.length > 0 && (
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Disciplines</h3>
                  <div className="flex flex-wrap gap-2">
                    {university.disciplines.map((discipline, idx) => (
                      <span key={idx} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {discipline}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Programs Tags */}
            {university.programs && university.programs.length > 0 && (
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4 text-foreground">Programs</h3>
                  <div className="flex flex-wrap gap-2">
                    {university.programs.map((program, idx) => (
                      <span key={idx} className="bg-secondary/10 text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
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

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
            <img
              src={selectedImage}
              alt="Gallery Fullscreen"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <span className="text-4xl">&times;</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Loader } from "@/components/ui/loader";
import { Card, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar, ExternalLink, Banknote, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
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

export default function Scholarships() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(4);
  const { toast } = useToast();

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const { data, error } = await supabase
        .from('scholarships')
        .select('id, title, provider, amount, deadline, eligibility, link, image_url')
        .order('deadline', { ascending: true });

      if (error) throw error;
      setScholarships(data as unknown as Scholarship[]);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load scholarships',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredScholarships = scholarships.filter((scholarship) =>
    scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.eligibility?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedScholarships = filteredScholarships.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Breadcrumbs />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Scholarships</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Discover funding opportunities for your education
          </p>

          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search scholarships..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <Loader center />
        ) : filteredScholarships.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {searchTerm ? 'No scholarships found matching your search' : 'No scholarships available yet'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {displayedScholarships.map((scholarship) => (
              <Card
                key={scholarship.id}
                className="group hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row overflow-hidden border-border/50 bg-card"
              >
                {/* Image Section - Left Side */}
                <div className="w-full md:w-[320px] h-64 md:h-auto relative shrink-0">
                  {scholarship.image_url ? (
                    <img
                      src={scholarship.image_url}
                      alt={scholarship.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted/20 flex items-center justify-center text-muted-foreground">
                      <GraduationCap className="h-16 w-16 opacity-50" />
                    </div>
                  )}
                </div>

                {/* Content Section - Right Side */}
                <div className="flex flex-col flex-1 p-6 gap-5">
                  {/* Header */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-2xl font-bold text-foreground">
                        {scholarship.title}
                      </CardTitle>
                    </div>

                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="flex items-center gap-1.5 text-sm font-medium">
                        <GraduationCap className="h-4 w-4" />
                        <span>{scholarship.provider}</span>
                      </div>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-primary">Deadline</p>
                      <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                        <Calendar className="w-5 h-5" />
                        {scholarship.deadline
                          ? format(new Date(scholarship.deadline), 'MMM dd, yyyy')
                          : "Open"}
                      </div>
                    </div>
                    <div className="space-y-1 border-l-2 border-border/50 pl-4">
                      <p className="text-sm font-medium text-muted-foreground">Amount</p>
                      <p className="text-sm font-bold text-foreground flex items-center gap-1">
                        <Banknote className="h-4 w-4" />
                        {scholarship.amount || "Variable"}
                      </p>
                    </div>
                    {/* Optional: Add a 3rd column if needed (e.g. Eligibility snippet), matching 3 cols of Universities */}
                    {scholarship.eligibility && (
                      <div className="space-y-1 border-l-2 border-border/50 pl-4 hidden md:block">
                        <p className="text-sm font-medium text-muted-foreground">Eligibility</p>
                        <p className="text-sm font-bold text-foreground line-clamp-1">
                          {scholarship.eligibility}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="mt-auto pt-2 flex gap-3">
                    <Link to={`/scholarships/${scholarship.id}`} className="block flex-1">
                      <Button className="w-full h-11 bg-[#2700D3] hover:bg-[#2700D3]/90 text-white font-semibold text-base shadow-sm hover:shadow-md transition-all rounded-md">
                        View Details
                      </Button>
                    </Link>
                    {scholarship.link && (
                      <Button asChild variant="outline" className="h-11 px-6 border-primary/20 hover:bg-primary/5">
                        <a href={scholarship.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            {filteredScholarships.length > visibleCount && (
              <div className="flex justify-center mt-4">
                <Button
                  onClick={() => setVisibleCount((prev) => prev + 4)}
                  variant="outline"
                  className="min-w-[200px]"
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

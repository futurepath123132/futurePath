import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Loader } from "@/components/ui/loader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Calendar, ExternalLink, DollarSign } from 'lucide-react';
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScholarships.map((scholarship) => (
              <Card key={scholarship.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <Link to={`/scholarships/${scholarship.id}`}>
                  <CardHeader>
                    <CardTitle>{scholarship.title}</CardTitle>
                    <CardDescription>{scholarship.provider}</CardDescription>
                    {scholarship.image_url && (
                      <img
                        src={scholarship.image_url}
                        alt={scholarship.title}
                        className="w-full h-40 object-cover rounded mt-2"
                      />
                    )}
                  </CardHeader>
                </Link>
                <CardContent className="space-y-4">
                  {scholarship.amount && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{scholarship.amount}</span>
                    </div>
                  )}
                  {scholarship.deadline && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Deadline: {format(new Date(scholarship.deadline), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  )}
                  {scholarship.eligibility && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Eligibility</p>
                      <p className="text-sm line-clamp-3">{scholarship.eligibility}</p>
                    </div>
                  )}
                  {scholarship.link && (
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full"
                      asChild
                    >
                      <a
                        href={scholarship.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View & Apply
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

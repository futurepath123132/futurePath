import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Search, MapPin } from 'lucide-react';
import SidebarFilters from '@/components/SidebarFilters';
import Breadcrumbs from '@/components/Breadcrumbs';
import { AddUniversityDialog, University } from '@/components/admin/AddUniversityDialog';
import { Loader } from '@/components/ui/loader';
// import { seedUniversities } from '@/components/admin/data/seedData';

interface Filters {
  city?: string;
  tuition_range?: string;
  discipline?: string;
}

export default function AdminUniversities() {
  const { user, loading, isAdmin } = useAuth();
  const { toast } = useToast();
  const [universities, setUniversities] = useState<University[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);

  useEffect(() => {
    if (user && isAdmin) fetchUniversities();
  }, [user, isAdmin]);

  if (loading) return <Loader center />;
  if (!user || !isAdmin) return <Navigate to="/" replace />;

  const fetchUniversities = async () => {
    const { data, error } = await supabase.from('universities').select('*').order('name');
    if (error) toast({ variant: 'destructive', title: 'Error', description: error.message });
    else {
      const typedData = (data as unknown as University[]) || [];
      setUniversities(typedData);
      setFilteredUniversities(typedData);
    }
  };

  useEffect(() => {
    let result = universities;

    // Apply search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(uni =>
        uni.name.toLowerCase().includes(lowerTerm) ||
        uni.city.toLowerCase().includes(lowerTerm) ||
        uni.disciplines?.some(d => d.toLowerCase().includes(lowerTerm))
      );
    }

    // Apply filters
    if (filters.city) {
      result = result.filter(u => u.city === filters.city);
    }
    if (filters.tuition_range) {
      result = result.filter(u => u.tuition_range === filters.tuition_range);
    }
    if (filters.discipline) {
      result = result.filter(u => u.disciplines?.includes(filters.discipline!));
    }

    setFilteredUniversities(result);
  }, [searchTerm, filters, universities]);

  const handleFilterChange = (selected: Filters) => {
    setFilters(selected);
  };

  const handleEdit = (university: University) => {
    setEditingId(university.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this university?')) return;
    const { error } = await supabase.from('universities').delete().eq('id', id);
    if (error) toast({ variant: 'destructive', title: 'Error', description: error.message });
    else { toast({ title: 'Success', description: 'University deleted successfully' }); fetchUniversities(); }
  };

  // const handleSeed = async () => {
  //   try {
  //     let addedCount = 0;
  //     let updatedCount = 0;

  //     for (const seedUni of seedUniversities) {
  //       // Check if exists
  //       const { data: existing } = await supabase
  //         .from('universities')
  //         .select('id')
  //         .eq('name', seedUni.name)
  //         .maybeSingle();

  //       if (existing) {
  //         // Update new fields (rankings)
  //         const { error } = await supabase
  //           .from('universities')
  //           .update({
  //             hec_recognized: seedUni.hec_recognized,
  //             scimago_ranking: seedUni.scimago_ranking,
  //             qs_ranking: seedUni.qs_ranking,
  //             ranking: seedUni.ranking
  //           })
  //           .eq('id', existing.id);
  //         if (error) console.error(error);
  //         updatedCount++;
  //       } else {
  //         // Insert
  //         const { error } = await supabase.from('universities').insert(seedUni);
  //         if (error) console.error(error);
  //         addedCount++;
  //       }
  //     }
  //     toast({ title: 'Seeding Complete', description: `Added ${addedCount} new, Updated ${updatedCount} existing universities.` });
  //     fetchUniversities();
  //   } catch (e: any) {
  //     toast({ variant: 'destructive', title: 'Seeding Failed', description: e.message });
  //   }
  // };

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Breadcrumbs />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/admin" className="text-primary hover:underline mb-2 inline-block">← Back to Admin</Link>
            <h1 className="text-4xl font-bold text-foreground">Manage Universities</h1>
          </div>

          <div className="flex gap-2">
            {/* <Button variant="outline" onClick={handleSeed}>Seed Missing Universities</Button> */}
            <Button onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Add University</Button>
          </div>

          <AddUniversityDialog
            open={dialogOpen}
            onOpenChange={handleOpenChange}
            universityToEdit={universities.find(u => u.id === editingId) || null}
            onSuccess={fetchUniversities}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-4">
            <SidebarFilters
              filters={{
                city: ["Lahore", "Faisalabad", "Multan"],
                tuition_range: ["100,000 - 200,000", "300,000 - 400,000", "500,000+"],
                discipline: ["Engineering", "Business", "Arts", "Medical"],
              }}
              selectedFilters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className="flex-1">
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, city, or discipline..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="grid gap-4">
              {filteredUniversities.map((university) => (
                <Card key={university.id}>
                  <div className="group hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row overflow-hidden border-border/50 bg-card">
                    {/* Image Section - Left Side */}
                    <div className="w-full md:w-[320px] h-64 md:h-auto relative shrink-0">
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

                    {/* Content Section - Right Side */}
                    <div className="flex flex-col flex-1 p-6 gap-5">
                      {/* Header */}
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <CardTitle className="text-2xl font-bold text-foreground">
                            {university.name}
                          </CardTitle>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(university)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDelete(university.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-muted-foreground">
                          {university.icon_url && (
                            <img
                              src={university.icon_url}
                              alt="icon"
                              className="w-6 h-6 object-contain"
                            />
                          )}
                          <div className="flex items-center gap-1.5 text-sm">
                            <MapPin className="h-4 w-4" />
                            <span>{university.city}, Pakistan</span>
                          </div>
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-3 gap-4 py-2">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-primary">Deadline</p>
                          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                            {university.application_deadline ? new Date(university.application_deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "Open"}
                          </div>
                        </div>
                        <div className="space-y-1 border-l-2 border-border/50 pl-4">
                          <p className="text-sm font-medium text-muted-foreground">Fee (Semester)</p>
                          <p className="text-sm font-bold text-foreground">
                            {university.tuition_range || "TBD"}
                          </p>
                        </div>
                        <div className="space-y-1 border-l-2 border-border/50 pl-4">
                          <p className="text-sm font-medium text-muted-foreground">Study Mode</p>
                          <p className="text-sm font-bold text-foreground">
                            {university.study_mode || "On-site"}
                          </p>
                        </div>
                      </div>

                      {/* Additional Admin Info (Optional, maybe hidden or small) */}
                      <div className="mt-auto pt-2 text-xs text-muted-foreground flex gap-4">
                        {university.website && <a href={university.website} target="_blank" rel="noopener noreferrer" className="hover:underline">Website</a>}
                        {university.contact_email && <span>{university.contact_email}</span>}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

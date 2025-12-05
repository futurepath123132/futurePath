import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Search, MapPin } from 'lucide-react';
import SidebarFilters from '@/components/SidebarFilters';
import Breadcrumbs from '@/components/Breadcrumbs';

interface University {
  id: string;
  name: string;
  city: string;
  address: string;
  website: string;
  tuition_range: string;
  ranking: number;
  description: string;
  apply_link: string;
  contact_email: string;
  contact_phone: string;
  disciplines: string[];
  programs: string[];
  application_deadline?: string;
  images?: string[];
  icon_url?: string;
  study_mode?: 'On-site' | 'Online' | 'Hybrid';
  size?: string;
  credit_hours?: number;
  starting_date?: string;
  available_seats?: number;
  admission_requirements?: string;
}

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
  const [images, setImages] = useState<FileList | null>(null);
  const [icon, setIcon] = useState<File | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    address: '',
    website: '',
    tuition_range: '',
    ranking: '',
    description: '',
    apply_link: '',
    contact_email: '',
    contact_phone: '',
    disciplines: '',
    programs: '',
    application_deadline: '',
    study_mode: 'On-site',
    size: '',
    credit_hours: '',
    starting_date: '',
    available_seats: '',
    admission_requirements: '',
  });

  useEffect(() => {
    if (user && isAdmin) fetchUniversities();
  }, [user, isAdmin]);

  if (loading) return <div>Loading...</div>;
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrls: string[] = [];
    let iconUrl: string | null = null;

    if (icon) {
      //sanitize name for folder
      const safeName = formData.name.replace(/[^a-zA-Z0-9-_]/g, "_");
      const iconPath = `${safeName}/icon_${Date.now()}_${icon.name}`;
      const { error: iconUploadError } = await supabase.storage.from('uni_icon').upload(iconPath, icon, { upsert: true });
      if (iconUploadError) toast({ variant: 'destructive', title: 'Icon upload error', description: iconUploadError.message });
      else {
        const { data: iconPublicUrl } = supabase.storage.from('uni_icon').getPublicUrl(iconPath);
        iconUrl = iconPublicUrl.publicUrl;
      }
    }

    if (images && images.length > 0) {
      for (const file of Array.from(images)) {
        const filePath = `${formData.name}/${Date.now()}_${file.name}`;
        const { data, error: uploadError } = await supabase.storage.from('university-images').upload(filePath, file);
        if (uploadError) { toast({ variant: 'destructive', title: 'Upload error', description: uploadError.message }); return; }
        const { data: publicUrlData } = supabase.storage.from('university-images').getPublicUrl(filePath);
        imageUrls.push(publicUrlData.publicUrl);
      }
    }

    const universityData = {
      ...formData,
      ranking: formData.ranking ? parseInt(formData.ranking) : null,
      disciplines: formData.disciplines ? formData.disciplines.split(',').map(d => d.trim()) : [],
      programs: formData.programs ? formData.programs.split(',').map(p => p.trim()) : [],
      created_by: user?.id,
      images: imageUrls.length ? imageUrls : undefined,
      icon_url: iconUrl,
      credit_hours: formData.credit_hours ? parseInt(formData.credit_hours) : null,
      starting_date: formData.starting_date || null,
      available_seats: formData.available_seats ? parseInt(formData.available_seats) : null,
      admission_requirements: formData.admission_requirements || null,
    };

    if (editingId) {
      const { error } = await supabase.from('universities').update(universityData).eq('id', editingId);
      if (error) toast({ variant: 'destructive', title: 'Error', description: error.message });
      else { toast({ title: 'Success', description: 'University updated successfully' }); setDialogOpen(false); resetForm(); fetchUniversities(); }
    } else {
      const { error } = await supabase.from('universities').insert(universityData);
      if (error) toast({ variant: 'destructive', title: 'Error', description: error.message });
      else { toast({ title: 'Success', description: 'University added successfully' }); setDialogOpen(false); resetForm(); fetchUniversities(); }
    }
  };

  const handleEdit = (university: University) => {
    setEditingId(university.id);
    setFormData({
      ...university,
      ranking: university.ranking?.toString() || '',
      disciplines: university.disciplines?.join(', ') || '',
      programs: university.programs?.join(', ') || '',
      study_mode: university.study_mode || 'On-site',
      application_deadline: university.application_deadline || '',
      size: university.size || '',
      credit_hours: university.credit_hours?.toString() || '',
      starting_date: university.starting_date || '',
      available_seats: university.available_seats?.toString() || '',
      admission_requirements: university.admission_requirements || '',
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this university?')) return;
    const { error } = await supabase.from('universities').delete().eq('id', id);
    if (error) toast({ variant: 'destructive', title: 'Error', description: error.message });
    else { toast({ title: 'Success', description: 'University deleted successfully' }); fetchUniversities(); }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '', city: '', address: '', website: '', tuition_range: '', ranking: '',
      description: '', apply_link: '', contact_email: '', contact_phone: '',
      disciplines: '', programs: '', application_deadline: '', study_mode: 'On-site',
      size: '', credit_hours: '', starting_date: '', available_seats: '', admission_requirements: '',
    });
    setImages(null);
    setIcon(null);
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

          <Dialog open={dialogOpen} onOpenChange={open => { setDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />Add University</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editingId ? 'Edit University' : 'Add New University'}</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label htmlFor="name">University Name *</Label><Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required /></div>
                  <div><Label htmlFor="city">City *</Label><Input id="city" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} required /></div>
                </div>
                <div><Label htmlFor="address">Address</Label><Input id="address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} /></div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label htmlFor="website">Website URL</Label><Input id="website" type="url" value={formData.website} onChange={e => setFormData({ ...formData, website: e.target.value })} /></div>
                  <div><Label htmlFor="apply_link">Apply Link</Label><Input id="apply_link" type="url" value={formData.apply_link} onChange={e => setFormData({ ...formData, apply_link: e.target.value })} /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label htmlFor="tuition_range">Tuition Range</Label><Input id="tuition_range" placeholder="e.g., 100,000 - 300,000 PKR" value={formData.tuition_range} onChange={e => setFormData({ ...formData, tuition_range: e.target.value })} /></div>
                  <div><Label htmlFor="ranking">Ranking</Label><Input id="ranking" type="number" value={formData.ranking} onChange={e => setFormData({ ...formData, ranking: e.target.value })} /></div>
                </div>
                <div><Label htmlFor="size">Size (sq ft)</Label><Input id="size" placeholder="e.g., 500,000" value={formData.size} onChange={e => setFormData({ ...formData, size: e.target.value })} /></div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label htmlFor="credit_hours">Credit Hours</Label><Input id="credit_hours" type="number" value={formData.credit_hours} onChange={e => setFormData({ ...formData, credit_hours: e.target.value })} /></div>
                  <div><Label htmlFor="available_seats">Available Seats</Label><Input id="available_seats" type="number" value={formData.available_seats} onChange={e => setFormData({ ...formData, available_seats: e.target.value })} /></div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label htmlFor="application_deadline">Application Deadline</Label><Input id="application_deadline" type="date" value={formData.application_deadline} onChange={e => setFormData({ ...formData, application_deadline: e.target.value })} /></div>
                  <div><Label htmlFor="starting_date">Starting Date</Label><Input id="starting_date" type="date" value={formData.starting_date} onChange={e => setFormData({ ...formData, starting_date: e.target.value })} /></div>
                </div>
                <div><Label htmlFor="study_mode">Study Mode</Label>
                  <select id="study_mode" value={formData.study_mode} onChange={e => setFormData({ ...formData, study_mode: e.target.value as 'On-site' | 'Online' | 'Hybrid' })} className="w-full border rounded px-2 py-1">
                    <option value="On-site">On-site</option>
                    <option value="Online">Online</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div><Label htmlFor="description">Description</Label><Textarea id="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
                <div><Label htmlFor="admission_requirements">Admission Requirements</Label><Textarea id="admission_requirements" value={formData.admission_requirements} onChange={e => setFormData({ ...formData, admission_requirements: e.target.value })} rows={3} /></div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><Label htmlFor="contact_email">Contact Email</Label><Input id="contact_email" type="email" value={formData.contact_email} onChange={e => setFormData({ ...formData, contact_email: e.target.value })} /></div>
                  <div><Label htmlFor="contact_phone">Contact Phone</Label><Input id="contact_phone" value={formData.contact_phone} onChange={e => setFormData({ ...formData, contact_phone: e.target.value })} /></div>
                </div>
                <div><Label htmlFor="disciplines">Disciplines (comma-separated)</Label><Input id="disciplines" placeholder="e.g., Computer Science, Engineering, Medicine" value={formData.disciplines} onChange={e => setFormData({ ...formData, disciplines: e.target.value })} /></div>
                <div><Label htmlFor="programs">Programs (comma-separated)</Label><Input id="programs" placeholder="e.g., BS, MS, PhD" value={formData.programs} onChange={e => setFormData({ ...formData, programs: e.target.value })} /></div>
                <div><Label htmlFor="icon">Upload Icon</Label><Input id="icon" type="file" accept="image/*" onChange={e => setIcon(e.target.files?.[0] || null)} /></div>
                <div><Label htmlFor="images">Upload Images</Label><Input id="images" type="file" multiple accept="image/*" onChange={e => setImages(e.target.files)} /></div>
                <div className="flex gap-2 pt-4"><Button type="submit">{editingId ? 'Update University' : 'Add University'}</Button><Button type="button" variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Cancel</Button></div>
              </form>
            </DialogContent>
          </Dialog>
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

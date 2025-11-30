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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import Breadcrumbs from '@/components/Breadcrumbs';

interface Scholarship {
  id: string;
  title: string;
  provider: string;
  amount: string;
  eligibility: string;
  deadline: string;
  program_level: string;
  link: string;
  description: string;
  disciplines: string[];
  documents_required: string[];
  image_url?: string;
  
}

export default function AdminScholarships() {
  const { user, loading, isAdmin } = useAuth();
  const { toast } = useToast();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    provider: '',
    amount: '',
    eligibility: '',
    deadline: '',
    program_level: '',
    link: '',
    description: '',
    disciplines: '',
    documents_required: '',
    image: null as File | null,
  });

  useEffect(() => {
    if (user && isAdmin) {
      fetchScholarships();
    }
  }, [user, isAdmin]);

  if (loading) return <div>Loading...</div>;
  if (!user || !isAdmin) return <Navigate to="/" replace />;
  
  

  const fetchScholarships = async () => {
    const { data, error } = await supabase
      .from('scholarships')
      .select('*')
      .order('deadline', { ascending: true });
      

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      setScholarships(data || []);
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  let imageUrl: string | null = null;

  if (formData.image) {
    const file = formData.image;
    const filePath = `scholarships/${editingId || crypto.randomUUID()}/${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('scholarships-images') // your bucket name
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ variant: 'destructive', title: 'Error', description: uploadError.message });
      return;
    }

    const { data: urlData } = supabase.storage
      .from('scholarships-images')
      .getPublicUrl(filePath);

    imageUrl = urlData.publicUrl;
  }

  const scholarshipData: any = {
    title: formData.title,
    provider: formData.provider,
    amount: formData.amount || null,
    eligibility: formData.eligibility || null,
    deadline: formData.deadline || null,
    program_level: formData.program_level || null,
    link: formData.link || null,
    description: formData.description || null,
    disciplines: formData.disciplines ? formData.disciplines.split(',').map(d => d.trim()) : [],
    documents_required: formData.documents_required ? formData.documents_required.split(',').map(d => d.trim()) : [],
    created_by: user?.id,
    ...(imageUrl && { image_url: imageUrl }), // only add if image exists
  };

  if (editingId) {
    const { error } = await supabase
      .from('scholarships')
      .update(scholarshipData)
      .eq('id', editingId);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Success', description: 'Scholarship updated successfully' });
      setDialogOpen(false);
      resetForm();
      fetchScholarships();
    }
  } else {
    const { error } = await supabase
      .from('scholarships')
      .insert(scholarshipData);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Success', description: 'Scholarship added successfully' });
      setDialogOpen(false);
      resetForm();
      fetchScholarships();
    }
  }
};

  const handleEdit = (scholarship: Scholarship) => {
    setEditingId(scholarship.id);
    setFormData({
      title: scholarship.title,
      provider: scholarship.provider,
      amount: scholarship.amount || '',
      eligibility: scholarship.eligibility || '',
      deadline: scholarship.deadline || '',
      program_level: scholarship.program_level || '',
      link: scholarship.link || '',
      description: scholarship.description || '',
      disciplines: scholarship.disciplines?.join(', ') || '',
      documents_required: scholarship.documents_required?.join(', ') || '',
      image: null,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this scholarship?')) return;

    const { error } = await supabase
      .from('scholarships')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    } else {
      toast({ title: 'Success', description: 'Scholarship deleted successfully' });
      fetchScholarships();
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: '',
      provider: '',
      amount: '',
      eligibility: '',
      deadline: '',
      program_level: '',
      link: '',
      description: '',
      disciplines: '',
      documents_required: '',
      image: null,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
       <Breadcrumbs />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/admin" className="text-primary hover:underline mb-2 inline-block">
              ← Back to Admin
            </Link>
            <h1 className="text-4xl font-bold text-foreground">Manage Scholarships</h1>
          </div>

          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {editingId ? 'Edit Scholarship' : 'Add Scholarship'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? 'Edit Scholarship' : 'Add New Scholarship'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Scholarship Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="provider">Provider *</Label>
                    <Input
                      id="provider"
                      value={formData.provider}
                      onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      placeholder="e.g., 50,000 PKR"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="image">Scholarship Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.files ? e.target.files[0] : null })
                    }
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="deadline">Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="program_level">Program Level</Label>
                    <Select
                      value={formData.program_level}
                      onValueChange={(value) => setFormData({ ...formData, program_level: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BS">BS</SelectItem>
                        <SelectItem value="MS">MS</SelectItem>
                        <SelectItem value="PhD">PhD</SelectItem>
                        <SelectItem value="Diploma">Diploma</SelectItem>
                        <SelectItem value="Certificate">Certificate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="eligibility">Eligibility</Label>
                  <Textarea
                    id="eligibility"
                    value={formData.eligibility}
                    onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="link">Application Link</Label>
                  <Input
                    id="link"
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="disciplines">Disciplines (comma-separated)</Label>
                  <Input
                    id="disciplines"
                    placeholder="e.g., Computer Science, Engineering"
                    value={formData.disciplines}
                    onChange={(e) => setFormData({ ...formData, disciplines: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="documents_required">Documents Required (comma-separated)</Label>
                  <Input
                    id="documents_required"
                    placeholder="e.g., Transcript, CNIC, Recommendation Letter"
                    value={formData.documents_required}
                    onChange={(e) => setFormData({ ...formData, documents_required: e.target.value })}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit">
                    {editingId ? 'Update Scholarship' : 'Add Scholarship'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {scholarships.map((scholarship) => (
            <Card key={scholarship.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{scholarship.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{scholarship.provider}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(scholarship)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(scholarship.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {scholarship.image_url && (
                  <img
                    src={scholarship.image_url}
                    alt={scholarship.title}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                )}
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  {scholarship.amount && (
                    <div>
                      <span className="font-medium">Amount:</span> {scholarship.amount}
                    </div>
                  )}
                  {scholarship.deadline && (
                    <div>
                      <span className="font-medium">Deadline:</span>{' '}
                      {format(new Date(scholarship.deadline), 'MMM dd, yyyy')}
                    </div>
                  )}
                  {scholarship.program_level && (
                    <div>
                      <span className="font-medium">Level:</span> {scholarship.program_level}
                    </div>
                  )}
                  {scholarship.link && (
                    <div>
                      <span className="font-medium">Link:</span>{' '}
                      <a
                        href={scholarship.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Apply Here
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

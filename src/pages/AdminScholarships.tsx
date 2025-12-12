import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ScholarshipDialog, Scholarship } from '@/components/admin/ScholarshipDialog';
import { Loader } from '@/components/ui/loader';

export default function AdminScholarships() {
  const { user, loading, isAdmin } = useAuth();
  const { toast } = useToast();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);

  useEffect(() => {
    if (user && isAdmin) {
      fetchScholarships();
    }
  }, [user, isAdmin]);

  if (loading) return <Loader center />;
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

  const handleEdit = (scholarship: Scholarship) => {
    setEditingScholarship(scholarship);
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

          <ScholarshipDialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) setEditingScholarship(null);
            }}
            initialData={editingScholarship}
            onSuccess={fetchScholarships}
            trigger={
              <Button onClick={() => {
                setEditingScholarship(null);
                setDialogOpen(true);
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add Scholarship
              </Button>
            }
          />
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

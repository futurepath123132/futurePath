import { useAuth } from '@/hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Award, Users, BarChart, Globe } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Loader } from '@/components/ui/loader';

export default function Admin() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <Loader center />;
  }

  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Breadcrumbs />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">Admin Panel</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/admin/universities">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <GraduationCap className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Manage Universities</CardTitle>
                <CardDescription>
                  Add, edit, or remove universities from the platform
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/scholarships">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Award className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Manage Scholarships</CardTitle>
                <CardDescription>
                  Add, edit, or remove scholarship opportunities
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/scraper">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Globe className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Web Scraper</CardTitle>
                <CardDescription>
                  Fetch and import data from external websites
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/users">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage user accounts
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/admin/analytics">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <BarChart className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Analytics</CardTitle>
                <CardDescription>
                  View platform statistics and insights
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

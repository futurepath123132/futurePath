import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { GraduationCap, Menu, X } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from "./ThemeToggle";
import ProfileDropdown from './ProfileDropdown';

export default function Navbar() {
  const { user, signOut, isAdmin, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
            <GraduationCap className="h-8 w-8 text-primary" />
            Future Path
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/universities" className="text-foreground hover:text-primary transition-colors">
              Universities
            </Link>
            <Link to="/scholarships" className="text-foreground hover:text-primary transition-colors">
              Scholarships
            </Link>
            <Link to="/feedback" className="text-foreground hover:text-primary transition-colors">
              Feedback
            </Link>

            {user ? (
              <>
                <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>

                {!loading && isAdmin && (
                  <Link to="/admin" className="text-foreground hover:text-primary transition-colors">
                    Admin
                  </Link>
                )}

                <ThemeToggle />
                <ProfileDropdown />
              </>
            ) : (
              <>
                <ThemeToggle />
                <Link to="/auth">
                  <Button variant="default" size="sm">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-3">
            <Link
              to="/universities"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Universities
            </Link>
            <Link
              to="/scholarships"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Scholarships
            </Link>
            <Link
              to="/feedback"
              className="block py-2 text-foreground hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Feedback
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>

                {!loading && isAdmin && (
                  <Link
                    to="/admin"
                    className="block py-2 text-foreground hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}

                <div className="pt-2">
                  <ProfileDropdown />
                </div>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="default" size="sm" className="w-full">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

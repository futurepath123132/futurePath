// components/Breadcrumbs.tsx
import { Link, useLocation } from 'react-router-dom';

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  // Map static segments to friendly names
  const staticNames: Record<string, string> = {
    universities: 'Universities',
    scholarships: 'Scholarships',
    dashboard: 'Dashboard',
    admin: 'Admin',
  };

  // Format name for each breadcrumb segment
  const formatName = (segment: string, index: number) => {
    const prev = pathnames[index - 1];

    // If the previous segment is 'universities', any ID shows 'University Detail'
    if (prev === 'universities') return 'University Detail';
    if (prev === 'scholarships') return 'Scholarship Detail';

    // Use static name if available, else format dynamically
    return staticNames[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <nav className="bg-background px-4 py-2 border-b border-border text-sm text-muted-foreground">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="hover:text-primary">
            Home
          </Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;

          return (
            <li key={routeTo} className="flex items-center">
              <span className="mx-2">{'>'}</span>
              {isLast ? (
                <span className="text-foreground font-medium">{formatName(name, index)}</span>
              ) : (
                <Link to={routeTo} className="hover:text-primary">
                  {formatName(name, index)}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

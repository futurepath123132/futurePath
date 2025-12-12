import { Card, CardContent } from '@/components/ui/card';
import { Globe, Mail, Phone } from 'lucide-react';
import { UniversityDetail } from './types';

interface UniversitySidebarProps {
    university: UniversityDetail;
}

export function UniversitySidebar({ university }: UniversitySidebarProps) {
    return (
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
                                <span key={idx} className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-medium">
                                    {program}
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

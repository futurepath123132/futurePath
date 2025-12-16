import { Card, CardContent } from '@/components/ui/card';
import { Globe, GraduationCap } from 'lucide-react';
import { Scholarship } from './types';

interface ScholarshipSidebarProps {
    scholarship: Scholarship;
}

export function ScholarshipSidebar({ scholarship }: ScholarshipSidebarProps) {
    return (
        <div className="space-y-6">
            <Card className="bg-card border-border">
                <CardContent className="pt-6 space-y-4">
                    <h3 className="text-xl font-semibold mb-4 text-foreground">Provider Details</h3>
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="p-2 bg-primary/10 rounded-full text-primary">
                            <GraduationCap className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{scholarship.provider}</span>
                    </div>
                    {scholarship.link && (
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="p-2 bg-primary/10 rounded-full text-primary">
                                <Globe className="h-4 w-4" />
                            </div>
                            <a href={scholarship.link} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-primary truncate text-foreground">
                                Visit Website
                            </a>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Calendar, Clock, Users } from 'lucide-react';
import { UniversityDetail } from './types';

interface UniversityStatsProps {
    university: UniversityDetail;
}

export function UniversityStats({ university }: UniversityStatsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {/* Credit Hours Card Removed */}

            <Card className="bg-card shadow-lg border-border">
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <Calendar className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-foreground">
                            {university.starting_date
                                ? new Date(university.starting_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                                : "TBD"}
                        </p>
                        <p className="text-xs text-muted-foreground">Starting Date</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-card shadow-lg border-border">
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-foreground">
                            {university.application_deadline
                                ? new Date(university.application_deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                                : "Open"}
                        </p>
                        <p className="text-xs text-muted-foreground">Deadline</p>
                    </div>
                </CardContent>
            </Card>

         
        </div>
    );
}

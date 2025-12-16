import { Card, CardContent } from '@/components/ui/card';
import { Banknote, Clock } from 'lucide-react';
import { Scholarship } from './types';
import { format } from 'date-fns';

interface ScholarshipStatsProps {
    scholarship: Scholarship;
}

export function ScholarshipStats({ scholarship }: ScholarshipStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card className="bg-card shadow-lg border-border">
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <Banknote className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-foreground">{scholarship.amount || "N/A"}</p>
                        <p className="text-sm text-muted-foreground">Amount</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-card shadow-lg border-border">
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <Clock className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-foreground">
                            {scholarship.deadline
                                ? format(new Date(scholarship.deadline), 'MMM dd, yyyy')
                                : "Open"}
                        </p>
                        <p className="text-sm text-muted-foreground">Deadline</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

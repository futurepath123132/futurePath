import { Scholarship } from './types';

interface ScholarshipInfoProps {
    scholarship: Scholarship;
}

export function ScholarshipInfo({ scholarship }: ScholarshipInfoProps) {
    return (
        <div className="space-y-8">
            <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
                <h2 className="text-xl font-bold mb-4 text-foreground">Eligibility</h2>
                <div className="prose max-w-none text-muted-foreground dark:text-gray-300">
                    <p className="whitespace-pre-line">{scholarship.eligibility || "No eligibility criteria specified."}</p>
                </div>
            </section>
        </div>
    );
}

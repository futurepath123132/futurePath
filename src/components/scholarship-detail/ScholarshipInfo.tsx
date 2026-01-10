import { Scholarship } from './types';
import ReactMarkdown from 'react-markdown';

interface ScholarshipInfoProps {
    scholarship: Scholarship;
}

export function ScholarshipInfo({ scholarship }: ScholarshipInfoProps) {
    return (
        <div className="space-y-8">
            {/* Description Section */}
            {scholarship.description && (
                <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
                    <h2 className="text-xl font-bold mb-4 text-foreground">Description</h2>
                    <div className="prose prose-sm max-w-none dark:prose-invert text-muted-foreground">
                        <ReactMarkdown>
                            {scholarship.description}
                        </ReactMarkdown>
                    </div>
                </section>
            )}

            {/* Eligibility Section */}
            <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
                <h2 className="text-xl font-bold mb-4 text-foreground">Eligibility</h2>
                <div className="prose prose-sm max-w-none dark:prose-invert text-muted-foreground">
                    <ReactMarkdown>
                        {scholarship.eligibility || "No eligibility criteria specified."}
                    </ReactMarkdown>
                </div>
            </section>
        </div>
    );
}

import { UniversityDetail } from './types';

interface UniversityInfoProps {
    university: UniversityDetail;
}

export function UniversityInfo({ university }: UniversityInfoProps) {
    return (
        <div className="space-y-8">
            {/* About University */}
            <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
                <h2 className="text-xl font-bold mb-6 text-foreground">About University</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-3xl font-bold text-primary mb-1">{university.ranking || "N/A"}</p>
                        <p className="text-sm text-muted-foreground">HEC Ranking</p>
                    </div>
                    {university.hec_recognized !== undefined && (
                        <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <p className="text-xl font-bold text-primary mb-1">{university.hec_recognized ? "Yes" : "No"}</p>
                            <p className="text-sm text-muted-foreground">HEC Recognized</p>
                        </div>
                    )}
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-xl font-bold text-primary mb-1">{university.scimago_ranking || "N/A"}</p>
                        <p className="text-sm text-muted-foreground">Scimago Ranking</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-xl font-bold text-primary mb-1">{university.qs_ranking || "N/A"}</p>
                        <p className="text-sm text-muted-foreground">QS Ranking</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-lg font-bold text-primary mb-1 line-clamp-1">{university.city}</p>
                        <p className="text-sm text-muted-foreground">Campus</p>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-lg font-bold text-primary mb-1">{university.study_mode || "On-site"}</p>
                        <p className="text-sm text-muted-foreground">Study Mode</p>
                    </div>
                </div>
            </section>

            {/* Description */}
            <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
                <h2 className="text-xl font-bold mb-4 text-foreground">Description</h2>
                <div className="prose max-w-none text-muted-foreground dark:text-gray-300">
                    <p>{university.description || "No description available."}</p>
                </div>
            </section>

            {/* Admission Requirements */}
            <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
                <h2 className="text-xl font-bold mb-4 text-foreground">Admission Requirements</h2>
                <div className="prose max-w-none text-muted-foreground dark:text-gray-300 bg-muted/30 p-4 rounded-lg border border-border/50">
                    <p className="whitespace-pre-line">{university.admission_requirements || "Contact university for admission requirements."}</p>
                </div>
            </section>

            {/* Fee Structure */}
            <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
                <h2 className="text-xl font-bold mb-4 text-foreground">Fee Structure</h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg border border-border/50">
                        <div>
                            <p className="font-semibold text-primary text-lg">Tuition Fee</p>
                            <p className="text-sm text-muted-foreground">Per Semester (Estimated) in PKR</p>
                        </div>
                        <p className="text-xl font-bold text-foreground">{university.tuition_range || "Contact University"}</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

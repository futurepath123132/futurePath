import { Button } from '@/components/ui/button';
import { Heart, ExternalLink, GraduationCap } from 'lucide-react';
import { Scholarship } from './types';

interface ScholarshipHeroProps {
    scholarship: Scholarship;
    isFavorite: boolean;
    onToggleFavorite: () => void;
}

export function ScholarshipHero({ scholarship, isFavorite, onToggleFavorite }: ScholarshipHeroProps) {
    return (
        <div className="w-full h-[400px] relative overflow-hidden">
            {scholarship.image_url ? (
                <img
                    src={scholarship.image_url}
                    alt={scholarship.title}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-32 w-32 text-primary/40" />
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                <div className="container mx-auto px-4 py-8 text-white">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold mb-2 text-white">{scholarship.title}</h1>
                            <div className="flex items-center gap-2 text-white/90">
                                <span className="text-lg font-medium">{scholarship.provider}</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button onClick={onToggleFavorite} variant="secondary" size="lg" className="gap-2">
                                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                                {isFavorite ? 'Saved' : 'Save'}
                            </Button>
                            {scholarship.link && (
                                <Button asChild size="lg" className="gap-2">
                                    <a href={scholarship.link} target="_blank" rel="noopener noreferrer">
                                        Apply Now
                                        <ExternalLink className="h-5 w-5" />
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Button } from '@/components/ui/button';
import { MapPin, Heart, ExternalLink } from 'lucide-react';
import { UniversityDetail } from './types';

interface UniversityHeroProps {
    university: UniversityDetail;
    isFavorite: boolean;
    onToggleFavorite: () => void;
}

export function UniversityHero({ university, isFavorite, onToggleFavorite }: UniversityHeroProps) {
    return (
        <div className="w-full h-[400px] relative overflow-hidden">
            {university.images && university.images.length > 0 ? (
                <img
                    src={university.images[0]}
                    alt={university.name}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <span className="text-6xl">🏛️</span>
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end">
                <div className="container mx-auto px-4 py-8 text-white">
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-2 text-white">{university.name}</h1>
                            <div className="flex items-center gap-2 text-white/90">
                                <MapPin className="h-5 w-5" />
                                <span className="text-lg">{university.city}, {university.address}</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button onClick={onToggleFavorite} variant="secondary" size="lg" className="gap-2">
                                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                                {isFavorite ? 'Saved' : 'Save'}
                            </Button>
                            {university.apply_link && (
                                <Button asChild size="lg" className="gap-2">
                                    <a href={university.apply_link} target="_blank" rel="noopener noreferrer">
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

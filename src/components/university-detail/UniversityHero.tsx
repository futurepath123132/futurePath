import { Button } from '@/components/ui/button';
import { MapPin, Heart, ExternalLink } from 'lucide-react';
import { UniversityDetail } from './types';

interface UniversityHeroProps {
    university: UniversityDetail;
    isFavorite: boolean;
    onToggleFavorite: () => void;
}

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export function UniversityHero({ university, isFavorite, onToggleFavorite }: UniversityHeroProps) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isTracking, setIsTracking] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            checkTrackingStatus();
        }
    }, [user, university.id]);

    const checkTrackingStatus = async () => {
        const { data } = await supabase
            .from('applications' as any)
            .select('status')
            .eq('user_id', user!.id)
            .eq('university_id', university.id)
            .maybeSingle();

        if (data) {
            setIsTracking(true);
            setStatus(data.status);
        }
    };

    const handleTrackApplication = async () => {
        if (!user) {
            toast({ title: "Please sign in to track applications", variant: "destructive" });
            return;
        }

        if (isTracking) {
            toast({ title: "Already tracking this application. Check your Dashboard." });
            return;
        }

        const { error } = await supabase
            .from('applications' as any)
            .insert({
                user_id: user.id,
                university_id: university.id,
                status: 'interested'
            });

        if (!error) {
            setIsTracking(true);
            setStatus('interested');
            toast({ title: "Application added to Board!" });
        } else {
            toast({ title: "Error tracking application", description: error.message, variant: "destructive" });
        }
    }

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
                            <Button
                                onClick={handleTrackApplication}
                                variant={isTracking ? "outline" : "default"}
                                size="lg"
                                className={`gap-2 ${isTracking ? "bg-white/20 hover:bg-white/30 text-white border-white/50" : ""}`}
                            >
                                {isTracking ? `Tracking: ${status}` : "Track Application"}
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

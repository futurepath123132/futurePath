import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, CalendarDays } from 'lucide-react';
import { University } from './types';

interface DashboardSuggestedUniversitiesProps {
    city: string;
    preferred_discipline: string;
}

export default function DashboardSuggestedUniversities({ city, preferred_discipline }: DashboardSuggestedUniversitiesProps) {
    const [suggestedUniversities, setSuggestedUniversities] = useState<University[]>([]);

    const fetchSuggestedUniversities = async () => {
        try {
            let query = supabase
                .from('universities')
                .select('id, name, city, tuition_range, study_mode, application_deadline, disciplines, images, icon_url')
                .limit(6);

            // Filter by city if available
            if (city) {
                // We use ilike for case-insensitive matching
                query = query.ilike('city', `%${city}%`);
            }

            // Note: Filtering by array column 'disciplines' containing 'preferred_discipline'
            // requires specific syntax. If preferred_discipline is set:
            if (preferred_discipline) {
                query = query.contains('disciplines', [preferred_discipline]);
            }

            const { data, error } = await query;

            if (error) throw error;

            // Filter out past deadlines
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const currentDate = `${year}-${month}-${day}`;

            const filteredData = (data || []).filter((uni: any) => {
                if (!uni.application_deadline) return true;
                return uni.application_deadline >= currentDate;
            });

            setSuggestedUniversities(filteredData);
        } catch (error) {
            console.error('Error fetching suggested universities:', error);
        }
    };

    useEffect(() => {
        if (city || preferred_discipline) {
            fetchSuggestedUniversities();
        }
    }, [city, preferred_discipline]);

    if (suggestedUniversities.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Suggested Universities</h2>
            <div className="grid md:grid-cols-2 gap-4">
                {suggestedUniversities.map((university) => (
                    <Card key={university.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                        <div className="h-40 relative">
                            {university.images && university.images.length > 0 ? (
                                <img
                                    src={university.images[0]}
                                    alt={university.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full bg-muted/20 flex items-center justify-center text-muted-foreground">
                                    <span className="text-4xl">🏛️</span>
                                </div>
                            )}
                        </div>
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-bold line-clamp-1">{university.name}</h3>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                <MapPin className="h-3 w-3" />
                                <span>{university.city}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-medium text-primary mb-4">
                                <CalendarDays className="h-4 w-4" />
                                <span>
                                    {university.application_deadline
                                        ? new Date(university.application_deadline).toLocaleDateString()
                                        : "Open"}
                                </span>
                            </div>
                            <Link to={`/universities/${university.id}`}>
                                <Button className="w-full bg-[#2700D3] hover:bg-[#2700D3]/90 text-white">
                                    View Details
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

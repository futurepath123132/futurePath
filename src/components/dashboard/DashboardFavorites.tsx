import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Heart, GraduationCap, Award, ExternalLink, X } from 'lucide-react';
import { Favorite } from './types';

interface DashboardFavoritesProps {
    userId: string;
}

export default function DashboardFavorites({ userId }: DashboardFavoritesProps) {
    const { toast } = useToast();
    const [favorites, setFavorites] = useState<Favorite[]>([]);

    const fetchFavorites = async () => {
        try {
            const { data: favData, error } = await supabase
                .from('favorites')
                .select('id, item_type, item_id')
                .eq('user_id', userId);

            if (error) throw error;

            const enrichedFavorites: Favorite[] = [];

            for (const fav of favData || []) {
                if (fav.item_type === 'university') {
                    const { data: uni } = await supabase
                        .from('universities')
                        .select('name')
                        .eq('id', fav.item_id)
                        .single();

                    if (uni) {
                        enrichedFavorites.push({
                            ...fav,
                            item_name: uni.name,
                        });
                    }
                } else if (fav.item_type === 'scholarship') {
                    const { data: sch } = await supabase
                        .from('scholarships')
                        .select('title')
                        .eq('id', fav.item_id)
                        .single();

                    if (sch) {
                        enrichedFavorites.push({
                            ...fav,
                            item_name: sch.title,
                        });
                    }
                }
            }

            setFavorites(enrichedFavorites);
        } catch (error: any) {
            console.error('Error fetching favorites:', error);
        }
    };

    const removeFavorite = async (favoriteId: string) => {
        try {
            const { error } = await supabase
                .from('favorites')
                .delete()
                .eq('id', favoriteId);

            if (error) throw error;

            setFavorites(favorites.filter(f => f.id !== favoriteId));
            toast({
                title: 'Removed from favorites',
            });
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: error.message,
            });
        }
    };

    useEffect(() => {
        if (userId) {
            fetchFavorites();
        }
    }, [userId]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-destructive" />
                    Saved Favorites
                </CardTitle>
            </CardHeader>
            <CardContent>
                {favorites.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                        No favorites saved yet. Start exploring!
                    </p>
                ) : (
                    <div className="space-y-3">
                        {favorites.map((favorite) => (
                            <div
                                key={favorite.id}
                                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                            >
                                <div className="flex items-center gap-2">
                                    {favorite.item_type === 'university' ? (
                                        <GraduationCap className="h-4 w-4 text-primary" />
                                    ) : (
                                        <Award className="h-4 w-4 text-primary" />
                                    )}
                                    <div>
                                        <p className="font-medium text-sm line-clamp-1">{favorite.item_name}</p>
                                        <p className="text-xs text-muted-foreground capitalize">
                                            {favorite.item_type}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link
                                        to={
                                            favorite.item_type === 'university'
                                                ? `/universities/${favorite.item_id}`
                                                : `/scholarships`
                                        }
                                    >
                                        <Button size="icon" variant="ghost" className="h-8 w-8">
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                        onClick={() => removeFavorite(favorite.id)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

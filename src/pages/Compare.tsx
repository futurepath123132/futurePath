import { useEffect, useState } from "react";
import { useCompare } from "@/context/CompareContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { X, MapPin, Calendar, University as UniIcon, Check, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import Breadcrumbs from "@/components/Breadcrumbs";

interface UniversityDetails {
    id: string;
    name: string;
    city: string;
    tuition_range?: string;
    study_mode?: string[];
    application_deadline?: string;
    disciplines?: string[];
    website?: string;
    images?: string[];
    icon_url?: string;
    size?: string;
    facilities?: string[]; // Assuming facilities might be added later, or we map existing fields
    ranking?: number; // Placeholder if ranking exists
}

export default function Compare() {
    const { selectedUniversities, removeFromCompare } = useCompare();
    const [universities, setUniversities] = useState<UniversityDetails[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUniversities = async () => {
            if (selectedUniversities.length === 0) {
                setUniversities([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("universities")
                    .select("*")
                    .in("id", selectedUniversities);

                if (error) throw error;
                setUniversities(data || []);
            } catch (error) {
                console.error("Error fetching universities for comparison:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUniversities();
    }, [selectedUniversities]);

    if (loading) {
        return <Loader center />;
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <Breadcrumbs />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Compare Universites</h1>

                {universities.length === 0 ? (
                    <div className="text-center py-20 bg-muted/20 rounded-lg">
                        <h2 className="text-xl font-semibold mb-4">No universities selected</h2>
                        <p className="text-muted-foreground mb-6">
                            Select up to 3 universities to compare them side by side.
                        </p>
                        <Link to="/universities">
                            <Button>Browse Universities</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto pb-4">
                        <div className="grid grid-cols-[200px_repeat(3,1fr)] min-w-[800px] gap-4">
                            {/* Row Headers */}
                            <div className="space-y-4 pt-60 font-semibold text-muted-foreground text-sm">
                                <div className="h-12 flex items-center border-b">City</div>
                                <div className="h-12 flex items-center border-b">Tuition Range</div>
                                <div className="h-12 flex items-center border-b">Study Mode</div>
                                <div className="h-12 flex items-center border-b">Deadline</div>
                                <div className="h-12 flex items-center border-b">Size</div>
                                <div className="h-auto min-h-[48px] flex items-center pt-2">Disciplines</div>
                            </div>

                            {/* University Columns */}
                            {universities.map((uni) => (
                                <div key={uni.id} className="relative flex flex-col space-y-4 bg-card rounded-xl border shadow-sm p-4">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-2 right-2 h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive"
                                        onClick={() => removeFromCompare(uni.id)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>

                                    {/* Header Card */}
                                    <div className="h-48 flex flex-col items-center text-center space-y-3 mb-4">
                                        <div className="w-20 h-20 bg-white rounded-full p-2 shadow-sm border flex items-center justify-center overflow-hidden">
                                            {uni.icon_url ? (
                                                <img src={uni.icon_url} alt={uni.name} className="w-full h-full object-contain" />
                                            ) : (
                                                <UniIcon className="w-10 h-10 text-muted-foreground" />
                                            )}
                                        </div>
                                        <Link to={`/universities/${uni.id}`} className="hover:underline">
                                            <h3 className="font-bold text-lg line-clamp-2 min-h-[3.5rem] flex items-center justify-center">
                                                {uni.name}
                                            </h3>
                                        </Link>
                                        <Link to={`/universities/${uni.id}`} className="w-full">
                                            <Button className="w-full bg-[#2700D3] hover:bg-[#2700D3]/90 text-white" size="sm">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>

                                    {/* Data Rows */}
                                    <div className="text-sm">
                                        <div className="h-12 flex items-center border-b text-foreground font-medium">
                                            <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                                            {uni.city}
                                        </div>
                                        <div className="h-12 flex items-center border-b text-foreground">
                                            {uni.tuition_range || "N/A"}
                                        </div>
                                        <div className="h-12 flex items-center border-b text-foreground">
                                            {uni.study_mode || "On-site"}
                                        </div>
                                        <div className="h-12 flex items-center border-b text-foreground font-medium">
                                            {uni.application_deadline ? (
                                                new Date(uni.application_deadline).toLocaleDateString()
                                            ) : (
                                                <span className="text-green-600 flex items-center"><Check className="w-4 h-4 mr-1" /> Open</span>
                                            )}
                                        </div>
                                        <div className="h-12 flex items-center border-b text-foreground">
                                            {uni.size || "Unknown"}
                                        </div>
                                        <div className="min-h-[48px] py-2 flex flex-wrap gap-1 content-start">
                                            {uni.disciplines?.slice(0, 3).map((d, idx) => (
                                                <span key={idx} className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
                                                    {d}
                                                </span>
                                            ))}
                                            {uni.disciplines && uni.disciplines.length > 3 && (
                                                <span className="text-muted-foreground text-xs flex items-center px-1">+{uni.disciplines.length - 3}</span>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            ))}

                            {/* Empty Slots */}
                            {[...Array(3 - universities.length)].map((_, i) => (
                                <div key={i} className="border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground/50 p-6 space-y-4">
                                    <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center">
                                        <Minus className="w-8 h-8" />
                                    </div>
                                    <span>Empty Slot</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

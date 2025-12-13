import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import {
  Card,
  CardTitle,
} from "@/components/ui/card";
import { Loader } from "@/components/ui/loader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import SidebarFilters from "@/components/SidebarFilters";

import Breadcrumbs from "@/components/Breadcrumbs";
import SeedUniversities from "@/components/seed";
import { CalendarDays } from "lucide-react";
import { useCompare } from "@/context/CompareContext";
import { Checkbox } from "@/components/ui/checkbox";
import CompareFloatingBar from "@/components/CompareFloatingBar";

interface University {
  id: string;
  name: string;
  city: string;
  tuition_range?: string;
  study_mode?: string;
  application_deadline?: string;
  disciplines?: string[];
  website?: string;
  images?: string[];
  icon_url?: string;
  size?: string; // Added size field
}

interface Filters {
  city?: string;
  tuition_range?: string;
  discipline?: string;
  size?: string;
}

export default function Universities() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [allUniversities, setAllUniversities] = useState<University[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { addToCompare, removeFromCompare, isComparing, selectedUniversities } = useCompare();

  const [visibleCount, setVisibleCount] = useState(4);

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      const { data, error } = (await supabase
        .from("universities")
        .select(
          "id, name, city, tuition_range, study_mode, application_deadline, disciplines, website, images, icon_url, size"
        )
        .order("name")) as { data: University[] | null; error: any };


      if (error) throw error;

      // Filter out universities with past deadlines
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const currentDate = `${year}-${month}-${day}`;

      const filteredData = (data || []).filter(uni => {
        if (!uni.application_deadline) return true;
        return uni.application_deadline >= currentDate;
      });

      setUniversities(filteredData);
      setAllUniversities(filteredData);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load universities",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (selected: Filters) => {
    setFilters(selected);
    setVisibleCount(4);
    let filtered = allUniversities;

    if (selected.city)
      filtered = filtered.filter((u) => u.city === selected.city);

    if (selected.tuition_range)
      filtered = filtered.filter(
        (u) => u.tuition_range === selected.tuition_range
      );

    if (selected.discipline)
      filtered = filtered.filter((u) =>
        u.disciplines?.includes(selected.discipline!)
      );

    if (selected.size)
      filtered = filtered.filter((u) => u.size === selected.size);

    setUniversities(filtered);
  };

  const filteredUniversities = universities.filter(
    (uni) =>
      uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      uni.disciplines?.some((d) =>
        d.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Reset pagination when search changes
  useEffect(() => {
    setVisibleCount(4);
  }, [searchTerm]);

  const displayedUniversities = filteredUniversities.slice(0, visibleCount);
  const cities = Array.from(new Set(allUniversities.map((u) => u.city))).sort();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Breadcrumbs />
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-4">
          <SidebarFilters
            filters={{
              city: cities,
              tuition_range: ["100,000 - 200,000", "300,000 - 400,000", "500,000+"],
              discipline: ["Engineering", "Business", "Arts", "Medical"],
              size: Array.from(new Set(allUniversities.map((u) => u.size).filter(Boolean))) as string[],
            }}
            selectedFilters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Universities in Punjab
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Explore universities across Punjab, Pakistan
            </p>
            {/* <div className="my-8">
              <SeedUniversities />
            </div> */}

            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, city, or discipline..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {loading ? (
            <Loader center />
          ) : filteredUniversities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm
                  ? "No universities found matching your search"
                  : "No universities available yet"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {displayedUniversities.map((university) => (
                <Card
                  key={university.id}
                  className="group hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row overflow-hidden border-border/50 bg-card"
                >
                  {/* Image Section - Left Side */}
                  <div className="w-full md:w-[320px] h-64 md:h-auto relative shrink-0">
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

                  {/* Content Section - Right Side */}
                  <div className="flex flex-col flex-1 p-6 gap-5">
                    {/* Header */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <CardTitle className="text-2xl font-bold text-foreground">
                          {university.name}
                        </CardTitle>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`compare-${university.id}`}
                            checked={isComparing(university.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                addToCompare(university.id);
                              } else {
                                removeFromCompare(university.id);
                              }
                            }}
                          />
                          <label
                            htmlFor={`compare-${university.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-muted-foreground select-none"
                          >
                            Compare
                          </label>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-muted-foreground">
                        {university.icon_url && (
                          <img
                            src={university.icon_url}
                            alt="icon"
                            className="w-6 h-6 object-contain"
                          />
                        )}
                        <div className="flex items-center gap-1.5 text-sm">
                          <MapPin className="h-4 w-4" />
                          <span>{university.city}, Pakistan</span>
                        </div>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-3 gap-4 py-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-primary">Deadline</p>
                        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                          {/* here */}
                          <CalendarDays className="w-5 h-5 text-primary" />
                          {university.application_deadline ? new Date(university.application_deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "Open"}
                        </div>
                      </div>
                      <div className="space-y-1 border-l-2 border-border/50 pl-4">
                        <p className="text-sm font-medium text-muted-foreground">Fee (Semester)</p>
                        <p className="text-sm font-bold text-foreground">
                          {university.tuition_range || "TBD"}
                        </p>
                      </div>
                      <div className="space-y-1 border-l-2 border-border/50 pl-4">
                        <p className="text-sm font-medium text-muted-foreground">Study Mode</p>
                        <p className="text-sm font-bold text-foreground">
                          {university.study_mode || "On-site"}
                        </p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto pt-2">
                      <Link to={`/universities/${university.id}`} className="block">
                        <Button className="w-full h-11 bg-[#2700D3] hover:bg-[#2700D3]/90 text-white font-semibold text-base shadow-sm hover:shadow-md transition-all rounded-md">
                          View Program
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}

              {filteredUniversities.length > visibleCount && (
                <div className="flex justify-center mt-4">
                  <Button
                    onClick={() => setVisibleCount((prev) => prev + 4)}
                    variant="outline"
                    className="min-w-[200px]"
                  >
                    Load More
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <CompareFloatingBar />
    </div>
  );
}

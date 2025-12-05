import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface SidebarFiltersProps {
  filters: {
    city?: string[];
    tuition_range?: string[];
    discipline?: string[];
    size?: string[]; // Added size
  };
  selectedFilters: {
    city?: string;
    tuition_range?: string;
    discipline?: string;
    size?: string; // Added size
  };
  onFilterChange: (selected: {
    city?: string;
    tuition_range?: string;
    discipline?: string;
    size?: string;
  }) => void;
}

export default function SidebarFilters({
  filters,
  selectedFilters,
  onFilterChange,
}: SidebarFiltersProps) {
  const handleChange = (key: string, value: string) => {
    const updated = { ...selectedFilters, [key]: value };
    onFilterChange(updated);
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  return (
    <Card className="w-full md:w-64 p-4 space-y-6 bg-muted/30">
      <CardContent className="space-y-4">
        <h3 className="text-xl font-semibold mb-2">Filters</h3>

        {filters.city && (
          <div>
            <p className="font-medium text-sm mb-1">City</p>
            <select
              className="w-full border rounded-md p-2 bg-background text-foreground  dark:text-white"
              value={selectedFilters.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
            >
              <option value="">All</option>
              {filters.city.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        )}

        {filters.tuition_range && (
          <div>
            <p className="font-medium text-sm mb-1">Tuition Range</p>
            <select
              className="w-full border rounded-md p-2 bg-background text-foreground  dark:text-white"
              value={selectedFilters.tuition_range || ""}
              onChange={(e) => handleChange("tuition_range", e.target.value)}
            >
              <option value="">All</option>
              {filters.tuition_range.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>
        )}

        {filters.discipline && (
          <div>
            <p className="font-medium text-sm mb-1">Discipline</p>
            <select
              className="w-full border rounded-md p-2 bg-background text-foreground  dark:text-white"
              value={selectedFilters.discipline || ""}
              onChange={(e) => handleChange("discipline", e.target.value)}
            >
              <option value="">All</option>
              {filters.discipline.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        )}

        {filters.size && (
          <div>
            <p className="font-medium text-sm mb-1">Square Feet</p>
            <select
              className="w-full border rounded-md p-2 bg-background text-foreground  dark:text-white"
              value={selectedFilters.size || ""}
              onChange={(e) => handleChange("size", e.target.value)}
            >
              <option value="">All</option>
              {filters.size.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        )}

        <Button variant="outline" onClick={clearFilters}>
          Clear Filters
        </Button>
      </CardContent>
    </Card>
  );
}

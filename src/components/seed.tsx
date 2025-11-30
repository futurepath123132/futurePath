"use client";

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface University {
  name: string;
  city: string;
  tuition_range: string;
  disciplines: string[];
  website: string;
  images?: string[];
}

const seedData: University[] = [
  {
    name: "University of Punjab",
    city: "Lahore",
    tuition_range: "100,000 - 200,000",
    disciplines: ["Engineering", "Business", "Arts", "Medical"],
    website: "https://www.pu.edu.pk",
  },
  {
    name: "Lahore University of Management Sciences",
    city: "Lahore",
    tuition_range: "200,000 - 400,000",
    disciplines: ["Business", "Computer Science", "Social Sciences"],
    website: "https://www.lums.edu.pk",
  },
  {
    name: "University of Engineering and Technology",
    city: "Lahore",
    tuition_range: "150,000 - 250,000",
    disciplines: ["Engineering", "Computer Science"],
    website: "https://www.uet.edu.pk",
  },
  {
    name: "Government College University",
    city: "Lahore",
    tuition_range: "100,000 - 200,000",
    disciplines: ["Arts", "Science", "Business"],
    website: "https://www.gcu.edu.pk",
  },
  {
    name: "COMSATS University Islamabad, Lahore Campus",
    city: "Lahore",
    tuition_range: "120,000 - 220,000",
    disciplines: ["Engineering", "Computer Science", "Business"],
    website: "https://lahore.comsats.edu.pk",
  },
  {
    name: "University of Veterinary and Animal Sciences",
    city: "Lahore",
    tuition_range: "110,000 - 210,000",
    disciplines: ["Medical", "Science"],
    website: "https://www.uvas.edu.pk",
  },
  {
    name: "Forman Christian College",
    city: "Lahore",
    tuition_range: "130,000 - 230,000",
    disciplines: ["Arts", "Business", "Social Sciences"],
    website: "https://www.fccollege.edu.pk",
  },
  {
    name: "University of Sargodha",
    city: "Sargodha",
    tuition_range: "80,000 - 150,000",
    disciplines: ["Engineering", "Arts", "Business"],
    website: "https://www.uos.edu.pk",
  },
  {
    name: "Bahauddin Zakariya University",
    city: "Multan",
    tuition_range: "90,000 - 180,000",
    disciplines: ["Engineering", "Medical", "Business"],
    website: "https://www.bzu.edu.pk",
  },
  {
    name: "University of Gujrat",
    city: "Gujrat",
    tuition_range: "70,000 - 150,000",
    disciplines: ["Engineering", "Business", "Science"],
    website: "https://www.uog.edu.pk",
  },
  {
    name: "University of Faisalabad",
    city: "Faisalabad",
    tuition_range: "80,000 - 160,000",
    disciplines: ["Engineering", "Business", "Arts"],
    website: "https://www.uf.edu.pk",
  },
  {
    name: "National Textile University",
    city: "Faisalabad",
    tuition_range: "100,000 - 200,000",
    disciplines: ["Engineering", "Textile"],
    website: "https://www.ntu.edu.pk",
  },
  {
    name: "The Islamia University of Bahawalpur",
    city: "Bahawalpur",
    tuition_range: "60,000 - 120,000",
    disciplines: ["Arts", "Science", "Business"],
    website: "https://www.iub.edu.pk",
  },
  {
    name: "University of Gujranwala",
    city: "Gujranwala",
    tuition_range: "70,000 - 150,000",
    disciplines: ["Engineering", "Business", "Arts"],
    website: "https://www.uog.edu.pk",
  },
  {
    name: "University of Chakwal",
    city: "Chakwal",
    tuition_range: "50,000 - 100,000",
    disciplines: ["Science", "Arts"],
    website: "https://www.uoc.edu.pk",
  },
];

export default function SeedUniversities() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSeed = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.from("universities").insert(seedData);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Seeded 15 universities successfully!",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to seed universities",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <Button onClick={handleSeed} disabled={loading}>
        {loading ? "Seeding..." : "Seed Universities"}
      </Button>
    </div>
  );
}

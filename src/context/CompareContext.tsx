import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface CompareContextType {
    selectedUniversities: string[]; // Store IDs of selected universities
    addToCompare: (id: string) => void;
    removeFromCompare: (id: string) => void;
    clearCompare: () => void;
    isComparing: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedUniversities, setSelectedUniversities] = useState<string[]>([]);
    const { toast } = useToast();

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem("compare_universities");
        if (saved) {
            try {
                setSelectedUniversities(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse saved comparison list", e);
            }
        }
    }, []);

    // Save to local storage whenever changed
    useEffect(() => {
        localStorage.setItem("compare_universities", JSON.stringify(selectedUniversities));
    }, [selectedUniversities]);

    const addToCompare = (id: string) => {
        if (selectedUniversities.includes(id)) {
            toast({
                title: "Already Added",
                description: "This university is already in your comparison list.",
            });
            return;
        }

        if (selectedUniversities.length >= 3) {
            toast({
                title: "Limit Reached",
                description: "You can compare up to 3 universities at a time.",
                variant: "destructive",
            });
            return;
        }

        setSelectedUniversities((prev) => [...prev, id]);
    };

    const removeFromCompare = (id: string) => {
        setSelectedUniversities((prev) => prev.filter((prevId) => prevId !== id));
    };

    const clearCompare = () => {
        setSelectedUniversities([]);
    };

    const isComparing = (id: string) => selectedUniversities.includes(id);

    return (
        <CompareContext.Provider
            value={{
                selectedUniversities,
                addToCompare,
                removeFromCompare,
                clearCompare,
                isComparing,
            }}
        >
            {children}
        </CompareContext.Provider>
    );
};

export const useCompare = () => {
    const context = useContext(CompareContext);
    if (context === undefined) {
        throw new Error("useCompare must be used within a CompareProvider");
    }
    return context;
};

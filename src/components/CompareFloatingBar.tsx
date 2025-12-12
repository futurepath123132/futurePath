import { Button } from "@/components/ui/button";
import { useCompare } from "@/context/CompareContext";
import { X, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

export default function CompareFloatingBar() {
    const { selectedUniversities, clearCompare, removeFromCompare } = useCompare();

    if (selectedUniversities.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
            >
                <div className="bg-card text-card-foreground border border-border rounded-lg shadow-lg p-4 flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="font-semibold text-sm">
                            {selectedUniversities.length} / 3 Selected
                        </span>
                        <span className="text-xs text-muted-foreground/80">
                            Compare universities side by side
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearCompare}
                            className="text-muted-foreground hover:text-background hover:bg-white/10"
                        >
                            Clear
                        </Button>
                        <Link to="/compare">
                            <Button size="sm" className="gap-2 bg-primary text-white hover:bg-primary/90">
                                Compare <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

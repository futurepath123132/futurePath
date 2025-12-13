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
                initial={{ y: 100, x: "-50%", opacity: 0 }}
                animate={{ y: 0, x: "-50%", opacity: 1 }}
                exit={{ y: 100, x: "-50%", opacity: 0 }}
                className="fixed bottom-6 left-1/2 z-50 w-[95%] max-w-md px-0"
            >
                <div className="bg-card text-card-foreground border border-border rounded-lg shadow-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                    {/* Top Row on Mobile: Info and Buttons */}
                    <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                        <div className="flex flex-col shrink-0">
                            <span className="font-semibold text-sm">
                                {selectedUniversities.length} / 3 Selected
                            </span>
                            {/* Desktop subtitle */}
                            <span className="text-xs text-muted-foreground/80 hidden sm:block">
                                Compare universities side by side
                            </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearCompare}
                                className="text-muted-foreground hover:text-background hover:bg-white/10 h-8 px-2"
                            >
                                Clear
                            </Button>
                            <Link to="/compare">
                                <Button size="sm" className="gap-2 bg-primary text-white hover:bg-primary/90 h-8">
                                    Compare <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile Only: Bottom centered description */}
                    <div className="sm:hidden w-full text-center border-t pt-2 mt-1">
                        <span className="text-[10px] text-muted-foreground block">
                            Compare universities side by side
                        </span>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

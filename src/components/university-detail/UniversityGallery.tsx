import { useState, useCallback, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UniversityGalleryProps {
    images: string[];
}

export function UniversityGallery({ images }: UniversityGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const handlePrevious = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIndex === null) return;
        setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
    };

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIndex === null) return;
        setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
    };

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (selectedIndex === null) return;
        if (e.key === 'ArrowLeft') {
            setSelectedIndex(prev => (prev === null || prev === 0 ? images.length - 1 : prev - 1));
        } else if (e.key === 'ArrowRight') {
            setSelectedIndex(prev => (prev === null || prev === images.length - 1 ? 0 : prev + 1));
        } else if (e.key === 'Escape') {
            setSelectedIndex(null);
        }
    }, [selectedIndex, images.length]);

    useEffect(() => {
        if (selectedIndex !== null) {
            window.addEventListener('keydown', handleKeyDown);
            return () => window.removeEventListener('keydown', handleKeyDown);
        }
    }, [selectedIndex, handleKeyDown]);

    if (!images || images.length === 0) return null;

    return (
        <>
            <section className="bg-card rounded-xl p-6 shadow-sm border border-border">
                <h2 className="text-xl font-bold mb-4 text-foreground">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {images.map((img, i) => (
                        <div
                            key={i}
                            className="aspect-video rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setSelectedIndex(i)}
                        >
                            <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Image Lightbox Modal */}
            {selectedIndex !== null && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedIndex(null)}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 text-white hover:bg-white/10"
                        onClick={() => setSelectedIndex(null)}
                    >
                        <X className="h-6 w-6" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 text-white hover:bg-white/10 h-12 w-12 hidden md:flex"
                        onClick={handlePrevious}
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </Button>

                    <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
                        <img
                            src={images[selectedIndex]}
                            alt={`Gallery ${selectedIndex + 1}`}
                            className="max-w-full max-h-[85vh] object-contain rounded-lg select-none"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                        />
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 text-white hover:bg-white/10 h-12 w-12 hidden md:flex"
                        onClick={handleNext}
                    >
                        <ChevronRight className="h-8 w-8" />
                    </Button>

                    {/* Mobile Navigation - Visible only on small screens */}
                    <div className="absolute bottom-6 flex gap-8 md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/10 h-12 w-12"
                            onClick={handlePrevious}
                        >
                            <ChevronLeft className="h-8 w-8" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/10 h-12 w-12"
                            onClick={handleNext}
                        >
                            <ChevronRight className="h-8 w-8" />
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}

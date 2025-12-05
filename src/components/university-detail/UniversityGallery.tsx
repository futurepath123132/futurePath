import { useState } from 'react';

interface UniversityGalleryProps {
    images: string[];
}

export function UniversityGallery({ images }: UniversityGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
                            onClick={() => setSelectedImage(img)}
                        >
                            <img src={img} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Image Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center">
                        <img
                            src={selectedImage}
                            alt="Gallery Fullscreen"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                        />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                        >
                            <span className="text-4xl">&times;</span>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

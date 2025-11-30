"use client";

import { useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

interface UniIconSliderProps {
  images: string[]; // Array of university icon URLs
}

export default function UniIconSlider({ images }: UniIconSliderProps) {
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    loop: true,
    duration: 4000,
    drag: false,
    slides: { perView: 6, spacing: 15 },
    mode: "free-snap",
  });

  // Auto scroll
  useEffect(() => {
    if (!slider) return;
    let raf: number;
    const animate = () => {
      slider.current?.moveToIdx(slider.current.track.details.rel + 1);
      raf = requestAnimationFrame(() => setTimeout(animate, 3000)); // adjust speed
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [slider]);

  return (
    <div className="mt-12">
      <div ref={sliderRef} className="keen-slider">
        {images.map((img, idx) => (
          <div key={idx} className="keen-slider__slide flex justify-center items-center">
            <img src={img} alt={`University ${idx + 1}`} className="h-16 w-16 object-contain rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

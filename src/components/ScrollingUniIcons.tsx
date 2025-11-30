export default function ScrollingUniIcons({ images }) {
  // duplicate the array for seamless scroll
  const allImages = [...images, ...images];

  return (
    <div className="overflow-hidden w-full max-w-5xl">
      <div
        className="flex animate-scroll gap-[100px] justify-center"
        style={{
          width: "max-content",
          margin: "0 auto", // center the strip
        }}
      >
        {allImages.map((src, idx) => (
          <img key={idx} src={src} alt="uni" className="h-16 w-auto object-contain" />
        ))}
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          display: flex;
          animation: scroll 40s linear infinite;
        }
      `}</style>
    </div>
  );
}

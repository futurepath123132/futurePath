interface UniImage {
  src: string;
  url: string;
}

export default function ScrollingUniIcons({ images }: { images: UniImage[] }) {
  // duplicate the array for seamless scroll
  const allImages = [...images, ...images];

  return (
    <div className="overflow-hidden w-full max-w-5xl group">
      <div
        className="flex animate-scroll gap-[100px] justify-center group-hover:pause-scroll"
        style={{
          width: "max-content",
          margin: "0 auto", // center the strip
        }}
      >
        {allImages.map((item, idx) => (
          <a
            key={idx}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform duration-300 hover:scale-110 hover:brightness-110"
          >
            <img
              src={item.src}
              alt="uni"
              className="h-16 w-auto object-contain cursor-pointer"
            />
          </a>
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
        .pause-scroll {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

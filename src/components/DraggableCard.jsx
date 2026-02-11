import { useRef, useEffect, useState } from "react";

const DraggableCard = ({
  className,
  position,
  title,
  videoSrc,
  objectFit = "object-cover",
}) => {
  const videoRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Intersection Observer for lazy loading videos
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "5000px" } // Load 5000px before entering viewport
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`dragger-wrapper ${className} absolute ${position} h-[500px] w-[250px] sm:w-[350px]`}
    >
      <div className="relative w-full h-full">
        <h3 className="absolute top-0 left-0 text-white text-3xl font-zen-antique-soft  mix-blend-difference z-10">
          {title}
        </h3>
        {/* Aspect ratio container prevents CLS */}
        <div
          ref={videoRef}
          className="relative w-full h-full"
          style={{ aspectRatio: "9 / 16" }}
        >
          {shouldLoad && (
            <video
              muted
              playsInline
              loop
              preload="metadata"
              autoPlay
              className={`${objectFit} w-full h-full block`}
              src={videoSrc}
              style={{ display: "block" }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DraggableCard;

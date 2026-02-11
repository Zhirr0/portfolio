import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import "../../styles/scroll-trigger-zoom.css";
import img5 from "/images/img5.webp";

const ScrollTriggerZoomIn = () => {
  const containerRef = useRef();
  const maskRef = useRef();

  useGSAP(
    () => {
      // Set initial scale to 1
      gsap.set(maskRef.current, { scale: 1 });

      // Animate scale to 140 (zoom in effect)
      gsap.to(maskRef.current, {
        scale: 140,
        ease: "sine.in",
        transformOrigin: "55% 50%",
        scrollTrigger: {
          trigger: containerRef.current,
          scrub: 1,
          pin: true,
          pinSpacing: true, // Make sure this is true
          start: "top top",
          end: "+=1000",
          id: "zoom-in",
        },
      });
    },
    { scope: containerRef },
  ); // Add scope to prevent conflicts

  return (
    <div ref={containerRef} className="scroll-trigger-zoom-container">
      <img className="scroll-trigger-zoom-image" src={img5} alt="" />
      <div className="scroll-trigger-zoom-mask">
        <h2 className="scroll-trigger-zoom-mask-title" ref={maskRef}>
          SCROLL
        </h2>
      </div>
    </div>
  );
};

export default ScrollTriggerZoomIn;

import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import "../../styles/scroll-trigger-zoom.css";
import img5 from "/images/img5.webp";

const ScrollTriggerZoomOut = () => {
  const containerRef = useRef();
  const maskRef = useRef();

  useGSAP(
    () => {
      // Set initial scale to 140
      gsap.set(maskRef.current, { scale: 140 });

      // Animate scale back to 1 (zoom out effect)
      gsap.to(maskRef.current, {
        scale: 1,
        ease: "sine.out",
        scrollTrigger: {
          trigger: containerRef.current,
          scrub: 1,
          pin: true,
          pinSpacing: true, // Make sure this is true
          start: "top top",
          end: "+=1000",
          // Add unique id to prevent conflicts
          id: "zoom-out",
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

export default ScrollTriggerZoomOut;

import { useEffect, useRef } from "react";
import gsap from "gsap";
import "../../styles/text-parallax.css";
import RoutingTransition from "../../components/transitionRouter/Transition";

const ParallaxText = () => {
  const containerRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const texts = Array.from(container.querySelectorAll(".text-parallax"));
    if (!texts.length) return;

    // quickSetters for performance
    const setX = texts.map((element) => gsap.quickSetter(element, "x", "px"));
    const setY = texts.map((element) => gsap.quickSetter(element, "y", "px"));
    const setRotX = texts.map((element) =>
      gsap.quickSetter(element, "rotationX", "deg"),
    );
    const setRotY = texts.map((element) =>
      gsap.quickSetter(element, "rotationY", "deg"),
    );
    const setScale = texts.map((element) => gsap.quickSetter(element, "scale"));

    // target (where the mouse currently is) and current (smoothed position)
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    const SMOOTH = 0.12;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    // On mouse leaving the page, reset target to center
    const handleMouseLeave = () => {
      targetX = window.innerWidth / 2;
      targetY = window.innerHeight / 2;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave); // for old browsers
    window.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      currentX += (targetX - currentX) * SMOOTH;
      currentY += (targetY - currentY) * SMOOTH;

      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      texts.forEach((_, i) => {
        const depth = (i + 1) / texts.length;
        const dx = (currentX - cx) * depth * 0.35;
        const dy = (currentY - cy) * depth * 0.35;
        const tiltX = (currentY - cy) * depth * 0.05;
        const tiltY = (currentX - cx) * depth * 0.05;
        const scale = 0.7 + depth * 0.6;

        setX[i](dx);
        setY[i](dy);
        setRotX[i](-tiltX);
        setRotY[i](tiltY);
        setScale[i](scale);
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    // cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
      window.removeEventListener("mouseleave", handleMouseLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      gsap.killTweensOf(setX);
      gsap.killTweensOf(setY);
      gsap.killTweensOf(setRotX);
      gsap.killTweensOf(setRotY);
      gsap.killTweensOf(setScale);
    };
  }, []);

  return (
    <section className="text-parallax-section">
      <p>( DOESN'T WORK FOR TOUCHSCREENS )</p>
      <div className="text-parallax-container" ref={containerRef}>
        <div className="text-parallax text-parallax-1">MOVE AROUND</div>
        <div className="text-parallax text-parallax-2">MOVE AROUND</div>
        <div className="text-parallax text-parallax-3">MOVE AROUND</div>
        <div className="text-parallax">MOVE AROUND</div>
        <div className="text-parallax">MOVE AROUND</div>
        <div className="text-parallax">MOVE AROUND</div>
        <div className="text-parallax">MOVE AROUND</div>
        <div className="text-parallax">MOVE AROUND</div>
        <div className="text-parallax">MOVE AROUND</div>
        <div className="text-parallax">
          <span>MOVE AROUND</span>
        </div>
      </div>
    </section>
  );
};

export default RoutingTransition(ParallaxText);

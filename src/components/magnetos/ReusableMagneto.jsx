import { useRef, useEffect } from "react";
import gsap from "gsap";
import magnetoConfig from "../../config/magneto.config";
const ReusableMagneto = ({ className = "", textClassname = "", children }) => {
  const magnetoRef = useRef(null);
  const magnetoTextRef = useRef(null);
  const isTouchingRef = useRef(false);


  useEffect(() => {
    const magneto = magnetoRef.current;
    const magnetoText = magnetoTextRef.current;
    if (!magneto || !magnetoText) return;

    gsap.set([magneto, magnetoText], { x: 0, y: 0 });

    const calculatePosition = (clientX, clientY) => {
      const rect = magneto.getBoundingClientRect();
      const x = ((clientX - rect.left) / magneto.offsetWidth) - 0.5;
      const y = ((clientY - rect.top) / magneto.offsetHeight) - 0.5;
      return { x, y };
    };

    const activeMagneto = (e) => {
      if (isTouchingRef.current) return;
      const { x, y } = calculatePosition(e.clientX, e.clientY);
      gsap.to(magneto, { x: x * magnetoConfig.magnetoStrength, y: y * magnetoConfig.magnetoStrength, duration: 1, ease: "power4.out" });
      gsap.to(magnetoText, { x: x * magnetoConfig.magnetoTextStrength, y: y * magnetoConfig.magnetoTextStrength, duration: 1, ease: "power4.out" });
    };

    const deactivateMagneto = () => {
      if (isTouchingRef.current) return;
      gsap.to(magneto, { x: 0, y: 0, duration: 1, ease: "elastic.out" });
      gsap.to(magnetoText, { x: 0, y: 0, duration: 1, ease: "elastic.out" });
    };

    const handleTouchStart = (e) => {
      e.preventDefault();
      isTouchingRef.current = true;
      const touch = e.touches[0];
      const { x, y } = calculatePosition(touch.clientX, touch.clientY);
      gsap.to(magneto, { x: x * magnetoConfig.touchGrabStrength, y: y * magnetoConfig.touchGrabStrength, duration: 0.3, ease: "power2.out" });
      gsap.to(magnetoText, { x: x * magnetoConfig.touchGrabTextStrength, y: y * magnetoConfig.touchGrabTextStrength, duration: 0.3, ease: "power2.out" });
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      if (!isTouchingRef.current) return;
      const touch = e.touches[0];
      const { x, y } = calculatePosition(touch.clientX, touch.clientY);
      gsap.to(magneto, { x: x * magnetoConfig.touchGrabStrength, y: y * magnetoConfig.touchGrabStrength, duration: 0.1, ease: "power1.out" });
      gsap.to(magnetoText, { x: x * magnetoConfig.touchGrabTextStrength, y: y * magnetoConfig.touchGrabTextStrength, duration: 0.1, ease: "power1.out" });
    };

    const handleTouchEnd = (e) => {
      e.preventDefault();
      isTouchingRef.current = false;
      gsap.to(magneto, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
      gsap.to(magnetoText, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
    };

    magneto.addEventListener("mousemove", activeMagneto);
    magneto.addEventListener("mouseleave", deactivateMagneto);
    magneto.addEventListener("touchstart", handleTouchStart, { passive: false });
    magneto.addEventListener("touchmove", handleTouchMove, { passive: false });
    magneto.addEventListener("touchend", handleTouchEnd, { passive: false });
    magneto.addEventListener("touchcancel", handleTouchEnd, { passive: false });

    return () => {
      gsap.set([magneto, magnetoText], { x: 0, y: 0 });
      magneto.removeEventListener("mousemove", activeMagneto);
      magneto.removeEventListener("mouseleave", deactivateMagneto);
      magneto.removeEventListener("touchstart", handleTouchStart);
      magneto.removeEventListener("touchmove", handleTouchMove);
      magneto.removeEventListener("touchend", handleTouchEnd);
      magneto.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [magnetoConfig.magnetoStrength, magnetoConfig.magnetoTextStrength, magnetoConfig.touchGrabStrength, magnetoConfig.touchGrabTextStrength]);

  const cleanedTextClass = (textClassname || "").replace(/\babs-center\b/g, "").trim();

  return (
    <div className={`magnetoWrapper ${className}`} ref={magnetoRef}>
      <div className="magneto abs-center">
        <h2 className={`text ${cleanedTextClass}`} ref={magnetoTextRef}>
          {children}
        </h2>
      </div>
    </div>
  );
};

export default ReusableMagneto;

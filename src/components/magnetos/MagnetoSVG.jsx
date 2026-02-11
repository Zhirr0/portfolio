import { useRef, useEffect } from "react";
import gsap from "gsap";

const MagnetoSVG = ({ children, containerClassName = "" }) => {
  const magnetoRef = useRef(null);
  const magnetoContentRef = useRef(null);
  const isTouchingRef = useRef(false);

  useEffect(() => {
    const magneto = magnetoRef.current;
    const magnetoContent = magnetoContentRef.current;

    if (!magneto || !magnetoContent) return;

    const config = {
      magnetoContentStrength: 40,
      touchGrabContentStrength: 40,
    };

    const calculatePosition = (clientX, clientY) => {
      const boundBox = magneto.getBoundingClientRect();
      const newX = (clientX - boundBox.left) / magneto.offsetWidth - 0.5;
      const newY = (clientY - boundBox.top) / magneto.offsetHeight - 0.5;
      return { x: newX, y: newY };
    };

    const activeMagneto = (event) => {
      if (isTouchingRef.current) return;

      const { x: newX, y: newY } = calculatePosition(
        event.clientX,
        event.clientY
      );

      gsap.to(magnetoContent, {
        duration: 1,
        x: newX * config.magnetoContentStrength,
        y: newY * config.magnetoContentStrength,
        ease: "power4.out",
      });
    };

    const deactivateMagneto = () => {
      if (isTouchingRef.current) return;

      gsap.to(magnetoContent, {
        duration: 1,
        x: 0,
        y: 0,
        ease: "elastic.out",
      });
    };

    const handleTouchStart = (event) => {
      event.preventDefault();
      isTouchingRef.current = true;

      const touch = event.touches[0];
      const { x: newX, y: newY } = calculatePosition(
        touch.clientX,
        touch.clientY
      );

      gsap.to(magnetoContent, {
        duration: 0.3,
        x: newX * config.touchGrabContentStrength,
        y: newY * config.touchGrabContentStrength,
        ease: "power2.out",
      });
    };

    const handleTouchMove = (event) => {
      event.preventDefault();

      if (!isTouchingRef.current) return;

      const touch = event.touches[0];
      const { x: newX, y: newY } = calculatePosition(
        touch.clientX,
        touch.clientY
      );

      gsap.to(magnetoContent, {
        duration: 0.1,
        x: newX * config.touchGrabContentStrength,
        y: newY * config.touchGrabContentStrength,
        ease: "power1.out",
      });
    };

    const handleTouchEnd = (event) => {
      event.preventDefault();
      isTouchingRef.current = false;

      gsap.to(magnetoContent, {
        duration: 1,
        x: 0,
        y: 0,
        ease: "elastic.out(1, 0.3)",
      });
    };

    magneto.addEventListener("mousemove", activeMagneto);
    magneto.addEventListener("mouseleave", deactivateMagneto);
    magneto.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    magneto.addEventListener("touchmove", handleTouchMove, { passive: false });
    magneto.addEventListener("touchend", handleTouchEnd, { passive: false });
    magneto.addEventListener("touchcancel", handleTouchEnd, { passive: false });

    return () => {
      magneto.removeEventListener("mousemove", activeMagneto);
      magneto.removeEventListener("mouseleave", deactivateMagneto);
      magneto.removeEventListener("touchstart", handleTouchStart);
      magneto.removeEventListener("touchmove", handleTouchMove);
      magneto.removeEventListener("touchend", handleTouchEnd);
      magneto.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  return (
    <div className={`magnetoWrapper`}>
      <div className={`magneto`} ref={magnetoRef}>
        <div
          className={`svg-content ${containerClassName}`}
          ref={magnetoContentRef}
          style={{ willChange: "transform" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default MagnetoSVG;
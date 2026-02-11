 import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import magnetoConfig from '../../config/magneto.config'
const Magneto = ({ children ,className = '', textClassname = ''}) => {
  const magnetoRef = useRef(null);
  const magnetoTextRef = useRef(null);
  const isTouchingRef = useRef(false);

    const cleanedTextClass = (textClassname || '').replace(/\babs-center\b/g, '').trim();

  useEffect(() => {
    const magneto = magnetoRef.current;
    const magnetoText = magnetoTextRef.current;

    if (!magneto || !magnetoText) return;


    const calculatePosition = (clientX, clientY) => {
      const boundBox = magneto.getBoundingClientRect();
      const newX = ((clientX - boundBox.left) / magneto.offsetWidth) - 0.5;
      const newY = ((clientY - boundBox.top) / magneto.offsetHeight) - 0.5;
      return { x: newX, y: newY };
    };

    const activeMagneto = (event) => {
      if (isTouchingRef.current) return;

      const { x: newX, y: newY } = calculatePosition(event.clientX, event.clientY);

      gsap.to(magneto, {
        duration: 1,
        x: newX * magnetoConfig.magnetoStrength,
        y: newY * magnetoConfig.magnetoStrength,
        ease: "power4.out"
      });

      gsap.to(magnetoText, {
        duration: 1,
        x: newX * magnetoConfig.magnetoTextStrength,
        y: newY * magnetoConfig.magnetoTextStrength,
        ease: "power4.out"
      });
    };

    const deactivateMagneto = () => {
      if (isTouchingRef.current) return;

      gsap.to(magneto, {
        duration: 1,
        x: 0,
        y: 0,
        ease: "elastic.out"
      });
      gsap.to(magnetoText, {
        duration: 1,
        x: 0,
        y: 0,
        ease: "elastic.out"
      });
    };

    // Touch start handler
    const handleTouchStart = (event) => {
      event.preventDefault();
      isTouchingRef.current = true;

      const touch = event.touches[0];
      const { x: newX, y: newY } = calculatePosition(touch.clientX, touch.clientY);

      gsap.to(magneto, {
        duration: 0.3,
        x: newX * magnetoConfig.touchGrabStrength,
        y: newY * magnetoConfig.touchGrabStrength,
        ease: "power2.out"
      });

      gsap.to(magnetoText, {
        duration: 0.3,
        x: newX * magnetoConfig.touchGrabTextStrength,
        y: newY * magnetoConfig.touchGrabTextStrength,
        ease: "power2.out"
      });
    };

    // Touch move handler
    const handleTouchMove = (event) => {
      event.preventDefault();

      if (!isTouchingRef.current) return;

      const touch = event.touches[0];
      const { x: newX, y: newY } = calculatePosition(touch.clientX, touch.clientY);

      gsap.to(magneto, {
        duration: 0.1,
        x: newX * magnetoConfig.touchGrabStrength,
        y: newY * magnetoConfig.touchGrabStrength,
        ease: "power1.out"
      });

      gsap.to(magnetoText, {
        duration: 0.1,
        x: newX * magnetoConfig.touchGrabTextStrength,
        y: newY * magnetoConfig.touchGrabTextStrength,
        ease: "power1.out"
      });
    };

    // Touch end handler
    const handleTouchEnd = (event) => {
      event.preventDefault();
      isTouchingRef.current = false;

      gsap.to(magneto, {
        duration: 1,
        x: 0,
        y: 0,
        ease: "elastic.out(1, 0.3)"
      });

      gsap.to(magnetoText, {
        duration: 1,
        x: 0,
        y: 0,
        ease: "elastic.out(1, 0.3)"
      });
    };

    // Add event listeners
    magneto.addEventListener('mousemove', activeMagneto);
    magneto.addEventListener('mouseleave', deactivateMagneto);
    magneto.addEventListener('touchstart', handleTouchStart, { passive: false });
    magneto.addEventListener('touchmove', handleTouchMove, { passive: false });
    magneto.addEventListener('touchend', handleTouchEnd, { passive: false });
    magneto.addEventListener('touchcancel', handleTouchEnd, { passive: false });

    // Cleanup
    return () => {
      magneto.removeEventListener('mousemove', activeMagneto);
      magneto.removeEventListener('mouseleave', deactivateMagneto);
      magneto.removeEventListener('touchstart', handleTouchStart);
      magneto.removeEventListener('touchmove', handleTouchMove);
      magneto.removeEventListener('touchend', handleTouchEnd);
      magneto.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  return (
    <div className={`magnetoWrapper overflow-visible ${className}`}>
      <button className="magneto" ref={magnetoRef}>
        <span className={`text ${cleanedTextClass}`} ref={magnetoTextRef}>
          {children}
        </span>
      </button>
    </div>
  );
};

export default Magneto;
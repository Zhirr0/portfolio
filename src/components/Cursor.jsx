import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Observer } from "gsap/all";

gsap.registerPlugin(Observer);

const size = 40;

const Cursor = () => {
  const cursorRef = useRef(null);
  const velocityDataRef = useRef({ rotation: 0, scaleX: 1, scaleY: 1 });
  const lastMoveTimeRef = useRef(Date.now());
  const resetTimeoutRef = useRef(null);
  const inactivityIntervalRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const links = document.querySelectorAll(
      ".bottom-wave-svg, .text-animation-header, .nav-left-header, .zhir-svg",
    );

    let lastX = null;
    let lastY = null;
    let rafId = null;
    let pendingCheck = false;
    let isDragging = false;

    // Function to smoothly reset scales to 1
    const resetScalesToNormal = () => {
      gsap.to(cursor, {
        scaleX: 1,
        scaleY: 1,
        duration: 0.5,
        overwrite: "auto",
        ease: "power2.out",
      });
    };

    // Check if cursor hasn't moved for a while
    const checkInactivity = () => {
      const now = Date.now();
      const timeSinceLastMove = now - lastMoveTimeRef.current;

      // If no movement for 150ms, reset to normal
      if (timeSinceLastMove > 150) {
        resetScalesToNormal();
      }
    };

    // Start continuous inactivity checking
    inactivityIntervalRef.current = setInterval(checkInactivity, 50);

    // Observer for velocity-based animation
    const observer = Observer.create({
      type: "pointer",
      tolerance: 1,
      onMove: (self) => {
        // Update last move time
        lastMoveTimeRef.current = Date.now();

        // Clear any pending reset
        if (resetTimeoutRef.current) {
          clearTimeout(resetTimeoutRef.current);
        }

        const deltaX = self.deltaX;
        const deltaY = self.deltaY;
        const velocityX = self.velocityX;
        const velocityY = self.velocityY;

        // Calculate total velocity magnitude
        const velocity = Math.sqrt(
          velocityX * velocityX + velocityY * velocityY,
        );

        // Normalize velocity to a reasonable range (0 to ~1)
        const normalizedVelocity = Math.min(Math.pow(velocity / 5000, 0.85), 1);

        // Calculate rotation based on direction
        let rotation = 0;
        if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
          // Calculate angle in degrees
          rotation = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        }

        // Calculate stretch values based on velocity
        const velocityFactor = normalizedVelocity;
        const scaleX = 1 + 0.55 * velocityFactor; // 1 to 1.55
        const scaleY = 1 - 0.55 * velocityFactor; // 1 to 0.45

        // Ensure constraints
        const finalScaleX = Math.max(1, scaleX);
        const finalScaleY = Math.min(1, Math.max(0.45, scaleY));

        // Store velocity data
        velocityDataRef.current = {
          rotation,
          scaleX: finalScaleX,
          scaleY: finalScaleY,
        };

        // Apply velocity-based transform immediately (only when moving)
        if (normalizedVelocity > 0.05) {
          // ROTATION — fast, immediate
          gsap.to(cursor, {
            rotation,
            duration: 0.001,
            ease: "none",
            overwrite: "auto",
          });

          // SCALE — heavier, slower
          gsap.to(cursor, {
            scaleX: finalScaleX,
            scaleY: finalScaleY,
            duration: 0.2,
            ease: "power2.out",
            overwrite: "auto",
          });

          // Schedule inactivity check
          resetTimeoutRef.current = setTimeout(checkInactivity, 150);
        } else {
          // Smoothly reset when velocity is low
          resetScalesToNormal();
        }
      },
    });

    const onMouseMove = (e) => {
      lastX = e.clientX;
      lastY = e.clientY;
      lastMoveTimeRef.current = Date.now();

      gsap.to(cursor, {
        x: e.clientX - size / 2,
        y: e.clientY - size / 2,
        duration: 0.7,
        ease: "back",
      });

      if (!isDragging) {
        scheduleCheck();
      }
    };

    const onCursorUpdate = (e) => {
      if (e.detail?.x !== undefined && e.detail?.y !== undefined) {
        lastX = e.detail.x;
        lastY = e.detail.y;
        lastMoveTimeRef.current = Date.now();

        gsap.to(cursor, {
          x: e.detail.x - size / 2,
          y: e.detail.y - size / 2,
          duration: 0.1,
          ease: "power2.out",
        });

        if (!isDragging) {
          scheduleCheck();
        }
      }
    };

    const getElementUnderPointer = (x, y) => {
      const elements = document.elementsFromPoint(x, y);
      for (const element of elements) {
        if (element === cursor || element.id === "cursor") continue;
        return element;
      }
      return null;
    };

    const checkElementUnderPointer = () => {
      pendingCheck = false;
      if (lastX === null || lastY === null) return;
      getElementUnderPointer(lastX, lastY);
    };

    const scheduleCheck = () => {
      if (pendingCheck) return;
      pendingCheck = true;
      rafId = requestAnimationFrame(checkElementUnderPointer);
    };

    const onMouseOut = () => {
      resetScalesToNormal();
    };

    // Handle mouse leaving the entire document
    const onMouseLeave = () => {
      resetScalesToNormal();
    };

    const onScroll = () => {
      if (!isDragging) {
        scheduleCheck();
      }
    };

    const onWheel = () => {
      if (!isDragging) {
        scheduleCheck();
      }
    };

    const onTouchMove = () => {
      if (!isDragging) {
        scheduleCheck();
      }
    };

    // Listen for drag events from Draggable
    const onDragStart = () => {
      isDragging = true;
    };

    const onDragEnd = () => {
      isDragging = false;
      scheduleCheck();
    };

    // Add global drag event listeners
    document.addEventListener("mousedown", (e) => {
      const target = e.target;
      if (target.closest(".dragger-wrapper")) {
        onDragStart();
      }
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        onDragEnd();
      }
    });

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("cursorUpdate", onCursorUpdate);
    links.forEach((link) => {
      link.addEventListener("mouseleave", onMouseOut);
    });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("cursorUpdate", onCursorUpdate);
      links.forEach((link) => {
        link.removeEventListener("mouseleave", onMouseOut);
      });
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onTouchMove);
      if (rafId) cancelAnimationFrame(rafId);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
      if (inactivityIntervalRef.current)
        clearInterval(inactivityIntervalRef.current);
      observer.kill();
    };
  }, []);

  return (
    <div
      style={{
        width: size,
        height: size,
        zIndex: 99999999,
        transformOrigin: "center center",
      }}
      id="cursor"
      className="custom-cursor"
      ref={cursorRef}
    />
  );
};

export default Cursor;

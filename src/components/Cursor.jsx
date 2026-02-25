import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Observer } from "gsap/all";
import { useMediaQuery } from "react-responsive";

gsap.registerPlugin(Observer);

const size = 30;
const PADDING = 5;
const PIN_BORDER_RADIUS = 10;

// Selector list — extend here if you add more pinnable elements later
const PINNABLE_SELECTOR = ".hero-header, .hero-paragraph";

const Cursor = () => {
  const cursorRef = useRef(null);
  const velocityDataRef = useRef({ rotation: 0, scaleX: 1, scaleY: 1 });
  const lastMoveTimeRef = useRef(Date.now());
  const resetTimeoutRef = useRef(null);
  const inactivityIntervalRef = useRef(null);
  const isMouseDownRef = useRef(false);
  const isPinnedRef = useRef(false);
  const pinnedTweenRef = useRef(null);
  const unpinCooldownRef = useRef(false);
  const lastXRef = useRef(null);
  const lastYRef = useRef(null);
  const isTouchscreenSize = useMediaQuery({ maxWidth: "1024px" });

  useEffect(() => {
    if (isTouchscreenSize) return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    gsap.set(cursor, {
      width: size,
      height: size,
      x: window.innerWidth / 2 - size / 2,
      y: window.innerHeight / 2 - size / 2,
      borderRadius: "50%",
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    });
    cursor.style.pointerEvents = "none";
    cursor.style.position = "fixed";
    cursor.style.top = "0";
    cursor.style.left = "0";

    let lastX = null;
    let lastY = null;
    let rafId = null;
    let pendingCheck = false;
    let isDragging = false;

    const resetScalesToNormal = () => {
      if (isPinnedRef.current) return;
      gsap.to(cursor, {
        scaleX: 1,
        scaleY: 1,
        duration: 0.5,
        overwrite: "auto",
        ease: "power2.out",
      });
    };

    const checkInactivity = () => {
      const now = Date.now();
      const timeSinceLastMove = now - lastMoveTimeRef.current;
      if (timeSinceLastMove > 150) {
        resetScalesToNormal();
      }
    };

    inactivityIntervalRef.current = setInterval(checkInactivity, 500);

    const observer = Observer.create({
      type: "pointer",
      tolerance: 1,
      onMove: (self) => {
        if (isPinnedRef.current) return;
        if (unpinCooldownRef.current) return;

        lastMoveTimeRef.current = Date.now();

        if (resetTimeoutRef.current) {
          clearTimeout(resetTimeoutRef.current);
        }

        const deltaX = self.deltaX;
        const deltaY = self.deltaY;
        const velocityX = self.velocityX;
        const velocityY = self.velocityY;

        const velocity = Math.sqrt(
          velocityX * velocityX + velocityY * velocityY,
        );
        const normalizedVelocity = Math.min(Math.pow(velocity / 5000, 0.85), 1);

        let rotation = 0;
        if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1) {
          rotation = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        }

        const velocityFactor = normalizedVelocity;
        const scaleX = 1 + 0.55 * velocityFactor;
        const scaleY = 1 - 0.55 * velocityFactor;

        const finalScaleX = Math.max(1, scaleX);
        const finalScaleY = Math.min(1, Math.max(0.45, scaleY));

        velocityDataRef.current = {
          rotation,
          scaleX: finalScaleX,
          scaleY: finalScaleY,
        };

        if (normalizedVelocity > 0.05) {
          gsap.to(cursor, {
            rotation,
            duration: 0.001,
            ease: "none",
            overwrite: "auto",
          });

          gsap.to(cursor, {
            scaleX: finalScaleX,
            scaleY: finalScaleY,
            duration: 0.2,
            ease: "power2.out",
            overwrite: "auto",
          });

          resetTimeoutRef.current = setTimeout(checkInactivity, 150);
        } else {
          resetScalesToNormal();
        }
      },
    });

    // --- Pin / Unpin logic ---

    // currentPinnedEl tracks which element is pinned for resize re-pinning
    let currentPinnedEl = null;

    const computePinnedRect = (element) => {
      const rect = element.getBoundingClientRect();
      return {
        left: rect.left - PADDING,
        top: rect.top - PADDING,
        width: rect.width + PADDING * 2,
        height: rect.height + PADDING * 2,
      };
    };

    const pinToElementRect = (element) => {
      if (!element) return;
      const target = computePinnedRect(element);
      currentPinnedEl = element;

      gsap.killTweensOf(cursor);
      if (pinnedTweenRef.current) {
        pinnedTweenRef.current.kill();
        pinnedTweenRef.current = null;
      }

      isPinnedRef.current = true;

      const currentTransform = gsap.getProperty(cursor, "x");
      const currentTransformY = gsap.getProperty(cursor, "y");

      gsap.set(cursor, {
        clearProps: "transform",
        left: currentTransform,
        top: currentTransformY,
      });

      pinnedTweenRef.current = gsap.to(cursor, {
        duration: 0.45,
        ease: "power3.out",
        left: target.left,
        top: target.top,
        width: target.width,
        height: target.height,
        borderRadius: `${PIN_BORDER_RADIUS}px`,
        overwrite: "auto",
      });
    };

    const unpinToCircle = () => {
      currentPinnedEl = null;

      gsap.killTweensOf(cursor);
      if (pinnedTweenRef.current) {
        pinnedTweenRef.current.kill();
        pinnedTweenRef.current = null;
      }

      // Block velocity/rotation animation for 0.5s after leaving a pinned element
      unpinCooldownRef.current = true;
      setTimeout(() => {
        unpinCooldownRef.current = false;
      }, 500);

      // Flip immediately so onMouseMove resumes tracking during the unpin animation
      isPinnedRef.current = false;

      const targetX =
        lastXRef.current !== null ? lastXRef.current - size / 2 : 0;
      const targetY =
        lastYRef.current !== null ? lastYRef.current - size / 2 : 0;

      const currentLeft = gsap.getProperty(cursor, "left");
      const currentTop = gsap.getProperty(cursor, "top");

      gsap.set(cursor, {
        clearProps: "left,top",
        x: currentLeft,
        y: currentTop,
        transformOrigin: "50% 50%",
      });

      pinnedTweenRef.current = gsap.to(cursor, {
        duration: 0.45,
        ease: "power3.out",
        x: targetX,
        y: targetY,
        width: size,
        height: size,
        borderRadius: "50%",
        scaleX: 1,
        scaleY: 1,
        overwrite: "auto",
      });
    };

    // Event delegation on document — works regardless of when hero elements
    // mount or unmount during route changes, no querySelector needed
    const onPointerOver = (e) => {
      const target = e.target.closest(PINNABLE_SELECTOR);
      if (!target) return;
      // Skip if already pinned to this exact element
      if (currentPinnedEl === target) return;
      pinToElementRect(target);
    };

    const onPointerOut = (e) => {
      if (!currentPinnedEl) return;
      // Only unpin when truly leaving the element, not moving between its children
      const leaving = e.target.closest(PINNABLE_SELECTOR);
      const entering = e.relatedTarget?.closest(PINNABLE_SELECTOR);
      if (leaving && leaving !== entering) {
        unpinToCircle();
      }
    };

    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("pointerout", onPointerOut, { passive: true });

    // Re-pin to current element on resize
    const onResize = () => {
      if (!isPinnedRef.current || !currentPinnedEl) return;
      pinToElementRect(currentPinnedEl);
    };

    window.addEventListener("resize", onResize, { passive: true });

    // --- Movement / input handlers ---

    const getElementUnderPointer = (x, y) => {
      const els = document.elementsFromPoint(x, y);
      for (const element of els) {
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

    const onMouseMove = (e) => {
      lastX = e.clientX;
      lastY = e.clientY;
      lastXRef.current = lastX;
      lastYRef.current = lastY;
      lastMoveTimeRef.current = Date.now();

      if (isPinnedRef.current) {
        // Auto-unpin if the pinned element was removed from the DOM (route change)
        // or the pointer is no longer hovering over any pinnable element
        const stillInDOM = currentPinnedEl && document.contains(currentPinnedEl);
        const stillUnderPointer = e.target.closest(PINNABLE_SELECTOR);
        if (!stillInDOM || !stillUnderPointer) {
          unpinToCircle();
        }
        return;
      }

      gsap.to(cursor, {
        x: e.clientX - size / 2,
        y: e.clientY - size / 2,
        duration: 0.7,
        ease: "back",
        overwrite: "auto",
      });

      if (!isDragging) {
        scheduleCheck();
      }
    };

    const onMouseDown = () => {
      isMouseDownRef.current = true;
      if (isPinnedRef.current) return;

      gsap.to(cursor, {
        scale: 0.85,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const onMouseUp = () => {
      isMouseDownRef.current = false;
      if (isPinnedRef.current) return;

      gsap.to(cursor, {
        scale: 1,
        duration: 0.5,
        ease: "back.out(3)",
        overwrite: "auto",
      });
    };

    const onCursorUpdate = (e) => {
      if (e.detail?.x !== undefined && e.detail?.y !== undefined) {
        lastX = e.detail.x;
        lastY = e.detail.y;
        lastXRef.current = lastX;
        lastYRef.current = lastY;
        lastMoveTimeRef.current = Date.now();

        if (isPinnedRef.current) return;

        gsap.to(cursor, {
          x: e.detail.x - size / 2,
          y: e.detail.y - size / 2,
          duration: 0.1,
          ease: "power2.out",
          overwrite: "auto",
        });

        if (!isDragging) {
          scheduleCheck();
        }
      }
    };

    const onDragStart = () => { isDragging = true; };
    const onDragEnd = () => { isDragging = false; scheduleCheck(); };

    const mousedownForDrag = (e) => {
      const target = e.target;
      if (target.closest && target.closest(".dragger-wrapper")) {
        onDragStart();
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", resetScalesToNormal);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("cursorUpdate", onCursorUpdate);
    window.addEventListener("scroll", scheduleCheck, { passive: true });
    window.addEventListener("wheel", scheduleCheck, { passive: true });
    window.addEventListener("touchmove", scheduleCheck, { passive: true });
    document.addEventListener("mousedown", mousedownForDrag);
    document.addEventListener("mouseup", () => {
      if (isDragging) onDragEnd();
    });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", resetScalesToNormal);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("cursorUpdate", onCursorUpdate);
      window.removeEventListener("scroll", scheduleCheck);
      window.removeEventListener("wheel", scheduleCheck);
      window.removeEventListener("touchmove", scheduleCheck);
      document.removeEventListener("mousedown", mousedownForDrag);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("resize", onResize);
      gsap.killTweensOf(cursor);
      if (pinnedTweenRef.current) {
        pinnedTweenRef.current.kill();
        pinnedTweenRef.current = null;
      }
      if (inactivityIntervalRef.current)
        clearInterval(inactivityIntervalRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
      if (rafId) cancelAnimationFrame(rafId);
      observer.kill();
    };
  }, [isTouchscreenSize]);

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
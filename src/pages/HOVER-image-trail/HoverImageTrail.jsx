import { useEffect, useRef } from "react";
import "../../styles/hover-image-trail.css";
import img1 from "/images/img1.webp";
import img2 from "/images/img2.webp";
import img3 from "/images/img3.webp";
import img4 from "/images/img4.webp";
import img5 from "/images/img5.webp";
import img6 from "/images/img6.webp";
import img7 from "/images/img7.webp";
import img9 from "/images/purple-background.jpg";
import img10 from "/images/blue-background.jpg";
import img11 from "/images/yellow-background.jpg";

import RoutingTransition from "../../components/transitionRouter/Transition";
import HOVER_IMAGE_TRAIL from "../../config/hoverImageTrail.config";

const HoverImageTrail = () => {
  const containerRef = useRef(null);
  const trailRef = useRef([]);
  const mouseRef = useRef({
    mouseX: 0,
    mouseY: 0,
    lastMouseX: 0,
    lastMouseY: 0,
    isMoving: false,
    isCursorInContainer: false,
    lastScrollTime: 0,
    isScrolling: false,
    isScrollTicking: false,
  });
  const timeoutsRef = useRef({
    moveTimeout: null,
    scrollTimeout: null,
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const images = Array.from(
      { length: HOVER_IMAGE_TRAIL.images },
      (_, i) =>
        [img1, img2, img3, img4, img5, img6, img7, img9, img10, img11][i],
    );

    const trail = trailRef.current;
    const mouse = mouseRef.current;
    const timeouts = timeoutsRef.current;

    function isInContainer(x, y) {
      const rect = container.getBoundingClientRect();

      return (
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
      );
    }

    const setInitialMousePos = (e) => {
      mouse.mouseX = e.clientX;
      mouse.mouseY = e.clientY;
      mouse.lastMouseX = mouse.mouseX;
      mouse.lastMouseY = mouse.mouseY;
      mouse.isCursorInContainer = isInContainer(mouse.mouseX, mouse.mouseY);
      document.removeEventListener("mouseover", setInitialMousePos);
    };

    document.addEventListener("mouseover", setInitialMousePos);

    const hasMovedEnough = () => {
      const distance = Math.sqrt(
        Math.pow(mouse.mouseX - mouse.lastMouseX, 2) +
          Math.pow(mouse.mouseY - mouse.lastMouseY, 2),
      );

      return distance > HOVER_IMAGE_TRAIL.mouseThreshold;
    };

    function createTrailImage() {
      if (!mouse.isCursorInContainer) return;

      if (mouse.isMoving && hasMovedEnough()) {
        mouse.lastMouseX = mouse.mouseX;
        mouse.lastMouseY = mouse.mouseY;
        createImage();
      }
    }

    function createImage() {
      const img = document.createElement("img");
      img.classList.add("trail-img");

      const randomIndex = Math.floor(Math.random() * images.length);

      const rotation = (Math.random() - 0.5) * 50;

      img.src = images[randomIndex];

      const rect = container.getBoundingClientRect();
      const relativeX = mouse.mouseX - rect.left;
      const relativeY = mouse.mouseY - rect.top;
      img.style.left = `${relativeX}px`;
      img.style.top = `${relativeY}px`;
      img.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(0)`;
      img.style.transition = `transform ${HOVER_IMAGE_TRAIL.inDuration}ms ${HOVER_IMAGE_TRAIL.inEasing}`;

      container.appendChild(img);
      setTimeout(() => {
        img.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(1)`;
      }, 10);

      trail.push({
        element: img,
        rotation,
        removeTime: Date.now() + HOVER_IMAGE_TRAIL.imagesLifespan,
      });
    }

    function createScrollTrailImage() {
      if (!mouse.isCursorInContainer) return;
      mouse.lastMouseX +=
        (HOVER_IMAGE_TRAIL.mouseThreshold + 10) *
        (Math.random() > 0.5 ? 1 : -1);
      mouse.lastMouseY +=
        (HOVER_IMAGE_TRAIL.mouseThreshold + 10) *
        (Math.random() > 0.5 ? 1 : -1);
      createImage();

      mouse.lastMouseX = mouse.mouseX;
      mouse.lastMouseY = mouse.mouseY;
    }

    function removeOldImages() {
      const now = Date.now();

      if (trail.length === 0) return;

      // Check all images and remove any that have expired
      for (let i = trail.length - 1; i >= 0; i--) {
        if (now >= trail[i].removeTime) {
          const imgToRemove = trail.splice(i, 1)[0];
          imgToRemove.element.style.transition = `transform ${HOVER_IMAGE_TRAIL.outDuration}ms ${HOVER_IMAGE_TRAIL.outEasing}`;
          imgToRemove.element.style.transform = `translate(-50%, -50%) rotate(${imgToRemove.rotation}deg) scale(0)`;

          setTimeout(() => {
            if (imgToRemove.element.parentNode) {
              imgToRemove.element.parentNode.removeChild(imgToRemove.element);
            }
          }, HOVER_IMAGE_TRAIL.outDuration);
        }
      }
    }

    const handleMouseMove = (e) => {
      mouse.mouseX = e.clientX;
      mouse.mouseY = e.clientY;
      mouse.isCursorInContainer = isInContainer(mouse.mouseX, mouse.mouseY);

      if (mouse.isCursorInContainer) {
        mouse.isMoving = true;
        clearTimeout(timeouts.moveTimeout);
        timeouts.moveTimeout = setTimeout(() => {
          mouse.isMoving = false;
        }, 100);
      }
    };

    const handleScroll1 = () => {
      mouse.isCursorInContainer = isInContainer(mouse.mouseX, mouse.mouseY);
      if (mouse.isCursorInContainer) {
        mouse.isMoving = true;
        mouse.lastMouseX += (Math.random() - 0.5) * 10;

        clearTimeout(timeouts.scrollTimeout);
        timeouts.scrollTimeout = setTimeout(() => {
          mouse.isMoving = false;
        }, 100);
      }
    };

    const handleScroll2 = () => {
      const now = Date.now();
      mouse.isScrolling = true;
      if (now - mouse.lastScrollTime < HOVER_IMAGE_TRAIL.scrollThreshol) return;
      mouse.lastScrollTime = now;
      if (!mouse.isScrollTicking) {
        requestAnimationFrame(() => {
          if (mouse.isScrolling) {
            createScrollTrailImage();
            mouse.isScrolling = false;
          }

          mouse.isScrollTicking = false;
        });
        mouse.isScrollTicking = true;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll1, { passive: true });
    window.addEventListener("scroll", handleScroll2, { passive: true });

    let animationId;
    const animate = () => {
      createTrailImage();
      removeOldImages();
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      document.removeEventListener("mouseover", setInitialMousePos);
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll1);
      window.removeEventListener("scroll", handleScroll2);
      cancelAnimationFrame(animationId);
      clearTimeout(timeouts.moveTimeout);
      clearTimeout(timeouts.scrollTimeout);

      // Clean up remaining images
      trail.forEach((item) => {
        if (item.element.parentNode) {
          item.element.parentNode.removeChild(item.element);
        }
      });
      trailRef.current = [];
    };
  }, []);

  return (
    <section className="hover-image-trail">
      <section className="hover-image-trail-hero">
        <h1>
          Hover the section below <br />( NOT FOR TOUCHSCREENS )
        </h1>
      </section>
      <section className="hover-image-trail-main" ref={containerRef}>
        <h1>Move the cursor</h1>
      </section>
    </section>
  );
};

export default RoutingTransition(HoverImageTrail);

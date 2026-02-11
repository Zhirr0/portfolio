import "../../styles/styles.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import {
  path1,
  path2,
  path3,
  path4,
  path5,
  path6,
  path7,
  path8, 
} from "./signatureSVG";
import { lockScroll, unlockScroll } from "../../utils/screenLocker";
import signatureConfig from "../../config/signature.config";

const RenderSignatureSvg = ({ onLoadComplete }) => {
  const [loadProgress, setLoadProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const digit3Ref = useRef(null);

  // Track loading progress
  useEffect(() => {
    let progress = 0;
    const increment = 1;
    const interval = .1; // Update every 30ms for smooth animation

    // Simulate checking various load states
    const checkLoadProgress = () => {
      // Check document ready state
      if (document.readyState === "interactive" && progress < 40) {
        progress = 40;
      }
      if (document.readyState === "complete" && progress < 70) {
        progress = 70;
      }

      // Check if images are loaded
      const images = Array.from(document.images);
      const videos = Array.from(document.querySelectorAll("video"));
      const allMedia = [...images, ...videos];

      if (allMedia.length > 0) {
        const loaded = allMedia.filter((media) => {
          if (media.tagName === "IMG") return media.complete;
          if (media.tagName === "VIDEO") return media.readyState >= 2;
          return false;
        }).length;

        const mediaProgress = Math.floor((loaded / allMedia.length) * 30);
        progress = Math.max(progress, 70 + mediaProgress);
      } else {
        progress = Math.max(progress, 95);
      }

      return progress;
    };

    const progressInterval = setInterval(() => {
      const currentProgress = checkLoadProgress();
      
      setLoadProgress((prev) => {
        const newProgress = Math.min(prev + increment, currentProgress);
        
        // When we reach 100%, mark as loaded
        if (newProgress >= 100 && !isLoaded) {
          setIsLoaded(true);
          clearInterval(progressInterval);
        }
        
        return newProgress;
      });
    }, interval);

    // Ensure we reach 100% after DOMContentLoaded
    const handleDOMContentLoaded = () => {
      setTimeout(() => {
        setLoadProgress(100);
        setIsLoaded(true);
        clearInterval(progressInterval);
      }, 500);
    };

    if (document.readyState === "complete") {
      handleDOMContentLoaded();
    } else {
      window.addEventListener("load", handleDOMContentLoaded);
    }

    return () => {
      clearInterval(progressInterval);
      window.removeEventListener("load", handleDOMContentLoaded);
    };
  }, [isLoaded]);

  useGSAP(() => {
    const svgEl = document.querySelector("svg.zhir-svg");
    const containerEl = document.querySelector(".svg-container");
    const digit1 = document.querySelector(".digit-1");
    const digit2 = document.querySelector(".digit-2");
    const digit3 = document.querySelector(".digit-3");

    if (!svgEl || !containerEl || !digit1 || !digit2 || !digit3) return;

    lockScroll();

    // Build extra digit loops for smooth counter animation
    for (let i = 0; i < signatureConfig.counter.digit3.extraLoops; i++) {
      for (let j = 0; j < 10; j++) {
        const div = document.createElement("div");
        div.className = "num";
        div.textContent = j;
        digit3.appendChild(div);
      }
    }

    const finalDigit = document.createElement("div");
    finalDigit.className = "num";
    finalDigit.textContent = "0";
    digit3.appendChild(finalDigit);

    digit3Ref.current = digit3;

    // Infinite SVG drawing animation
    const svgDrawing = svgEl.querySelectorAll("path");
    const svgTimeline = gsap.timeline();

    const { svgAnimation } = signatureConfig;
    
    svgDrawing.forEach((path, i) => {
      const length = path.getTotalLength();

      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      path.style.fill = "#313131";
      path.style.fillOpacity = 0;

      svgTimeline.to(
        path,
        { strokeDashoffset: 0, duration: svgAnimation.drawDuration },
        i * svgAnimation.staggerAmount,
      ).to(
        path,
        {
          fillOpacity: 1,
          duration: svgAnimation.fillDuration,
          ease: svgAnimation.ease.fill,
        },
        `>${svgAnimation.fillDelay}`,
      );
    });

    // Add undraw animation to loop
    const { undrawAnimation } = signatureConfig;
    const drawEnd = svgTimeline.duration();

    svgDrawing.forEach((path, i) => {
      const length = path.getTotalLength();

      svgTimeline.to(
        path,
        {
          fillOpacity: 0,
          duration: undrawAnimation.unfillDuration,
          ease: undrawAnimation.ease.unfill,
        },
        drawEnd +
          undrawAnimation.pauseBeforeUndraw +
          i * undrawAnimation.staggerAmount,
      );

      svgTimeline.to(
        path,
        {
          strokeDashoffset: length,
          duration: undrawAnimation.undrawDuration,
          ease: undrawAnimation.ease.undraw,
        },
        drawEnd +
          undrawAnimation.pauseBeforeUndraw +
          i * undrawAnimation.staggerAmount +
          undrawAnimation.unfillDuration,
      );
    });

    return () => {
      svgTimeline.kill();
    };
  }, []);

  // Update counter based on load progress
  useEffect(() => {
    if (!digit3Ref.current) return;

    const digit1 = document.querySelector(".digit-1");
    const digit2 = document.querySelector(".digit-2");
    const digit3 = digit3Ref.current;

    if (!digit1 || !digit2 || !digit3) return;

    const numHeight = digit3.querySelector(".num")?.clientHeight || 0;
    if (numHeight === 0) return;

    // Calculate digit positions based on progress
    const ones = loadProgress % 10;
    const tens = Math.floor((loadProgress % 100) / 10);
    const hundreds = Math.floor(loadProgress / 100);

    // Animate digits to show current progress
    gsap.to(digit3, {
      y: -ones * numHeight,
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.to(digit2, {
      y: -tens * numHeight,
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.to(digit1, {
      y: -hundreds * numHeight,
      duration: 0.3,
      ease: "power2.out",
    });
  }, [loadProgress]);

  // Exit animation when loaded
  useEffect(() => {
    if (!isLoaded) return;

    const containerEl = document.querySelector(".svg-container");
    const svgEl = document.querySelector("svg.zhir-svg");

    if (!containerEl) return;

    gsap.set(containerEl, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    });

    const exitTimeline = gsap.timeline({
      onComplete: () => {
        if (svgEl) {
          const leaveEvt = new MouseEvent("mouseleave", {
            bubbles: true,
            cancelable: true,
            composed: true,
          });
          svgEl.dispatchEvent(leaveEvt);
        }

        const cursorEl = document.getElementById("cursor");
        if (cursorEl) {
          const cursorText = cursorEl.querySelector(".cursor-text");
          if (cursorText) cursorText.style.display = "none";
          gsap.to(cursorEl, { scale: 1, duration: 0.5, ease: "circ.inOut" });
        }

        containerEl.remove();
        unlockScroll();
        
        if (onLoadComplete) {
          onLoadComplete();
        }
      },
    });

    exitTimeline.to(containerEl, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 2,
      backgroundColor: "#000",
      ease: "expo.in",
      delay: 2,
    });

    return () => {
      exitTimeline.kill();
    };
  }, [isLoaded, onLoadComplete]);

  return (
    <div className="svg-container bg-light-secondary">
      <div className="text-dark-tertiary counter overflow-hidden">
        <div className="digit-1 digit">
          <div className="num">0</div>
          <div className="num">1</div>
        </div>
        <div className="digit-2 digit">
          <div className="num">0</div>
          <div className="num offset">1</div>
          <div className="num">2</div>
          <div className="num">3</div>
          <div className="num">4</div>
          <div className="num">5</div>
          <div className="num">6</div>
          <div className="num">7</div>
          <div className="num">8</div>
          <div className="num">9</div>
          <div className="num">0</div>
        </div>
        <div className="digit-3 digit">
          <div className="num">0</div>
          <div className="num">1</div>
          <div className="num">2</div>
          <div className="num">3</div>
          <div className="num">4</div>
          <div className="num">5</div>
          <div className="num">6</div>
          <div className="num">7</div>
          <div className="num">8</div>
          <div className="num">9</div>
        </div>
        <div className="digit-4 digit">%</div>
      </div>
      <div className="svg-header">
        <h1>
          <svg
            className="zhir-svg"
            viewBox="0 0 626 348"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d={path1} stroke="#131313" />
            <path d={path2} stroke="#131313" />
            <path d={path3} stroke="#131313" />
            <path d={path4} stroke="#131313" />
            <path d={path5} stroke="#131313" />
            <path d={path6} stroke="#131313" />
            <path d={path7} stroke="#131313" />
            <path d={path8} stroke="#131313" />
          </svg>
        </h1>
      </div>
    </div>
  );
};

export default RenderSignatureSvg;
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
  const pathLengthsRef = useRef([]);
  const totalLengthRef = useRef(0);
  const glowTriggeredRef = useRef(false);

  // Track loading progress
  useEffect(() => {
    let progress = 0;
    const increment = 1;
    const interval = 0.1;

    const checkLoadProgress = () => {
      if (document.readyState === "interactive" && progress < 40) {
        progress = 40;
      }
      if (document.readyState === "complete" && progress < 70) {
        progress = 70;
      }

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

        if (newProgress >= 100 && !isLoaded) {
          setIsLoaded(true);
          clearInterval(progressInterval);
        }

        return newProgress;
      });
    }, interval);

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

  // Initialize SVG paths, set up dash arrays, store lengths, don't animate yet
  useGSAP(() => {
    const svgEl = document.querySelector("svg.zhir-svg");
    const containerEl = document.querySelector(".svg-container");
    const digit3 = document.querySelector(".digit-3");

    if (!svgEl || !containerEl || !digit3) return;

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

    // Measure all paths and set them to fully hidden
    const svgPaths = svgEl.querySelectorAll("path");
    let totalLength = 0;
    const lengths = [];

    svgPaths.forEach((path) => {
      const length = path.getTotalLength();
      lengths.push(length);
      totalLength += length;

      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length; // fully hidden 
      path.style.fill = "#fafafa";
      path.style.fillOpacity = 0;
      path.style.transition = "none";
    });

    pathLengthsRef.current = lengths;
    totalLengthRef.current = totalLength;
  }, []);

  // Drive SVG drawing from load progress (0–100 maps to 0–100% drawn)
  useEffect(() => {
    const svgEl = document.querySelector("svg.zhir-svg");
    if (
      !svgEl ||
      pathLengthsRef.current.length === 0 ||
      totalLengthRef.current === 0
    )
      return;

    const svgPaths = svgEl.querySelectorAll("path");
    const totalLength = totalLengthRef.current;
    const drawnLength = (loadProgress / 100) * totalLength;

    let consumed = 0;
    svgPaths.forEach((path, i) => {
      const pathLen = pathLengthsRef.current[i];

      if (consumed + pathLen <= drawnLength) {
        // Fully drawn
        gsap.set(path, { strokeDashoffset: 0 });
      } else if (consumed >= drawnLength) {
        // Not yet started
        gsap.set(path, { strokeDashoffset: pathLen });
      } else {
        // Partially drawn — smooth it slightly with a very short tween
        const partial = drawnLength - consumed;
        gsap.to(path, {
          strokeDashoffset: pathLen - partial,
          duration: 0.08,
          ease: "none",
          overwrite: "auto",
        });
      }

      consumed += pathLen;
    });

    // Update counter digits
    if (!digit3Ref.current) return;

    const digit1 = document.querySelector(".digit-1");
    const digit2 = document.querySelector(".digit-2");
    const digit3 = digit3Ref.current;

    if (!digit1 || !digit2 || !digit3) return;

    const numHeight = digit3.querySelector(".num")?.clientHeight || 0;
    if (numHeight === 0) return;

    const ones = loadProgress % 10;
    const tens = Math.floor((loadProgress % 100) / 10);
    const hundreds = Math.floor(loadProgress / 100);

    gsap.to(digit3, { y: -ones * numHeight, duration: 0.3, ease: "power2.out" });
    gsap.to(digit2, { y: -tens * numHeight, duration: 0.3, ease: "power2.out" });
    gsap.to(digit1, { y: -hundreds * numHeight, duration: 0.3, ease: "power2.out" });
  }, [loadProgress]);

  // On load complete: fill + glow, then exit
  useEffect(() => {
    if (!isLoaded || glowTriggeredRef.current) return;
    glowTriggeredRef.current = true;

    const containerEl = document.querySelector(".svg-container");
    const svgEl = document.querySelector("svg.zhir-svg");

    if (!containerEl || !svgEl) return;

    const svgPaths = svgEl.querySelectorAll("path");

    const completionTimeline = gsap.timeline({
      onComplete: () => {
        // Exit wipe
        gsap.set(containerEl, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        });

        const exitTimeline = gsap.timeline({
          onComplete: () => {
            const leaveEvt = new MouseEvent("mouseleave", {
              bubbles: true,
              cancelable: true,
              composed: true,
            });
            svgEl.dispatchEvent(leaveEvt);

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
          delay: 1,
        });
      },
    });

    // 1. Fill all paths
    completionTimeline.to(Array.from(svgPaths), {
      fillOpacity: 1,
      duration: 0.6,
      ease: "power1.in",
      stagger: 0.02,
    });

    // 2. Glow pulse using drop-shadow filter on the SVG element
    completionTimeline.to(
      svgEl,
      {
        filter: "drop-shadow(0 0 18px rgba(250, 250, 250, 0.9))",
        duration: 0.5,
        ease: "power2.out",
      },
      "<0.2", 
    );

    // 3. Fade glow down softly
    completionTimeline.to(svgEl, {
      filter: "drop-shadow(0 0 6px rgba(250, 250, 250, 0.2))",
      duration: 1,
      ease: "power2.in",
    });

    return () => {
      completionTimeline.kill();
    };
  }, [isLoaded, onLoadComplete]);

  return (
    <div className="svg-container bg-dark-primary">
      <div className="text-light-primary counter overflow-hidden">
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
      <div className="svg-header overflow-visible">
        <h1 className="overflow-visible">
          <svg
            className="zhir-svg overflow-visible"
            viewBox="0 0 626 348"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d={path1} stroke="#fafafa" />
            <path d={path2} stroke="#fafafa" />
            <path d={path3} stroke="#fafafa" />
            <path d={path4} stroke="#fafafa" />
            <path d={path5} stroke="#fafafa" />
            <path d={path6} stroke="#fafafa" />
            <path d={path7} stroke="#fafafa" />
            <path d={path8} stroke="#fafafa" />
          </svg>
        </h1>
      </div>
    </div>
  );
};

export default RenderSignatureSvg;
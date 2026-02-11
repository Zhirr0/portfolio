import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMediaQuery } from "react-responsive";
import GitHub from "./svgComponents/GitHub";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import TEXT_ANIM_CONFIG from "../config/textAnimation.config";

const TextAnimation = () => {
  const isMediumScreen = useMediaQuery({ minWidth: 400, maxWidth: 768 });

  function getScrollMetrics(progressPercent, vhMultiplier) {
    const t = progressPercent / 100;
    const totalPx = window.innerHeight * vhMultiplier;
    const scrolledPx = t * totalPx;
    const scrollesvh = scrolledPx / window.innerHeight;
    const remainingPercent = 100 - progressPercent;
    const fixedProgress = progressPercent.toFixed(4);
    return { scrolledPx, scrollesvh, fixedProgress, remainingPercent };
  }

  useGSAP(() => {
    const containers = Array.from(
      document.querySelectorAll(
        ".text-animation-header-container, .text-animation-header-container-words",
      ),
    );
    if (!containers.length) return;

    const splitInstances = [];
    const partsByIndex = [];
    let activeIndex = -1;

    const sliderIndices = document.querySelector(".slider-indices");
    const progressBar = document.querySelector(".slider-progress");

    gsap.set(".slider-indicator", {
      opacity: 0,
    });

    function createIndices() {
      sliderIndices.innerHTML = "";

      containers.forEach((_, i) => {
        const indexNum = (i + 1).toString().padStart(2, "0");

        const p = document.createElement("p");
        p.className = "flex items-center gap-4 text-[#242424]";
        p.innerHTML = `
          <span class="marker w-3 h-px bg-[#242424] origin-right" style="transform: scaleX(0);"></span>
          <span class="index w-5 flex justify-end pr-[5px] opacity-35">${indexNum}</span>
        `;

        sliderIndices.appendChild(p);
      });
    }

    function animateIndicators(index) {
      const indicators = sliderIndices.querySelectorAll("p");

      indicators.forEach((p, i) => {
        const marker = p.querySelector(".marker");
        const idx = p.querySelector(".index");

        if (i === index) {
          gsap.to(idx, { opacity: 1, duration: 0.3 });
          gsap.to(marker, { scaleX: 1, duration: 0.3 });
        } else {
          gsap.to(idx, { opacity: 0.35, duration: 0.3 });
          gsap.to(marker, { scaleX: 0, duration: 0.3 });
        }
      });
    }

    createIndices();

    containers.forEach((container, index) => {
      const h1 = container.querySelector("h1");
      const githubIcon = container.querySelector(".svg-github-animation");

      if (!h1) {
        splitInstances.push(null);
        partsByIndex.push({
          parts: [],
          isChars: false,
          iswords: false,
          githubIcon: null,
        });
        return;
      }

      const splitType = index === 0 ? "words" : "words, words";
      const split = SplitText.create(h1, { type: splitType, autoSplit: true });
      splitInstances.push(split);

      const parts = splitType === "words" ? split.words : split.words;
      const partsArray = Array.isArray(parts) ? parts : [];

      partsByIndex.push({
        parts: partsArray,
        isChars: splitType === "words",
        iswords: splitType === "words",
        githubIcon: githubIcon || null,
      });

      gsap.set(partsArray, {
        opacity: 0,
        filter: `blur(${TEXT_ANIM_CONFIG.startBlur})`,
        yPercent: TEXT_ANIM_CONFIG.startY,
        pointerEvents: "none",
      });

      if (githubIcon) {
        const { initial } = TEXT_ANIM_CONFIG.github;
        gsap.set(githubIcon, {
          opacity: initial.opacity,
          filter: `blur(${initial.blur})`,
          rotation: initial.rotation,
          xPercent: initial.xPercent,
          yPercent: initial.yPercent,
          pointerEvents: initial.pointerEvents,
        });
      }
    });

    function animateIn(index, isChars) {
      const parts = partsByIndex[index]?.parts || [];
      const githubIcon = partsByIndex[index]?.githubIcon;
      if (!parts.length) return;

      const stagger = isChars
        ? TEXT_ANIM_CONFIG.staggerChars
        : TEXT_ANIM_CONFIG.staggerIn;

      gsap.killTweensOf(parts);

      gsap.fromTo(
        parts,
        {
          yPercent: TEXT_ANIM_CONFIG.startY,
          opacity: 0,
          filter: `blur(${TEXT_ANIM_CONFIG.startBlur})`,
        },
        {
          yPercent: TEXT_ANIM_CONFIG.inY,
          opacity: 1,
          filter: `blur(${TEXT_ANIM_CONFIG.inBlur})`,
          stagger,
          ease: TEXT_ANIM_CONFIG.easeIn,
          duration: TEXT_ANIM_CONFIG.duration,
          overwrite: "auto",
        },
      );

      if (githubIcon) {
        const { initial, animateIn: animIn } = TEXT_ANIM_CONFIG.github;

        gsap.killTweensOf(githubIcon);
        gsap.fromTo(
          githubIcon,
          {
            xPercent: initial.xPercent,
            yPercent: initial.yPercent,
            opacity: initial.opacity,
            rotation: initial.rotation,
            filter: `blur(${initial.blur})`,
          },
          {
            xPercent: animIn.xPercent,
            yPercent: animIn.yPercent,
            opacity: animIn.opacity,
            rotation: animIn.rotation,
            filter: `blur(${animIn.blur})`,
            ease: animIn.ease,
            duration: animIn.duration,
            delay: stagger * parts.length,
            overwrite: "auto",
            onComplete: () => {
              gsap.set(githubIcon, { pointerEvents: animIn.pointerEvents });
            },
          },
        );
      }
    }

    function forceOutState(index) {
      const parts = partsByIndex[index]?.parts || [];
      const githubIcon = partsByIndex[index]?.githubIcon;
      if (!parts.length) return;

      gsap.killTweensOf(parts);

      gsap.to(parts, {
        yPercent: TEXT_ANIM_CONFIG.outY,
        opacity: 0,
        filter: `blur(${TEXT_ANIM_CONFIG.outBlur})`,
        duration: TEXT_ANIM_CONFIG.duration,
        ease: TEXT_ANIM_CONFIG.easeOut,
        stagger: TEXT_ANIM_CONFIG.staggerOut,
      });

      if (githubIcon) {
        const { animateOut } = TEXT_ANIM_CONFIG.github;

        gsap.killTweensOf(githubIcon);
        gsap.to(githubIcon, {
          xPercent: animateOut.xPercent,
          yPercent: animateOut.yPercent,
          opacity: animateOut.opacity,
          rotation: animateOut.rotation,
          filter: `blur(${animateOut.blur})`,
          duration: animateOut.duration,
          ease: animateOut.ease,
        });
      }
    }

    function computeVisibleIndex(progress, totalHeaders) {
      if (progress < 20) return -1;

      const normalizedProgress = (progress - 20) / 80;
      const sectionSize = 1 / totalHeaders;
      const idx = Math.floor(normalizedProgress / sectionSize);

      return Math.min(Math.max(idx, 0), totalHeaders - 1);
    }
    
    ScrollTrigger.create({
      trigger: ".text-animation-section",
      start: "top top",
      end: `+=${window.innerHeight * 6}px`,
      pin: true,
      pinSpacing: true,
      pinType: "fixed",
      onUpdate: (e) => {
        const metrics = getScrollMetrics(e.progress * 100, 6);
        const progress = parseFloat(metrics.fixedProgress); // 0 to 100 not 0.01 to 1
        const targetIndex = computeVisibleIndex(progress, partsByIndex.length);
        
        gsap.set(progressBar, { scaleY: e.progress });
        
        if (progress >= 1 && progress <= 99) {
          gsap.to(".slider-indicator", {
            opacity: 1,
            duration:1,
            ease: "power2",
            overwrite: "auto",
          });
        }

        if (progress < 1 ) {
          gsap.to(".slider-indicator", {
            opacity: 0,
            duration:1,
            ease: "power2",
            overwrite: "auto",
          });
        }
        if (targetIndex === -1) {
          partsByIndex.forEach((_, i) => forceOutState(i));
          activeIndex = -1;
          return;
        }

        if (targetIndex === activeIndex) return;

        partsByIndex.forEach((_, i) => {
          if (i !== targetIndex) forceOutState(i);
        });

        const targetIsChars = partsByIndex[targetIndex]?.isChars || false;
        animateIn(targetIndex, targetIsChars);

        animateIndicators(targetIndex);

        activeIndex = targetIndex;

      },
    });
  }, []);

  return (
    <section className="text-animation-section">
      <div className="slider-indicator">
        <div className="slider-indices"></div>
        <div className="slider-progress-bar">
          <div
            className="slider-progress"
            style={{ transform: "translateX(-50%) scaleY(0)" }}
          ></div>
        </div>
      </div>

      <div
        className={`text-animation-header-container-words abs-center text-[80px] lg:text-9xl ${
          isMediumScreen ? "w-auto" : ""
        }`}
      >
        <h1 className="text-animation-header font-zen-antique-soft">Hello!</h1>
      </div>

      <div
        className={`text-animation-header-container-words abs-center text-[20px] sm:text-[30px] lg:text-5xl ${
          isMediumScreen ? "w-[70%]" : "md:w-[70%] w-[90%]"
        }`}
      >
        <h1 className="text-animation-header font-zen-antique-soft">
          I'm still early in my journey
        </h1>
      </div>

      <div
        className={`text-animation-header-container-words abs-center text-[20px] sm:text-[30px] lg:text-5xl ${
          isMediumScreen ? "w-[70%]" : "md:w-[70%] w-[90%]"
        }`}
      >
        <h1 className="text-animation-header font-zen-antique-soft">
          I don't have a huge portfolio yet
        </h1>
      </div>

      <div
        className={`text-animation-header-container-words abs-center text-[20px] sm:text-[30px] lg:text-5xl ${
          isMediumScreen ? "w-[70%]" : "md:w-[70%] w-[90%]"
        }`}
      >
        <h1 className="text-animation-header font-zen-antique-soft">
          Most of what I've built started from recreations and tutorials
        </h1>
      </div>

      <div
        className={`text-animation-header-container-words github-icon-link abs-center text-[20px] sm:text-[30px] lg:text-5xl ${
          isMediumScreen ? "w-[70%]" : "md:w-[70%] w-[90%]"
        }`}
      >
        <div className="github-container relative">
          <h1 className="text-animation-header font-zen-antique-soft">
            You can check my GitHub. I've recreated Awwwards sites like
            spylt.com
          </h1>
          <GitHub />
        </div>
      </div>
    </section>
  );
};

export default TextAnimation;

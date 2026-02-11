import { useCallback, useEffect, useRef, useState } from "react";
import { useWindowScroll } from "react-use";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import Magneto from './magnetos/Magneto'
import MagnetoSVG from "./magnetos/MagnetoSVG";
import signature from "/svg/signature.svg";
import logoSvg from "/svg/logo.svg";
import brush from "/svg/brush.svg";
import gsap from "gsap";
import navConfig from "../config/nav.config";

const Nav = () => {
  const [isCompressed, setIsCompressed] = useState(false);
  const isTouchScreen = useMediaQuery({ maxWidth: "1024px" });
  const isMobile = useMediaQuery({ maxWidth: "768px" });
  const lastScrollY = useRef(0);
  const navRef = useRef(null);
  const leftContentRef = useRef(null);
  const centerContentRef = useRef(null);
  const rightContentRef = useRef(null);
  const logoRef = useRef(null);

  const { y: currentScrollY } = useWindowScroll();

  // Responsive breakpoints
  const isXXL = useMediaQuery({ minWidth: 1536 });
  const isXL = useMediaQuery({ minWidth: 1280 });
  const isLG = useMediaQuery({ minWidth: 1024 });
  const isMD = useMediaQuery({ minWidth: 768 });
  const isSM = useMediaQuery({ minWidth: 640 });
  const isXS = useMediaQuery({ minWidth: 400 });

  useEffect(() => {
    // Set will-change for all animated elements
    gsap.set(navRef.current, {
      willChange: "left, right, top, height, background-color",
    });

    gsap.set(
      [
        leftContentRef.current,
        centerContentRef.current,
        rightContentRef.current,
      ],
      {
        willChange: "opacity",
      },
    );

    gsap.set(logoRef.current, {
      willChange: "opacity",
    });
  }, []);

  const getCompressedValues = useCallback(() => {
    if (isXXL) {
      return navConfig.compressed.xxl;
    } else if (isXL) {
      return navConfig.compressed.xl;
    } else if (isLG) {
      return navConfig.compressed.lg;
    } else if (isMD) {
      return navConfig.compressed.md;
    } else if (isSM) {
      return navConfig.compressed.sm;
    } else if (isXS) {
      return navConfig.compressed.xs;
    } else {
      return navConfig.compressed.default;
    }
  }, [isXXL, isXL, isLG, isMD, isSM, isXS]);

  const getExpandedValues = useCallback(() => {
    if (isXXL) {
      return navConfig.expanded.xxl;
    } else if (isXL) {
      return navConfig.expanded.xl;
    } else if (isLG) {
      return navConfig.expanded.lg;
    } else if (isMD) {
      return navConfig.expanded.md;
    } else if (isSM) {
      return navConfig.expanded.sm;
    } else {
      return navConfig.expanded.default;
    }
  }, [isXXL, isXL, isLG, isMD, isSM]);

  useEffect(() => {
    // Skip compression logic for mobile
    if (isMobile) return;

    let rafId = null;

    rafId = requestAnimationFrame(() => {
      if (
        currentScrollY > lastScrollY.current &&
        currentScrollY > navConfig.scrollThreshold
      ) {
        if (!isCompressed) {
          setIsCompressed(true);
        }
      } else if (currentScrollY < lastScrollY.current) {
        if (isCompressed) {
          setIsCompressed(false);
        }
      }

      lastScrollY.current = currentScrollY;
    });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [currentScrollY, isCompressed, isMobile]);

  useEffect(() => {
    // Force expanded state on mobile
    if (isMobile) {
      const expandedValues = getExpandedValues();

      gsap.set(navRef.current, {
        backgroundColor: navConfig.colors.expanded,
        left: expandedValues.left,
        right: expandedValues.right,
        top: expandedValues.top,
        height: expandedValues.height,
      });

      gsap.set(logoRef.current, {
        opacity: 0,
        display: "none",
        visibility: "hidden",
      });

      gsap.set(
        [
          leftContentRef.current,
          centerContentRef.current,
          rightContentRef.current,
        ],
        {
          opacity: 1,
          display: "block",
          visibility: "visible",
        },
      );

      return;
    }

    const compressedValues = getCompressedValues();
    const expandedValues = getExpandedValues();

    if (isCompressed) {
      gsap.to(navRef.current, {
        backgroundColor: navConfig.colors.compressed,
        duration: navConfig.animation.backgroundColor.duration,
        ease: navConfig.animation.backgroundColor.ease,
      });

      gsap.to(navRef.current, {
        left: compressedValues.left,
        right: compressedValues.right,
        top: compressedValues.top,
        height: compressedValues.height,
        duration: navConfig.animation.transform.duration,
        ease: navConfig.animation.transform.ease,
      });

      gsap.to(
        [
          leftContentRef.current,
          centerContentRef.current,
          rightContentRef.current,
        ],
        {
          opacity: 0,
          duration: navConfig.animation.contentFadeOut.duration,
          ease: navConfig.animation.contentFadeOut.ease,
          onComplete: () => {
            gsap.set(
              [
                leftContentRef.current,
                centerContentRef.current,
                rightContentRef.current,
              ],
              {
                display: "none",
                visibility: "hidden",
              },
            );
          },
        },
      );

      gsap.set(logoRef.current, { display: "flex" });

      gsap.to(logoRef.current, {
        opacity: 1,
        duration: navConfig.animation.logoFadeIn.duration,
        display: "flex",
        delay: navConfig.animation.logoFadeIn.delay,
        visibility: "visible",
        ease: navConfig.animation.logoFadeIn.ease,
      });
    } else {
      gsap.to(navRef.current, {
        backgroundColor: navConfig.colors.expanded,
        duration: navConfig.animation.backgroundColor.duration,
        ease: navConfig.animation.backgroundColor.ease,
      });

      gsap.to(navRef.current, {
        left: expandedValues.left,
        right: expandedValues.right,
        top: expandedValues.top,
        height: expandedValues.height,
        duration: navConfig.animation.transform.duration,
        ease: navConfig.animation.transform.ease,
      });

      gsap.to(logoRef.current, {
        opacity: 0,
        duration: navConfig.animation.logoFadeOut.duration,
        ease: navConfig.animation.logoFadeOut.ease,
        visibility: "hidden",
        display: "none",
      });

      gsap.set(
        [
          leftContentRef.current,
          centerContentRef.current,
          rightContentRef.current,
        ],
        {
          display: "block",
        },
      );

      gsap.to(
        [
          leftContentRef.current,
          centerContentRef.current,
          rightContentRef.current,
        ],
        {
          opacity: 1,
          duration: navConfig.animation.contentFadeIn.duration,
          delay: navConfig.animation.contentFadeIn.delay,
          display: "block",
          visibility: "visible",
          ease: navConfig.animation.contentFadeIn.ease,
        },
      );
    }
  }, [
    isCompressed,
    isXXL,
    isXL,
    isLG,
    isMD,
    isSM,
    isMobile,
    getExpandedValues,
    getCompressedValues,
  ]);

  useEffect(() => {
    const setHeroOffset = () => {
      if (!navRef.current) return;

      const rect = navRef.current.getBoundingClientRect();
      const offset = rect.bottom + navConfig.heroGap;

      document.documentElement.style.setProperty("--nav-bottom", `${offset}px`);
    };

    setHeroOffset();

    window.addEventListener("resize", setHeroOffset);

    const ro = new ResizeObserver(setHeroOffset);
    ro.observe(navRef.current);

    return () => {
      window.removeEventListener("resize", setHeroOffset);
      ro.disconnect();
    };
  }, [isCompressed, isXXL, isXL, isLG, isMD, isSM, isMobile]);

  return (
    <nav className="nav" ref={navRef}>
      <div className="nav-content">
        <div ref={leftContentRef}>
          <Magneto>
            <div className="nav-left">
              <h3 className="nav-left-header">PORTFOLIO</h3>
            </div>
          </Magneto>
        </div>

        {/* CENTER → HOME */}
        <Link
          to="/"
          ref={centerContentRef}
          className="nav-center-container"
          style={{ cursor: "pointer", textDecoration: "none" }}
        >
          {isTouchScreen ? (
            <div className="nav-center">
              <img src={signature} alt="PORTFOLIO LOGO" />
            </div>
          ) : (
            <MagnetoSVG>
              <div className="nav-center">
                <img src={signature} alt="PORTFOLIO LOGO" />
              </div>
            </MagnetoSVG>
          )}
        </Link>

        {/* RIGHT → ANIMATIONS */}
        <Link
          to="/animations"
          ref={rightContentRef}
          style={{ textDecoration: "none" }}
        >
          {isTouchScreen ? (
            <div className="nav-right">
              <img src={brush} alt="Animations in action" />
            </div>
          ) : (
            <MagnetoSVG>
              <img src={brush} alt="Animations in action" />
            </MagnetoSVG>
          )}
        </Link>

        <div ref={logoRef} className="logo-container">
          <img src={logoSvg} alt="logo" />
        </div>
      </div>
    </nav>
  );
};

export default Nav;
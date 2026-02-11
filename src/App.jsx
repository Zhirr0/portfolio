import "./index.css";

/* React */
import { useEffect, useRef } from "react";

/* Routing */
import { useLocation, Routes, Route } from "react-router-dom";

/* Animation / motion */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence } from "motion/react";
import { ReactLenis } from "lenis/react";

/* Utilities */
import { useMediaQuery } from "react-responsive";

/* Core components */
import Nav from "./components/Nav";
import Cursor from "./components/Cursor";
import RenderSignatureSvg from "./components/signatureAnimation/RenderSignatureSvg";
/* Pages */
import Home from "./pages/Home";
import Animations from "./pages/animations/Animations";

/* Animations */
import RenderTextAnimations from "./pages/TEXT-reveal/RenderTextAnimations";
import GravityInteraction from "./pages/TEXT-physics-interaction/GravityInteraction";
import ParallaxText from "./pages/TEXTparallax3D/ParallaxText";
import ScrollTriggerCardsReveal from "./pages/SCROLLTRIGGER-cards-reveal/ScrollTriggerCardsReveal";
import ScrollTriggerZoom from "./pages/SCROLLTRIGGER-zoom/ScrollTriggerZoom";
import LandingPage from "./pages/LANDINGPAGE/LandingPage";
import HoverClipPath from "./pages/HOVER-clippath/HoverClipPath";
import HoverLinksInteraction from "./pages/HOVER-links-interaction/HoverLinksInteraction";
import HoverImageTrail from "./pages/HOVER-image-trail/HoverImageTrail";

const App = () => {
  const location = useLocation();
  const lenisRef = useRef();
  const isTouchScreenSize = useMediaQuery({ maxWidth: 1024 });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (lenisRef.current?.lenis) {
      lenisRef.current.lenis.scrollTo(0, { immediate: true });
    }
  }, []);

  useEffect(() => {
    const update = (time) => lenisRef.current?.lenis?.raf(time * 700);
    gsap.ticker.add(update);
    return () => gsap.ticker.remove(update);
  }, []);

  // Sync Lenis with ScrollTrigger for infinite scroll
  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    
    if (lenis) {
      const handleScroll = () => {
        ScrollTrigger.update();
      };
      
      lenis.on('scroll', handleScroll);
      
      return () => {
        lenis.off('scroll', handleScroll);
      };
    }
  }, []);
  return (
    // balanced tuning (my recommended defaults)
    <ReactLenis
      root
      options={{
        autoRaf: false,
        smoothWheel: true,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      }}
      ref={lenisRef}
    >
      <Nav />
      <div style={{display: isTouchScreenSize ? 'none': "block"}}>
        <Cursor />
      </div>
      <RenderSignatureSvg />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route index element={<Home />} />
          <Route path="/animations" element={<Animations />} />
          <Route
            path="/animations/text-reveal"
            element={<RenderTextAnimations />}
          />
          <Route
            path="/animations/text-physics-interaction"
            element={<GravityInteraction />}
          />
          <Route path="/animations/text-parallax" element={<ParallaxText />} />
          <Route
            path="/animations/scrolltrigger-cards"
            element={<ScrollTriggerCardsReveal />}
          />
          <Route
            path="/animations/scrolltrigger-zoom"
            element={<ScrollTriggerZoom />}
          />
          <Route path="/animations/landingpage" element={<LandingPage />} />
          <Route
            path="/animations/hover-clippath"
            element={<HoverClipPath />}
          />
          <Route
            path="/animations/hover-links-interaction"
            element={<HoverLinksInteraction />}
          />
          <Route
            path="/animations/hover-image-trail"
            element={<HoverImageTrail />}
          />
        </Routes>
      </AnimatePresence>
    </ReactLenis>
  );
};

export default App;
import BottomWave from "./svgComponents/BottomWave";
import ReusableMagneto from "./magnetos/ReusableMagneto";
import { useRef} from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import HERO_CONFIG from "../config/hero.config";
import { useMediaQuery } from "react-responsive";

gsap.registerPlugin(SplitText);

const Hero = () => {
  const heroRef = useRef(null);
  const headerRef = useRef(null);
  const paragraphRef = useRef(null);
  const heroTextRef = useRef(null);
  const isIpad = useMediaQuery({ maxWidth: "1015px" });
  const isMiniIpad = useMediaQuery({ maxWidth: "835px" });
  const isPhone = useMediaQuery({ maxWidth: "630px" });

  useGSAP(
    () => {
      let headerSplit;
      let paraSplit;

      document.fonts.ready.then(() => {
        headerSplit = SplitText.create(headerRef.current, {
          type: "chars",
          mask: "chars",
        });

        paraSplit = SplitText.create(paragraphRef.current, {
          type: "words",
          wordsClass: "word",
          mask: "words",
        });

        const tl = gsap.timeline();

        tl.from(headerSplit.chars, {
          y: HERO_CONFIG.animation.header.fromY,
          stagger: HERO_CONFIG.animation.header.stagger,
          duration: HERO_CONFIG.animation.header.duration,
          ease: HERO_CONFIG.animation.ease,
          delay: HERO_CONFIG.animation.header.delay,
        }).from(
          paraSplit.words,
          {
            y: HERO_CONFIG.animation.paragraph.fromY,
            stagger: HERO_CONFIG.animation.paragraph.stagger,
            duration: HERO_CONFIG.animation.paragraph.duration,
            ease: HERO_CONFIG.animation.ease,
          },
          "<",
        );
      });
    },
    { scope: heroRef, dependencies: [] },
  );
  const paddingTop = isPhone ? 10 : isMiniIpad ? 15 : isIpad ? 20 : 0;

  return (
    <section ref={heroRef} className="hero relative">
      <div
        ref={heroTextRef}
        className="hero-text flex flex-col -gap-10"
        style={{ paddingTop: "clamp(50px, 9vw, 100px)" }}
      >
        <div ref={headerRef} className="hero-header">
          <h1 className="text-header">
            CREATIVE <br />
            DEVELOPER
          </h1>
        </div>

        <div ref={paragraphRef} className="hero-paragraph">
          <p className="text-paragraph">
            Building modern, high-performance websites with motion, focused on
            performance, animation, and interaction. Powered by React, GSAP,
            Motion, and TailwindCSS. Trying to reach awwward-winning website
            level.
          </p>
        </div>
      </div>
      <div className="relative w-full">
        <BottomWave heroContainer={heroRef} />
      </div>

      <div className="circular">
        <ReusableMagneto
          textClassname="abs-center text-[10px] lg:text-[15px] xl:text-[17px] leading-5 mix-blend-difference z-10 text-center text-white"
          className="relative circle rounded-full bg-[#242424] w-[100px] h-[100px] lg:w-[150px] lg:h-[150px]"
        >
          Enjoy Scrolling
        </ReusableMagneto>
      </div>
    </section>
  );
};

export default Hero;

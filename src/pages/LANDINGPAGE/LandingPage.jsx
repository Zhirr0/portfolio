import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import "../../styles/landing-page.css";
import img from "/images/img5.webp";
import RoutingTransition from "../../components/transitionRouter/Transition";
import landingPageConfig from "../../config/landingPage.config";

const LandingPage = () => {
  const loadHeadingRef = useRef(null);
  const videoContainerRef = useRef(null);
  const splitRef = useRef(null);

  useEffect(() => {
    const loadHeading = loadHeadingRef.current;
    const videoContainer = videoContainerRef.current;

    const split = new SplitText("[data-split]", {
      type: landingPageConfig.splitText.type,
      wordsClass: landingPageConfig.splitText.wordsClass,
    });
    splitRef.current = split;

    const getGap = () => {
      const vw = window.innerWidth;
      if (vw <= landingPageConfig.breakpoints.mobile) {
        return landingPageConfig.gap.mobile;
      }
      if (vw <= landingPageConfig.breakpoints.tablet) {
        return landingPageConfig.gap.tablet;
      }
      if (vw <= landingPageConfig.breakpoints.laptop) {
        return landingPageConfig.gap.laptop;
      }
      return landingPageConfig.gap.desktop;
    };

    gsap.set(loadHeading, { opacity: landingPageConfig.initial.opacity });

    const tl = gsap.timeline();

    tl.to(loadHeading, {
      opacity: landingPageConfig.animation.fadeIn.opacity,
      duration: landingPageConfig.animation.fadeIn.duration,
      ease: landingPageConfig.animation.fadeIn.ease,
      delay: landingPageConfig.animation.fadeIn.delay,
    })
      .to(
        loadHeading,
        {
          gap: getGap(),
          duration: landingPageConfig.animation.gapExpand.duration,
          ease: landingPageConfig.animation.gapExpand.ease,
        },
        "<1",
      )
      .to(
        videoContainer,
        {
          transform: landingPageConfig.transform.rotateStart,
          duration: landingPageConfig.animation.videoRotate.duration,
          ease: landingPageConfig.animation.videoRotate.ease,
        },
        "<",
      )
      .to(
        videoContainer,
        {
          transform: landingPageConfig.transform.rotateEnd,
          height: landingPageConfig.transform.fullSize.height,
          width: landingPageConfig.transform.fullSize.width,
          ease: landingPageConfig.animation.videoExpand.ease,
          duration: landingPageConfig.animation.videoExpand.duration,
        },
        `+=${landingPageConfig.animation.videoExpand.delay}`,
      )
      .to(
        loadHeading,
        {
          opacity: landingPageConfig.animation.fadeOut.opacity,
        },
        "<",
      )
      .to(split.words, {
        y: landingPageConfig.animation.wordsReveal.y,
        duration: landingPageConfig.animation.wordsReveal.duration,
        stagger: landingPageConfig.animation.wordsReveal.stagger,
        ease: landingPageConfig.animation.wordsReveal.ease,
      });

    return () => {
      if (splitRef.current) {
        splitRef.current.revert();
      }
      tl.kill();
    };
  }, []);

  return (
    <section className="landing-page-section">
      <div className="landing-page-loading">
        <div className="landing-page-loading-heading" ref={loadHeadingRef}>
          <h2 className="landing-page-loading-title">ZH</h2>
          <h2 className="landing-page-loading-title">IR</h2>
        </div>
      </div>
      <div className="landing-page-main">
        <div className="landing-page-video" ref={videoContainerRef}>
          <img className="landing-page-video-img" src={img} alt="" />
        </div>
        <div className="landing-page-after-loading">
          <header className="landing-page-header">
            <a className="landing-page-header-link"></a>
          </header>
          <div className="landing-page-content">
            <p className="landing-page-content-title" data-split>
              HELLO
            </p>
            <span className="landing-page-content-subtitle" data-split>
              don't hesitate to reach out
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoutingTransition(LandingPage);

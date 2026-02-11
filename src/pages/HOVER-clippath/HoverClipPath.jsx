import { useRef } from "react";
import gsap from "gsap";
import "../../styles/hover-clipPath.css";
import { useGSAP } from "@gsap/react";
import RoutingTransition from "../../components/transitionRouter/Transition";
import hoverClipPathConfig from "../../config/hoverClippath.config";

const HoverClipPath = () => {
  const projectsRef = useRef(null);
  const thumbnailRef = useRef(null);
  const projectRefs = useRef([]);
  const thumbnailRefs = useRef([]);

  useGSAP(() => {
    const projects = projectRefs.current;
    const thumbnails = thumbnailRefs.current;
    const projectThumbnail = thumbnailRef.current;
    const projectsContainer = projectsRef.current;

    if (!projectThumbnail || !projectsContainer) return;

    gsap.set(projectThumbnail, hoverClipPathConfig.thumbnail.initial);

    gsap.set(thumbnails, {
      clipPath: hoverClipPathConfig.clipPath.hidden,
    });

    const xTo = gsap.quickTo(projectThumbnail, "x", {
      duration: hoverClipPathConfig.mouseTracking.duration,
      ease: hoverClipPathConfig.mouseTracking.ease,
    });
    const yTo = gsap.quickTo(projectThumbnail, "y", {
      duration: hoverClipPathConfig.mouseTracking.duration,
      ease: hoverClipPathConfig.mouseTracking.ease,
    });

    const setRotation = gsap.quickSetter(projectThumbnail, "rotation", "deg");

    let currentIndex = -1;
    let previousX = null;
    let targetRotation = 0;
    let currentRotation = 0;

    const sensitivity = hoverClipPathConfig.rotation.sensitivity;
    const maxRotation = hoverClipPathConfig.rotation.maxRotation;
    const smoothing = hoverClipPathConfig.rotation.smoothing;
    const decay = hoverClipPathConfig.rotation.decay;

    const handleMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);

      if (previousX === null) {
        previousX = e.clientX;
      }

      const deltaX = e.clientX - previousX;
      targetRotation = Math.max(
        -maxRotation,
        Math.min(maxRotation, deltaX * sensitivity),
      );
      previousX = e.clientX;
    };

    const tickerHandler = () => {
      currentRotation += (targetRotation - currentRotation) * smoothing;
      setRotation(currentRotation);
      targetRotation *= decay;
    };

    const handleMouseLeave = () => {
      gsap.to(projectThumbnail, {
        scale: hoverClipPathConfig.animation.scale.hide.scale,
        duration: hoverClipPathConfig.animation.scale.hide.duration,
        ease: hoverClipPathConfig.animation.scale.hide.ease,
        overwrite: "auto",
      });

      gsap.to(thumbnails, {
        clipPath: hoverClipPathConfig.clipPath.hidden,
        duration: hoverClipPathConfig.animation.clipPathHide.duration,
        ease: hoverClipPathConfig.animation.clipPathHide.ease,
        overwrite: "auto",
      });

      currentIndex = -1;
      previousX = null;
      targetRotation = 0;
    };

    projectsContainer.addEventListener("mousemove", handleMouseMove);
    projectsContainer.addEventListener("mouseleave", handleMouseLeave);
    gsap.ticker.add(tickerHandler);

    projects.forEach((project, index) => {
      const handleMouseEnter = () => {
        previousX = null;

        gsap.to(projectThumbnail, {
          scale: hoverClipPathConfig.animation.scale.show.scale,
          duration: hoverClipPathConfig.animation.scale.show.duration,
          ease: hoverClipPathConfig.animation.scale.show.ease,
          overwrite: "auto",
        });

        if (currentIndex !== -1 && currentIndex !== index) {
          gsap.to(thumbnails[currentIndex], {
            clipPath: hoverClipPathConfig.clipPath.hiddenTop,
            duration: hoverClipPathConfig.animation.clipPathHide.duration,
            ease: hoverClipPathConfig.animation.clipPathHide.ease,
            overwrite: "auto",
          });
        }

        gsap.fromTo(
          thumbnails[index],
          {
            clipPath: hoverClipPathConfig.clipPath.hidden,
          },
          {
            clipPath: hoverClipPathConfig.clipPath.visible,
            duration: hoverClipPathConfig.animation.clipPathReveal.duration,
            ease: hoverClipPathConfig.animation.clipPathReveal.ease,
            overwrite: "auto",
          },
        );

        currentIndex = index;
      };

      project.addEventListener("mouseenter", handleMouseEnter);
    });
  }, []);

  return (
    <>
      <div className="h-[50svh] bg-dark-primary"></div>
      <section className="hover-clippath-container">
        <div className="hover-clippath-projects-wrapper">
          <div className="hover-clippath-section-title">Featured Projects</div>
          <div className="hover-clippath-projects" ref={projectsRef}>
            <div
              className="hover-clippath-project"
              ref={(element) => (projectRefs.current[0] = element)}
            >
              <div className="hover-clippath-project-content">
                <span className="hover-clippath-project-number">01</span>
                <h2>Vertex Commerce</h2>
              </div>
              <div className="hover-clippath-project-meta">
                <span className="hover-clippath-project-year">2024</span>
                <div className="hover-clippath-arrow">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
            <div
              className="hover-clippath-project"
              ref={(element) => (projectRefs.current[1] = element)}
            >
              <div className="hover-clippath-project-content">
                <span className="hover-clippath-project-number">02</span>
                <h2>Helix Studio</h2>
              </div>
              <div className="hover-clippath-project-meta">
                <span className="hover-clippath-project-year">2024</span>
                <div className="hover-clippath-arrow">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
            <div
              className="hover-clippath-project"
              ref={(element) => (projectRefs.current[2] = element)}
            >
              <div className="hover-clippath-project-content">
                <span className="hover-clippath-project-number">03</span>
                <h2>Northbound</h2>
              </div>
              <div className="hover-clippath-project-meta">
                <span className="hover-clippath-project-year">2023</span>
                <div className="hover-clippath-arrow">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
            <div
              className="hover-clippath-project"
              ref={(element) => (projectRefs.current[3] = element)}
            >
              <div className="hover-clippath-project-content">
                <span className="hover-clippath-project-number">04</span>
                <h2>Orbital Collective</h2>
              </div>
              <div className="hover-clippath-project-meta">
                <span className="hover-clippath-project-year">2023</span>
                <div className="hover-clippath-arrow">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hover-clippath-project-thumbnail" ref={thumbnailRef}>
          <div
            className="hover-clippath-thumbnail"
            ref={(element) => (thumbnailRefs.current[0] = element)}
          >
            <img
              src="https://i.pinimg.com/1200x/6d/47/22/6d4722b27a1acccd09b1add01c905ff3.jpg"
              alt=""
            />
          </div>
          <div
            className="hover-clippath-thumbnail"
            ref={(element) => (thumbnailRefs.current[1] = element)}
          >
            <img
              src="https://i.pinimg.com/736x/8f/39/c4/8f39c40449d2f512763fff45719b20e3.jpg"
              alt=""
            />
          </div>
          <div
            className="hover-clippath-thumbnail"
            ref={(element) => (thumbnailRefs.current[2] = element)}
          >
            <img
              src="https://i.pinimg.com/736x/89/c5/b3/89c5b3925874afdd643fbe67a487813d.jpg"
              alt=""
            />
          </div>
          <div
            className="hover-clippath-thumbnail"
            ref={(element) => (thumbnailRefs.current[3] = element)}
          >
            <img
              src="https://i.pinimg.com/736x/9a/cd/c5/9acdc5e6672acb43c4648a0d2fce3a52.jpg"
              alt=""
            />
          </div>
        </div>
      </section>
      <div className="h-[50svh] bg-dark-primary"></div>
    </>
  );
};

export default RoutingTransition(HoverClipPath);

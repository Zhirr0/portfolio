import { useEffect, useRef, useState } from "react";
import "../../styles/animations-styles.css";
import AnimationsHeader from "../../components/AnimationsHeader";
import RoutingTransition from "../../components/transitionRouter/Transition";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";

const Animations = () => {
  const isMobile = useMediaQuery({ maxWidth: "650px" });
  const isMidRange = useMediaQuery({ minWidth: "768px", maxWidth: "835px" });
  const isMiniIpad = useMediaQuery({ maxWidth: "835px" });
  const isIpad = useMediaQuery({ maxWidth: "1015px" });
  const containerRef = useRef(null);
  const [navBottom, setNavBottom] = useState(0);
  const [activeSection, setActiveSection] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
 
  const getNavBottom = () => {
    const val = getComputedStyle(document.documentElement).getPropertyValue(
      "--nav-bottom",
    );
    return val ? parseFloat(val) : 0;
  };
  useEffect(() => {
    const updateOffset = () => {
      const navHeight = getNavBottom();
      setNavBottom(navHeight);

      if (containerRef.current) {
        containerRef.current.style.paddingTop = `${navHeight}px`;
      }
    };

    updateOffset();

    window.addEventListener("resize", updateOffset);
    return () => window.removeEventListener("resize", updateOffset);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX - 20, y: e.clientY - 20 });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  };

  const handleSectionClick = (sectionName) => {
    setActiveSection(activeSection === sectionName ? null : sectionName);
  };

  return (
    <div
      ref={containerRef}
      style={{ paddingTop: `${navBottom + 20}px` }}
      className="animations-container"
    >
      {/* Ambient light effect */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: isDarkMode
            ? `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(217, 179, 140, 0.08), transparent 30%)`
            : `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0)f, transparent 30%)`,
        }}
      />
      <button
        className="theme-toggle-btn"
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {isDarkMode ? (
          <img src="/svg/sun.svg" alt="" />
        ) : (
          <img src="/svg/moon.svg" alt="" />
        )}
      </button>

      <header className="animations-header">
        {isIpad ? (
          <h1 className="animations-h1 font-thin text-center font-tan-pearl">
            Animations in action <br /> <hr className="style-dots" />
          </h1>
        ) : (
          <AnimationsHeader
            className="animations-h1 font-thin font-tan-pearl"
            text="Animations in action"
          />
        )}
      </header>

      <div className="animations-content-grid">
        {/* Hover Section */}
        <section
          className={`animations-section hover-section w-fit ${
            activeSection === "hover" ? "active" : ""
          }`}
          onClick={() => handleSectionClick("hover")}
        >
          <span className="whitespace-nowrap">
            <h2 className="animations-section-title font-tan-pearl">Hover</h2>
            <p className="animations-in-action-warning block lg:hidden">
              ( generally not for touchscreens )
            </p>
          </span>
          <div className="item-list">
            <div className="animations-item flex">
              <div className="svg-arrow">
                <svg
                  width="68"
                  height="176"
                  viewBox="0 0 68 176"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 1C2 0.447715 1.55228 0 1 0C0.447715 0 0 0.447715 0 1H1H2ZM65.9571 58.7071C66.3476 58.3166 66.3476 57.6834 65.9571 57.2929L59.5931 50.9289C59.2026 50.5384 58.5695 50.5384 58.1789 50.9289C57.7884 51.3195 57.7884 51.9526 58.1789 52.3431L63.8358 58L58.1789 63.6569C57.7884 64.0474 57.7884 64.6805 58.1789 65.0711C58.5695 65.4616 59.2026 65.4616 59.5931 65.0711L65.9571 58.7071ZM67.7071 119.707C68.0976 119.317 68.0976 118.683 67.7071 118.293L61.3431 111.929C60.9526 111.538 60.3195 111.538 59.9289 111.929C59.5384 112.319 59.5384 112.953 59.9289 113.343L65.5858 119L59.9289 124.657C59.5384 125.047 59.5384 125.681 59.9289 126.071C60.3195 126.462 60.9526 126.462 61.3431 126.071L67.7071 119.707ZM1 168.5H0V169.5H1V168.5ZM67.7071 169.207C68.0976 168.817 68.0976 168.183 67.7071 167.793L61.3431 161.429C60.9526 161.038 60.3195 161.038 59.9289 161.429C59.5384 161.819 59.5384 162.453 59.9289 162.843L65.5858 168.5L59.9289 174.157C59.5384 174.547 59.5384 175.181 59.9289 175.571C60.3195 175.962 60.9526 175.962 61.3431 175.571L67.7071 169.207ZM1 1H0V58H1H2V1H1ZM1 58H0V119H1H2V58H1ZM1 119H0V168.5H1H2V119H1ZM1 168.5V169.5H24V168.5V167.5H1V168.5ZM24 168.5V169.5H67V168.5V167.5H24V168.5ZM1 119V120H24V119V118H1V119ZM24 119V120H67V119V118H24V119ZM1 58V59H24V58V57H1V58ZM24 58V59H65.25V58V57H24V58Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="animations-content h-full relative">
                <div
                  style={{
                    marginTop: isMobile
                      ? "27px"
                      : isMidRange
                        ? "40px"
                        : isMiniIpad
                          ? "30px"
                          : isIpad
                            ? "40px"
                            : "40px",
                  }}
                >
                  <Link to="/animations/hover-links-interaction">
                    <h2 className="whitespace-nowrap">Links Interactive </h2>
                  </Link>
                </div>
                <div
                  style={{
                    marginTop: isMobile
                      ? "0px"
                      : isMidRange
                        ? "30px"
                        : isMiniIpad
                          ? "10px"
                          : isIpad
                            ? "30px"
                            : "10px",
                  }}
                >
                  <Link to="/animations/hover-clippath">
                    <h2>Clip Path </h2>
                  </Link>
                </div>
                <div
                  style={{
                    marginTop: isMobile
                      ? "0px"
                      : isMidRange
                        ? "15px"
                        : isMiniIpad
                          ? "5px"
                          : isIpad
                            ? "15px"
                            : "5px",
                  }}
                >
                  <Link to="/animations/hover-image-trail">
                    <h2>Image Trail </h2>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Text Section */}
        <section
          className={`animations-section w-fit text-section ${
            activeSection === "text" ? "active" : ""
          }`}
          onClick={() => handleSectionClick("text")}
        >
          <h2 className="animations-section-title font-tan-pearl">Text</h2>
          <div className="item-list">
            <div className="animations-item flex">
              <div className="svg-arrow">
                <svg
                  width="68"
                  height="176"
                  viewBox="0 0 68 176"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 1C2 0.447715 1.55228 0 1 0C0.447715 0 0 0.447715 0 1H1H2ZM65.9571 58.7071C66.3476 58.3166 66.3476 57.6834 65.9571 57.2929L59.5931 50.9289C59.2026 50.5384 58.5695 50.5384 58.1789 50.9289C57.7884 51.3195 57.7884 51.9526 58.1789 52.3431L63.8358 58L58.1789 63.6569C57.7884 64.0474 57.7884 64.6805 58.1789 65.0711C58.5695 65.4616 59.2026 65.4616 59.5931 65.0711L65.9571 58.7071ZM67.7071 119.707C68.0976 119.317 68.0976 118.683 67.7071 118.293L61.3431 111.929C60.9526 111.538 60.3195 111.538 59.9289 111.929C59.5384 112.319 59.5384 112.953 59.9289 113.343L65.5858 119L59.9289 124.657C59.5384 125.047 59.5384 125.681 59.9289 126.071C60.3195 126.462 60.9526 126.462 61.3431 126.071L67.7071 119.707ZM1 168.5H0V169.5H1V168.5ZM67.7071 169.207C68.0976 168.817 68.0976 168.183 67.7071 167.793L61.3431 161.429C60.9526 161.038 60.3195 161.038 59.9289 161.429C59.5384 161.819 59.5384 162.453 59.9289 162.843L65.5858 168.5L59.9289 174.157C59.5384 174.547 59.5384 175.181 59.9289 175.571C60.3195 175.962 60.9526 175.962 61.3431 175.571L67.7071 169.207ZM1 1H0V58H1H2V1H1ZM1 58H0V119H1H2V58H1ZM1 119H0V168.5H1H2V119H1ZM1 168.5V169.5H24V168.5V167.5H1V168.5ZM24 168.5V169.5H67V168.5V167.5H24V168.5ZM1 119V120H24V119V118H1V119ZM24 119V120H67V119V118H24V119ZM1 58V59H24V58V57H1V58ZM24 58V59H65.25V58V57H24V58Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="animations-content h-full relative">
                <div
                  style={{
                    marginTop: isMobile
                      ? "27px"
                      : isMidRange
                        ? "40px"
                        : isMiniIpad
                          ? "20px"
                          : isIpad
                            ? "40px"
                            : "40px",
                  }}
                >
                  <Link to="/animations/text-parallax">
                    <h2>Text Parallax </h2>
                  </Link>
                </div>
                <div
                  style={{
                    marginTop: isMobile
                      ? "0px"
                      : isMidRange
                        ? "29px"
                        : isMiniIpad
                          ? "15px"
                          : isIpad
                            ? "30px"
                            : "10px",
                  }}
                >
                  <Link to="/animations/text-reveal">
                    <h2>Text Reveal </h2>
                  </Link>
                </div>
                <div
                  style={{
                    marginTop: isMobile
                      ? "0px"
                      : isMidRange
                        ? "10px"
                        : isMiniIpad
                          ? "15px"
                          : isIpad
                            ? "15px"
                            : "5px",
                  }}
                >
                  <Link to="/animations/text-physics-interaction">
                    <h2>Physics Interaction </h2>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scroll Section */}
        <section
          className={`animations-section w-fit scroll-section ${
            activeSection === "scroll" ? "active" : ""
          }`}
          onClick={() => handleSectionClick("scroll")}
        >
          <h2 className="animations-section-title font-tan-pearl">Scroll</h2>
          <div className="item-list">
            <div className="animations-item flex">
              <div className="svg-arrow">
                <svg
                  width="66"
                  height="104"
                  viewBox="0 0 66 104"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 1C2 0.447715 1.55228 0 1 0C0.447715 0 0 0.447715 0 1H1H2ZM65.7071 46.7071C66.0976 46.3166 66.0976 45.6834 65.7071 45.2929L59.3431 38.9289C58.9526 38.5384 58.3195 38.5384 57.9289 38.9289C57.5384 39.3195 57.5384 39.9526 57.9289 40.3431L63.5858 46L57.9289 51.6569C57.5384 52.0474 57.5384 52.6805 57.9289 53.0711C58.3195 53.4616 58.9526 53.4616 59.3431 53.0711L65.7071 46.7071ZM1 96.5H0V97.5H1V96.5ZM65.7071 97.2071C66.0976 96.8166 66.0976 96.1834 65.7071 95.7929L59.3431 89.4289C58.9526 89.0384 58.3195 89.0384 57.9289 89.4289C57.5384 89.8195 57.5384 90.4526 57.9289 90.8431L63.5858 96.5L57.9289 102.157C57.5384 102.547 57.5384 103.181 57.9289 103.571C58.3195 103.962 58.9526 103.962 59.3431 103.571L65.7071 97.2071ZM1 1H0V46H1H2V1H1ZM1 46H0V96.5H1H2V46H1ZM1 46V47H26V46V45H1V46ZM26 46V47H65V46V45H26V46ZM1 96.5V97.5H26V96.5V95.5H1V96.5ZM26 96.5V97.5H65V96.5V95.5H26V96.5Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="animations-content h-full relative">
                <div
                  style={{
                    marginTop: isMobile
                      ? "20px"
                      : isMidRange
                        ? "30px"
                        : isMiniIpad
                          ? "15px"
                          : isIpad
                            ? "30px"
                            : "30px",
                  }}
                >
                  <Link to="/animations/scrolltrigger-cards">
                    <h2>Cards Reveal </h2>
                  </Link>
                </div>
                <div
                  style={{
                    marginTop: isMobile
                      ? "0px"
                      : isMidRange
                        ? "17px"
                        : isMiniIpad
                          ? "10px"
                          : isIpad
                            ? "15px"
                            : "0px",
                  }}
                >
                  <Link to="/animations/scrolltrigger-zoom">
                    <h2>Zooming</h2>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Landing Section */}
        <section
          className={`animations-section w-fit landing-section ${
            activeSection === "landing" ? "active" : ""
          }`}
          onClick={() => handleSectionClick("landing")}
        >
          <h2 className="animations-section-title font-tan-pearl">
            Landing Page
          </h2>
          <div className="item-list">
            <div className="animations-item flex">
              <div className="svg-arrow">
                <svg
                  width="66"
                  height="96"
                  viewBox="0 0 66 96"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 88H0V89H1V88ZM65.7071 88.7071C66.0976 88.3166 66.0976 87.6834 65.7071 87.2929L59.3431 80.9289C58.9526 80.5384 58.3195 80.5384 57.9289 80.9289C57.5384 81.3195 57.5384 81.9526 57.9289 82.3431L63.5858 88L57.9289 93.6569C57.5384 94.0474 57.5384 94.6805 57.9289 95.0711C58.3195 95.4616 58.9526 95.4616 59.3431 95.0711L65.7071 88.7071ZM2 1C2 0.447715 1.55228 0 1 0C0.447715 0 0 0.447715 0 1H1H2ZM1 88V89H26V88V87H1V88ZM26 88V89H65V88V87H26V88ZM1 88H2V1H1H0V88H1Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
              <div className="animations-content h-full relative">
                <div
                  style={{
                    marginTop: isMobile
                      ? "40px"
                      : isMidRange
                        ? "55px"
                        : isMiniIpad
                          ? "50px"
                          : isIpad
                            ? "70px"
                            : "70px",
                  }}
                >
                  <Link to="/animations/landingpage">
                    <h2>Timeline Animation </h2>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RoutingTransition(Animations);

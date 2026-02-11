import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import Marquee from "./Marquee";
import Magneto from "./magnetos/Magneto";
import ResizeScreen from "./ResizeScreen";
import { useMediaQuery } from "react-responsive";
import footerSectionConfig from "../config/footerSection.config";
import LimitedLink from "./LimitedLink";

const FooterSection = () => {
  const fontContainerRef = useRef(null);
  const isMinimumScreen = useMediaQuery({ minWidth: "650px" });
  const isMaxScreen = useMediaQuery({ maxWidth: "1000px" });
  const isLgUp = useMediaQuery({ minWidth: "1024px" });

  useGSAP(
    () => {
      let mm = gsap.matchMedia();

      mm.add("(min-width: 992px)", () => {
        const fontWeightItems = fontContainerRef.current.querySelectorAll(
          ".header-font-animation",
        );

        fontWeightItems.forEach((item) => {
          SplitText.create(item, {
            type: "chars",
            charsClass: "char",
          });
        });

        const onMouseMove = (e) => {
          const { clientX, clientY } = e;

          fontWeightItems.forEach((i) => {
            i.querySelectorAll(".char").forEach((char) => {
              const rect = char.getBoundingClientRect();
              const centerX = rect.left + rect.width / 2;
              const centerY = rect.top + rect.height / 2;

              const distance = Math.hypot(clientX - centerX, clientY - centerY);

              const fontWeight =
                distance < footerSectionConfig.MAX_DISTANCE
                  ? gsap.utils.mapRange(
                      0,
                      footerSectionConfig.MAX_DISTANCE,
                      footerSectionConfig.MAX_FONT_WEIGHT,
                      footerSectionConfig.MIN_FONT_WEIGHT,
                      distance,
                    )
                  : footerSectionConfig.MIN_FONT_WEIGHT;

              gsap.to(char, {
                fontWeight,
                duration: 0.4,
                ease: "power1.out",
                overwrite: true,
              });
            });
          });
        };

        document.addEventListener("mousemove", onMouseMove);
      });

      return () => mm.kill();
    },
    { scope: fontContainerRef },
  );

  return (
    <footer ref={fontContainerRef}>
      <div className="variable-font-animation ">
        <h5 className="header-font-animation">ANIMATION</h5>
        <h5 className="header-font-animation">TYPOGRAPHY</h5>
        <h5 className="header-font-animation">MOTION</h5>
      </div>

      <div className="marquee-wrapper ">
        <Marquee/>
      </div>

      <div
        style={{ display: isMinimumScreen && isMaxScreen ? "block" : "none" }}
        className="responsive-screen-wrapper"
      >
        <ResizeScreen />
      </div>

      <div className="contact ">
        <div className="contact-column-1">
          <div>
            <h3>get in contact</h3>
          </div>

          <div>
            <span>
              <br />
              <LimitedLink />
            </span>
          </div>
        </div>

        <div className="contact-column-2">
          <div className="social-header">
            <h3>Socials</h3>
          </div>
          <div className="socials">
            {/* GitHub */}
            <Magneto>
              <div
                className="social-container"
                onClick={() =>
                  window.open("https://github.com/Zhirr0", "_blank")
                }
              >
                <img
                  src="/svg/github.svg"
                  className="scale-75 cursor-pointer"
                  alt="GitHub"
                />
              </div>
            </Magneto>

            {/* LinkedIn */}
            {isLgUp ? (
              <Magneto>
                <div
                  className="social-container"
                  onClick={() =>
                    window.open(
                      "https://www.linkedin.com/in/zhir-abdulrahman",
                      "_blank",
                    )
                  }
                >
                  <img
                    src="/svg/linkedln.svg"
                    className="scale-75 cursor-pointer"
                    alt="LinkedIn"
                  />
                </div>
              </Magneto>
            ) : (
              <div
                className="social-container"
                onClick={() =>
                  window.open(
                    "https://www.linkedin.com/in/zhir-abdulrahman",
                    "_blank",
                  )
                }
              >
                <img
                  src="/svg/linkedln.svg"
                  className="scale-75 cursor-pointer"
                  alt="LinkedIn"
                />
              </div>
            )}

            {/* Instagram */}
            {isLgUp ? (
              <Magneto>
                <div
                  className="social-container"
                  onClick={() =>
                    window.open("https://www.instagram.com/itsme.z06", "_blank")
                  }
                >
                  <img
                    src="/svg/instagram.svg"
                    className="scale-75 cursor-pointer"
                    alt="Instagram"
                  />
                </div>
              </Magneto>
            ) : (
              <div
                className="social-container"
                onClick={() =>
                  window.open("https://www.instagram.com/itsme.z06", "_blank")
                }
              >
                <img
                  src="/svg/instagram.svg"
                  className="scale-75 cursor-pointer"
                  alt="Instagram"
                />
              </div>
            )}

            {/* Twitter/X */}
            {isLgUp ? (
              <Magneto>
                <div
                  className="social-container"
                  onClick={() =>
                    window.open(
                      "https://x.com/zhirDev1",
                      "_blank",
                    )
                  }
                >
                  <img
                    src="/svg/x.svg"
                    className="scale-90  ml-5 cursor-pointer"
                    alt="Twitter"
                  />
                </div>
              </Magneto>
            ) : (
              <div
                className="social-container"
                onClick={() =>
                  window.open(
                    "https://x.com/zhirDev1",
                    "_blank",
                  )
                }
              >
                <img
                  src="/svg/x.svg"
                  className="scale-90 mr-3 cursor-pointer"
                  alt="Twitter"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
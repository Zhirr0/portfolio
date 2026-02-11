import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";
import "../../styles/text-reveal-fade.css";
const TextRevealFade = () => {

  useGSAP(() => {
    let splitInstance = null;
    let tl = null;

    document.fonts.ready.then(() => {
      splitInstance = SplitText.create(".text-reveal-fade-first-message", {
        type: "words",
        autoSplit: true,
        onSplit(self) {
          gsap.set(self.words, { opacity: 0.05, color: "#777" });
          tl = gsap.timeline({
            scrollTrigger: {
              trigger: ".text-reveal-fade-message-content",
              start: "top center",
              end: "30% 20%",
              scrub: true,
            },
          });

          tl.fromTo(
            self.words,
            { opacity: 0.05, color: "#777" },
            {
              opacity: 1,
              color: "#eee",
              ease: "power2.in",
              stagger: 0.15,
            },
          );

          // refresh after DOM changes (important)
          ScrollTrigger.refresh();
        },
      });
    });

    document.fonts.ready.then(() => {
      SplitText.create(".text-reveal-fade-message-content-header", {
        type: "chars",
        autoSplit: true,
        onSplit: (self) => {
          gsap.from(self.chars, {
            opacity: 0,
            filter: "blur(10px)",
            yPercent: 100,
            duration: 1,
            ease: "expo.out",
            stagger: {
              amount: 0.05,
              from: "center",
            },
            scrollTrigger: {
              trigger: ".text-reveal-fade-message-content",
              start: `top 30%`,
              toggleActions: "play none none reverse",
            },
          });
        },
      });
    });
  }, []);

  return (
    <section className="text-reveal-fade-message-content">
      <h1 className="text-reveal-fade-message-content-header">
        Fade In Reveal
      </h1>

      <div className="text-reveal-fade-container">
        <div className="text-reveal-fade-wrapper">
          <div className="text-reveal-fade-msg-wrapper">
            <h1 className="text-reveal-fade-first-message">
              DON'T HESITATE TO
              <br /> REACH OUT AND <br />
              GET IN CONTACT <br />
              TO BUILD YOUR <br />
              NEXT PROJECT
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextRevealFade;

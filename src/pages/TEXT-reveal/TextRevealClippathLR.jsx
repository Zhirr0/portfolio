import "../../styles/text-reveal-clippath-LR.css";
import gsap from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

const TextRevealClippathLR = () => {
  useGSAP(() => {
    document.fonts.ready.then(() => {
      SplitText.create(".text-reveal-clippath-container-header-left-to-right", {
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
              trigger: ".text-reveal-clippath-lr-left-to-right",
              start: `top center`,
              toggleActions: "play none none reverse",
            },
          });
        },
      });
    });

    document
      .querySelectorAll(".text-reveal-clippath-lr-animate-text")
      .forEach((textElement) => {
        textElement.setAttribute("data-text", textElement.textContent.trim());

        ScrollTrigger.create({
          trigger: textElement,
          start: "top center",
          end: "bottom 30%",
          scrub: 1,
          onUpdate: (self) => {
            const clipValue = Math.max(0, 100 - self.progress * 100);
            textElement.style.setProperty("--clip-value", `${clipValue}%`);
          },
        });
      });
  }, []);

  return (
    <section className="text-reveal-clippath-lr-container text-reveal-clippath-lr-left-to-right">
      <h1 className="text-reveal-clippath-lr-container-header text-reveal-clippath-container-header-left-to-right">
        Clip-Path Left to Right
      </h1>

      <div className="text-reveal-clippath-lr-about">
        <h1 className="text-reveal-clippath-lr-animate-text">
          The message emerges from the left, gradually revealing meaning as the
          clip-path moves across the text.
        </h1>
      </div>
    </section>
  );
};

export default TextRevealClippathLR;

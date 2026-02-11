import "../../styles/text-reveal-clippath.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";

const TextRevealClippath = () => {
  useGSAP(() => {
    document.fonts.ready.then(() => {
      SplitText.create(".text-reveal-clippath-container-header", {
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
              trigger: ".text-reveal-clippath-top-to-bottom",
              start: `top center`,
              toggleActions: "play none none reverse",
            },
          });
        },
      });
    });

    document
      .querySelectorAll(".text-reveal-clippath-animate-text")
      .forEach((textElement) => {
        textElement.setAttribute("data-text", textElement.textContent.trim());

        ScrollTrigger.create({
          trigger: textElement,
          start: "top 50%",
          end: "bottom 30%",
          invalidateOnRefresh: true,

          scrub: 1,
          onUpdate: (self) => {
            const clipValue = Math.max(0, 100 - self.progress * 100);
            textElement.style.setProperty("--clip-value", `${clipValue}%`);
          },
        });
      });
  }, []);

  return (
    <section className="text-reveal-clippath-container text-reveal-clippath-top-to-bottom">
      <h1 className="text-reveal-clippath-container-header">
        Clip-Path Top to Bottom
      </h1>
      <div className="text-reveal-clippath-about">
        <h1 className="text-reveal-clippath-animate-text">
          At first, these words are partially hidden, fragmented by the motion
          above. As the clip-path travels from top to bottom, the message
          sharpens into focus. What begins as an abstract shape resolves into
          readable text, revealing clarity through motion rather than opacity.
        </h1>
      </div>
    </section>
  );
};

export default TextRevealClippath;

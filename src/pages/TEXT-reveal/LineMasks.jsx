import "../../styles/line-masks.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import RoutingTransition from "../../components/transitionRouter/Transition";
const LineMasks = () => {

  useGSAP(() => {
    document.fonts.ready.then(() => {
      SplitText.create(".line-masks-container-header", {
        type: "chars",
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
              trigger: ".line-masks-section",
              start: `top center`,
              toggleActions: "play none none reverse",
            },
          });
        },
      });

      document.querySelectorAll(".line-masks-text").forEach((paragraph) => {
        SplitText.create(paragraph, {
          type: "lines",
          linesClass: "line-mask-wrapper",
          autoSplit: true,
          onSplit: (self) => {
            self.lines.forEach((line) => {
              const wrapper = document.createElement("div");
              wrapper.className = "line-overflow-hidden";
              line.parentNode.insertBefore(wrapper, line);
              wrapper.appendChild(line);
            });

            gsap.from(self.lines, {
              yPercent: 100,
              opacity: 0,
              duration: 1.2,
              ease: "power3.out",
              stagger: 0.08,
              
              scrollTrigger: {
                trigger: paragraph,
                start: "top center",
                toggleActions: "play none none reverse",
              },
            });
          },
        });
      });
    });
  }, []);

  return (
    <section className="line-masks-section relative line-masks-section-height">
      <h1 className="absolute -top-30  line-masks-container-header">
        Line Masks
      </h1>

      <div className="line-masks-content">
        <div className="line-masks-block">
          <p className="line-masks-text">
            This placeholder content demonstrates the elegant reveal animation
            using line masking techniques that bring text to life as you scroll.
          </p>
        </div>

        <div className="line-masks-block">
          <p className="line-masks-text">
            Each line smoothly animates into view creating a sophisticated
            reading experience that captures attention and guides the eye
            through your narrative.
          </p>
        </div>

        <div className="line-masks-block">
          <p className="line-masks-text">
            The split text animation creates dynamic motion by treating each
            line independently allowing for precise control over timing and
            visual flow.
          </p>
        </div>

        <div className="line-masks-block">
          <p className="line-masks-text">
            These animations work seamlessly across different screen sizes
            maintaining their impact and readability on any device your users
            choose.
          </p>
        </div>
      </div>
    </section>
  );
};

export default RoutingTransition(LineMasks);

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import * as textAnim from "../features/ScatterText/ScatterAnimation";
import scatterTextConfig from "../config/scatterText.config";

const ScatterText = ({ text }) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const tlRef = useRef(null);
  const splitRef = useRef(null);
  const scrollTriggerRef = useRef(null);

  useGSAP(
    () => {
      if (!containerRef.current || !titleRef.current) return;

      const calculateFinalPosition = () => {
        const titleWidth = titleRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        return -(titleWidth - viewportWidth / 2);
      };

      const initAnimation = () => {
        gsap.set(titleRef.current, {
          x: scatterTextConfig.initialPosition.x,
        });

        const split = SplitText.create(titleRef.current, {
          type: scatterTextConfig.splitText.type,
          autoSplit: scatterTextConfig.splitText.autoSplit,
        });
        splitRef.current = split;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            
            start: "top top",
            end: `${window.innerHeight * 3}px`,
            scrub: 1,
            pin: true,
            pinSpacing: false,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const progress = self.progress;

              if (progress >= scatterTextConfig.fade.threshold) {
                gsap.to(titleRef.current, {
                  opacity: 0,
                  duration: scatterTextConfig.fade.duration,
                });
              } else if (progress < scatterTextConfig.fade.threshold) {
                gsap.to(titleRef.current, {
                  opacity: 1,
                  duration: scatterTextConfig.fade.duration,
                });
              }
            },
          },
        });

        tlRef.current = tl;
        scrollTriggerRef.current = tl.scrollTrigger;

        const initialFinalPosition = calculateFinalPosition();
        textAnim.floatDown(split, titleRef, tl, initialFinalPosition);
      };

      // Initialize animation
      initAnimation();

      // Cleanup
      return () => {
        if (splitRef.current) {
          splitRef.current.revert();
        }
        if (tlRef.current) {
          tlRef.current.kill();
        }
      };
    },
    { scope: containerRef, dependencies: [text] },
  );

  return (
    <section ref={containerRef} style={{overflow: "hidden", overflowY: "hidden"}} className="scatter-section overflow-hidden">
      <div className="scatter-container relative">
        <h2 ref={titleRef}>{text}</h2>
      </div>
    </section>
  );
};

export default ScatterText;

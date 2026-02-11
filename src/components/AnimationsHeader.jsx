import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const SkewZigzag = ({ className = "", text = "ZIGZAG" }) => {
  const containerRef = useRef(null);
  const initialRef = useRef(null);
  const appearRef = useRef(null);

  useGSAP(() => {
    let splitInitial;
    let splitAppear;

    // Wait for fonts to load before splitting text
    document.fonts.ready.then(() => {
      splitInitial = SplitText.create(initialRef.current, {
        type: "chars, words",
        charsClass: "char",
        onSplit: (self) => {
          gsap.set(self.chars, { skewX: 0, x: 0, y: 0 });
        },
      });

      splitAppear = SplitText.create(appearRef.current, {
        type: "chars, words",
        charsClass: "char",
        onSplit: (self) => {
          gsap.set(self.chars, {
            skewX: 30,
            x: 100,
            y: (i) => (i % 2 === 0 ? -150 : 150),
          });
        },
      });
    });

    const handleMouseEnter = () => {
      if (!splitInitial || !splitAppear) return;

      gsap.to(splitInitial.chars, {
        skewX: -30,
        x: -100,
        y: (i) => (i % 2 === 0 ? 150 : -150),
        duration: 0.6,
        ease: "power2.inOut",
        stagger: 0.03,
      });

      gsap.to(splitAppear.chars, {
        skewX: 0,
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "power2.inOut",
        stagger: 0.03,
      });
    };

    const handleMouseLeave = () => {
      if (!splitInitial || !splitAppear) return;

      gsap.to(splitInitial.chars, {
        skewX: 0,
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "power2.inOut",
        stagger: 0.03,
      });

      gsap.to(splitAppear.chars, {
        skewX: 30,
        x: 100,
        y: (i) => (i % 2 === 0 ? -200 : 200),
        duration: 0.6,
        ease: "power2.inOut",
        stagger: 0.03,
      });
    };

    containerRef.current?.addEventListener("mouseenter", handleMouseEnter);
    containerRef.current?.addEventListener("mouseleave", handleMouseLeave);
  }, { scope: containerRef });

  return (
    <div className={`relative overflow-hidden cursor-pointer ${className}`} ref={containerRef}>
      <span ref={initialRef} className="block">{text}</span>
      <span ref={appearRef} className="block absolute top-0 left-0">{text}</span>
    </div>
  );
};

export default SkewZigzag;
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Marquee = () => {
  useEffect(() => {
    // Only run animation on screens larger than 768px
    if (window.innerWidth <= 768) return;

    const wrappers = document.querySelectorAll(".outer-wrapper");

    wrappers.forEach((wrapper, index) => {
      gsap.to(wrapper, {
        x: index % 2 === 0 ? 300 : -300,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top bottom",
          scrub: 1,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section className="marquee">
      <div className="outer-wrapper scale-75 lg:-translate-x-50 rotate172">
        <div className="wrapper">
          <div className="logo logo1">
            <img
              className="scale-50 rotate-180"
              src="/svg/javascript.svg"
              alt="JavaScript logo"
            />
          </div>
          <div className="logo logo2">
            <img
              className="scale-50 rotate-180"
              src="/svg/typescript.svg"
              alt="TypeScript logo"
            />
          </div>
          <div className="logo logo3">
            <img
              className="scale-75 rotate-180"
              src="/svg/react.svg"
              alt="React logo"
            />
          </div>
          <div className="logo logo4">
            <img
              className="scale-50 rotate-180"
              src="/svg/GSAP.svg"
              alt="GSAP animation library logo"
            />
          </div>
          <div className="logo logo5">
            <img
              className="scale-50 rotate-180"
              src="/svg/tailwindcss.svg"
              alt="Tailwind CSS logo"
            />
          </div>
          <div className="logo logo6">
            <img
              className="max-[420px]:scale-500 scale-50 rotate-180"
              src="/svg/framer-motion.svg"
              alt="Framer Motion animation library logo"
            />
          </div>
          <div className="logo logo7">
            <img
              className="scale-100 rotate-180"
              src="/svg/lenis.svg"
              alt="Lenis smooth scrolling library logo"
            />
          </div>
        </div>
      </div>

      <div className="outer-wrapper scale-75 rotate2 mb-50">
        <div className="wrapper">
          <div className="logo logo1">
            <img
              className="scale-50"
              src="/svg/javascript.svg"
              alt="JavaScript logo"
            />
          </div>
          <div className="logo logo2">
            <img
              className="scale-50"
              src="/svg/typescript.svg"
              alt="TypeScript logo"
            />
          </div>
          <div className="logo logo3">
            <img
              className="scale-50"
              src="/svg/GSAP.svg"
              alt="GSAP animation library logo"
            />
          </div>
          <div className="logo logo4">
            <img
              className="scale-50"
              src="/svg/tailwindcss.svg"
              alt="Tailwind CSS logo"
            />
          </div>
          <div className="logo logo5">
            <img className="scale-75" src="/svg/react.svg" alt="React logo" />
          </div>
          <div className="logo logo6">
            <img
              className="scale-50"
              src="/svg/framer-motion.svg"
              alt="Framer Motion animation library logo"
            />
          </div>
          <div className="logo logo7">
            <img
              className="scale-100"
              src="/svg/lenis.svg"
              alt="Lenis smooth scrolling library logo"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Marquee;
export const signatureConfig = {
  counter: {
    digit1: {
      duration: 1,
      delay: 5,
    },
    digit2: {
      duration: 4,
      delay: 1,
    },
    digit3: {
      duration: 3,
      delay: 1,
      extraLoops: 2,
    },
    exitAnimation: {
      topOffset: "-150px",
      stagger: 0.25,
      delay: 6.6,
      duration: 1,
      ease: "cubic-bezier(0.7, 0, 0.489, 0)",
    },
  },

  svgAnimation: {
    // How long the fill-in transition takes when reaching 100%
    fillDuration: 0.6,
    fillStagger: 0.02,
    ease: {
      fill: "power1.in",
    },
    glow: {
      // Tweak these if your logo color is lighter/darker
      peakFilter:
        "drop-shadow(0 0 18px rgba(49, 49, 49, 0.9)) drop-shadow(0 0 40px rgba(49, 49, 49, 0.5))",
      restFilter: "drop-shadow(0 0 6px rgba(49, 49, 49, 0.3))",
      peakDuration: 0.5,
      fadeDuration: 1,
    },
  },
};

export default signatureConfig;
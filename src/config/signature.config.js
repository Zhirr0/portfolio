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
    drawDuration: 1.5,
    fillDuration: 0.5,
    fillDelay: 0,
    staggerAmount: 0.01,
    ease: {
      draw: "power2.inOut",
      fill: "power1.in",
    },
  },

  undrawAnimation: {
    pauseBeforeUndraw: 1,
    unfillDuration: 0.5,
    undrawDuration: 1.5,
    staggerAmount: 0.01,
    ease: {
      unfill: "power1.in",
      undraw: "power2.inOut",
    },
  },
};

export default signatureConfig;
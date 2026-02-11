export const videoShowcaseConfig = {
  textAnimation: {
    animateIn: {
      width: "100px",
      duration: 0.45,
      ease: "power4.out",
    },
    animateOut: {
      duration: 0.28,
      ease: "power4.in",
    },
  },

  flipAnimation: {
    duration: 0.8,
    ease: "power2.inOut",
  },

  backdrop: {
    fadeIn: {
      duration: 0.5,
      ease: "power2.out",
    },
    fadeOut: {
      duration: 0.5,
      ease: "power2.in",
    },
  },

  controlButtons: {
    fadeIn: {
      duration: 0.5,
      ease: "back.out(1.7)",
      stagger: 0.1,
    },
    fadeOut: {
      duration: 0.3,
      ease: "back.in(1.7)",
    },
  },
};

export default videoShowcaseConfig;
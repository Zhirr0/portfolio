const HERO_CONFIG = {
  animation: {
    ease: "cubic-bezier(.07, .983, .261, .829)",

    header: {
      fromY: 120,
      stagger:0.035,
      duration: 0.8,
      delay: 0.7,
    },

    paragraph: {
      fromY: 100,
      stagger: 0.01,
      duration: 1.3,
    },
  },

  layout: {
    breakpoint: 768,

    gap: {
      desktop: 15,
      mobile: 10,
    },

    overlap: {
      desktop: 30,
      mobile: 20,
    },

    zIndex: {
      header: 10,
      paragraph: 5,
    },
  },

  observers: {
    navPollInterval: 120,
  },
};
export default HERO_CONFIG
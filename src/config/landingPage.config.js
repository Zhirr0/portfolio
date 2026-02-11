export const landingPageConfig = {
  splitText: {
    type: "words",
    wordsClass: "landing-page-word",
  },

  // Responsive gap values for heading
  gap: {
    mobile: "55vw", // <= 480px
    tablet: "25vw", // <= 768px
    laptop: "30vw", // <= 1024px
    desktop: "20vw", // > 1024px
  },

  breakpoints: {
    mobile: 480,
    tablet: 768,
    laptop: 1024,
  },

  initial: {
    opacity: 0,
  },

  transform: {
    rotateStart: "rotate(8deg) scale(1)",
    rotateEnd: "rotate(0deg) scale(1)",
    fullSize: {
      height: "100%",
      width: "100%",
    },
  },

  animation: {
    fadeIn: {
      opacity: 1,
      duration: 0.5,
      ease: "expo.out",
      delay: 1,
    },

    gapExpand: {
      duration: 1.5,
      ease: "expo.out",
      delay: 1, // Relative to fadeIn start ("<1")
    },

    videoRotate: {
      duration: 1.5,
      ease: "expo.out",
    },

    videoExpand: {
      duration: 1.5,
      ease: "power4.out",
      delay: 0.3, // After video rotate ("+=.3")
    },

    fadeOut: {
      opacity: 0,
    },

    wordsReveal: {
      y: 0,
      duration: 1,
      stagger: 0.05,
      ease: "expo.out",
    },
  },
};

export default landingPageConfig;

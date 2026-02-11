export const hoverLinksInteraction = {
  customEase: {
    name: "hop",
    curve: "M0,0 C0.071,0.505 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1",
  },

  scale: {
    initial: 1.25,
    final: 1,
    hidden: 0,
  },

  clipPath: {
    visible: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  },

  animation: {
    wrapperReveal: {
      duration: 0.5,
      ease: "hop",
    },

    imageScaleInitial: {
      duration: 0.5,
      ease: "power2.out",
    },

    imageScaleHop: {
      duration: 1.25,
      ease: "hop",
    },

    imageHide: {
      scale: 0,
      delay: 1,
      duration: 0.5,
    },

    fadeOut: {
      opacity: 0,
      delay: 0.6,
      duration: 0.5,
    },
  },
};

export default hoverLinksInteraction;
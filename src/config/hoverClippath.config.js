export const hoverClipPathConfig = {
  thumbnail: {
    initial: {
      scale: 0,
      xPercent: -50,
      yPercent: -50,
    },
  },

  clipPath: {
    hidden: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
    hiddenTop: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
    visible: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
  },

  mouseTracking: {
    duration: 1,
    ease: "power3.out",
  },

  // Rotation animation settings
  rotation: {
    sensitivity: 0.4,
    maxRotation: 10,
    smoothing: 0.12,
    decay: 0.92,
  },

  animation: {
    scale: {
      show: {
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
      },
      hide: {
        scale: 0,
        duration: 0.5,
        delay: 1,
        ease: "power2.out",
      },
    },

    clipPathReveal: {
      duration: 0.5,
      ease: "power2.out",
    },

    clipPathHide: {
      duration: 0.5,
      ease: "power2.out",
    },

    imageScale: {
      duration: 0.5,
      ease: "power2.out",
    },
  },
};

export default hoverClipPathConfig;
export const scatterTextConfig = {
  initialPosition: {
    x: "75dvw",
  },

  splitText: {
    type: "chars",
    autoSplit: true,
  },

  scrollTrigger: {
    endMultiplier: 4, // Multiplies window.innerHeight

  },

  fade: {
    threshold: 0.85, // Progress threshold to start fading
    duration: 0.3,
  },
};

export default scatterTextConfig;
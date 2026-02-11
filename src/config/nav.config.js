export const navConfig = {
  scrollThreshold: 50,

  // Gap between nav and hero section
  heroGap: 5, // in pixels

  compressed: {
    xxl: { left: "47%", right: "47%", top: "20px", height: "80px" },
    xl: { left: "47%", right: "47%", top: "18px", height: "75px" },
    lg: { left: "46%", right: "46%", top: "16px", height: "65px" },
    md: { left: "45%", right: "45%", top: "14px", height: "60px" },
    sm: { left: "44%", right: "44%", top: "12px", height: "50px" },
    xs: { left: "41%", right: "41%", top: "10px", height: "50px" },
    default: { left: "39%", right: "39%", top: "10px", height: "50px" },
  },

  expanded: {
    xxl: { left: "0.5rem", right: "0.5rem", top: "0.5rem", height: "80px" },
    xl: { left: "0.5rem", right: "0.5rem", top: "0.5rem", height: "72px" },
    lg: { left: "0.5rem", right: "0.5rem", top: "0.5rem", height: "64px" },
    md: { left: "0.375rem", right: "0.375rem", top: "0.375rem", height: "60px" },
    sm: { left: "0.375rem", right: "0.375rem", top: "0.375rem", height: "48px" },
    default: { left: "0.25rem", right: "0.25rem", top: "0.25rem", height: "40px" },
  },

  animation: {
    backgroundColor: {
      duration: 0.2,
      ease: "cubic-bezier(0.848, 0.01, 0.932, 1.001)",
    },
    
    // Position and size animation
    transform: {
      duration: 1,
      ease: "cubic-bezier(0.848, 0.01, 0.932, 1.001)",
    },
    
    contentFadeOut: {
      duration: 0.5,
      ease: "cubic-bezier(0.848, 0.01, 0.932, 1.001)",
    },
    
    contentFadeIn: {
      duration: 0.3,
      delay: 0.2,
      ease: "cubic-bezier(0.848, 0.01, 0.932, 1.001)",
    },
    
    logoFadeIn: {
      duration: 0.3,
      delay: 0.2,
      ease: "cubic-bezier(0.848, 0.01, 0.932, 1.001)",
    },
    
    logoFadeOut: {
      duration: 0.5,
      ease: "cubic-bezier(0.848, 0.01, 0.932, 1.001)",
    },
  },

  colors: {
    compressed: "#272727",
    expanded: "#eee",
  },
};

export default navConfig;
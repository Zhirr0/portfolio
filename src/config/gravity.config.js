const gravityConfig = {

  // note this file has alot of comments because it is about a library that i have only used in this project so i have very little to no knowledge about this topic
  // used AI for the math and the physics calculation
  // Words Configuration
  words: [
    "ORBIT",
    "GALAXY",
    "PLANET",
    "STAR",
    "COSMOS",
    "NEBULA",
    "MOON",
    "COMET",
    "GRAVITY",
    "VOID",
  ],
  wordSpacing: {
    circleRadius: 250, // Initial circle radius for word placement
    padding: 24, // Padding multiplier for word width
    extraWidth: 30, // Extra width added to each word box
    height: 55, // Height of word boxes
  },

  // Physics Configuration
  physics: {
    restitution: 0.8, // Bounciness (0-1)
    friction: 0.01, // Surface friction
    frictionAir: 0.01, // Air resistance
    gravity: 0, // Initial gravity (0 = no gravity)
  },

  // Gravity Well Configuration (when gravityMode = true)
  gravityWell: {
    pullRadius: 300, // Distance at which gravity starts affecting words
    maxPullStrength: 0.01, // Maximum pull force (increase for stronger gravity)
    minPullStrength: 0, // Minimum pull force
    orbitRadius: 150, // Distance at which orbital motion kicks in
    orbitForce: 0.003, // Orbital velocity force (increase for faster orbits)
  },

  // Repulsion Configuration (when gravityMode = false)
  repulsion: {
    pushRadius: 200, // Distance at which repulsion affects words
    maxPushStrength: 0.15, // Maximum push force
    minPushStrength: 0, // Minimum push force
  },

  // Cursor Configuration
  cursor: {
    gravityMode: {
      innerSize: 8, // Inner circle size
      outerSize: 15, // Outer circle size
      innerColor: [255, 255, 255], // RGB
      outerColor: [200, 150, 255], // RGB
      ringsCount: 5, // Number of concentric rings
      ringsSpacing: 60, // Distance between rings
      ringsColor: [150, 100, 255], // RGB
      ringsMaxAlpha: 80, // Maximum ring opacity
      ringsMinAlpha: 10, // Minimum ring opacity
    },
    repulsionMode: {
      innerSize: 10, // Inner circle size
      outerSize: 18, // Outer circle size
      innerColor: [255, 100, 100], // RGB
      outerColor: [255, 150, 150], // RGB
      ringsCount: 4, // Number of warning rings
      ringsSpacing: 50, // Distance between rings
      ringsColor: [255, 100, 100], // RGB
      ringsMaxAlpha: 60,
      ringsMinAlpha: 5,
    },
  },

  // Word Visual Configuration
  wordStyle: {
    fontSize: 18, // Base font size
    fontSizeIncrease: 4, // Font size increase when near cursor
    textColor: [180, 160, 255], // RGB base color
    textGlowIncrease: [75, 95, 0], // RGB increase when glowing
    boxBaseColor: [20, 20, 40], // RGB base box color
    boxGlowIncrease: [50, 40, 80], // RGB increase when glowing
    boxAlpha: 180, // Base box opacity
    boxAlphaIncrease: 75, // Opacity increase when glowing
    strokeBaseColor: [100, 80, 200], // RGB base stroke color
    strokeGlowIncrease: [155, 120, 55], // RGB increase when glowing
    strokeWeight: 2, // Base stroke weight
    strokeWeightIncrease: 2, // Stroke weight increase when glowing
    borderRadius: 10, // Corner radius
    glowDistance: 200, // Distance at which glow starts
    shadowBlur: 25, // Shadow blur amount
  },

  // Starfield Configuration
  starfield: {
    count: 200, // Number of stars
    minSize: 1, // Minimum star size
    maxSize: 3, // Maximum star size
    minBrightness: 100, // Minimum brightness
    maxBrightness: 255, // Maximum brightness
    twinkleSpeed: 0.05, // Twinkle animation speed
  },

  // Background Configuration
  background: {
    color: [5, 5, 15], // RGB
  },

  // UI Configuration
  ui: {
    instructionColor: [255, 255, 255, 200], // RGBA
    fontSize: 14,
    position: { x: 20, y: 20 },
    lineHeight: 20,
  },

  // Screen Boundary Configuration
  boundary: {
    margin: 50, // Margin from screen edges
  },
};
export default gravityConfig;

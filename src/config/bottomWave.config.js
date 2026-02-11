export const VIEWPORT = {
  MIN: 360,
  MAX: 1200,
  SCALE_MAX_REF: 1920,
};

export const TEXTS = [
  "FRONT-END",
  "ANIMATE",
  "GSAP",
  "REACT",
  "MOTION",
  "TYPESCRIPT",
  "REDUX",
];

export const MOTION_PROFILES = {
  SMALL: {
    base: -70,
    movement: 150,
    spacing: 15,
  },
  LARGE: {
    base: -30,
    movement: 60,
    spacing: 15,
  },
};

export const SCALE_PROFILE = {
  SMALL_WIDTH: 370,
  SMALL_SCALE: 250,
  LARGE_SCALE: 130,
};

export const OFFSET_CLAMP = {
  MIN: -200,
  MAX: 200,
};

export const math = {
  clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  },

  lerp(a, b, t) {
    return a + (b - a) * t;
  },

  lerpByWidth(width) {
    return this.clamp(
      (width - VIEWPORT.MIN) / (VIEWPORT.MAX - VIEWPORT.MIN),
      0,
      1,
    );
  },
};

export const deriveParams = (width) => {
  const t = math.lerpByWidth(width);

  return {
    base: math.lerp(MOTION_PROFILES.SMALL.base, MOTION_PROFILES.LARGE.base, t),
    movement: math.lerp(
      MOTION_PROFILES.SMALL.movement,
      MOTION_PROFILES.LARGE.movement,
      t,
    ),
    spacing: math.lerp(
      MOTION_PROFILES.SMALL.spacing,
      MOTION_PROFILES.LARGE.spacing,
      t,
    ),
  };
};

export const deriveScale = (width) => {
  if (width <= SCALE_PROFILE.SMALL_WIDTH) return SCALE_PROFILE.SMALL_SCALE;
  if (width >= VIEWPORT.MAX) return SCALE_PROFILE.LARGE_SCALE;

  return (
    SCALE_PROFILE.SMALL_SCALE -
    ((width - VIEWPORT.MIN) / (VIEWPORT.SCALE_MAX_REF - VIEWPORT.MIN)) *
      (SCALE_PROFILE.SMALL_SCALE - SCALE_PROFILE.LARGE_SCALE)
  );
};

export const deriveTextData = (params) =>
  TEXTS.map((text, i) => ({
    text,
    offset: `${(params.base + i * params.spacing).toFixed(2)}%`,
  }));

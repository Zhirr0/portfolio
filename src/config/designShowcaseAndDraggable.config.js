// Animation configuration constants
export const ANIMATION_CONFIG = {

  // design showcase configs
  PIN_HEIGHT_MULTIPLIER: 1.5,
  SCROLL_HEIGHT_MULTIPLIER: 3,
  TELLER_THRESHOLD: 0.667,
  TELLER_DIVISOR: 0.333,
  IMG_SCALE_MIN: 0.1,
  IMG_SCALE_MAX: 0.9,
  IMG_SCALE_MULTIPLIER: 1.5,
  HEADER_Y_PERCENT_MULTIPLIER: 300,

  // Draggable animation values
  BLUR_MULTIPLIER: 0.1,
  ROTATION_MULTIPLIER: 0.2,
  SCALE_REDUCTION_X: 0.003,
  SCALE_REDUCTION_Y: 0.003,
  BASE_SCALE: 1.05,
  BORDER_RADIUS_BASE: 10,
  BORDER_RADIUS_MULTIPLIER: 0.5,
  MOMENTUM_MULTIPLIER: 1.5,

  // Scale animations for drag
  DRAG_START_SCALE: 1.03,
  DRAG_END_SCALE: 1,

  // Durations for drag
  DRAG_DURATION: 1,
  RELEASE_DURATION: 1.5,
  DRAG_START_DURATION: 0.3,
  DRAG_END_DURATION: 1,

  // Easing for drag
  DRAG_EASE: "power2.out",
  RELEASE_EASE: "power3.out",
  DRAG_START_EASE: "expo.inOut",
};

// Selector arrays for design showcase containers
export const IMAGE_CONTAINERS = [
  ".image-section-container-1",
  ".image-section-container-2",
  ".image-section-container-3",
  ".image-section-container-4",
];
// selectors arrays for drag containers
export const DRAGGER_SELECTORS = [
  ".dragger-wrapper-1",
  ".dragger-wrapper-2",
  ".dragger-wrapper-3",
  ".dragger-wrapper-4",
  ".dragger-wrapper-5",
];
 
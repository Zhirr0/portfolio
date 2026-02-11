import gsap from "gsap";
import { ANIMATION_CONFIG } from "../../config/designShowcaseAndDraggable.config";

/**
 * Calculate teller Y percent based on progress
 */

// for design showcase
export const calculateTellerYPercent = (progress) => {
  const { TELLER_THRESHOLD, TELLER_DIVISOR } = ANIMATION_CONFIG;

  if (progress < TELLER_THRESHOLD) {
    return 100;
  }

  return 100 - ((progress - TELLER_THRESHOLD) / TELLER_DIVISOR) * 100;
};

/**
 * Calculate image scale based on progress
 */
// for designshowcase
export const calculateImageScale = (progress) => {
  const { IMG_SCALE_MIN, IMG_SCALE_MULTIPLIER, IMG_SCALE_MAX } =
    ANIMATION_CONFIG;
  return (
    IMG_SCALE_MIN + Math.min(progress * IMG_SCALE_MULTIPLIER, 1) * IMG_SCALE_MAX
  );
};

/**
 * Dispatch cursor update event
 */
// for drag
export const dispatchCursorUpdate = (event) => {
  const pointerEvent = event || window.event;
  window.dispatchEvent(
    new CustomEvent("cursorUpdate", {
      detail: {
        x: pointerEvent.clientX,
        y: pointerEvent.clientY,
      },
    }),
  );
};

/**
 * Calculate drag animation properties
 */

export const calculateDragEffects = (deltaX, deltaY) => {
  const {
    BLUR_MULTIPLIER,
    ROTATION_MULTIPLIER,
    BASE_SCALE,
    SCALE_REDUCTION_X,
    SCALE_REDUCTION_Y,
    BORDER_RADIUS_BASE,
    BORDER_RADIUS_MULTIPLIER,
    DRAG_DURATION,
    DRAG_EASE,
  } = ANIMATION_CONFIG;

  const blurSpeed = Math.abs(deltaX) + Math.abs(deltaY);
  const speed = Math.sqrt(deltaX ** 2 + deltaY ** 2);

  return {
    filter: `blur(${blurSpeed * BLUR_MULTIPLIER}px)`,
    rotation: deltaX * ROTATION_MULTIPLIER,
    scaleX: BASE_SCALE - Math.abs(deltaY) * SCALE_REDUCTION_X,
    scaleY: BASE_SCALE - Math.abs(deltaX) * SCALE_REDUCTION_Y,
    borderRadius: `${BORDER_RADIUS_BASE + speed * BORDER_RADIUS_MULTIPLIER}px`,
    duration: DRAG_DURATION,
    ease: DRAG_EASE,
  };
};

/**
 * Calculate momentum target position with bounds
 */
// for drag
export const calculateMomentumTarget = (current, delta, min, max) => {
  const { MOMENTUM_MULTIPLIER } = ANIMATION_CONFIG;
  const target = current + delta * MOMENTUM_MULTIPLIER;
  return Math.max(min, Math.min(target, max));
};

/**
 * Animate drag start
 */
export const animateDragStart = (selector) => {
  const { DRAG_START_SCALE, DRAG_START_EASE, DRAG_START_DURATION } =
    ANIMATION_CONFIG;

  gsap.to(selector, {
    scale: DRAG_START_SCALE,
    ease: DRAG_START_EASE,
    duration: DRAG_START_DURATION,
  });
};

/**
 * Animate drag end
 */
export const animateDragEnd = (selector) => {
  const { DRAG_END_SCALE, RELEASE_EASE, DRAG_END_DURATION } = ANIMATION_CONFIG;

  gsap.to(selector, {
    scale: DRAG_END_SCALE,
    ease: RELEASE_EASE,
    filter: "blur(0px)",
    duration: DRAG_END_DURATION,
    rotation: 0,
    scaleX: 0,
    scaleY: 0,
    borderRadius: "0px",
  });
};

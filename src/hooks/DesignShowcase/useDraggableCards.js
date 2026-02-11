import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Draggable } from "gsap/all";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  animateDragEnd,
  animateDragStart,
  calculateDragEffects,
  calculateMomentumTarget,
  dispatchCursorUpdate,
} from "../../utils/DesignShowcase/animationHelper.js";
import {
  ANIMATION_CONFIG,
  DRAGGER_SELECTORS,
} from "../../config/designShowcaseAndDraggable.config.js";

gsap.registerPlugin(Draggable, ScrollTrigger);

const createDraggableInstance = (selector) => {
  const instances = Draggable.create(selector, {
    bounds: ".dragging-divs",
    type: "x,y",
    inertia: true,

    // CRITICAL: Allow dragging to override other interactions
    allowContextMenu: false,
    allowNativeTouchScrolling: false,
    zIndexBoost: true,

    onPress: function () {
      // Kill ALL ScrollTriggers affecting this element immediately
      const element = this.target;

      // Method 1: Kill via stored reference
      if (element._stTween) {
        if (element._stTween.scrollTrigger) {
          element._stTween.scrollTrigger.kill();
        }
        element._stTween.kill();
        delete element._stTween;
      }

      // Method 2: Kill any ScrollTriggers that have this element as target
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === element || st.vars?.trigger === element) {
          st.kill();
        }
      });

      // Method 3: Kill all tweens on this element
      gsap.killTweensOf(element);
    },

    onDrag: function (event) {
      dispatchCursorUpdate(event);

      const dragEffects = calculateDragEffects(this.deltaX, this.deltaY);
      gsap.to(this.target, {
        ...dragEffects,
        overwrite: "auto", 
      });
    },

    onDragStart: function () {
      animateDragStart(this.target);

      const element = this.target;
      element.dataset.isDragging = "true";

      // Store the kill function for this specific element
      if (!element._killScrollTriggers) {
        element._killScrollTriggers = () => {
          if (element._stTween) {
            if (element._stTween.scrollTrigger) {
              element._stTween.scrollTrigger.kill();
            }
            element._stTween.kill();
            delete element._stTween;
          }

          ScrollTrigger.getAll().forEach((st) => {
            if (st.trigger === element || st.vars?.trigger === element) {
              st.kill();
            }
          });
        };
      }

      element._killScrollTriggers();
    },

    onRelease: function () {
      const currentX = this.x;
      const currentY = this.y;

      const targetX = calculateMomentumTarget(
        currentX,
        this.deltaX,
        this.minX,
        this.maxX,
      );
      const targetY = calculateMomentumTarget(
        currentY,
        this.deltaY,
        this.minY,
        this.maxY,
      );

      gsap.to(this.target, {
        x: targetX,
        y: targetY,
        ease: ANIMATION_CONFIG.RELEASE_EASE,
        duration: ANIMATION_CONFIG.RELEASE_DURATION,
        overwrite: true,
      });
    },

    onDragEnd: function () {
      const element = this.target;
      element.dataset.isDragging = "false";
      animateDragEnd(selector);
    },
  });

  return instances;
};
// hook
export const useDraggableCards = () => {
  useGSAP(() => {
    // Small delay to ensure ScrollTriggers are fully initialized first
    const timer = setTimeout(() => {
      // Create draggable instances for all cards
      const draggableInstances = [];
      DRAGGER_SELECTORS.forEach((selector) => {
        const instances = createDraggableInstance(selector);
        if (instances && instances.length > 0) {
          draggableInstances.push(...instances);
        }
      });

      // Cleanup
      return () => {
        draggableInstances.forEach((instance) => {
          if (instance && instance.kill) {
            instance.kill();
          }
        });
      };
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, []);
};

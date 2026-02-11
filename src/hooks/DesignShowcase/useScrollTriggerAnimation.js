import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import {
  calculateImageScale,
  calculateTellerYPercent,
} from "../../utils/DesignShowcase/animationHelper.js";
import {
  ANIMATION_CONFIG,
  IMAGE_CONTAINERS,
} from "../../config/designShowcaseAndDraggable.config.js";

export const useScrollTriggerAnimation = () => {
  useGSAP(() => {
    const headerSplitDesignShowcase = SplitText.create(
      ".some-of-the-designs-container h4",
      { type: "lines", mask: "lines", autoSplit: true },
    );

    const headerSplitTeller = SplitText.create(".image-section-header-h4", {
      type: "lines",
      mask: "lines",
      autoSplit: true,
    });

    ScrollTrigger.create({
      trigger: "#image-section",
      start: "top top",
      end: `+=${window.innerHeight * ANIMATION_CONFIG.PIN_HEIGHT_MULTIPLIER}px`,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        const progress = self.progress;

        const imgScale = calculateImageScale(progress);
        gsap.set(IMAGE_CONTAINERS, { scale: imgScale });

        gsap.set(headerSplitDesignShowcase.lines, {
          yPercent: Math.min(
            progress * ANIMATION_CONFIG.HEADER_Y_PERCENT_MULTIPLIER,
            100,
          ),
        });

        const tellerYPercent = calculateTellerYPercent(progress);
        gsap.set(headerSplitTeller.lines, {
          yPercent: tellerYPercent,
        });
      },
    });
  }, []);
};

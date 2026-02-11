// Hooks
import { useScrollTriggerAnimation } from "../hooks/DesignShowcase/useScrollTriggerAnimation.js";

// Components
import VideoSection from "../components/VideoSection.jsx";
import FadeoutCard from "../components/touchscreen-component/FadeoutCard.jsx";

// Assets
import scrollTriggerVideo from "/videos/scrollTriggerVideo.mp4";
import textAnimation from "/videos/textAnimation.mp4";
import designShowcase from "/videos/designShowcase.mp4";
import { unlockScroll } from "../utils/screenLocker.js";

const DesignShowcase = () => {
  // Scroll-trigger logic ONLY for the pinned section
  useScrollTriggerAnimation();
  unlockScroll();

  return (
    <div className="design-showcase">
      {/* Image Section with Pinned Scroll */}
      <div id="image-section" className="image-section">
        <div className="image-section-container-1">
          <VideoSection title="Custom Cursor" src={designShowcase} />
        </div>

        <div className="image-section-container-2">
          <h4 className="image-section-header-h4">back-to-back marquee</h4>
          <FadeoutCard />
        </div>

        <div className="image-section-container-3">
          <VideoSection
            title="links hover Transition"
            src={textAnimation}
            videoClassName="w-full h-full object-cover rounded-2xl"
          />
        </div>

        <div className="image-section-container-4">
          <VideoSection
            title="Working With Canvas API"
            src={scrollTriggerVideo}
            videoClassName="w-full h-full object-cover rounded-2xl"
          />
        </div>

        <div className="some-of-the-designs-container">
          <h4>Some of the creations</h4>
        </div>
      </div>
    </div>
  );
};

export default DesignShowcase;

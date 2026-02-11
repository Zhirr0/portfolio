import { useState } from "react";
import ScrollTriggerZoomIn from "./ScrollTriggerZoomIn";
import ScrollTriggerZoomOut from "./ScrollTriggerZoomOut";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RoutingTransition from "../../components/transitionRouter/Transition";

const ScrollTriggerZoom = () => {
  const [activeSection, setActiveSection] = useState("zoomIn");

  const handleSectionChange = (section) => {
    setActiveSection(section);
    // Refresh ScrollTrigger after display change
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  };

  return (
    <section className="scroll-trigger-zoom-section">
      <div className="scroll-trigger-zoom-controls">
        <button
          onClick={() => handleSectionChange("zoomIn")}
          className={`scroll-trigger-zoom-button ${
            activeSection === "zoomIn"
              ? "scroll-trigger-zoom-button-active"
              : ""
          }`}
        >
          Zoom In
        </button>
        <button
          onClick={() => handleSectionChange("zoomOut")}
          className={`scroll-trigger-zoom-button ${
            activeSection === "zoomOut"
              ? "scroll-trigger-zoom-button-active"
              : ""
          }`}
        >
          Zoom Out
        </button>
        <button
          onClick={() => handleSectionChange("both")}
          className={`scroll-trigger-zoom-button ${
            activeSection === "both" ? "scroll-trigger-zoom-button-active" : ""
          }`}
        >
          Both
        </button>
      </div>

      <div
        className="scroll-trigger-zoom-content"
        style={{
          display:
            activeSection === "zoomOut" || activeSection === "both"
              ? "block"
              : "none",
        }}
      >
        <ScrollTriggerZoomOut />
      </div>
      <div
        className="scroll-trigger-zoom-content"
        style={{
          display:
            activeSection === "zoomIn" || activeSection === "both"
              ? "block"
              : "none",
        }}
      >
        <ScrollTriggerZoomIn />
      </div>
    </section>
  );
};

export default RoutingTransition(ScrollTriggerZoom);

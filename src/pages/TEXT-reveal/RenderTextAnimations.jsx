import TextRevealClippath from "./TextRevealClippath";
import TextRevealBackground from "./TextRevealFade";
import TextRevealClippathLR from "./TextRevealClippathLR";
import LineMasks from "./LineMasks";
import RoutingTransition from "../../components/transitionRouter/Transition";
import "../../styles/render-text-animations.css";
const RenderTextAnimations = () => {
  return (
    <section className="rendet-text-animations-section">
      <div></div> {/* first-child */}
      <TextRevealBackground />
      <div></div> {/* third-child */}
      <TextRevealClippath />
      <div></div> {/* fifth-child */}
      <TextRevealClippathLR />
      <div></div>
      {/* seventh-child */}
      <LineMasks />
      <div></div> {/* last-child */}
    </section>
  );
};

export default RoutingTransition(RenderTextAnimations);

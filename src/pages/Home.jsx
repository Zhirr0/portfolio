import "../index.css";
import Hero from "../components/Hero";
import DesignShowcase from "../components/DesignShowcase";
import ScatterText from "../components/ScatterText";
import FooterSection from "../components/FooterSection";
import TextAnimation from "../components/TextAnimation";
import { useMediaQuery } from "react-responsive";
import VideoShowcase from "../components/touchscreen-component/VideoShowcase";
import DraggableCards from "../components/DraggableCards";
import RoutingTransition from "../components/transitionRouter/Transition";

const Home = () => {
  const isTouchScreenSize = useMediaQuery({ maxWidth: 1024 });

  return (
    <>
      <Hero />
      <TextAnimation />
      <div style={{ display: isTouchScreenSize ? "block" : "none" }}>
        <VideoShowcase />
      </div>
      <div style={{ display: isTouchScreenSize ? "none" : "block" }}>
        <DesignShowcase />
      </div>
      <ScatterText text="Build Something Better." />
      <DraggableCards />
      <FooterSection />
    </>
  );
};
export default RoutingTransition(Home);

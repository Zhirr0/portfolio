import "../../styles/texthover.css";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import { useEffect, useRef } from "react";

// Import images dynamically
import img1 from "/images/img1.webp";
import img2 from "/images/img2.webp";
import img3 from "/images/img3.webp";
import img4 from "/images/img4.webp";
import img5 from "/images/img5.webp";
import img6 from "/images/img6.webp";
import img7 from "/images/img7.webp";
import RoutingTransition from "../../components/transitionRouter/Transition";
import hoverLinksInteraction from "../../config/hoverLinksInteraction";

const clients = [
  "Native Instruments.",
  "Pixel Labs.",
  "Aurora Studio.",
  "Flux Design Co.",
  "Quantum Soft.",
  "Nebula Works.",
  "Meridian Collective.",
];

const images = [img1, img2, img3, img4, img5, img6, img7];

const HoverLinksInteraction = () => {
  const clientsPreviewRef = useRef(null);
  const activeClientRef = useRef({ index: -1, wrapper: null, img: null });
  const preloadedImages = useRef(new Set());

  useEffect(() => {
    CustomEase.create(
      hoverLinksInteraction.customEase.name,
      hoverLinksInteraction.customEase.curve,
    );

    // Silently preload images in background - won't block anything
    images.forEach((src) => {
      const img = new Image();
      img.onload = () => preloadedImages.current.add(src);
      img.src = src;
    });
  }, []);

  const handleMouseEnter = (index) => {
    const clientsPreview = clientsPreviewRef.current;
    const {
      index: activeIndex,
      wrapper: activeWrapper,
      img: activeImg,
    } = activeClientRef.current;

    if (activeIndex === index) return;

    // Remove previous client
    if (activeIndex !== -1 && activeWrapper && activeImg) {
      gsap.to(activeImg, {
        scale: hoverLinksInteraction.animation.imageHide.scale,
        delay: hoverLinksInteraction.animation.imageHide.delay,
        duration: hoverLinksInteraction.animation.imageHide.duration,
        onComplete: () => activeWrapper.remove(),
      });
    }

    // Create new wrapper & image
    const clientImgWrapper = document.createElement("div");
    clientImgWrapper.className = "client-img-wrapper";

    const clientImg = document.createElement("img");
    clientImg.src = images[index];

    gsap.set(clientImg, { scale: hoverLinksInteraction.scale.initial });
    clientImgWrapper.appendChild(clientImg);
    clientsPreview.appendChild(clientImgWrapper);

    // Animate
    gsap.to(clientImgWrapper, {
      clipPath: hoverLinksInteraction.clipPath.visible,
      duration: hoverLinksInteraction.animation.wrapperReveal.duration,
      ease: hoverLinksInteraction.animation.wrapperReveal.ease,
    });

    gsap.to(clientImg, {
      scale: hoverLinksInteraction.scale.final,
      duration: hoverLinksInteraction.animation.imageScaleInitial.duration,
      ease: hoverLinksInteraction.animation.imageScaleInitial.ease,
    });

    gsap.to(clientImg, {
      scale: hoverLinksInteraction.scale.final,
      duration: hoverLinksInteraction.animation.imageScaleHop.duration,
      ease: hoverLinksInteraction.animation.imageScaleHop.ease,
    });

    activeClientRef.current = {
      index,
      wrapper: clientImgWrapper,
      img: clientImg,
    };
  };

  const handleMouseOut = (e, index) => {
    const { wrapper, img, index: activeIndex } = activeClientRef.current;

    if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) return;

    if (activeIndex !== index || !img || !wrapper) return;

    gsap.to(img, {
      opacity: hoverLinksInteraction.animation.fadeOut.opacity,
      delay: hoverLinksInteraction.animation.fadeOut.delay,
      duration: hoverLinksInteraction.animation.fadeOut.duration,
      onComplete: () => wrapper.remove(),
    });

    activeClientRef.current = { index: -1, wrapper: null, img: null };
  };

  return (
    <section className="text-hover-clippath-section">
      <section className="text-hover-clippath-clients">
        <div
          className="text-hover-clippath-clients-preview"
          ref={clientsPreviewRef}
        />
        <div className="text-hover-clippath-client-list">
          {clients.map((name, i) => (
            <div
              className="text-hover-clippath-client-name"
              key={i}
              onMouseEnter={() => handleMouseEnter(i)}
              onMouseOut={(e) => handleMouseOut(e, i)}
            >
              <h1 className="text-hover-clippath-header">{name}</h1>
            </div>
          ))}
        </div>
      </section>

      <section className="text-hover-clippath-footer">
        <p className="text-hover-clippath-paragraph">VITE</p>
        <p className="text-hover-clippath-paragraph">REACT</p>
      </section>
    </section>
  );
};

export default RoutingTransition(HoverLinksInteraction);
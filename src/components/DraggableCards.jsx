import { useMediaQuery } from "react-responsive";
import { useDraggableCards } from "../hooks/DesignShowcase/useDraggableCards";
import { DRAGGABLE_CARDS_DATA } from "../features/DesignShowcase/constants/draggableCardsData";
import DraggableCard from "./DraggableCard";
import { useGSAP } from "@gsap/react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/all";
import stConfig from "../config/DraggableCards.config";
gsap.registerPlugin(ScrollTrigger, Draggable);
const DraggableCards = () => {
  useGSAP(() => {
    const container = document.querySelector(".dragging-divs");

    const cards = {
      c1: document.querySelector(".dragger-wrapper-1"),
      c2: document.querySelector(".dragger-wrapper-2"),
      c3: document.querySelector(".dragger-wrapper-3"),
      c4: document.querySelector(".dragger-wrapper-4"),
    };

    const getX = (element) =>
      container.clientWidth / 2 - element.offsetWidth / 2;
    const getY = (element) =>
      container.clientHeight / 2 - element.offsetHeight / 2;

    // create individual tweens and attach to element so draggable can kiil those tweens
    if (cards.c1) {
      const t1 = gsap.to(cards.c1, {
        x: () => -getX(cards.c1),
        y: () => -getY(cards.c1),
        scrollTrigger: stConfig,
      });
      cards.c1._stTween = t1;
    }

    if (cards.c2) {
      const t2 = gsap.to(cards.c2, {
        x: () => getX(cards.c2),
        y: () => -getY(cards.c2),
        scrollTrigger: stConfig,
      });
      cards.c2._stTween = t2;
    }

    if (cards.c3) {
      const t3 = gsap.to(cards.c3, {
        x: () => -getX(cards.c3),
        y: () => getY(cards.c3),
        scrollTrigger: stConfig,
      });
      cards.c3._stTween = t3;
    }

    if (cards.c4) {
      const t4 = gsap.to(cards.c4, {
        x: () => getX(cards.c4),
        y: () => getY(cards.c4),
        scrollTrigger: stConfig,
      });
      cards.c4._stTween = t4;
    }
    // Animate background color
    gsap.to(".dragging-divs, body, .scatter-section", {
      backgroundColor: "#0f0f1b",
      duration: 0.3,
      ease: "power1.in",
      scrollTrigger: {
        trigger: ".dragging-divs",
        start: "top top",
        toggleActions: "play none none reverse",
      },
    });

    // Animate text color to blend with background transition
    gsap.to(".touch-screen-text h1", {
      color: "#ffffff", // White text for dark background
      duration: 0.3,
      ease: "power1.in",
      scrollTrigger: {
        trigger: ".dragging-divs",
        start: "top top",
        toggleActions: "play none none reverse",
      },
    });
    // cleanpu
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.killTweensOf([cards.c1, cards.c2, cards.c3, cards.c4]);
    };
  }, []);

  useDraggableCards();

  return (
    <div className="dragging-divs relative h-[200svh] mt-[50vh]">
      <div className="touch-screen-text">
        <h1>DRAGGABLE CARDS</h1>
      </div>

      {DRAGGABLE_CARDS_DATA.map(
        ({ id, className, position, title, videoSrc, objectFit }) => (
          <DraggableCard
            key={id}
            className={className}
            position={position}
            title={title}
            videoSrc={videoSrc}
            objectFit={objectFit}
          />
        ),
      )}
    </div>
  );
};

export default DraggableCards;

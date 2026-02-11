import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import "../../styles/scrollTriggerCards.css";

import img1 from "/images/purple-background.jpg";
import img2 from "/images/red-background.jpg";
import img3 from "/images/yellow-background.jpg";
import img4 from "/images/blue-background.jpg";
import RoutingTransition from "../../components/transitionRouter/Transition";

const ScrollTriggerCardsReveal = () => {
  useGSAP(() => {
    const cards = gsap.utils.toArray(".scroll-trigger-card");

    cards.forEach((c, i) => {
      if (i < cards.length - 1) {
        const cardInner = c.querySelector(".scroll-trigger-card-inner");

        gsap.fromTo(
          cardInner,
          { scale: 1, y: "0%", opacity: 1 },
          {
            scale: 0.6,
            y: "-40%",
            opacity: 1,
            scrollTrigger: {
              trigger: cards[i + 1],
              start: "top 100%",
              end: "top -70%",
              scrub: true,
              pin: c,
              pinSpacing: false,
            },
          },
        );
      }
    });
  });

  return (
    <section className="scroll-trigger-cards-wrapper">
      <section className="scroll-trigger-cards-hero">
        <h1 className="scroll-trigger-cards-hero-title">
          Scroll to reveal cards
        </h1>
      </section>

      <div className="scroll-trigger-cards-sticky-cards">
        <div className="scroll-trigger-card scroll-trigger-card-1">
          <div className="scroll-trigger-card-inner">
            <div className="scroll-trigger-card-info">
              <p className="scroll-trigger-card-info-text">
                A lightweight scroll interaction system that progressively
                reveals content as the user moves through the page.
              </p>
            </div>
            <div className="scroll-trigger-card-title">
              <p className="scroll-trigger-card-title-text">
                Scroll-Triggered Motion
              </p>
            </div>
            <div className="scroll-trigger-card-description">
              <p className="scroll-trigger-card-description-text">
                This card demonstrates how scroll position can be mapped to
                animations, creating smooth, engaging transitions that guide
                attention without overwhelming the layout.
              </p>
            </div>
            <div className="scroll-trigger-cards-image-container">
              <img className="object-bottom scroll-trigger-cards-image" src={img1} alt="" />
            </div>
          </div>
        </div>

        <div className="scroll-trigger-card scroll-trigger-card-2">
          <div className="scroll-trigger-card-inner">
            <div className="scroll-trigger-card-info">
              <p className="scroll-trigger-card-info-text">
                Sticky positioning keeps key elements visible while surrounding
                content continues to move.
              </p>
            </div>
            <div className="scroll-trigger-card-title">
              <p className="scroll-trigger-card-title-text">
                Sticky Card Layout
              </p>
            </div>
            <div className="scroll-trigger-card-description">
              <p className="scroll-trigger-card-description-text">
                By combining sticky containers with scroll logic, each card
                stays in focus long enough for the user to read and understand
                its message before transitioning out.
              </p>
            </div>
            <div className="scroll-trigger-cards-image-container">
              <img className="object-center scroll-trigger-cards-image" src={img2} alt="" />
            </div>
          </div>
        </div>

        <div className="scroll-trigger-card scroll-trigger-card-3">
          <div className="scroll-trigger-card-inner">
            <div className="scroll-trigger-card-info">
              <p className="scroll-trigger-card-info-text">
                Animations are timed to feel natural and responsive to user
                input.
              </p>
            </div>
            <div className="scroll-trigger-card-title">
              <p className="scroll-trigger-card-title-text">
                Motion Timing & Easing
              </p>
            </div>
            <div className="scroll-trigger-card-description">
              <p className="scroll-trigger-card-description-text">
                Carefully tuned easing and durations ensure that motion feels
                smooth rather than mechanical, improving perceived performance
                and overall user experience.
              </p>
            </div>
            <div className="scroll-trigger-cards-image-container">
              <img className="object-bottom scroll-trigger-cards-image" src={img3} alt="" />
            </div>
          </div>
        </div>

        <div className="scroll-trigger-card scroll-trigger-card-4">
          <div className="scroll-trigger-card-inner">
            <div className="scroll-trigger-card-info">
              <p className="scroll-trigger-card-info-text">
                Visual hierarchy is reinforced through scale, spacing, and
                motion.
              </p>
            </div>
            <div className="scroll-trigger-card-title">
              <p className="scroll-trigger-card-title-text">
                Content Hierarchy
              </p>
            </div>
            <div className="scroll-trigger-card-description">
              <p className="scroll-trigger-card-description-text">
                Each card is designed to clearly separate supporting information
                from the main message, making complex ideas easier to scan and
                understand while scrolling.
              </p>
            </div>
            <div className="scroll-trigger-cards-image-container">
              <img className="object-[center_75%] scroll-trigger-cards-image" src={img4} alt="" />
            </div>
          </div>
        </div>
      </div>

      <section className="scroll-trigger-cards-footer">
        Cards Revealed !
      </section>
    </section>
  );
};

export default RoutingTransition(ScrollTriggerCardsReveal);

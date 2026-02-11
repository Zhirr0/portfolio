import pageTransition from "/videos/pageTransition.mp4";
import cards from "/videos/cards.mp4";
import horizontalScroll from "/videos/horizontalScroll.mp4";
import imageReveal from '/videos/imageReveal.mp4'
import hoverTransition from "/videos/hoverTransition.mp4";

export const DRAGGABLE_CARDS_DATA = [
  {
    id: 1,
    className: "dragger-wrapper cursor-auto md:cursor-grab active:cursor-grab dragger-wrapper-1",
    position: "abs-center",
    title: "Page-Transition",
    videoSrc: pageTransition,
    objectFit: "object-cover",
  },
  {
    id: 2,
    className: "dragger-wrapper cursor-auto md:cursor-grab active:cursor-grab dragger-wrapper-2",
    position: "abs-center",
    title: "Hover-Transition",
    videoSrc: hoverTransition,
    objectFit: "object-cover",
  },
  {
    id: 3,
    className: "dragger-wrapper cursor-auto md:cursor-grab active:cursor-grab dragger-wrapper-3",
    position: "abs-center",
    title: "Horizontal-Scroll",
    videoSrc: horizontalScroll,
    objectFit: "object-cover",
  },
  {
    id: 4,
    className: "dragger-wrapper cursor-auto md:cursor-grab active:cursor-grab dragger-wrapper-4",
    position: "abs-center",
    title: "Image-Reveal",
    videoSrc: imageReveal,
    objectFit: "object-cover",
  },
  {
    id: 5,
    className: "dragger-wrapper cursor-auto md:cursor-grab active:cursor-grab dragger-wrapper-5",
    position: "abs-center",
    title: "Cards-Transition",
    videoSrc: cards,
    objectFit: "object-cover",
  },
]; 

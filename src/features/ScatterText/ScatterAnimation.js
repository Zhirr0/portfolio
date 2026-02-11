import gsap from "gsap";



export const floatDown = (split, titleRef, tl, finalPosition) => {
  const anim = gsap.timeline();
  gsap.set(split.chars, {
    yPercent: -200,
    opacity: 0,
    scale: 0.3,
  });

  anim
    .to(titleRef.current, {
      x: finalPosition,
      duration: 1.4,
      ease: "none",
    })
    .to(
      split.chars,
      {
        yPercent: 0,
        opacity: 1,
        scale: 1,
        stagger: {
          amount: 1,
          ease: "sine.inOut",
        },
        ease: "elastic.out(1, 0.5)",
      },
      0
    );

  tl.add(anim, 0).totalDuration(tl.duration() / 0.65);
};

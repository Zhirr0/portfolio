import { motion } from "motion/react";
import { useRef } from "react";

let hasLoadedOnce = false;

const RoutingTransition = (OgComponent) => {
  return function TransitionWrapper(props) {
    const isFirstLoad = useRef(!hasLoadedOnce);
    if (isFirstLoad.current) hasLoadedOnce = true;

    const slats = 8;

    return (
      <div className="relative">
        <OgComponent {...props} />

        {/* Slide Out */}
        <div className="slide-out">
          {Array.from({ length: slats }).map((_, i) => (
            <motion.div
              key={`out-${i}`}
              className="absolute bg-[#090909]"
              style={{
                top: `${i * (100 / slats)}%`,
                left: 0,
                right: 0,
                height: `${100 / slats}%`,
                transformStyle: "preserve-3d",
              }}
              initial={{
                scaleY: isFirstLoad.current ? 0 : 1,
                rotateX: isFirstLoad.current ? 90 : 0,
              }}
              animate={{
                scaleY: 0,
                rotateX: 90,
              }}
              exit={{
                scaleY: 0,
                rotateX: 90,
              }}
              transition={{
                duration: 0.5,
                delay: i * 0.05,
                ease: [0.65, 0, 0.35, 1],
              }}
            />
          ))}
        </div>

        {/* Slide In */}
        <div className="slide-in">
          {Array.from({ length: slats }).map((_, i) => (
            <motion.div
              key={`in-${i}`}
              className="absolute bg-[#090909]"
              style={{
                top: `${i * (100 / slats)}%`,
                left: 0,
                right: 0,
                height: `${100 / slats}%`,
                transformStyle: "preserve-3d",
              }}
              initial={{
                scaleY: 0,
                rotateX: 90,
              }}
              animate={{
                scaleY: 0,
                rotateX: 90,
              }}
              exit={{
                scaleY: 1,
                rotateX: 0,
              }}
              transition={{
                duration: 0.5,
                delay: i * 0.05,
                ease: [0.65, 0, 0.35, 1],
              }}
            />
          ))}
        </div>
      </div>
    );
  };
};

export default RoutingTransition;

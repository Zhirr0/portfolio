import { useScroll } from "framer-motion";
import { motion } from "motion/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { bottomWavePath1, bottomWavePath2 } from "./paths/bottomWavePath";
import {
  VIEWPORT,
  OFFSET_CLAMP,
  math,
  deriveParams,
  deriveScale,
  deriveTextData,
} from "../../config/bottomWave.config";

export default function BottomWave({ heroContainer }) {
  const container = useRef(null);
  const texts = useRef([]);

  const [scale, setScale] = useState(() => {
    if (typeof window === "undefined") return 130;
    return deriveScale(window.innerWidth);
  });

  const [params, setParams] = useState(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : VIEWPORT.MAX;
    return deriveParams(w);
  });

  const computeTextData = useCallback((p) => deriveTextData(p), []);

  const [textData, setTextData] = useState(() => computeTextData(params));

  const { scrollYProgress } = useScroll({
    target: heroContainer,
    offset: ["start end", "end start"],
  });

  // resizer
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      const newScale = deriveScale(width);
      const newParams = deriveParams(width);
      const newTextData = computeTextData(newParams);

      setScale(newScale);
      setParams(newParams);
      setTextData(newTextData);

      texts.current.forEach((element, i) => {
        if (!element) return;
        const raw = newParams.base + i * newParams.spacing;
        const clamped = math.clamp(raw, OFFSET_CLAMP.MIN, OFFSET_CLAMP.MAX);
        element.setAttribute("startOffset", `${clamped}%`);
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [computeTextData]);

  // hadnling scroll
  useEffect(() => {
    if (!scrollYProgress) return;

    const unsubscribe = scrollYProgress.on("change", (progress) => {
      texts.current.forEach((element, i) => {
        if (!element) return;

        const raw =
          params.base + i * params.spacing + progress * params.movement;

        const clamped = math.clamp(raw, OFFSET_CLAMP.MIN, OFFSET_CLAMP.MAX);

        element.setAttribute("startOffset", `${clamped}%`);
      });
    });

    return () => unsubscribe();
  }, [scrollYProgress, params]);

  return (
    <motion.div className="relative w-full h-[458px]">
      <svg
        ref={container}
        className="bottom-wave-svg absolute mt-20 -translate-y-10 w-full top-50 sm:top-40 md:top-40 lg:top-40"
        style={{ transform: `scale(${scale / 100})` }}
        viewBox="0 0 2231 458"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d={bottomWavePath1} fill="#242424" />
        <path id="path" d={bottomWavePath2} fill="none" />

        <text letterSpacing="5px" fontFamily="Zen Antique Soft" fill="#fff">
          {textData.map(({ offset, text }, i) => (
            <textPath
              key={i}
              ref={(ref) => (texts.current[i] = ref)}
              startOffset={offset}
              fontSize={35}
              href="#path"
            >
              {text}
            </textPath>
          ))}
        </text>
      </svg>
    </motion.div>
  );
}

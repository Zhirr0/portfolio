import { useEffect, useRef, useState } from "react";
import { githubpath1, githubpath2 } from "./paths/gitHubPaths.js";
import "../../styles/githubSvg.css";

const GitHub = () => {
  const githubUrl = "https://github.com/Zhirr0";
  const svgRef = useRef(null);
  const path1Ref = useRef(null);
  const path2Ref = useRef(null);
  const [svgSize, setSvgSize] = useState(130);

  useEffect(() => {
    const updateSvgSize = () => {
      const width = window.innerWidth;
      
     if (width < 1024) {
        setSvgSize(130);
      } else {
        setSvgSize(130);
      }
    };

    updateSvgSize();

    window.addEventListener("resize", updateSvgSize);

    return () => {
      window.removeEventListener("resize", updateSvgSize);
    };
  }, []);

  useEffect(() => {
    const svg = svgRef.current;

    const onClick = () => {
      window.open(githubUrl, "_blank", "noopener,noreferrer");
    };

    const onKeyDown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    };

    svg.addEventListener("click", onClick);
    svg.addEventListener("keydown", onKeyDown);

    return () => {
      svg.removeEventListener("click", onClick);
      svg.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      width={svgSize}
      height={svgSize}
      viewBox="0 0 130 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: "pointer" }}
      role="link"
      tabIndex={0}
      aria-label="Open GitHub profile"
      className="github-svg svg-github-animation"
    >
      <path ref={path1Ref} d={githubpath1} fill="#242424" />
      <path
        ref={path2Ref}
        d={githubpath2}
        fill="#fafafa"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  );
};

export default GitHub;
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

const ResizeContainer = () => {
  const boxRef = useRef(null);

  useGSAP(() => {
    const box = boxRef.current;
    if (!box) return;

    const header = box.querySelector("h1");

    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      repeatDelay: 1,
      defaults: { duration: 1, ease: "power3.inOut" },
    });

    // Animate box and text
    tl.to(box, { width: "100px", height: "200px" })
      .to(header, { fontSize: "0.75rem" }, "<")
      .to(box, { width: "166.67px", height: "166.67px" }, "+=1")
      .to(header, { fontSize: "1rem" }, "<")
      .to(box, { width: "300px", height: "150px" }, "+=1")
      .to(header, { fontSize: "1.25rem" }, "<");

  }, []);

  return (
    <div
      ref={boxRef}
      className="change-size flex justify-center items-center bg-[#EDEFF5] h-[150px] w-[300px] rounded-xl"
    >
      <div className="header-container-resize">
        <h1 className="uppercase font-tan-pearl">Responsive</h1>
      </div>
    </div>
  );
};

export default ResizeContainer;

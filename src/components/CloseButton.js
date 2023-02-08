import React, { useRef } from "react";
import useMousePos from "../hooks/useMousePos";
import { adjustedLocation, styler } from "../utils";
const distance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
const CloseButton = ({ fill = "navy-green", onClick = () => {} }) => {
  const ref = useRef();
  const stateRef = useRef({
    hover: false,
    xPos: 0,
    yPos: 0,
    animationId: null,
  });
  useMousePos((mouseX, mouseY) => {
    if (ref) {
      const { width, left, top, height } = adjustedLocation(ref);
      const MY = mouseY + window.scrollY;
      const TX = left + width / 2;
      const TY = top + window.scrollY + height / 2;
      const dist = distance(mouseX, MY, TX, TY);
      // distance b/w Mouse and Button -  trigger region
      if (dist < width) {
        const easeIn = 1 - dist / 100;
        const x = (mouseX - TX) * easeIn;
        const y = (MY - TY) * easeIn;
        cancelAnimationFrame(stateRef.current.animationId);
        stateRef.current.animationId = requestAnimationFrame(() => {
          ref.current.style = `transform: translate3d(${x / 2}px, ${y / 2}px, 0);transition:none;`;
        });
      } else {
        ref.current.style = `translate3d(0, 0, 0);transition:all 0.75s ease-out;`;
      }
    }
  });
  return (
    <div ref={ref} className={styler(["close-button", "button-" + fill])} onClick={onClick}>
      <div>
        <span />
        <span />
      </div>
    </div>
  );
};

export default CloseButton;

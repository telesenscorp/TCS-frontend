import React, { useRef, useState, useContext } from "react";
import { useSelector } from "react-redux";
import useMousePos from "../hooks/useMousePos";
import PointerContext, {mouseEvents, types} from "./pointer/Context";
import { adjustedLocation } from "../utils";
const distance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
function StickyButton({ children, className }) {
  const context = useContext(PointerContext);
  const boxRef = useRef(null);
  const buttonRef = useRef(null);
  const { mobileBrowser } = useSelector(({ layout }) => layout);
  const [stateRef] = useState({ animationId: null, charge: 9 });
  useMousePos((mouseX, mouseY) => {
    if (buttonRef && !mobileBrowser) {
      const { width, left, top, height } = adjustedLocation(boxRef);
      const TX = left + width / 2;
      const TY = top + height / 2;
      const dist = distance(mouseX, mouseY, TX, TY);
      if (dist < width / 2 + 20) {
        if (stateRef.charge > 4) {
          stateRef.charge -= 1;
        }
        const x = (mouseX - TX) / stateRef.charge;
        const y = (mouseY - TY) / stateRef.charge;
        cancelAnimationFrame(stateRef.animationId);
        stateRef.animationId = requestAnimationFrame(() => {
          buttonRef.current.style = `transform: translate(${x}px, ${y}px);transition:none;animation:none;`;
        });
      } else {
        stateRef.charge = 9;
        buttonRef.current.style = `translate(0, 0);transition:all 0.75s ease-out;`;
      }
    }
  });
  return (
    <div ref={boxRef} className={`btn-box ${className}`} {...mouseEvents(context, types.link)}>
      <div ref={buttonRef} className="btn-joint">
        {children}
      </div>
    </div>
  );
}
export default StickyButton;

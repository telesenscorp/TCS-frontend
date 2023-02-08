import { useEffect, useRef, useState } from "react";
const useMousePos = (fn = () => {}) => {
  const pos = useRef({
    mouseX: null,
    mouseY: null,
  });
  const [mousePosition, setMousePosition] = useState({
    mouseX: null,
    mouseY: null,
  });

  useEffect(() => {
    const updateMousePosition = ({ clientX, clientY }) => {
      // setMousePosition({ mouseX: clientX, mouseY: clientY });
      pos.current = {
        mouseX: clientX,
        mouseY: clientY,
      };
      fn(clientX, clientY);
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return pos;
};
export default useMousePos;

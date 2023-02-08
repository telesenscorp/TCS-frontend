import React, { useContext, useEffect, useLayoutEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { ReactComponent as PointerSvg } from "../../assets/pointer.svg";
import PointerContext from "./Context";
const Pointer = () => {
  const location = useLocation();
  const { mobileBrowser } = useSelector(({ layout }) => layout);
  return mobileBrowser || location.pathname === "/ap" ? null : <PointerComponent />;
};
const PointerComponent = () => {
  const { type, setType } = useContext(PointerContext);
  const secondaryCursor = useRef(null);
  const mainCursor = useRef(null);
  const outerCircle = useRef(null);
  const positionRef = useRef({
    mouseX: 0,
    mouseY: 0,
    destinationX: 0,
    destinationY: 0,
    distanceX: 0,
    distanceY: 0,
    key: -1,
  });

  useEffect(() => {
    const animating = ({ clientX, clientY }) => {
      if (!mainCursor.current) return null;
      positionRef.current.mouseX = clientX;
      positionRef.current.mouseY = clientY;
      mainCursor.current.style.transform = `translate(${clientX}px, ${clientY}px)`;
    };
    document.addEventListener("mousemove", animating);
    const followMouse = () => {
      if (!mainCursor.current) return null;
      cancelAnimationFrame(positionRef.current.key);
      const { mouseX, mouseY, destinationX, destinationY } = positionRef.current;
      let distX = mouseX - destinationX;
      let distY = mouseY - destinationY;
      let dir = (Math.atan2(distY, distX) / Math.PI) * 180;
      if (!destinationX || !destinationY) {
        positionRef.current.destinationX = mouseX;
        positionRef.current.destinationY = mouseY;
      } else {
        if (Math.abs(distX) + Math.abs(distY) < 0.1) {
          positionRef.current.destinationX = mouseX;
          positionRef.current.destinationY = mouseY;
        } else {
          positionRef.current.destinationX += distX * 0.1;
          positionRef.current.destinationY += distY * 0.1;
        }
      }
      secondaryCursor.current.style.transform = `translate(${destinationX}px, ${destinationY}px) rotate(${dir}deg)`;
      outerCircle.current.style.transform = `translate(-50%,-50%) scaleX(${1 - Math.min((Math.abs(distX) + Math.abs(distY)) / 100, 0.5)})`;
      positionRef.current.key = requestAnimationFrame(followMouse);
    };
    followMouse();
    return () => {
      document.removeEventListener("mousemove", animating);
    };
  }, []);
  useLayoutEffect(() => {
    const changeType = () => {
      if (type !== "default" && type !== "") {
        setType("default");
      }
    };
    document.addEventListener("wheel", changeType);
    return () => {
      document.removeEventListener("wheel", changeType);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div id="cursor" className={`cursor-wrapper ${type}`}>
      <div className="main-cursor" ref={mainCursor}>
        <div className="main-cursor-background">
          <PointerSvg />
        </div>
      </div>
      <div className="secondary-cursor" ref={secondaryCursor}>
        <div className="cursor-background" ref={outerCircle} />
      </div>
    </div>
  );
};

export default Pointer;

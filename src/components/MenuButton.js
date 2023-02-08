import React, { useLayoutEffect, useRef, useState, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideMenu, toggleMenu } from "../configuration/redux/Layout.slice";
import useMousePos from "../hooks/useMousePos";
import { adjustedLocation, styler } from "../utils";
import PointerContext, { mouseEvents, types } from "./pointer/Context";

const keys = { 32: 1, 33: 1, 34: 1, 35: 1, 36: 1, 37: 1, 38: 1, 39: 1, 40: 1 };
const distance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
const MenuButton = ({ color = "white" }) => {
  const context = useContext(PointerContext);
  const dispatch = useDispatch();
  const textRef = useRef();
  const ref = useRef();
  const [stateRef] = useState({ animationId: null });
  const { visible } = useSelector(({ layout }) => layout.menu);
  const { mobileBrowser, wheelEvent, wheelOpt } = useSelector(({ layout }) => layout);
  useMousePos((mouseX, mouseY) => {
    if (ref && !mobileBrowser) {
      const { width, left, top, height } = adjustedLocation(ref);
      const MY = mouseY + window.scrollY;
      const TX = left + width / 2;
      const TY = top + height / 2;
      const dist = distance(mouseX, MY, TX, TY);
      // distance b/w Mouse and Button -  trigger region
      if (dist < width) {
        const easeIn = 1 - dist / 100;
        const x = (mouseX - TX) * easeIn;
        const y = (MY - TY) * easeIn;
        cancelAnimationFrame(stateRef.animationId);
        stateRef.animationId = requestAnimationFrame(() => {
          ref.current.style = `transform: translate(${x / 2}px, ${y / 2}px);transition:none;`;
          textRef.current.style = `transform: translate(${x}px, ${y}px);transition:all 0.75s ease-out;`;
        });
      } else {
        ref.current.style = `translate(0, 0);transition:all 0.75s ease-out;`;
        textRef.current.style = `translate(0, 0);transition:all 0.75s ease-out;`;
      }
    }
  });

  const handleClick = () => {
    const btnOff = mobileBrowser ? 20 : 0; //button offset
    const { x, y } = ref.current.getBoundingClientRect();
    dispatch(visible ? hideMenu() : toggleMenu({ x: x - btnOff, y: y - btnOff }));
  };

  useLayoutEffect(() => {
    function preventDefault(e) {
      if (visible) e.preventDefault();
    }
    function preventDefaultForScrollKeys(e) {
      if (visible && keys[e.keyCode]) {
        preventDefault(e);
        return false;
      }
    }
    window.addEventListener(wheelEvent, preventDefault, wheelOpt);
    window.addEventListener("touchmove", preventDefault, wheelOpt);
    window.addEventListener("keydown", preventDefaultForScrollKeys, false);
    return () => {
      window.removeEventListener(wheelEvent, preventDefault);
      window.removeEventListener("touchmove", preventDefault);
      window.removeEventListener("keydown", preventDefaultForScrollKeys);
    };
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div id="header-menu">
      <div
        ref={ref}
        className={styler(["menu-button", "bg-" + color, { ["bordered-" + color]: visible }])}
        onClick={handleClick}
        {...mouseEvents(context, types.link)}>
        <div ref={textRef} className="menu-bar">
          <div className={`menu-check ${visible ? "active" : ""}`}>
            <span className={`contrast-bg-${color}`} />
            <span className={`contrast-bg-${color}`} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuButton;

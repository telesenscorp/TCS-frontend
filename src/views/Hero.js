import React, { useEffect, useId, useRef } from "react";
import { useSelector } from "react-redux";
import { StickyButton, Text } from "../components";
import { Post } from "../configuration/server";
import { imgURL } from "../utils";
function Hero({
  text = "",
  desc = "",
  bg = "navy-green",
  color = "white",
  getInTouch,
  wallpaper,
  scrollColor,
  scrollLabel,
  wallpaperStyle,
}) {
  const ID = useId();
  const ref = useRef(null);
  const textRef = useRef(null);
  const descRef = useRef(null);
  const { layout, user } = useSelector((state) => state);
  const sendClickEvent = () => {
    const { ip, locale, location } = user;
    Post("createEvent", {
      ip: ip || "unknown",
      locale: locale || "ua",
      location: location || "unknown",
      type: 0,
      event: "click",
      mode: layout.widthType,
      browser: window.navigator.userAgent,
    });
  };
  useEffect(() => {
    const animating = () => {
      try {
        ref.current.style.opacity = 1 - window.pageYOffset / 300;
        textRef.current.style.opacity = 1 - window.pageYOffset / 600;
      } catch (error) {
        console.warn("animating ~ error", error);
      }
    };
    window.addEventListener("scroll", animating);
    return () => {
      window.removeEventListener("scroll", animating);
    };
  }, []);
  return (
    <section id={ID} className="width-wrapper">
      <div className="full-size background-img floor-1" style={imgURL(wallpaper, wallpaperStyle)} />
      <div className={`hero-root full-width bg-${bg}`}>
        <div className="block container wrap-word">
          <div className="motto">
            <Text type="H2" color={color}>
              {text}
            </Text>
          </div>
          <div className="hero-desc">
            <StickyButton className="hero-button">
              <a className="pulse" href="#contact-us" onClick={sendClickEvent}>
                <div id="floating-pointer" style={imgURL(getInTouch)} />
              </a>
            </StickyButton>
            <div className="description">
              <Text color={color} ref={descRef}>
                {desc}
              </Text>
            </div>
          </div>
          <div ref={textRef} className="scroll-text frc">
            <Text type="Button" italic color={scrollColor}>
              {scrollLabel}
            </Text>
            <svg width="6" height="24" viewBox="0 0 6 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3 24L5.88675 19L0.113246 19L3 24ZM2.5 -6.55671e-08L2.5 19.5L3.5 19.5L3.5 6.55671e-08L2.5 -6.55671e-08Z"
                className={"fill-" + scrollColor}
              />
            </svg>
          </div>
        </div>
        <div ref={ref} className={`scroll-down scroll-${scrollColor}`} />
      </div>
    </section>
  );
}
export default Hero;

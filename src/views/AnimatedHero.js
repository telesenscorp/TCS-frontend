import React, { useEffect, useId, useRef } from "react";
import { useSelector } from "react-redux";
import { StickyButton, Text } from "../components";
import { Post } from "../configuration/server";
import { imgURL } from "../utils";
function AnimatedHero({
  text = "",
  desc = "",
  bg = "navy-green",
  color = "white",
  getInTouch,
  wallpaper,
  scrollColor,
  scrollLabel,
  wallpaperStyle = "rgba(3, 166, 90, 0.3)/#152D31",
}) {
  const ID = useId();
  const ref = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const descRef = useRef(null);
  const { wheelEvent, wheelOpt, widthType } = useSelector(({ layout }) => layout);
  const { ip, locale, location } = useSelector(({ user }) => user);
  const [colorFrom, colorTo] = wallpaperStyle.split("/");
  const sendClickEvent = () => {
    Post("createEvent", {
      ip: ip || "unknown",
      locale: locale || "ua",
      location: location || "unknown",
      type: 0,
      event: "click",
      mode: widthType,
      browser: window.navigator.userAgent,
    });
  };
  useEffect(() => {
    function animating() {
      try {
        ref.current.style.opacity = 1 - window.pageYOffset / 300;
        textRef.current.style.opacity = 1 - window.pageYOffset / 600;
      } catch (error) {
        console.warn("animating ~ error", error);
      }
    }
    function parallax(e) {
      imageRef.current.previousElementSibling.style.backgroundImage = `radial-gradient(circle at ${(e.pageX / window.innerWidth) * 100}% ${
        (e.pageY / window.innerHeight) * 100
      }%, ${colorFrom} 0px, ${colorTo} 600px)`;
      imageRef.current.style.backgroundPosition = `${50 - (e.clientX - window.innerWidth / 2) * -0.05}% ${
        50 - (e.clientY - window.innerHeight / 2) * -0.05
      }%`;
    }
    window.addEventListener("scroll", animating);
    window.addEventListener("mousemove", parallax);
    window.addEventListener(wheelEvent, parallax, wheelOpt);
    return () => {
      window.removeEventListener("scroll", animating);
      window.removeEventListener("mousemove", parallax);
      window.removeEventListener(wheelEvent, parallax);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <section id={ID} className="width-wrapper">
      <div
        className="full-size floor-2"
        style={{ backgroundImage: `radial-gradient(circle at 0% 0%, ${colorFrom} 0px, ${colorTo} 600px)` }}
      />
      <div ref={imageRef} className="full-size floor-3 parallax-background-img" />
      <div className="full-size floor-4" style={{ backgroundColor: colorTo }} />
      {/* <div className="background-img" style={imgURL(wallpaper, wallpaperStyle)} /> */}
      <div className={`hero-root full-width`}>
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
export default AnimatedHero;

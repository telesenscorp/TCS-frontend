import { useContext, useEffect, useId, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { content } from "../../common/translator.js";
import { Image, Link, Text } from "../../components";
import PointerContext, { mouseEvents, types } from "../../components/pointer/Context";
import { toPath, uniqueId } from "../../utils";
function clamp(value, lower, upper) {
  if (value > upper) return upper;
  if (value < lower) return lower;
  return value;
}
const initialState = {
  pressed: false,
  startX: 0,
  startLeft: 0,
  transformAmount: 0,
  animationId: 0,
  clickX: -1,
  slideWidth: 0,
  busy: false,
  selected: 0,
};
export default function Main({ sbw, heading, products, bg = "grey-blue", color, sideBg = "grey-blue", sideColor, hoverColor }) {
  const ID = useId();
  const { locale } = useSelector(({ user }) => user);
  const context = useContext(PointerContext);
  let navigate = useNavigate();
  const len = products.length;
  const slider = useRef(null);
  const imagesRef = useRef([]);
  const idTimer = useRef(null);
  const [state, setState] = useState({ ...initialState });
  const imageRotator = () => {
    try {
      const { x, width } = slider.current.getBoundingClientRect();
      const pos = Math.abs((x - sbw) / (width / len));
      imagesRef.current.forEach((el, i) => {
        el.style = `transform: rotate(${(pos - i) * 5}deg)`;
      });
      return x;
    } catch (error) {
      console.warn("imageRotator ~ error", error);
      return 0;
    }
  };
  const mouseDown = ({ pageX }) => {
    try {
      idTimer.current = setTimeout(() => context.setSwiping(types.whiteSwipe, true), 200);
      window.addEventListener("mouseup", mouseUp, { once: true });
      state.pressed = true;
      state.clickX = Math.floor(pageX);
      const { x, width } = slider.current.getBoundingClientRect();
      state.startX = x - pageX - sbw;
      state.slideWidth = width / len;
      state.startLeft = x - sbw;
      cancelMomentumTracking();
    } catch (error) {
      console.warn("mouseDown ~ error", error);
    }
  };
  const mouseUp = ({ pageX }) => {
    clearTimeout(idTimer.current);
    context.setSwiping();
    if (Math.floor(pageX) === state.clickX && context.type.includes("pointer")) {
      state.pressed = false;
      return null;
    }
    if (state.pressed) {
      state.pressed = false;
      const offset = Math.abs(pageX - state.clickX) > 250 ? Math.sign(pageX - state.clickX) : 0;
      const dir = Math.round(state.startLeft / state.slideWidth) + offset;
      state.selected = clamp(dir, -len + 1, 0);
      state.transformAmount = clamp(dir, -len + 1, 0) * state.slideWidth;
      beginMomentumTracking();
    }
  };
  const mouseMove = ({ pageX, pointerId }) => {
    if (state.pressed) {
      if (context.type === types.default) {
        context.setType(types.whiteSwipe);
      }
      if (!slider.current.hasPointerCapture(pointerId)) {
        slider.current.setPointerCapture(pointerId);
      }
      imageRotator();
      slider.current.style.transform = `translateX(${state.startX + pageX}px)`;
    }
  };
  const beginMomentumTracking = () => {
    cancelMomentumTracking();
    state.animationId = requestAnimationFrame(momentumLoop);
  };
  const cancelMomentumTracking = () => {
    cancelAnimationFrame(state.animationId);
  };
  const momentumLoop = () => {
    try {
      const x = imageRotator();
      const value = (x - sbw - state.transformAmount) * 0.2;
      slider.current.style.transform = `translateX(${x - sbw - value}px)`;
      if (Math.abs(value) > 0.1) {
        state.animationId = requestAnimationFrame(momentumLoop);
      } else {
        slider.current.style.transform = `translateX(${state.transformAmount}px)`;
      }
    } catch (error) {
      console.warn("momentumLoop ~ error", error);
    }
  };
  const handleNavigation = (to, { pageX }, title) => {
    if (Math.floor(pageX) === state.clickX) {
      navigate(toPath(to), { state: title });
    }
  };

  function wheelSlide({ wheelDeltaX }) {
    if (!state.busy && Math.abs(wheelDeltaX) > 50) {
      const dir = state.selected + Math.sign(wheelDeltaX);
      if (dir <= 0 && dir > -len) {
        state.busy = true;
        state.selected = dir;
        state.transformAmount = dir * state.slideWidth;
        setTimeout(() => {
          state.busy = false;
        }, 1000);
        beginMomentumTracking();
      }
    }
  }

  useEffect(() => {
    const Target = slider.current;
    setState({ ...initialState });
    Target.style.transform = `translateX(0px)`;
    imageRotator();
    const { width } = Target.getBoundingClientRect();
    state.slideWidth = width / len;
    Target.addEventListener("wheel", wheelSlide);
    return () => Target.removeEventListener("wheel", wheelSlide);
  }, [locale]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section id={ID} className="width-wrapper">
      <div className={`bg-${bg} slider-container`}>
        <div className={`slider-side-bar bg-${sideBg}`}>
          <Text type="Sub" color={sideColor} bold>
            {heading}
          </Text>
        </div>
        <div ref={slider} className="services-slider" onPointerDown={mouseDown} onPointerMove={mouseMove}>
          {products.map(({ url, title, to }, i) => (
            <div key={uniqueId(i)} className="product-card">
              <div className="product-desc">
                <div
                  ref={(r) => (imagesRef.current[i] = r)}
                  onClick={(e) => handleNavigation(to, e, title)}
                  className="product-image"
                  {...mouseEvents(context, types.whitePointer)}>
                  <Image lazy {...{ url, label: title }} />
                </div>
                <Link label={content.showMore[locale]} color={color} after={hoverColor} to={to} />
              </div>
              <div className="pager" {...mouseEvents(context, types.whiteSwipe)} />
              <div className="product-title" onClick={(e) => handleNavigation(to, e, title)} {...mouseEvents(context, types.whitePointer)}>
                <Text type="H2" color={color}>
                  {title}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

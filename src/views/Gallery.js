import _ from "lodash";
import { useContext, useEffect, useId, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Image, Text } from "../components";
import PointerContext, { mouseEvents, types } from "../components/pointer/Context";
import { parseHtml, uniqueId } from "../utils";

function clamp(value, lower, upper) {
  if (value > upper) return upper;
  if (value < lower) return lower;
  return value;
}
function GalleryMobile({ items, innerHeading, bg = "grey-blue", color, sideColor, scaleType = "cover" }) {
  const ID = useId();
  const ref = useRef([]);
  const slider = useRef(null);
  const refresh = useState(0)[1];
  const { locale } = useSelector(({ user }) => user);
  const { contentVersion } = useSelector(({ layout }) => layout);
  useEffect(() => {
    if (ref.current.length) {
      ref.current.forEach((el, i) => {
        el.innerHTML = parseHtml(items[i].desc, false, items[i].links);
        const links = el.querySelectorAll("a");
        links.forEach((el) => {
          el.classList.add(`color-${color}`);
        });
      });
    }
    slider.current.scrollLeft = 0;
    refresh(_.now());
  }, [contentVersion, locale]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <section id={ID} className="width-wrapper">
      <div className={`bg-${bg} wide-gallery-mob-root`}>
        <Text color={sideColor} className="gallery-heading" italic>
          {innerHeading}
        </Text>
        <div ref={slider} className="wide-gallery-mob-slider hsh">
          {items.map(({ title, desc, url, urlMobile }, i) => (
            <div key={uniqueId(i)} className="wide-gallery-card">
              <Image lazy className={`wide-gallery-image ${scaleType}`} url={urlMobile || url} label={title} />
              <Text className="semi-bold" color={color} mb="8">
                {title}
              </Text>
              <Text ref={(el) => (ref.current[i] = el)} type="Button" color={color}>
                {desc}
              </Text>
            </div>
          ))}
          <div className="spacer" />
        </div>
      </div>
    </section>
  );
}
function GalleryFull({
  sbw = 360,
  heading,
  items,
  innerHeading,
  bg = "grey-blue",
  color,
  sideBg = "grey-blue",
  sideColor,
  scaleType = "cover",
}) {
  const ID = useId();
  const context = useContext(PointerContext);
  const { locale } = useSelector(({ user }) => user);
  const len = items.length;
  const slider = useRef(null);
  const ref = useRef([]);
  const refresh = useState(0)[1];
  const [state] = useState({
    pressed: false,
    startX: 0,
    posX: 0,
    initX: -1,
    selected: 0,
    busy: false,
    slideWidth: 1050,
  });
  const mouseDown = ({ pageX }) => {
    slider.current.style.transition = "none";
    context.setSwiping(types.whiteSwipe, true);
    window.addEventListener("mouseup", mouseUp, { once: true });
    let posX = slider.current.getBoundingClientRect().x - sbw;
    state.pressed = true;
    state.initX = pageX;
    state.posX = posX;
    state.startX = posX - pageX;
  };
  const mouseUp = ({ pageX }) => {
    context.setSwiping();
    if (state.pressed) {
      state.pressed = false;
      const offset = Math.abs(pageX - state.initX) > 250 ? Math.sign(pageX - state.initX) : 0;
      const dir = Math.floor(state.posX / state.slideWidth) + offset;
      state.selected = clamp(dir, -len + 1, 0);
      slider.current.style.transition = "transform 0.3s ease-out";
      slider.current.style.transform = `translateX(${clamp(dir, -len + 1, 0) * state.slideWidth}px)`;
    }
  };
  const mouseMove = ({ pageX, pointerId }) => {
    if (!state.pressed) {
      if (context.type === types.default) {
        context.setType(types.whiteSwipe);
      }
      return;
    }
    if (!slider.current.hasPointerCapture(pointerId)) {
      slider.current.setPointerCapture(pointerId);
    }
    slider.current.style.transform = `translateX(${state.startX + pageX}px)`;
  };
  function wheelSlide({ wheelDeltaX }) {
    if (!state.busy && Math.abs(wheelDeltaX) > 50) {
      const dir = state.selected + Math.sign(wheelDeltaX);
      if (dir <= 0 && dir > -len) {
        state.selected = clamp(dir, -len + 1, 0);
        slider.current.style.transition = "transform 0.3s ease-out";
        slider.current.style.transform = `translateX(${clamp(dir, -len + 1, 0) * state.slideWidth}px)`;
        state.busy = true;
        setTimeout(() => {
          state.busy = false;
        }, 1500);
      }
    }
  }
  useEffect(() => {
    const Target = slider.current;
    if (ref.current.length) {
      ref.current.forEach((el, i) => {
        el.innerHTML = parseHtml(items[i].desc, false, items[i].links);
        const links = el.querySelectorAll("a");
        links.forEach((el) => {
          el.classList.add(`color-${color}`);
          el.addEventListener("pointerenter", (e) => {
            if (!context.swiping) {
              e.stopPropagation();
              context.setType(types.link);
            }
          });
          el.addEventListener("pointermove", (e) => {
            if (context.type !== types.link && !context.swiping) {
              e.stopPropagation();
              context.setType(types.link);
            }
          });
          el.addEventListener("pointerleave", (e) => {
            if (context.type !== types.default) {
              state.pressed = false;
              e.stopPropagation();
              context.setType(types.default);
            }
          });
        });
      });
    }
    Target.style.transform = `translateX(0px)`;
    refresh(_.now());
    Target.addEventListener("wheel", wheelSlide);
    return () => Target.removeEventListener("wheel", wheelSlide);
  }, [items, locale]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section id={ID} className="width-wrapper">
      <div className={`bg-${bg} slider-container`}>
        <div className={`slider-side-bar bg-${sideBg}`}>
          <Text color={sideColor} type="Sub" bold>
            {heading}
          </Text>
        </div>
        <div className="wide-gallery-root">
          <Text type="H2" color={color} className="gallery-heading" italic>
            {innerHeading}
          </Text>
          <div
            ref={slider}
            className="wide-gallery-slider"
            {...mouseEvents(context, types.whiteSwipe)}
            onPointerDown={mouseDown}
            onPointerMove={mouseMove}>
            {items.map(({ title, desc, url }, i) => (
              <div key={uniqueId(i)} className="wide-gallery-card">
                <Image lazy className={`wide-gallery-image ${scaleType}`} url={url} label={title} />
                <Text type="Sub2" mb="12" color={color}>
                  {title}
                </Text>
                <Text ref={(el) => (ref.current[i] = el)} color={color}>
                  {desc}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Gallery(props) {
  const { mobileBrowser, sideBarWidth } = useSelector(({ layout }) => layout);
  return mobileBrowser ? <GalleryMobile {...props} /> : <GalleryFull {...props} sbw={sideBarWidth} />;
}

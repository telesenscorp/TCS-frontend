import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Card, Text } from "..";
import { styler, uniqueId } from "../../utils";
import PointerContext, { types } from "../pointer/Context";
const getX = (t) => parseFloat(t.style.transform.slice(11));
const slideWidth = { full: 420, mob: 342 };
function CardsTreeMobile({ heading, products = [], selected, parentItem, options, onChange }) {
  const slider = useRef(null);
  const [state] = useState({ index: 0 });
  const slideToIndex = (pos) => {
    slider.current.scrollTo({ left: slideWidth.mob * pos, behavior: "smooth" });
  };
  const longFace = products.every(({ pointer }) => /^:end/.test(pointer));
  const { current, next } = options;

  useEffect(() => {
    const index = products.findIndex((p) => p.id === selected);
    slider.current.scrollLeft = 0;
    slideToIndex(index > 0 ? index : 0);
  }, [products]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="services-mob">
      <div
        id="cards-tree"
        className={styler(["bg-" + current.bg, { "shelf-content-mob": heading || parentItem?.secTitle || parentItem?.secDesc }])}>
        <Text hideIfEmpty className="medium" type="Cap" color={current.color} mb="6">
          {heading}
        </Text>
        <Text hideIfEmpty type="H-mob" mb="32" color={current.color}>
          {parentItem?.secTitle || ""}
        </Text>
        <Text hideIfEmpty type="Button" color={current.color}>
          {parentItem?.secDesc || ""}
        </Text>
      </div>
      <div ref={slider} className={`services-tree-mob hsh bg-${current.bg}`}>
        <div className="flex-row">
          {products.map((props, i) => (
            <Card
              isMobile
              key={uniqueId(i)}
              {...props}
              bg={next.bg}
              square={longFace}
              color={current.color}
              ending={/^:end/.test(props.pointer)}
              selected={props.id === selected}
              onClick={() => {
                slideToIndex(i);
                onChange(props);
                state.index = i;
              }}
            />
          ))}
          <div className="f1">
            <div className="ending-spacer"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
function CardsTreeFull({ sbw, heading, products = [], selected, parentItem, options, onChange }) {
  const context = useContext(PointerContext);
  const slider = useRef(null);
  const sliderContainer = useRef(null);
  const [state] = useState({
    pressed: false,
    startX: 0,
    startLeft: 0,
    transformAmount: 0,
    animationId: 0,
    swiping: false,
    index: 0,
    busy: false,
    selected: 0,
  });
  const len = products.length;
  const mouseDown = ({ pageX }) => {
    context.setSwiping(types.whiteSwipe, true);
    state.pressed = true;
    const { x } = slider.current.getBoundingClientRect();
    state.startX = x - pageX - sbw;
    cancelMomentumTracking();
  };
  const mouseUp = ({ pointerId }) => {
    slider.current.releasePointerCapture(pointerId);
    context.setSwiping();
    if (state.pressed) {
      state.pressed = false;
      const x = getX(slider.current);
      const maxPosition = (len - 1) * slideWidth.full;
      state.transformAmount =
        x > 0 ? 0 : Math.abs(x) > maxPosition ? maxPosition : Math.round(Math.abs(x) / slideWidth.full) * slideWidth.full;
      beginMomentumTracking();
    }
  };
  const mouseMove = ({ pageX, pointerId }) => {
    if (!state.pressed) return;
    if (!slider.current.hasPointerCapture(pointerId)) {
      slider.current.setPointerCapture(pointerId);
    }
    state.swiping = true;
    slider.current.style.transform = `translateX(${state.startX + pageX}px)`;
  };
  const slideToIndex = (pos) => {
    state.pressed = false;
    state.transformAmount = pos * slideWidth.full;
    state.selected = pos;
    beginMomentumTracking();
  };
  const beginMomentumTracking = () => {
    cancelMomentumTracking();
    state.animationId = requestAnimationFrame(momentumLoop);
  };
  const cancelMomentumTracking = () => {
    cancelAnimationFrame(state.animationId);
  };
  const momentumLoop = () => {
    const x = getX(slider.current);
    const value = (x + state.transformAmount) * 0.2;
    slider.current.style.transform = `translateX(${x - value}px)`;
    if (Math.abs(value) > 0.2) {
      state.animationId = requestAnimationFrame(momentumLoop);
    }
  };
  function wheelSlide({ wheelDeltaX }) {
    if (!state.busy && Math.abs(wheelDeltaX) > 50) {
      const dir = -(state.transformAmount / slideWidth.full) + Math.sign(wheelDeltaX);
      if (dir <= 0 && dir > -len) {
        state.busy = true;
        setTimeout(() => {
          state.busy = false;
        }, 1000);
        slideToIndex(-dir);
      }
    }
  }
  useEffect(() => {
    const Target = sliderContainer.current;
    slider.current.style.transform = `translateX(0px)`;
    Target.addEventListener("wheel", wheelSlide);
    return () => Target.removeEventListener("wheel", wheelSlide);
  }, [products]);
  const longFace = products.every(({ pointer }) => /^:end/.test(pointer));
  const { current, next } = options;
  return (
    <div className="flex-col">
      <div id="cards-tree" className={`shelf-content bg-${current.bg}`}>
        <Text hideIfEmpty type="H3" italic color={current.color}>
          {parentItem?.secTitle || ""}
        </Text>
        <Text hideIfEmpty color={current.color}>
          {parentItem?.secDesc || ""}
        </Text>
      </div>
      <div ref={sliderContainer} className={`slider-container bg-${current.bg}`}>
        <div className={`slider-side-bar bg-${current.bg}`}>
          <Text color={current.color} type="Sub">
            {heading}
          </Text>
        </div>
        <div
          ref={slider}
          className="services-slider"
          onPointerDown={mouseDown}
          onPointerMove={mouseMove}
          onPointerCancel={mouseUp}
          onPointerUp={mouseUp}>
          {products.map((props, i) => (
            <Card
              key={uniqueId(i)}
              {...props}
              bg={next.bg}
              square={longFace}
              color={current.color}
              ending={/^:end/.test(props.pointer)}
              selected={props.id === selected}
              onClick={() => {
                slideToIndex(i);
                onChange(props);
                state.index = i;
                state.swiping = false;
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CardsTree(props) {
  const { mobileBrowser, sideBarWidth } = useSelector(({ layout }) => layout);
  return mobileBrowser ? <CardsTreeMobile {...props} /> : <CardsTreeFull sbw={sideBarWidth} {...props} />;
}

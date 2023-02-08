import { useContext, useEffect, useId, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { content } from "../common/translator";
import { Text } from "../components";
import PointerContext, { mouseEvents, types } from "../components/pointer/Context";
import { uniqueId } from "../utils";
function clamp(value, lower, upper) {
  if (value > upper) return upper;
  if (value < lower) return lower;
  return value;
}
export default function Quotes(props) {
  const { mobileBrowser } = useSelector(({ layout }) => layout);
  return mobileBrowser ? <QuotesMobile {...props} /> : <QuotesFull {...props} />;
}
const QuotesFull = ({ quotes, bg = "soft-blue", color = "grey-blue" }) => {
  const ID = useId();
  const context = useContext(PointerContext);
  const { locale } = useSelector(({ user }) => user);
  const len = quotes.length;
  const slider = useRef(null);
  const [stateRef] = useState({
    pressed: false,
    startX: 0,
    posX: 0,
    initX: -1,
    selected: 0,
    busy: false,
    slideWidth: window.innerWidth || document.documentElement.clientWidth,
  });
  const mouseDown = ({ pageX, pointerId }) => {
    slider.current.setPointerCapture(pointerId);
    slider.current.style.transition = "none";
    context.setSwiping(types.greenSwipe, true);
    window.addEventListener("mouseup", mouseUp, { once: true });
    let posX = slider.current.getBoundingClientRect().x;
    stateRef.pressed = true;
    stateRef.initX = pageX;
    stateRef.posX = posX;
    stateRef.startX = posX - pageX;
  };
  const mouseUp = ({ pageX }) => {
    context.setSwiping();
    if (stateRef.pressed) {
      const { slideWidth } = stateRef;
      stateRef.pressed = false;
      const offset = Math.abs(pageX - stateRef.initX) > 250 ? Math.sign(pageX - stateRef.initX) : 0;
      const dir = Math.floor(stateRef.posX / slideWidth) + offset;
      stateRef.selected = clamp(dir, -len + 1, 0);
      slider.current.style.transition = "transform 0.3s ease-out";
      slider.current.style.transform = `translateX(${clamp(dir, -len + 1, 0) * slideWidth}px)`;
    }
  };
  const mouseMove = ({ pageX }) => {
    if (stateRef.pressed) {
      if (context.type === types.default) {
        context.setType(types.greenSwipe);
      }
      slider.current.style.transform = `translateX(${stateRef.startX + pageX}px)`;
    }
  };
  function wheelSlide({ wheelDeltaX }) {
    if (!stateRef.busy && Math.abs(wheelDeltaX) > 50) {
      const dir = stateRef.selected + Math.sign(wheelDeltaX);
      if (dir <= 0 && dir > -len) {
        stateRef.selected = clamp(dir, -len + 1, 0);
        slider.current.style.transition = "transform 0.3s ease-out";
        slider.current.style.transform = `translateX(${clamp(dir, -len + 1, 0) * stateRef.slideWidth}px)`;
        stateRef.busy = true;
        setTimeout(() => {
          stateRef.busy = false;
        }, 1000);
      }
    }
  }

  useEffect(() => {
    const ratio = window.devicePixelRatio || 1;
    if (ratio === 1.25) {
      stateRef.slideWidth *= ratio;
    }
    const Target = slider.current;
    Target.style.transform = `translateX(0px)`;
    Target.addEventListener("wheel", wheelSlide);
    return () => Target.removeEventListener("wheel", wheelSlide);
  }, [locale]);
  return (
    <section id={ID} className="width-wrapper">
      <div className={`quotes bg-${bg}`}>
        <div className="quotes-slider" onPointerDown={mouseDown} onPointerMove={mouseMove} ref={slider}>
          {quotes.map(({ title, desc, author, company }, i) => (
            <div key={uniqueId(i)} className="quote-container">
              <div key="SingleQuote" className="single-quote" {...mouseEvents(context, types.greenSwipe)}>
                <Text italic type="H4" color={color} className="title non-selectable">
                  {title}
                </Text>
                <Text italic color={color} className="description non-selectable">
                  {desc}
                </Text>
                <Text color={color} type="Body2" className="non-selectable">
                  {author}
                </Text>
                <Text color={color} type="Body2" className="non-selectable">
                  {company}
                </Text>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
function QuotesMobile({ quotes, bg = "soft-blue", color = "grey-blue" }) {
  const ID = useId();
  const { locale } = useSelector(({ user }) => user);
  const ref = useRef(null);
  const handleScroll = (e) => {
    let pos = e.target.scrollLeft / window.innerWidth;
    if (pos % 1 === 0) {
      const el = document.getElementById("quote-" + pos);
      e.target.style = `height:${el.clientHeight + 77}px`;
      e.target.scrollLeft = pos * window.innerWidth;
      e.target.parentNode.classList.remove("hint");
    }
  };

  useEffect(() => {
    const el = document.getElementById("quote-0");
    ref.current.style = `height:${el.clientHeight + 77}px`;
    ref.current.scrollLeft = 0;
  }, [locale]);

  return (
    <section id={ID} data-hint={content.quotesHint[locale]} className={`width-wrapper quotes-mob-wrapper hint bg-${bg}`}>
      <div ref={ref} className={`quotes-mob hsh fade-down-${bg}`} onScroll={handleScroll}>
        <div className="flex-row">
          {quotes.map(({ title, desc, author, company }, i) => (
            <div key={uniqueId(i)} className="quote-mob">
              <div key="SingleQuote" className="single-quote">
                <div id={"quote-" + i}>
                  <Text italic type="Sub" color={color} className="title non-selectable">
                    {title}
                  </Text>
                  <Text italic type="Button" color={color} className="description non-selectable">
                    {desc}
                  </Text>
                  <Text color={color} type="Cap" className="non-selectable">
                    {author}
                  </Text>
                  <Text color={color} type="Cap" className="non-selectable">
                    {company}
                  </Text>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

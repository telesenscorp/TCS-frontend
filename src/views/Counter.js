import { useEffect, useId, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Text } from "../components";
import { uniqueId } from "../utils";
import isInViewport from "../utils/isInViewport";

const SingleCounter = ({ target, label, animate, color = "text-primary", speed = 3 }) => {
  const targetRef = useRef(null);
  function animateValue(item, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const count = Math.floor(progress * (end - start) + start);
      item.innerHTML = count > 1000 ? Math.floor(count / 1000) + "K" : count;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
  useEffect(() => {
    if (animate) {
      animateValue(targetRef.current, 0, target, speed * 1000);
    }
  }, [animate]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="f1 single-counter center">
      <div>
        <Text type="H1" italic center color={color}>
          <span ref={targetRef} className="regular">
            0
          </span>
        </Text>
        <Text type="H6" center color={color}>
          {label}
        </Text>
      </div>
    </div>
  );
};

const Counter = ({ counters = [], bg = "soft-blue", color, speed }) => {
  const ID = useId();
  const ref = useRef(null);
  const { locale } = useSelector(({ user }) => user);
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    setAnimate(false);
    const animating = () => {
      try {
        if (ref.current && isInViewport(ref.current).visibleByMargin) {
          window.removeEventListener("scroll", animating);
          setAnimate(true);
        }
      } catch (error) {
        console.warn("animating ~ error", error);
      }
    };
    window.addEventListener("scroll", animating);
    return () => {
      window.removeEventListener("scroll", animating);
    };
  }, [locale]);
  return (
    <section id={ID} className="width-wrapper">
      <div ref={ref} className={`counter full-width row flex center bg-${bg}`}>
        <div className="container">
          {counters.map((props, i) => (
            <SingleCounter animate={animate} key={uniqueId(i)} {...{ ...props, color, speed }} />
          ))}
        </div>
      </div>
    </section>
  );
};
export default Counter;

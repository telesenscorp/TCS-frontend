import { Fragment, useContext, useEffect, useId, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Image, Text } from "../components";
import PointerContext, { types } from "../components/pointer/Context";
import { styler, useDimensions } from "../utils";
const cardWidth = 356;
const IndustriesImage = ({ urlMobile, urlTablet, url, label }) => {
  const { widthType } = useSelector(({ layout }) => layout);
  const src = {
    desktop: url,
    laptop: url,
    tablet: urlTablet,
    mobile: urlMobile,
  };
  return <Image url={src[widthType]} label={label} lazy />;
};
export default function Industries(props) {
  const { mobileBrowser, screenWidth } = useSelector(({ layout }) => layout);
  return mobileBrowser ? <IndustriesMobile {...props} sw={screenWidth} /> : <IndustriesFull {...props} />;
}
const IndustriesMobile = ({ heading = "", cards = [], bg = "light-grey", color, sw }) => {
  const ID = useId();
  const ref = useRef(null);
  const width = document.documentElement.clientWidth > 480 ? 170 : 100;
  const offset = cards.length * width;
  const endScroll = offset * 4 - sw;
  const handleScroll = (e) => {
    let pos = e.target.scrollLeft;
    if (pos === 0) {
      ref.current.scrollLeft = offset;
    } else if (pos > offset * 2) {
      if ((pos / width) % 1 === 0) {
        ref.current.scrollLeft = pos - offset;
      } else if (pos === endScroll) {
        ref.current.scrollLeft = pos - offset * 2;
      }
    }
  };
  useEffect(() => {
    ref.current.scrollLeft = cards.length * width;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <section id={ID} className="width-wrapper">
      <div className={`bg-${bg} industries-mob`}>
        <div className="industries-title">
          <Text type="H-mob" color={color}>
            {heading}
          </Text>
        </div>
        <div ref={ref} className="industries-slider hsh" onScroll={handleScroll}>
          <div className="flex-row">
            <CardSlide list={cards} i="a" />
            <CardSlide list={cards} i="b" />
            <CardSlide list={cards} i="c" />
            <CardSlide list={cards} />
          </div>
        </div>
      </div>
    </section>
  );
};
const IndustriesFull = ({ heading = "", cards = [], bg = "light-grey", color }) => {
  const ID = useId();
  const { type, setSwiping, setType } = useContext(PointerContext);
  const { locale } = useSelector(({ user }) => user);
  const ref = useRef(null);
  const len = cards.length;
  const sliderWidth = len * cardWidth;
  const [stateRef] = useState({
    mx: 0,
    pos: 0,
    startX: 0,
    isPressed: false,
    still: false,
    busy: false,
  });
  const dim = useDimensions();
  const [switchSlider, setSwitchSlider] = useState(false);
  const animate = () => {
    stateRef.busy = true;
    setSwitchSlider(!switchSlider);
    if (switchSlider) {
      stateRef.busy = false;
      return reset();
    }
    const cardsRef = ref.current.querySelectorAll("#industry-card");
    cardsRef.forEach((e) => {
      e.style.transform = "";
    });
    ref.current.style.transform = `translate(0px,280px)`;
    setTimeout(() => {
      ref.current.classList.add("still");
      stateRef.still = true;
      stateRef.busy = false;
    }, 500);
  };

  const reset = (angle = 5) => {
    if (stateRef.busy) return null;
    ref.current.classList.remove("still");
    stateRef.still = false;
    const ratio = window.devicePixelRatio === 1.25 ? 1.25 : 1;
    ref.current.style.transform = `translate(${dim.width * ratio / 2 + 100}px,145px)`;
    const cardsRef = ref.current.querySelectorAll("#industry-card");
    cardsRef.forEach((e, i) => {
      e.style.transform = `translate(-${i * cardWidth}px,0) rotate(${(i + 1) * angle}deg)`;
      e.style.zIndex = len - i;
    });
  };

  const mouseDown = ({ pageX, pointerId }) => {
    if (stateRef.busy) return null;
    ref.current.setPointerCapture(pointerId);
    window.addEventListener("mouseup", mouseUp, { once: true });
    const { x } = ref.current.getBoundingClientRect();
    stateRef.isPressed = true;
    stateRef.pos = x - pageX;
    stateRef.mx = pageX;
  };

  const mouseUp = ({ pageX }) => {
    if (stateRef.busy) return null;
    setSwiping();
    if (stateRef.isPressed) {
      if (Math.abs(pageX - stateRef.mx) < 1) {
        animate();
      } else if (switchSlider) {
        let offset = stateRef.pos + pageX;
        offset -= Math.abs(offset) > sliderWidth / 2 ? sliderWidth * Math.sign(offset) : 0;
        ref.current.style.transform = `translate(${offset % sliderWidth}px,280px)`;
      }
    }
    stateRef.isPressed = false;
  };
  const mouseMove = ({ pageX }) => {
    if (!stateRef.still) return;
    if (switchSlider && type !== types.greenSwipe) {
      setType(types.greenSwipe);
      return null;
    }
    let offset = stateRef.pos + pageX;
    if (stateRef.isPressed) {
      ref.current.style.transform = `translate(${offset}px,280px)`;
    }
  };

  useEffect(() => {
    ref.current.style.width = `${sliderWidth}px`;
    setTimeout(() => {
      reset();
    }, 500);
    setSwitchSlider(false);
    return () => {};
  }, [locale]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <section id={ID} className="width-wrapper">
      <div className={styler([`bg-${bg} industries`, { large: switchSlider }])}>
        <div className={styler(["industries-title", { spread: switchSlider }])}>
          <Text color={color} italic>{heading}</Text>
        </div>
        <div
          ref={ref}
          className="industries-slider"
          onPointerDown={mouseDown}
          onPointerMove={mouseMove}
          onPointerLeave={(e) => {
            e.stopPropagation();
            setType(types.default);
            if (!switchSlider) reset();
          }}>
          <div
            className="interaction-box"
            onPointerEnter={() => {
              setType(types.greenPointer);
              reset(-5);
            }}
            onPointerLeave={() => {
              setType(types.default);
              if (!switchSlider) reset();
            }}
          />
          <ShadowSlides cards={cards} style={{ left: -sliderWidth }} />
          {cards.map(({ label, url, urlMobile, urlTablet, textColor }) => (
            <div key={label} id="industry-card" className={styler(["industry-card", { spread: switchSlider }])}>
              <Text color={textColor}>{`${label}`}</Text>
              <IndustriesImage {...{ url, label, urlTablet, urlMobile }} />
            </div>
          ))}
          <ShadowSlides cards={cards} style={{ right: -sliderWidth }} />
        </div>
      </div>
    </section>
  );
};
function ShadowSlides({ cards = [], style }) {
  return (
    <div className="shadow-slider" style={style}>
      {cards.map(({ label, url, urlMobile, urlTablet, textColor }) => (
        <div key={label} className="industry-card spread">
          <Text color={textColor}>{`${label}`}</Text>
          {/* <Image {...{ url, label }} lazy /> */}
          <IndustriesImage {...{ url, label, urlTablet, urlMobile }} />
        </div>
      ))}
    </div>
  );
}
function CardSlide({ list = [], i = 0 }) {
  return (
    <Fragment>
      {list.map(({ label, url, urlTablet, urlMobile, textColor }) => (
        <div key={label + i} className="industry-card">
          <div>
            <Text color={textColor}>{`${label}`}</Text>
            <IndustriesImage {...{ url, label, urlTablet, urlMobile }} />
          </div>
        </div>
      ))}
    </Fragment>
  );
}

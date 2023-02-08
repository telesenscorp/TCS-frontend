import { useEffect, useId, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { File_URL } from "../common/constants";
import { Text } from "../components";
import { uniqueId } from "../utils";
import { InnerBlog } from "./BlogPreview";
const margins = [240, 0, 140, 300];

const Value = ({ title, desc, url, color, cardBg = "navy-green", iconFill }) => {
  const { isWide, isFull } = useSelector(({ layout }) => layout);
  const ref = useRef(null);
  const onPointerMove = ({ clientX, clientY }) => {
    if (isWide || isFull) {
      const { x, width, y, height } = ref.current.getBoundingClientRect();
      const ratio = window.devicePixelRatio === 1.25 ? 1.25 : 1;
      const ax = (x + width / 2 - clientX * ratio) / 10;
      const ay = (y + height / 2 - clientY) / 20;
      ref.current.style.transition = "none";
      ref.current.style.transform = `rotateY(${-ax}deg) rotateX(${ay}deg) translateZ(10px) scale(1.05)`;
    }
  };
  const onPointerEnter = () => {
    ref.current.style.transition = "all 1s ease-out";
    ref.current.style.transform = `rotateY(0deg)  rotateX(0deg)  translateZ(1px)`;
  };
  const Props = isWide || isFull ? { onPointerMove, onPointerEnter, onPointerLeave: onPointerEnter } : {};
  return (
    <div ref={ref} className={`value-card bg-${cardBg}`} {...Props}>
      <div className="card-content">
        <div className="value-circle" style={{ backgroundImage: `url(${File_URL + url})` }} />
        <Text color={color} type="Sub" className="value-title">
          {title}
        </Text>
        <Text type="Body2" color={color}>
          {desc}
        </Text>
      </div>
    </div>
  );
};
function Values({ values = [], bg = "white", color, cardBg, innerHtml, iconFill }) {
  const ID = useId();
  const ref = useRef(null);
  const [top, setTop] = useState(0);
  useEffect(() => {
    setTop(ref.current.getBoundingClientRect().height + 120);
  }, []);
  return (
    <section id={ID} className={`root-values bg-${bg}`}>
      <div ref={ref} className={`sticky values-header center bg-${innerHtml?.bg}`} style={{ top: 60 }}>
        {innerHtml ? <InnerBlog {...innerHtml} /> : null}
      </div>
      <div className="spacer" />
      <div className="container up-2 sticky" style={{ top }}>
        {values.map((el, i) => (
          <div key={"a" + i} className="single-card">
            <div className="card-spacer" style={{ height: margins[i] }} />
            <div className="sticky" style={{ top }}>
              <Value {...{ ...el, color, cardBg, iconFill }} key={uniqueId(i)} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
export default Values;

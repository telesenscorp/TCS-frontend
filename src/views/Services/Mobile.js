import { useEffect, useId, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ReactComponent as PointerSvg } from "../../assets/pointer.svg";
import { Image, Text } from "../../components";
import { toPath, uniqueId } from "../../utils";

export default function Mobile({ heading, products, bg = "grey-blue", sideColor }) {
  const ID = useId();
  const { locale } = useSelector(({ user }) => user);
  const slider = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    slider.current.scrollTo({ left: 0 });
  }, [locale]);
  return (
    <section id={ID} className="width-wrapper">
      <div className={`bg-${bg} services-mob`}>
        <div className="services-title">
          <Text color={sideColor}>{heading}</Text>
        </div>
        <div ref={slider} className="services-mob-slider hsh">
          {products.map(({ url, title, to }, i) => (
            <div key={uniqueId(i)}>
              <div onClick={() => navigate(toPath(to), { state: title })} className="services-mob-card" data-title={title}>
                <Image lazy {...{ url, label: title }} />
                <div className="mob-card-arrow">
                  <PointerSvg fill="white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

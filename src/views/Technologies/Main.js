import { useContext, useEffect, useId, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Image, Text } from "../../components";
import PointerContext, { mouseEvents, types } from "../../components/pointer/Context";
import { styler, uniqueId } from "../../utils";
export default function Main({ heading, technologies, bg, sideBg, sideColor }) {
  const ID = useId();
  const ref = useRef(null);
  const context = useContext(PointerContext);
  const { mobileBrowser, contentVersion } = useSelector(({ layout }) => layout);
  const { locale } = useSelector(({ user }) => user);
  const [state, setState] = useState({ selected: null, position: [0] });
  const [loc, setLoc] = useState(locale);
  const toggleCard = (i) => {
    const ratio = window.devicePixelRatio === 1.25 ? 1.25 : 1;
    if (state.selected === i) {
      setState({ ...state, selected: null });
      setTimeout(() => {
        window.scrollTo({ top: ref.current.offsetTop / ratio });
      }, 1200);
    } else {
      setState({ ...state, selected: i });
      setTimeout(() => {
        window.scrollTo({ top: (ref.current.offsetTop + state.position[i]) / ratio });
      }, 1000);
    }
  };
  // reset selected card if locale changes
  useEffect(() => {
    if (loc !== locale) {
      setLoc(locale);
      setState({ ...state, selected: null });
    }
  }, [locale]);
  useEffect(() => {
    const list = ref.current.querySelectorAll(".techno-card");
    list.forEach((v, i) => {
      state.position[i] = v.offsetTop;
    });
  }, [contentVersion]);

  return (
    <section ref={ref} id={ID} className="width-wrappers">
      <div className={`bg-${bg} techno-container`}>
        {!mobileBrowser ? (
          <div className={`slider-side-bar bg-${sideBg}`}>
            <Text type="Sub" color={sideColor} className="technologies-title" bold>
              {heading}
            </Text>
          </div>
        ) : null}
        <div className="techno-root">
          <div className="techno-spacer" />
          {technologies.map((el, i) => (
            <div key={"k-" + i} className={styler(["techno-card", { selected: state.selected === i }])} onClick={() => toggleCard(i)}>
              <div className={`techno-card-title bg-${bg}`}>
                <Text type="H5" color="white" bold>
                  {el.title}
                </Text>
                <div className="techno-arrow" />
              </div>
              <div className="techno-content">
                {el.variants.map(({ label, url }, i) => (
                  <div key={uniqueId(i)} className="variant" {...mouseEvents(context, types.link)}>
                    <div>
                      <Image lazy className="techno-image" {...{ label, url }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

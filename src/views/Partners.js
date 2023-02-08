import React, { useContext, useEffect, useId, useRef } from "react";
import { useSelector } from "react-redux";
import { content } from "../common/translator";
// import { ReactComponent as GalaxyTablet } from "../assets/galaxy-tablet.svg";
import { Galaxy, Image, Text } from "../components";
import { GalaxyTablet } from "../components/Galaxy";
import PointerContext, { mouseEvents, types } from "../components/pointer/Context";
import { uniqueId } from "../utils";
import { isSafari } from "../utils/browserDetector";

const PartnersFull = ({ partners, bg, color }) => {
  const ID = useId();
  const isSupported = isSafari(15.6);
  const context = useContext(PointerContext);
  return (
    <section id={ID} className="width-wrapper">
      <div className={`bg-${bg} partners-section`}>
        <div className="partners">
          <Galaxy color={color} />
          <div className="partner-list">
            {partners.map(({ label, url, to }, i) => (
              <div key={label + i} className={`partner${isSupported ? " dynamic" : " static-pos"} pos-${i} line-${i % 7} offset-${i % 10}`}>
                <Image lazy {...{ url, label }} {...mouseEvents(context, types.link)} />
              </div>
            ))}
            {/* {partners.map(({ label, url, to }, i) => (
              <div
                key={"shadow-" + label + i}
                className={`shadow-partner${isSupported ? " dynamic" : " static-pos"} shadow-line-${i % 7} offset-${i % 10}`}>
                <Image lazy {...{ url, label }} />
              </div>
            ))} */}
          </div>
        </div>
      </div>
    </section>
  );
};
const PartnersTablet = ({ partners, bg, color }) => {
  const ID = useId();
  return (
    <section id={ID} className="width-wrapper">
      <div className={`bg-${bg} partners-tablet`}>
        <div className="partners">
          <GalaxyTablet color={color} />
          <div className="partner-list">
            {partners.map(({ label, url, to }, i) => (
              <div key={uniqueId(i)} className={`partner line-${i % 3} offset-${i % 10}`}>
                <Image lazy {...{ url, label }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
const slideHeight = 400;
const PartnersMobile = ({ partners = [], bg = "soft-blue" }) => {
  const { contentVersion } = useSelector(({ layout }) => layout);
  const ID = useId();
  const ref = useRef(null);
  const { locale } = useSelector(({ user }) => user);
  const slider = useRef(null);
  const msgRef = useRef(null);
  const len = partners.length;
  const onScroll = (e) => {
    ref.current.style.transform = `rotate(${(e.target.scrollTop / slideHeight) * 90}deg)`;
    if (e.target.scrollTop / slideHeight === len + 1) {
      e.target.scrollTop = slideHeight;
    } else if (e.target.scrollTop === 0) {
      e.target.scrollTop = len * slideHeight;
    } else if (e.target.scrollTop !== slideHeight) {
      msgRef.current.style.opacity = 0;
    }
  };
  useEffect(() => {
    slider.current.scrollTop = slideHeight;
  }, [partners, contentVersion]);

  return (
    <section id={ID} className="width-wrapper">
      <div className={`bg-${bg} partners-mob`}>
        <div className="hinge" ref={ref} />
        <div className="blocker" />
        <Text ref={msgRef} type="Overline" className="hinge-msg" italic>
          {content.partnersHint[locale]}
        </Text>
        <div ref={slider} className="partners hsh" onScroll={onScroll}>
          <div className="partner-list">
            <div className="partner">
              <Image url={partners[len - 1].url} label={partners[len - 1].label} />
            </div>
            {partners.map(({ label, url, to }, i) => (
              <div key={uniqueId(i)} className={`partner`}>
                <Image lazy {...{ url, label }} />
              </div>
            ))}
            <div className="partner last-partner">
              <Image url={partners[0].url} label={partners[0].label} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Partners(props) {
  const { mobileBrowser, isMobile } = useSelector(({ layout }) => layout);
  return mobileBrowser ? isMobile ? <PartnersMobile {...props} /> : <PartnersTablet {...props} /> : <PartnersFull {...props} />;
}

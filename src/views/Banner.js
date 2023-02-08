import React, { useId } from "react";
import { useSelector } from "react-redux";
import { Text } from "../components";
import BlogPreview from "./BlogPreview";
const Slide = ({ color, title, className = "ticker frc", separatorColor }) => (
  <div className={className}>
    <Text type="H1" color={color} italic>
      {title}
    </Text>
    <div className={`bg-${separatorColor} separator flex-col`}>
      <span>Professionalism.</span>
      <span>People.</span>
      <span>Persistance.</span>
      <span>Perception.</span>
    </div>
  </div>
);

const Banner = ({ title, bg = "white", color = "grey", innerHtml, separatorColor = "navy-green", speed = 30 }) => {
  const ID = useId();
  const { mobileBrowser } = useSelector(({ layout }) => layout);
  return (
    <section id={ID} className="width-wrapper">
      {innerHtml ? <BlogPreview {...innerHtml} /> : null}
      <div className={`banner bg-${bg}`}>
        <div className="banner-container" style={{animationDuration: `${speed}s`}}>
          <Slide {...{ title, color, separatorColor }} />
          <Slide {...{ title, color, separatorColor, className: "ticker frc reverse" }} />
          {mobileBrowser ? (
            <React.Fragment>
              <Slide {...{ title, color, separatorColor }} />
              <Slide {...{ title, color, separatorColor, className: "ticker frc reverse" }} />
            </React.Fragment>
          ) : null}
        </div>
      </div>
    </section>
  );
};
export default Banner;

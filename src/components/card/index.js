import React, { useState } from "react";
import { Text } from "..";
import { ReactComponent as PointerSvg } from "../../assets/pointer.svg";
import { styler } from "../../utils";
import Image from "../Image";

const Card = ({ title = "", desc = "", url = "", onClick = () => {}, bg, color, selected, ending, square, isMobile = false }) => {
  const [state] = useState({ x: 0 });
  return (
    <div
      className={styler(["services-card", bg, { selected, ending, square }])}
      onPointerDown={({ pageX }) => {
        state.x = pageX;
      }}
      onPointerUp={({ pageX }) => {
        if (Math.abs(state.x - pageX) < 5) {
          onClick();
        }
      }}>
      <div className="image">
        <Image lazy url={url} label={title} />
        {isMobile ? (
          <div className="mob-card-arrow">
            <PointerSvg fill="white" />
          </div>
        ) : null}
      </div>
      <div className="desc">
        <Text type="H5" bold color={color}>
          {title}
        </Text>
        <Text type="H6" className="medium" color={color}>
          {desc}
        </Text>
      </div>
    </div>
  );
};
export default Card;

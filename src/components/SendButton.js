import React, { useContext } from "react";
import PointerContext, { mouseEvents, types } from "./pointer/Context";
import StickyButton from "./StickyButton";

const SendButton = (props) => {
  const context = useContext(PointerContext);
  return (
    <StickyButton>
      <div className="svg-btn send-btn" {...props} {...mouseEvents(context, types.link)} />
    </StickyButton>
  );
};
export const ClutchButton = (props) => {
  const context = useContext(PointerContext);
  const { to } = props;
  return (
    <div className="clutch pulse" {...props} {...mouseEvents(context, types.link)}>
      <a href={to} target="_blank" rel="noopener noreferrer">
        <div className="svg-btn clutch-btn" />
      </a>
    </div>
  );
};
export default SendButton;

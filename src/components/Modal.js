import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { styler } from "../utils";
import Text from "./Text";

function Modal() {
  const { message, visible } = useSelector(({ layout }) => layout);
  const dispatch = useDispatch();
  return (
    <div className={styler(["back-drop", { visible }])}>
      <div className="pop-up">
        <div className="content">
          <div className="close-btn" onClick={() => dispatch()} />
          <Text>{message}</Text>
        </div>
      </div>
    </div>
  );
}

export default Modal;

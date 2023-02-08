import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import { dragUpdate } from "../../configuration/redux/Panel";
import { Sections } from "../../content/res";
import { styler } from "../../utils";
let counter;
function EntityBox({ selected, onSelect }) {
  const dispatch = useDispatch();
  const entities = useRef(Object.keys(Sections)).current;
  return (
    <div className="frc entity-box">
      {entities.map((label) => (
        <div
          key={label}
          className={styler(["entity hand", { selected: selected === label }])}
          onPointerDown={({ clientY }) => {
            onSelect(label);
            clearTimeout(counter);
            counter = setTimeout(() => dispatch(dragUpdate({ active: true, index: 99, name: label, top: clientY, position: 99 })), 500);
            window.addEventListener(
              "mouseup",
              () => {
                clearTimeout(counter);
                counter = setTimeout(() => dispatch(dragUpdate({ active: false })), 100);
              },
              { once: true }
            );
          }}>
          <p>{label}</p>
        </div>
      ))}
    </div>
  );
}

export default EntityBox;

import React from "react";
import { styler } from "../../utils";

const Toggle = ({ label, selected, options, onChange }) => {
  return (
    <div className="toggler">
      <p className="label">{label}</p>
      <div className="toggler-control">
        {options.map(({ value, label }) => (
          <div key={value} className={styler(["toggler-button pointy", { selected: value === selected }])} onClick={() => onChange(value)}>
            <p className="color-white">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Toggle;

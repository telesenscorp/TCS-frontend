import { useState } from "react";
import { Text } from "../../components";
import { styler } from "../../utils";
import colorList from "../constants/colorList";

const ListPicker = ({ list = [{ label: "", value: "" }], selected, onChange, name, error }) => {
  return (
    <div className="dropdown">
      <p className="label cant-touch">{name}</p>
      <div className="selected flex center">
        <p className="color-white">{selected || "not-selected"}</p>
      </div>
      <ul className="dropdown-content size-picker">
        {list.map(({ label, value }) => (
          <li key={label} className={styler(["pointy", selected === value ? "selected-value" : ""])} onClick={() => onChange(value)}>
            {label}
          </li>
        ))}
      </ul>
      <p className="picker-error">{error}</p>
    </div>
  );
};
const colorNum = colorList.length / 3;
const FontList = [
  { label: "H1", value: "H1" },
  { label: "H2", value: "H2" },
  { label: "H3", value: "H3" },
  { label: "H4", value: "H4" },
  { label: "H5", value: "H5" },
  { label: "H6", value: "H6" },
  { label: "Sub", value: "S1" },
  { label: "Sub2", value: "S2" },
  { label: "Body", value: "B1" },
  { label: "Body2", value: "B2" },
  { label: "Button", value: "Bu" },
  { label: "Cap", value: "Ca" },
  { label: "Overline", value: "Ov" },
];
export const ColorPicker = ({ value, onChange, name, isFont }) => {
  const [step, setStep] = useState(0);
  const list = colorList.slice(colorNum * step, colorNum * (step + 1));
  return (
    <div className="dropdown">
      <p className="label cant-touch">{name}</p>
      <div className={`selected flex center bg-${value}`}>
        <p className={`contrast-color-${value} cant-touch`}>{value}</p>
      </div>
      <ul className="dropdown-content color-picker">
        {list.map((e) =>
          e ? (
            <li key={e} className={`dropdown-item center contrast-color-${e} bg-${e}`} onClick={() => onChange(e === value ? "" : e)}>
              <div className="f1 cant-select pointy">{e === value ? "✔" : e === "transparent" ? "t" : ""}</div>
            </li>
          ) : null
        )}
        {isFont ? null : (
          <li className={`dropdown-item center contrast-color-white bg-white`} onClick={() => setStep((step + 1) % 3)}>
            <div className="f1 cant-select pointy">&raquo;</div>
          </li>
        )}
      </ul>
    </div>
  );
};
export const FontColorPicker = ({ value, onChange, children }) => {
  const list = colorList.slice(0, colorNum);
  return (
    <div className="dropdown">
      {children}
      <ul className="dropdown-content color-picker">
        {list.map((e, i) =>
          e ? (
            <li key={e} className={`dropdown-item center contrast-color-${e} bg-${e}`} onClick={() => onChange(i < 10 ? "0" + i : i)}>
              <div className="f1 cant-select pointy">{e === value ? "✔" : e === "transparent" ? "t" : ""}</div>
            </li>
          ) : null
        )}
      </ul>
    </div>
  );
};
export const FontSizePicker = ({ onChange, children }) => {
  return (
    <div className="dropdown">
      {children}
      <ul className="dropdown-content size-picker">
        {FontList.map(({ label, value }) => (
          <li key={label} className="pointy bg-white" onClick={() => onChange(value)}>
            <Text type="Sub" color="black">
              {value}
            </Text>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListPicker;

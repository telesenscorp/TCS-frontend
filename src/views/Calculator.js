import React, { useRef, useState } from "react";
import { BlogPreview } from ".";
import { Text } from "../components";
import { styler, uniqueId } from "../utils";
const CalculatorItem = ({ data, steps, step }) => {
  const { title, buttons, type } = data[step];
  const ref = useRef();
  const [checked, setChecked] = useState({});
  const setCheckboxesValue = (value, label, type) => {
    if (type === "multi") {
      setChecked({ ...checked, [label]: value });
    } else {
      setChecked({ [label]: value });
    }
  };
  return (
    <div className="calculator-item">
      <div className="flex row mb24">
        <div>
          <Text type="Sub" color="grey" mb="4">
            {title}
          </Text>
          <Text color="light-grey">({type === "multi" ? "Multioption" : "Choose one"})</Text>
        </div>
        <Text type="Sub" italic className="regular" color="grey">
          Step {step}/{steps}
        </Text>
      </div>
      <div className="flex row buttons-container">
        {buttons.map(({ label, value }, i) => (
          <div
            className={styler(["button", { selected: checked[label] }])}
            onClick={() => setCheckboxesValue(ref.current.checked, label, type)}>
            <input ref={ref} className="calculator-check" type={type === "multi" ? "checkbox" : "radio"} value={value} />
            <div key={uniqueId(i)}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
const Calculator = ({ innerHtml, items = [], bg = "white", color = "" }) => {
  return (
    <section className={styler(["calculator", "bg-" + bg, "color-" + color])}>
      {innerHtml ? <BlogPreview {...innerHtml} /> : null}
      {items.map((item, i) => (
        <CalculatorItem key={uniqueId(i)} step={Object.keys(item)} steps={items.length} data={item} />
      ))}
    </section>
  );
};

export default Calculator;

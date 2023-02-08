import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { styler } from "../../utils";
import PointerContext, { mouseEvents, types } from "../pointer/Context";
import Text from "../Text";
import SubmitForm from "./SubmitForm";

export default function Vacancy({ color, visible, title, heading, requirements, onClick, vacancyForm, labelColor }) {
  const vacancyRef = useRef(null);
  const applyRef = useRef(null);
  const singleRef = useRef(null);
  const [apply, setApply] = useState(false);
  const [height, setHeight] = useState(0);
  const updateHeight = () => setHeight(height + 1);
  const context = useContext(PointerContext);
  const { mobileBrowser } = useSelector(({ layout }) => layout);
  useEffect(() => {
    try {
      singleRef.current.style.height = visible ? applyRef.current.getBoundingClientRect().height + "px" : 0;
      singleRef.current.style.overflowY = visible ? "initial" : "hidden";
    } catch (error) {
      console.error(error);
    }
  }, [visible, apply, height]);
  return (
    <div className={styler(["single-vacancy", { collapse: visible }])}>
      <div
        ref={vacancyRef}
        className="accordion"
        onClick={() => {
          onClick(vacancyRef.current.getBoundingClientRect().height);
          setApply(false);
        }}
        {...mouseEvents(context, types.link)}>
        <Text type="H5" italic color={color}>
          {title}
        </Text>
        <div className="toggle" />
      </div>
      <div ref={singleRef} className="single-desc">
        <div ref={applyRef}>
          <Text type="Sub" color={color} mb={mobileBrowser ? "24" : "32"}>
            {heading}
          </Text>
          {requirements.map((e, i) => (
            <div key={e.title + i} className={mobileBrowser ? "mb24" : "mb32"}>
              <Text type="Sub2" color={color} mb={mobileBrowser ? "8" : "12"}>
                {e.title}
              </Text>
              <Text color={color}>{e.desc}</Text>
            </div>
          ))}
          <div className="tablet-separator-16" />
          <div className={styler(["apply-btn", { apply }])} onClick={() => setApply(!apply)}>
            <Text type="Sub2" italic color={color}>
              {vacancyForm.applyButton}
            </Text>
          </div>
          <div className="vacancies-separator" />
          <SubmitForm {...{ apply, vacancyForm, updateHeight, labelColor }} />
        </div>
      </div>
    </div>
  );
}

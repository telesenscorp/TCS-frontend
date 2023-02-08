import { useFormikContext } from "formik";
import React, { useContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { content } from "../common/translator";
import { styler } from "../utils";
import PointerContext, { mouseEvents, types } from "./pointer/Context";
import Text from "./Text";

const Input = ({
  label = "",
  value,
  onChange = () => {},
  className,
  error,
  required,
  multi,
  name = "",
  onBlur = () => {},
  onFocus = () => {},
  onTouch,
  onResize = () => {},
  inputProps,
  last,
  labelColor,
}) => {
  const context = useContext(PointerContext);
  const inputRef = useRef(null);
  const labelRef = useRef(null);
  const autoGrow = () => {
    if (multi) {
      inputRef.current.style.height = "10px";
      inputRef.current.style.height = `${inputRef.current.scrollHeight + 20}px`;
      onResize(inputRef.current.style.height);
    }
  };
  const handleBlur = () => {
    labelRef.current.style.color = `var(--${labelColor})`;
    onBlur();
  };
  const handleFocus = () => {
    labelRef.current.style.color = "var(--navy-green)";
    onFocus();
  };

  useEffect(() => {
    autoGrow();
    return () => {};
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styler([className, "text-input", { error }])} onClick={onTouch}>
      <Text ref={labelRef} color={labelColor} type="Sub2">{`${label}${required ? "*" : ""}`}</Text>
      {multi ? (
        <textarea
          ref={inputRef}
          {...inputProps}
          className="input multi"
          {...{ name, value }}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onChange={(e) => onChange(e.target.value)}
          {...mouseEvents(context, types.text)}
          enterKeyHint={last ? "enter" : "next"}
          onKeyUp={(e) => {
            if (e.key.toLowerCase() === "enter" && !last) {
              e.target.parentElement.nextElementSibling.children[1].focus();
              e.preventDefault();
            }
          }}
        />
      ) : (
        <input
          type="text"
          {...inputProps}
          className="input"
          {...{ name, value }}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onChange={(e) => onChange(e.target.value)}
          {...mouseEvents(context, types.text)}
          enterKeyHint={last ? "done" : "next"}
          onKeyUp={(e) => {
            if (e.key.toLowerCase() === "enter" && !last) {
              e.target.parentElement.nextElementSibling.children[1].focus();
              e.preventDefault();
            }
          }}
        />
      )}
      {error ? (
        <div className="input-error">
          {/* <Error /> */}
          <Text color="just-grey">{error}</Text>
        </div>
      ) : null}
      {multi ? (
        <Text className="letters-counter" color="just-grey">
          {value.length}/2000
        </Text>
      ) : null}
    </div>
  );
};
export const FormikInput = ({ name, submitted, ...props }) => {
  const { values, errors, touched, setFieldValue, setFieldError, isSubmitting } = useFormikContext();
  const { locale } = useSelector(({ user }) => user);
  useEffect(() => {
    if (isSubmitting) {
  setFieldValue(name, values[name].trim())
}
}, [submitted])

  const isError = touched[name] && !!errors[name];
  return (
    <Input
      {...{ name, ...props }}
      onTouch={() => setFieldError(name, "")}
      onFocus={() => setFieldError(name, "")}
      value={values[name]}
      error={isError && content[errors[name]][locale]}
      onChange={(v) => setFieldValue(name, v)}
    />
  );
};
export const CheckBox = ({ value, label, to, onChange, error = "" }) => {
  const context = useContext(PointerContext);
  return (
    <div className="checkbox-root" {...mouseEvents(context, types.link)}>
      {error ? <Text className="checkbox-error">{error}</Text> : null}
      <label className="checkbox path">
        <input type="checkbox" {...{ value, onChange, checked: value }} />
        <svg viewBox="0 0 21 21">
          <path d="M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186" />
        </svg>
      </label>
      <a href={to} target="_blank" rel="noopener noreferrer">
        <Text className="regular Link" color="just-grey">
          {label}
        </Text>
      </a>
    </div>
  );
};
export default Input;

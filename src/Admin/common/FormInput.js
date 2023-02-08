import React, { useImperativeHandle, useRef } from "react";
const FormInput = ({ tiny, label, value, onChange, error, inputRef, ...props }) => {
  const selection = useRef([0, 0]).current;
  useImperativeHandle(inputRef, () => ({
    hug: (tag, end = "</span>") => {
      const [selectionStart, selectionEnd] = selection;
      let newValue = "";
      if (tag === "list") {
        let part = value.slice(selectionStart, selectionEnd).split("\n");
        newValue = `${value.slice(0, selectionStart)}\n● ${part.join("\n● ")}\n${value.slice(selectionEnd)}`;
      } else {
        for (let i = 0; i < value.length; i++) {
          if (i === selectionStart) {
            newValue += "<" + tag + ">";
          } else if (i === selectionEnd) {
            newValue += end;
          }
          newValue += value[i];
        }
        if (selectionEnd === value.length) {
          newValue += end;
        }
      }
      onChange(newValue);
    },
  }));
  return (
    <div className={`section-form-group${tiny ? " tiny" : ""}`}>
      <p className="cant-touch">{label}</p>
      <input 
      ref={inputRef} 
      className="form-control" 
      value={value} 
      onChange={({ target }) => onChange(target.value)} 
      onSelect={(v) => {
          selection[0] = v.target.selectionStart;
          selection[1] = v.target.selectionEnd;
        }}
      {...props} />
      <p>{error}</p>
    </div>
  );
};
export default FormInput;

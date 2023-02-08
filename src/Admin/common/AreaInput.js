import { forwardRef, useImperativeHandle, useRef } from "react";

const AreaInput = forwardRef(({ label, value, onChange }, ref) => {
  const selection = useRef([0, 0]).current;
  useImperativeHandle(ref, () => ({
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
    <div className="section-form-group">
      <p>{label}</p>
      <textarea
        ref={ref}
        className="form-area-control"
        value={value}
        onChange={({ target }) => {
          target.style.height = "auto";
          target.style.height = target.scrollHeight + 1 + "px";
          onChange(target.value);
        }}
        onSelect={(v) => {
          selection[0] = v.target.selectionStart;
          selection[1] = v.target.selectionEnd;
        }}
      />
    </div>
  );
});
export default AreaInput;

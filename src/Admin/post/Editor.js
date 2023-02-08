import React from "react";
import { FontColorPicker, FontSizePicker } from "../common/ListPicker";
import OnOff from "../common/OnOff";

export default function Editor({ onStyle, onAddLink, onChange, padding, sideBySide, sidePad, align }) {
  return (
    <div className="frr">
      <FontColorPicker onChange={(v) => onStyle("C" + v)}>
        <OnOff type="color" />
      </FontColorPicker>
      <FontSizePicker onChange={(v) => onStyle("S" + v)}>
        <OnOff type="size" />
      </FontSizePicker>
      <OnOff type="bold" onClick={() => onStyle("B")} />
      <OnOff type="italic" onClick={() => onStyle("I")} />
      <OnOff type="underline" onClick={() => onStyle("U")} />
      <OnOff type="list" onClick={() => onStyle("list")} />
      <OnOff type="link" onClick={() => onStyle("L", "</a>")} />
      <OnOff type="addLink" onClick={onAddLink} />
      <OnOff type="sidePad" onClick={() => onChange({ sidePad: !sidePad })} value={sidePad} />
      <OnOff type="alignLeft" value={align === "left"} onClick={() => onChange({ align: "left" })} />
      <OnOff type="alignCenter" value={align === "center"} onClick={() => onChange({ align: "center" })} />
      <OnOff type="alignRight" value={align === "right"} onClick={() => onChange({ align: "right" })} />
      <OnOff type="padding" onClick={() => onChange({ padding: !padding })} value={padding} />
      <OnOff type="sideBySide" onClick={() => onChange({ sideBySide: !sideBySide })} value={sideBySide} />
    </div>
  );
}

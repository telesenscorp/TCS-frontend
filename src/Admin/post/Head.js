import React from "react";
import { FormInput } from "../common";
import { ColorPicker } from "../common/ListPicker";
import Container from "./Container";
export default function Head({ type, bg, color, anchorName, content, onChange, handler, onMove }) {
  return (
    <Container {...{ handler, onMove }}>
      <div className="frc">
        <FormInput label="Bookmark name" value={anchorName} onChange={(v) => onChange({ anchorName: v })} />
        <FormInput label="Bookmark content" value={content} onChange={(v) => onChange({ content: v })} />
        <ColorPicker name="bg" value={bg} onChange={(v) => onChange({ bg: v })} />
        <ColorPicker name="color" value={color} onChange={(v) => onChange({ color: v })} />
      </div>
    </Container>
  );
}

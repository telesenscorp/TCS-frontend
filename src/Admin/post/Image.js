import React from "react";
import { Gallery } from "../common";
import { ColorPicker } from "../common/ListPicker";
import Container from "./Container";

export default function Image({ type, bg, color, content, onChange, handler, onMove }) {
  const handleChange = (v) => onChange({ content: { ...content, ...v } });
  return (
    <Container {...{ handler, onMove }}>
      <div className="flex-row">
        <Gallery value={content.img1} onChange={(v) => handleChange({ img1: v })} />
        <Gallery value={content.img2} onChange={(v) => handleChange({ img2: v })} />
        <Gallery value={content.img3} onChange={(v) => handleChange({ img3: v })} />
        <ColorPicker name="bg" value={bg} onChange={(v) => onChange({ bg: v })} />
        <ColorPicker name="color" value={color} onChange={(v) => onChange({ color: v })} />
      </div>
    </Container>
  );
}

import React, { useRef } from "react";
import { AreaInput, FormInput } from "../common";
import { ColorPicker } from "../common/ListPicker";
import Container from "./Container";
import Editor from "./Editor";

export default function Block({ type, bg, color, content, onChange, handler, padding, sideBySide, sidePad, align, links = [], onMove }) {
  const ref = useRef(null);
  const handleChange = (v) => onChange({ content: { ...content, ...v } });
  const editLinks = (v, i) => {
    let data = [...links];
    data[i] = v;
    onChange({ links: data });
  };
  const onStyle = (v, t) => ref.current.hug(v, t);
  const onAddLink = () => editLinks("", links.length);
  return (
    <Container {...{ handler, onMove }}>
      <div className="flex-row">
        <div className="f4">
          <FormInput label="Head" value={content.head} onChange={(v) => handleChange({ head: v })} />
          <AreaInput ref={ref} label="Paragraph" value={content.paragraph} onChange={(v) => handleChange({ paragraph: v })} />
          {links.map((val, i) => (
            <FormInput key={"k" + i} label={"Link: " + i} value={val} onChange={(v) => editLinks(v, i)} />
          ))}
        </div>
        <div className="flex-col f1">
          <div className="flex-row">
            <ColorPicker name="bg" value={bg} onChange={(v) => onChange({ bg: v })} />
            <ColorPicker name="color" value={color} onChange={(v) => onChange({ color: v })} />
          </div>
          <Editor {...{ onAddLink, onChange, onStyle, padding, sideBySide, sidePad, align }} />
        </div>
      </div>
    </Container>
  );
}

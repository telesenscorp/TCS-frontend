import React from 'react'
import { FormInput } from "../common";
import Container from "./Container";

export default function Link({ content, onChange, handler, onMove }) {
  const handleChange = (v) => onChange({ content: { ...content, ...v } });
  return (
    <Container {...{ handler, onMove }}>
      <div className="flex-column mb8">
        <FormInput label="To" value={content.to} onChange={(v) => handleChange({ to: v })} />
      </div>
    </Container>
  );
}

import React, { useState } from 'react'
import { Text } from '../../components';
import { FileSelector, FormInput } from "../common";
import { ColorPicker } from "../common/ListPicker";
import Container from "./Container";
import ProgressBar from './ProgressBar';

export default function File({ color, content, onChange, handler, onMove }) {
  const [file, setFile] = useState({name: "", p: 0, error: false})
  const uploadFile = (url, name) => {
    handleChange({name, url})
  }
  const handleChange = (v) => onChange({ content: { ...content, ...v } });
  const handleDelete = () => {
    onChange({ content: { ...content, name: "", url: "" } });
    setFile({name: "", p: 0, error: false});
  };
  return (
    <Container {...{ handler, onMove }}>
      <div className="flex-column mb8">
        <ColorPicker name="color" value={color} onChange={(v) => onChange({ color: v })} />
        <FormInput label="Head" value={content.head} onChange={(v) => handleChange({ head: v })} />
        <FileSelector onUpload={uploadFile} setFile={setFile} post/>
        <Text>15mb max</Text>
        <Text>PDF only</Text>
      </div>
      {content.name || file.name ? <div className="flex-row gap16 align-center mb8">
          <Text>{content.name || file.name}</Text>
          {!file.error ? <ProgressBar p={file.p}/> : <div className='upload-error' />}
          <div className="file-delete pointy" onClick={handleDelete} />
        </div> : null}
    </Container>
  );
}

import React, {useState} from "react";
import { ContainerForm, FileSelector, FormInput } from "../common";
import { ColorPicker } from "../common/ListPicker";
import { Text } from "../../components";
import ProgressBar from "../post/ProgressBar";
const PDFForm = ({ modify = () => {}, containerMethods, virgin, visibilityOptions, index, title, bg, url, name, color }) => {
  const [file, setFile] = useState({name: "", p: 0, error: false})
  const uploadFile = (url, name) => {
    modify(index, { title, bg, visibilityOptions, name, url, color });
  };
  const handleDelete = () => {
    modify(index, { title, bg, visibilityOptions, name: "", url: "" });
    setFile({name: "", p: 0, error: false});
  };
  return (
    <ContainerForm name="PDF" {...containerMethods} {...{ visibilityOptions, index, virgin }}>
      <div className="flex-col">
        <FormInput label="title" value={title} onChange={(v) => modify(index, { title: v, bg, visibilityOptions, name, url, color })} />
        <ColorPicker name="title color" value={color} onChange={(v) => modify(index, { title, bg, visibilityOptions, name, url, color: v })} />
        <ColorPicker name="background" value={bg} onChange={(v) => modify(index, { title, bg: v, visibilityOptions, name, url, color })} />
        <FileSelector onUpload={uploadFile} setFile={setFile} post/>
        <Text>15mb max</Text>
        <Text>PDF only</Text>
      </div>
      {name || file.name ? <div className="flex-row gap16 align-center mb8">
        <Text>{name || file.name}</Text>
        {!file.error ? <ProgressBar p={file.p}/> : <div className='upload-error' />}
        <div className="file-delete pointy" onClick={handleDelete} />
      </div> : null}
    </ContainerForm>
  );
};
export default PDFForm;

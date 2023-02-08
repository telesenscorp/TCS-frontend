import React from "react";
import { ContainerForm, FormInput } from "../common";
import { ColorPicker } from "../common/ListPicker";
const PostForm = ({ modify = () => {}, containerMethods, virgin, visibilityOptions, index, id, bg }) => {
  return (
    <ContainerForm name="Post" {...containerMethods} {...{ visibilityOptions, index, virgin }}>
      <div className="flex-row">
        <FormInput label="ID" value={id} onChange={(v) => modify(index, { id: v, bg, visibilityOptions })} />
        <ColorPicker name="background" value={bg} onChange={(v) => modify(index, { id, bg: v, visibilityOptions })} />
      </div>
    </ContainerForm>
  );
};
export default PostForm;

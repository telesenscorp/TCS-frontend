import React from "react";
import { SvgButton } from "./IconButton";

const RowEditor = ({ onAdd, onRemove }) => {
  return (
    <div className="variant-editor">
      <SvgButton btn="close" name="remove" onClick={onRemove} />
      <SvgButton btn="minimize" onClick={onAdd} />
    </div>
  );
};

export default RowEditor;

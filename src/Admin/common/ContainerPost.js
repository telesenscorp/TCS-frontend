import React from "react";
import { SvgButton } from "./IconButton";

const ContainerPost = ({ preview, postId, onCopy, onPaste, onSave, onPreview, onAddWidget, onReset, children }) => {
  return (
    <div className="form-container">
      <div className="window">
        <div className="header">
          <div className="mini-max f1">
            <SvgButton name="save" btn="minimize" onClick={onSave} />
            <SvgButton name={preview ? "edit" : "eye"} btn="maximize" onClick={onPreview} />
          </div>
          <div>
            <p className="color-white">post ID: {postId}</p>
          </div>
          <div className="mini-max f1 justify-right">
            <div
              className="button other"
              onClick={(e) => {
                e.stopPropagation();
                onReset();
              }}>
              <p>reset</p>
            </div>
            <div
              className="button other"
              onClick={(e) => {
                e.stopPropagation();
                onAddWidget();
              }}>
              <p>widget</p>
            </div>
            <div
              className="button other"
              onClick={(e) => {
                e.stopPropagation();
                onPaste();
              }}>
              <p>paste</p>
            </div>
            <SvgButton name="copy" onClick={onCopy} />
          </div>
        </div>
        <div className="body">
          <div className="item">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ContainerPost;

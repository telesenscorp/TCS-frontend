import React, { useId } from "react";
import { useDispatch } from "react-redux";
import { authUpdate } from "../../configuration/redux/Auth.slice";
import { Get, Upload } from "../../configuration/server";
const maxSize = 15728640;
const type = "application/pdf";
const FileSelector = ({ onUpload, setFile, post }) => {
  const ID = useId();
  const dispatch = useDispatch();
  const refresh = () => {
    Get("allFiles", (gallery) => {
      dispatch(authUpdate({ gallery }));
    });
  };
  const validation = (file) => {
    return file && file.size < maxSize && file.type === type;
  }
  const upload = (file) => {
    const {name} = file;
    if (post && !validation(file)) {
      setFile({name, error: true})
      return;
    }
    Upload(file, ({ url }) => {
      onUpload(url, name);
      refresh();
    }, ()=> {}, {
      onUploadProgress: (progressEvent) => {
          let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          if (post) setFile({name, p: percentCompleted, error: false })
      }
      });
  };
  return (
    <div className="upload-file">
      <input type="file" id={ID} name="filename" onChange={(e) => upload(e.target.files[0])} hidden />
      <label htmlFor={ID}>Upload</label>
    </div>
  );
};

export default FileSelector;

import React, { useContext, useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import { ReactComponent as FileSvg } from "../assets/file.svg";
import { content } from "../common/translator";
import { styler } from "../utils";
import { isFirefox } from "../utils/browserDetector";
import Error from "./dropzone/Error";
import FileList from "./dropzone/FileList";
import PointerContext, { mouseEvents, types } from "./pointer/Context";
import Text from "./Text";

const baseStyle = {
  zIndex: 2,
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "25px 16px",
  borderWidth: 1,
  borderRadius: 2,
  borderColor: "#AFBCBA",
  borderStyle: "dashed",
  backgroundColor: "#EAF5F9",
  outline: "none",
  "&:hover": {
    backgroundColor: "#D4FFEF",
  },
};

const acceptStyle = {
  backgroundColor: "#D4FFEF",
};

const maxSize = 5242880;
const DropZone = ({ label, setFile, file, labelColor, submitted }) => {
  const { mobileBrowser } = useSelector(({ layout }) => layout);
  const context = useContext(PointerContext);
  const { locale } = useSelector(({ user }) => user);
  const [isActive, setActive] = useState(false);
  const { getRootProps, getInputProps, isDragAccept, isDragActive, fileRejections, isFileDialogActive } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "image/jpeg": [".jpeg"],
      "image/png": [".png"],
    },
    onDropAccepted: (acceptedFiles) => {
      if (acceptedFiles.length + file.length > 3) {
        const files = acceptedFiles.slice(0, acceptedFiles.length - file.length);
        setFile([...file, ...files]);
      } else setFile([...file, ...acceptedFiles]);
    },
    maxFiles: 3,
    noDrag: isActive && !isFirefox(),
    maxSize,
    disabled: file.length === 3,
    useFsAccessApi: false,
  });
  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragAccept ? acceptStyle : {}),
    }),
    [isDragAccept]
  );
  useEffect(() => {
    setActive(isFileDialogActive);
  }, [isFileDialogActive]);

  const deleteFile = (i) => {
    setFile(file.filter((el, idx) => i !== idx));
  };
  useEffect(() => {
    if (fileRejections.length) {
      fileRejections.splice(0, fileRejections.length);
    }
  }, [submitted, locale]);

  return (
    <div className="text-input">
      <Text color={labelColor} type="Sub2" mb="8">
        {label}
      </Text>
      {isDragActive ? <div className="dropzone-overlay" /> : null}
      <div
        className={styler(["dropzone", { disabled: file.length === 3 }])}
        {...getRootProps({ style })}
        {...mouseEvents(context, types.link)}>
        <input {...getInputProps()} />
        <div className="flex-row gap12 align-center">
          <FileSvg />
          <Text className="semi-bold download-button" color="navy-green">
            {content.file[locale]}
          </Text>
        </div>
        {!mobileBrowser ? (
          <Text color="navy-green" type="Cap" mb={16}>
            {content.dropzone[locale]}
          </Text>
        ) : (
          <div className="mb16" />
        )}
        <div className="flex-row gap12 dropzone-description">
          <Text color="grey" type="Small-11">
            {content.fileFormat[locale]}
          </Text>
          <Text color="grey" type="Small-11">
            {content.fileAmount[locale]}
          </Text>
          <Text color="grey" type="Small-11">
            {content.fileSize[locale]}
          </Text>
        </div>
        {fileRejections.length ? <Error dropzoneError={content.dropzoneError[locale]} /> : null}
      </div>
      <FileList onDelete={deleteFile} list={file} />
    </div>
  );
};
export default DropZone;

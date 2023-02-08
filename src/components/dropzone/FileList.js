import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { ReactComponent as DownloadedSvg } from "../../assets/downloadedFile.svg";
import PointerContext, { mouseEvents, types } from "../pointer/Context";
import Text from "../Text";

const FileList = ({ onDelete, list }) => {
  const context = useContext(PointerContext);
  const { isMobile } = useSelector(({ layout }) => layout);
  const truncateString = (str) => (isMobile && str.length > 20 ? `${str.substring(0, 10)}.....${str.slice(-10)}` : str);
  return (
    <div className="flex column gap16">
      {list.map(({ path }, i) => (
        <div key={path + i} className="flex row gap12 single-file">
          <DownloadedSvg />
          <Text color="navy-green" type="Body2" className="f2 file-label">
            {truncateString(path)}
          </Text>
          <div className="f1" {...mouseEvents(context, types.link)}>
            <div className="delete-button" onClick={() => onDelete(i)} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileList;

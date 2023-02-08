import React from "react";
import { File_URL } from "../common/constants";

function Image({ url, label, lazy, ...props }) {
  return <img loading={lazy ? "lazy" : undefined} src={File_URL + url} alt={label} {...props} />;
}

export default Image;

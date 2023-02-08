import React from "react";
import { useSelector } from "react-redux";
import Main from "./Main";
export default function Technologies(props) {
  const { sideBarWidth } = useSelector(({ layout }) => layout);
  return  <Main sbw={sideBarWidth} {...props} />;
}

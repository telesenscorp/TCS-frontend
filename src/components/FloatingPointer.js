import React from "react";
import { ReactComponent as BackHome } from "../assets/back-home.svg";

function FloatingPointer({ name, onClick, className }) {
  switch (name) {
    case "back-home":
      return <BackHome {...{ onClick, className }} />;
    default:
      return <div />;
  }
}

export default FloatingPointer;

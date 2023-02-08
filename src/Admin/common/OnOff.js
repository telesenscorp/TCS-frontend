import React from "react";
import { ReactComponent as Bold } from "../../assets/icons/bold.svg";
import { ReactComponent as Center } from "../../assets/icons/center.svg";
import { ReactComponent as Color } from "../../assets/icons/color.svg";
import { ReactComponent as Italic } from "../../assets/icons/italic.svg";
import { ReactComponent as Left } from "../../assets/icons/left.svg";
import { ReactComponent as Link } from "../../assets/icons/link.svg";
import { ReactComponent as List } from "../../assets/icons/list.svg";
import { ReactComponent as Padding } from "../../assets/icons/padding.svg";
import { ReactComponent as Right } from "../../assets/icons/right.svg";
import { ReactComponent as SideBySide } from "../../assets/icons/side-by-side.svg";
import { ReactComponent as SidePad } from "../../assets/icons/side-pad.svg";
import { ReactComponent as Size } from "../../assets/icons/size.svg";
import { ReactComponent as AddLink } from "../../assets/icons/add-link.svg";
import { ReactComponent as Underline } from "../../assets/icons/underline.svg";
import { styler } from "../../utils";
function OnOff({ onClick, type = "bold", value = false }) {
  return (
    <div className={styler(["on-off pointy", { active: value }])} onClick={onClick}>
      {Icons(type)}
    </div>
  );
}

const Icons = (type) => {
  switch (type) {
    case "bold":
      return <Bold />;
    case "italic":
      return <Italic />;
    case "underline":
      return <Underline />;
    case "alignLeft":
      return <Left />;
    case "alignCenter":
      return <Center />;
    case "alignRight":
      return <Right />;
    case "list":
      return <List />;
    case "padding":
      return <Padding />;
    case "sideBySide":
      return <SideBySide />;
    case "link":
      return <Link />;
    case "color":
      return <Color />;
    case "sidePad":
      return <SidePad />;
    case "addLink":
      return <AddLink />;
    default:
      return <Size />;
  }
};
export default OnOff;

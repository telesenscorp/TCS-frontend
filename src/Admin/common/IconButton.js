import { ReactComponent as AlignLeft } from "../../assets/admin/align-left.svg";
import { ReactComponent as Branch } from "../../assets/admin/branch.svg";
import { ReactComponent as ChevDown } from "../../assets/admin/chev-down.svg";
import { ReactComponent as ChevUp } from "../../assets/admin/chev-up.svg";
import { ReactComponent as ChevronCircledDown } from "../../assets/admin/chevron-circled-down.svg";
import { ReactComponent as ChevronCircledLeft } from "../../assets/admin/chevron-circled-left.svg";
import { ReactComponent as ChevronCircledRight } from "../../assets/admin/chevron-circled-right.svg";
import { ReactComponent as ChevronCircledUp } from "../../assets/admin/chevron-circled-up.svg";
import { ReactComponent as Computer } from "../../assets/admin/comp.svg";
import { ReactComponent as Copy } from "../../assets/admin/copy.svg";
import { ReactComponent as Remove } from "../../assets/admin/cross.svg";
import { ReactComponent as Edit } from "../../assets/admin/edit.svg";
import { ReactComponent as EyeOff } from "../../assets/admin/eye-off.svg";
import { ReactComponent as Eye } from "../../assets/admin/eye.svg";
import { ReactComponent as Laptop } from "../../assets/admin/laptop.svg";
import { ReactComponent as Mobile } from "../../assets/admin/phone.svg";
import { ReactComponent as Add } from "../../assets/admin/plus.svg";
import { ReactComponent as Save } from "../../assets/admin/save.svg";
import { ReactComponent as Select } from "../../assets/admin/select.svg";
import { ReactComponent as Sort } from "../../assets/admin/sort.svg";
import { ReactComponent as Tablet } from "../../assets/admin/tablet.svg";
const Icons = {
  down: <ChevDown />,
  up: <ChevUp />,
  computer: <Computer />,
  eyeOff: <EyeOff />,
  eye: <Eye />,
  laptop: <Laptop />,
  mobile: <Mobile />,
  tablet: <Tablet />,
  add: <Add />,
  remove: <Remove />,
  copy: <Copy />,
  save: <Save />,
  edit: <Edit />,
  select: <Select />,
  branch: <Branch />,
  sort: <Sort />,
  alignLeft: <AlignLeft />,
  chevronCircledUp: <ChevronCircledUp />,
  chevronCircledDown: <ChevronCircledDown />,
  chevronCircledRight: <ChevronCircledRight />,
  chevronCircledLeft: <ChevronCircledLeft />,
};
function IconButton({ name, onClick }) {
  return (
    <div className="icon-button pointy" onClick={onClick}>
      {Icons[name]}
    </div>
  );
}
export function SvgButton({ name = "add", btn = "other", onClick = () => {}, visible, toggle, children }) {
  return (
    <div
      className={`button ${btn} ${toggle ? "active" : ""} svg-icon pointy ${visible ? "matt" : "vibe"}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}>
      {Icons[name]}
      {children}
    </div>
  );
}

export default IconButton;

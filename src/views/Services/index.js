import { useSelector } from "react-redux";
import Main from "./Main";
import Mobile from "./Mobile";

export default function Services(props) {
  const { mobileBrowser, sideBarWidth } = useSelector(({ layout }) => layout);
  return mobileBrowser ? <Mobile {...props} /> : <Main sbw={sideBarWidth} {...props} />;
}

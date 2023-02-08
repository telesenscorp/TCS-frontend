import { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userUpdate } from "../configuration/redux/User.slice";
import PointerContext, { mouseEvents, types } from "./pointer/Context";

const LocaleToggle = ({ bg, color, activeColor, activeBg, borderColor, borderWidth, hoverColor }) => {
  const dispatch = useDispatch();
  const context = useContext(PointerContext);
  const { locale } = useSelector(({ user }) => user);
  return (
    <div className={`locale-btn bg-${bg} bw${borderWidth} border-color-${borderColor}`}>
      <input className={`hover-border-color-${hoverColor}`} type="checkbox" checked={locale === "en"} onChange={() => dispatch(userUpdate({ locale: locale === "ua" ? "en" : "ua" }))} {...mouseEvents(context, types.link)} />
      <div data-left="UA" data-right="EN" className={`knobs color-before-${activeColor} bg-before-${activeBg}`} />
      <div data-left="UA" data-right="EN" className={`labels color-before-${color} color-after-${color}`} />
    </div>
  );
};
export default LocaleToggle;

import { useContext } from "react";
import { useDispatch } from "react-redux";
import { Link as RouteLink, useNavigate } from "react-router-dom";
import { hideMenu } from "../configuration/redux/Layout.slice";
import { styler, toPath } from "../utils";
import PointerContext, { mouseEvents, types } from "./pointer/Context";
const Link = ({
  label,
  to,
  className = "",
  type = "Body",
  center,
  italic,
  contrast = "",
  color = "white",
  after = "bright-green",
  external,
}) => {
  const dispatch = useDispatch();
  const context = useContext(PointerContext);
  const Props = {
    className: styler([type, "animated-link", className, { "text-center": center, ["contrast-ab-" + contrast]: contrast, italic }]),
  };
  const Label = (
    <span className="title">
      <span
        data-text={label}
        onClick={() => (!external ? dispatch(hideMenu()) : null)}
        className={styler([{ ["contrast-ab-" + contrast]: contrast, ["color-after-" + after]: after, ["color-before-" + color]: color }])}>
        {label}
      </span>
    </span>
  );
  if (external) {
    return (
      <a {...Props} href={to} target="_blank" rel="noopener noreferrer" {...mouseEvents(context, types.link)}>
        {Label}
      </a>
    );
  }
  return (
    <RouteLink to={toPath(to)} {...Props} {...mouseEvents(context, types.link)}>
      {Label}
    </RouteLink>
  );
};
export const CustomLink = ({ label, to, color, contrast, className = "", external, children }) => {
  const dispatch = useDispatch();
  const context = useContext(PointerContext);
  let navigate = useNavigate();
  const Label = (
    <span
      className={styler(["label", { ["color-" + color]: color, ["contrast-color-" + contrast]: contrast }])}
      onClick={() => dispatch(hideMenu())}>
      {label}
    </span>
  );
  if (external) {
    return (
      <a href={to} className={className} target="_blank" rel="noopener noreferrer" {...mouseEvents(context, types.link)}>
        {Label}
        {children}
      </a>
    );
  }
  return (
    <a className={className} onClick={() => navigate(toPath(to))} {...mouseEvents(context, types.link)}>
      {Label}
      {children}
    </a>
  );
};
export default Link;

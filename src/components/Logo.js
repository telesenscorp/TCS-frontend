import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ReactComponent as LogoSvg } from "../assets/logo.svg";
import { styler } from "../utils";
import PointerContext, { mouseEvents, types } from "./pointer/Context";
function Logo({ color, admin }) {
  const context = useContext(PointerContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [home, setHome] = useState("");
  useEffect(() => {
    let res = "";
    let len = pathname.split("").filter((s) => s === "/").length;
    for (let i = 0; i < len; i++) {
      res += "../";
      if (i === len - 1) {
      }
    }
    setHome(res);
  }, [pathname]);
  return <LogoSvg onClick={() => !admin ? navigate(home) : ""} {...mouseEvents(context, types.link)} className={styler([`fill-${color}`, {"admin-logo": admin}])} />;
}

export default Logo;

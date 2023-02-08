import React, { useEffect, useId, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { StickyButton, Text } from "../components";
const NotFound = ({ color, bg, title }) => {
  const ID = useId();
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
  return (
    <section id={ID} className={`not-found-root bg-${bg}`}>
      <div className="t404">
        <div className="message">
          <Text type="Sub" color={color}>
            {title}
          </Text>
          <StickyButton className="back-home">
            <div onClick={() => navigate(home)} className="back-home-btn" id="floating-pointer"></div>
            {/* <div className="pulse">
              <FloatingPointer name="back-home" onClick={() => navigate(home)} className="back-home" />
            </div> */}
          </StickyButton>
        </div>
        <Text type="None" className="not-found" italic>
          404
        </Text>
      </div>
    </section>
  );
};

export default NotFound;

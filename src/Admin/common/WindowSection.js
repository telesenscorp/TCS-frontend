import { useState } from "react";
import { styler } from "../../utils";
function WindowSection({ children, label, left = [], right = [] }) {
  const [mini, setMini] = useState(true);
  return (
    <div className="form-container">
      <div className={styler(["window", { hidden: mini }])}>
        <div
          className="header"
          onClick={(e) => {
            e.stopPropagation();
            setMini(!mini);
          }}>
          <div className="mini-max f1 justify-left">
            {left.map(({ name, fn }) => (
              <div key={name} className="button other" onClick={fn}>
                <p>{name}</p>
              </div>
            ))}
          </div>
          <div className="mini-max f1 center">
            <p className="color-white">{label}</p>
          </div>
          <div className="mini-max f1 justify-right">
            {right.map(({ name, fn }) => (
              <div key={name} className="button other" onClick={fn}>
                <p>{name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="body">
          <div className="item">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default WindowSection;

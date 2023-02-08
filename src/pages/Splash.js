import React from "react";
import "../styles/Splash.scss";
const Splash = () => {
  return (
    <div className="splash">
      <div className="splash-container">
        <svg width="700" height="500" viewBox="0 0 500 700" fill="none" xmlns="http://www.w3.org/2000/svg">
          <text x="40%" y="50%" textAnchor="end">
            TELE
          </text>
          <text x="40%" y="50%" textAnchor="start">
            SENS
          </text>
        </svg>
      </div>
    </div>
  );
};
export default Splash;

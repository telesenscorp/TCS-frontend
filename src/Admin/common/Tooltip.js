import { useEffect, useRef } from "react";
import { styler } from "../../utils";
const Tooltip = ({ label, children }) => {
const ref = useRef(null);
useEffect(() => {
if (ref.current?.offsetLeft > window.innerWidth / 2 && !ref.current.classList.contains("right-side")) {
  ref.current.classList.add("right-side")
}
}, [ref.current])

  return (
    <div ref={ref} className={styler(["tooltip"])}>
      {children}
      <div>
        <p>{label}</p>
      </div>
    </div>
  );
};
export default Tooltip;

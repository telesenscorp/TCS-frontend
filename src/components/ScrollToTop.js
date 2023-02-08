import { useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { hideMenu } from "../configuration/redux/Layout.slice";
import PointerContext, { types } from "./pointer/Context";
function ScrollToTop() {
  const location = useLocation();
  // const jumpTo = useNavigate();
  // const ref = useRef(null);
  const dispatch = useDispatch();
  // const { to, label } = useSelector(({ layout }) => layout.transition);
  const { setType } = useContext(PointerContext);
  useEffect(() => {
    document.documentElement.style.setProperty("--smoothy", "auto");
    setTimeout(() => {
      dispatch(hideMenu());
      setType(types.default);
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.style.setProperty("--smoothy", "smooth");
    }, 100);
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
  // return (
  //   <div className="transition-container">
  //     <div ref={ref} id="transition-layer" className="transition-layer frc">
  //       <span className="main-line">
  //         {label.split("").map((v, i) => (
  //           <span className="letter-box" key={v + i}>
  //             <span className="letter-inner">{v}</span>
  //           </span>
  //         ))}
  //       </span>
  //     </div>
  //   </div>
  // );
}
export default ScrollToTop;

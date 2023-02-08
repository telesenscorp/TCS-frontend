import React, { useCallback, useState } from "react";
import PointerContext, { types } from "./Context";

const PointerManager = ({ children }) => {
  const [swiping, updateSwiping] = useState(false);
  const [type, setType] = useState("");
  const setSwiping = useCallback((t = types.default, s = false) => {
    updateSwiping(s);
    setType(t);
  }, []);
  return <PointerContext.Provider value={{ type, setType, swiping, setSwiping }}>{children}</PointerContext.Provider>;
};
export default PointerManager;

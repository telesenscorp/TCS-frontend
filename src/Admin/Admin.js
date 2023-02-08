import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PointerContext from "../components/pointer/Context";
import { showPopUp } from "../configuration/redux/Layout.slice";
import { setup } from "../configuration/server";
import "../styles/Admin.scss";
import Login from "./Login";
import Panel from "./Panel";
const Admin = (pops) => {
  const { setType } = useContext(PointerContext);
  const { logged, accessToken } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();
  let root = document.documentElement;
  function moveSnippet({pageX, pageY}) {
    root.style.setProperty('--x', pageX + "px");
    root.style.setProperty('--y', pageY + "px");  
  }
  useEffect(() => {
    setType("no-cursor");
    if (accessToken) {
      setup(accessToken, (promptMessage) => dispatch(showPopUp({ promptMessage })));
    }
    window.addEventListener('mousemove', moveSnippet)

    return () => {
      window.removeEventListener('mousemove', moveSnippet)
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return logged ? <Panel /> : <Login />;
};

export default Admin;

import axios from "axios";
import { uniqueId } from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import Admin from "./Admin/Admin";
import "./App.css";
import "./App.scss";
import { ScrollToTop, Snackbar } from "./components";
import Pointer from "./components/pointer";
import PointerManager from "./components/pointer/Manager";
import { contentUpdate, setScreen } from "./configuration/redux/Layout.slice";
import { userUpdate } from "./configuration/redux/User.slice";
import { Get } from "./configuration/server";
import { Page } from "./pages";

const App = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState(false);
  const { content } = useSelector(({ layout }) => layout);
  const { locale } = useSelector(({ user }) => user);
  const onAdminPanel = window.location.pathname === "/ap";
  const off = () => {
    if (state) return null;
    const splashScreen = document.getElementById("splash-screen");
    if (splashScreen) splashScreen.remove();
    setState(true);
  };
  const fetchData = async (value) => {
    await Get(
      ["content", value],
      (res) => {
        let routes = [];
        let pages = {};
        res.forEach((e) => {
          routes.push(e.route);
          pages[e.route] = JSON.parse(e.content);
        });
        dispatch(contentUpdate({ routes, pages }));
        // off();
        setTimeout(off, 2500);
      },
      off
    );
  };
  const initiate = async () => {
    if (locale) {
      fetchData(locale);
    } else {
      try {
        const { data } = await axios.get("https://api.ipify.org");
        Get(["ping", data], (res) => {
          let value = res === "ua" ? "ua" : "en";
          dispatch(userUpdate({ ip: data, locale: value, location: res }));
          fetchData(value);
        });
      } catch (error) {
        fetchData("ua");
      }
    }
  };
  useEffect(() => {
    if (onAdminPanel) {
      off();
    } else {
      function screenResize() {
        let supportsPassive = false;
        try {
          window.addEventListener(
            "test",
            null,
            Object.defineProperty({}, "passive", {
              get: () => {
                supportsPassive = true;
              },
            })
          );
        } catch (e) {}
        const ratio = window.devicePixelRatio || 1;
        const wheelOpt = supportsPassive ? { passive: false } : false;
        const wheelEvent = "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";
        const sw = window.innerWidth || document.documentElement.clientWidth;
        dispatch(setScreen({ sw: ratio === 1.25 ? sw * ratio : sw, wheelOpt, wheelEvent }));
      }
      screenResize();
      window.addEventListener("resize", screenResize);
      return () => window.removeEventListener("resize", screenResize);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    initiate();
    return () => {};
  }, [locale]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!state) {
    return <div className="bg-navy-green" />;
  }
  if (onAdminPanel) {
    return <Admin />;
  }
  return (
    <PointerManager>
      <ScrollToTop />
      <Pointer />
      <div className="fade bg-navy-green" />
      <Routes>
        {content.routes.map((r, i) => (
          <Route key={uniqueId(i)} path={"/" + r.toLowerCase()} element={<Page content={content.pages[r]} pos={i} />} />
        ))}
        <Route index element={content?.pages?.Home ? <Page content={content?.pages?.Home || []} /> : <div />} />
        {["uk", "ru", "ua", "en"].map((v) => (
          <Route key={v} path={"/" + v} element={<Navigate to="/" replace />} />
        ))}
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Routes>
      <Snackbar />
    </PointerManager>
  );
};
export default App;

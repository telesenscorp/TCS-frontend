import React, { Fragment, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { Post } from "../configuration/server";
import Views, { ViewsList } from "../views";
const Page = ({ content, pos }) => {
  const { layout, user } = useSelector((state) => state);
  useLayoutEffect(() => {
    const { ip, locale, location } = user;
    Post("createEvent", {
      ip: ip || "unknown",
      locale: locale || "ua",
      location: location || "unknown",
      type: 0,
      event: "visit",
      mode: layout.widthType,
      browser: window.navigator.userAgent,
    });
  }, []);
  return (
    <Fragment>
      {content.map(({ section, props }, i) => {
        try {
          if (!ViewsList.includes(section) || props?.visibilityOptions?.[layout.widthType]) {
            return null;
          }
          return React.createElement(Views[section], { ...props, key: "m-" + i });
        } catch (error) {
          console.error(error);
          return null;
        }
      })}
    </Fragment>
  );
};
export default Page;

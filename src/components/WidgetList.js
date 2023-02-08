import React, { useContext, useEffect, useState } from "react";
import { ReactComponent as Bookmark } from "../assets/bookmark.svg";
import PointerContext, { mouseEvents, types } from "./pointer/Context";
import Text from "./Text";

export function BookmarkList({ list = [], label = "", className = "" }) {
  const context = useContext(PointerContext);
  const [booked, setBooked] = useState(-1);
  useEffect(() => {
    const anchorPositions = [];
    setTimeout(() => {
      const anchorList = document.querySelectorAll(".anchor-name");
      if (anchorList.length) {
        if (anchorList[0].offsetParent?.localName === "body") {
          for (let i = 0; i < anchorList.length; i++) {
            anchorPositions.push(anchorList[i].offsetTop);
          }
        } else {
          for (let i = 0; i < anchorList.length; i++) {
            const ratio = window.devicePixelRatio || 1;
            const offsetTopParent = anchorList[i].offsetParent?.offsetTop ? anchorList[i].offsetParent?.offsetTop : 0;
            anchorPositions.push(Math.floor((anchorList[i].offsetTop/ratio) + offsetTopParent));
          }
        }
      }
    } , 100);
    function checkBookmarks() {
      const point = Math.floor(window.pageYOffset);
      if (point >= anchorPositions[anchorPositions.length - 1]) {
        return setBooked(anchorPositions.length - 1);
      }
      setBooked(anchorPositions.findIndex((v) => v >= point));
    }
    window.addEventListener("scroll", checkBookmarks);
    return () => {
      window.removeEventListener("scroll", checkBookmarks);
    };
  }, [list]);
  return list.length > 0 ? (
    <div className={className}>
      <Text type="Sub" mv={12} color="black">
        {label}
      </Text>
      {list.map((e, i) => (
        <a key={"L-" + i} className="flex-row align-center gap8 mb12" href={`#${e}`} {...mouseEvents(context, types.link)}>
          {booked === i ? <Bookmark /> : null}
          <Text color={booked === i ? "navy-green" : "grey"} children={[e]} />
        </a>
      ))}
    </div>
  ) : null;
}
function WidgetList({ list = [], label = "", className = "" }) {
  return label && list.length > 0 ? (
    <div className={className}>
      <Text type="Sub" mb={12} color="black">
        {label}
      </Text>
      {list.map((e, i) => (e ? <Text key={"L-" + i} color="black" children={[e]} /> : null))}
    </div>
  ) : null;
}
export default WidgetList;

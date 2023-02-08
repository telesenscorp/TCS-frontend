import { createContext } from "react";
const PointerContext = createContext({
  type: "",
  swiping: false,
  setType: () => {},
  setSwiping: () => {},
});
export const types = {
  greenSwipe: "arrow-cursor green-swipe",
  greenPointer: "arrow-cursor green-pointer",
  whiteSwipe: "arrow-cursor white-swipe",
  whitePointer: "arrow-cursor white-pointer",
  link: "link-pointer",
  text: "cursor-text",
  default: "default",
  zoom: "arrow-cursor zoom",
};
export const mouseEvents = ({ swiping, type, setType }, mouseIn, mouseOut = types.default) => ({
  onPointerEnter: (e) => {
    if (type !== mouseIn && !swiping) {
      e.stopPropagation();
      setType(mouseIn);
    }
  },
  onPointerMove: (e) => {
    if (type !== mouseIn && !swiping) {
      e.stopPropagation();
      setType(mouseIn);
    }
  },
  onPointerLeave: (e) => {
    if (type !== mouseOut) {
      e.stopPropagation();
      setType(mouseOut);
    }
  },
});
export default PointerContext;

import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dragUpdate } from "../../configuration/redux/Panel";
import { styler } from "../../utils";
import { SvgButton } from "./IconButton";
import Tooltip from "./Tooltip";
const defaultOptions = { tablet: false, mobile: false, desktop: false, laptop: false };
const hints = {
  eye: "show settings",
  eyeOff: "hide settings",
  copy: "copy settings",
  remove: "remove section",
  sort: "sort cards",
  computer: "toggle computer (FullHD)",
  laptop: "toggle laptop (HD)",
  tablet: "toggle tablet",
  mobile: "toggle mobile",
  up: "move up",
  down: "move down",
  add: "add a new section below",
};
const ImageButton = ({
  onToggleVisibility = () => {},
  onClick = () => {},
  index,
  name = "add",
  visibilityOptions,
  type = "",
  btn = "other",
}) => (
  <Tooltip label={hints[name]}>
    <SvgButton
      {...{ name, btn, visible: visibilityOptions?.[type] }}
      onClick={() =>
        type ? onToggleVisibility(index, { ...defaultOptions, ...visibilityOptions, [type]: !visibilityOptions?.[type] }) : onClick()
      }
    />
  </Tooltip>
);
let counter = null;
const ContainerForm = ({
  name,
  index,
  onAdd,
  onDelete,
  onMove,
  onUseDefault,
  onSetAsDefault,
  onToggleVisibility,
  visibilityOptions,
  innerVisible,
  virgin,
  onSort,
  changeInner,
  children,
}) => {
  const ref = useRef(null);
  const dispatch = useDispatch();
  const { drag } = useSelector(({ panel }) => panel);
  const [mini, setMini] = useState(true);
  return (
    <div
      ref={ref}
      key={name}
      className="form-container"
      onPointerEnter={() => (drag.active ? dispatch(dragUpdate({ position: index })) : null)}>
      <div
        className={styler([
          "window",
          {
            hidden: mini,
            "is-dragging": drag.active,
            selected: index === drag.index,
            "move-up": drag.index < index && drag.position >= index,
            "move-down": drag.index > index && drag.position <= index,
            "move-back": drag.position === drag.index,
          },
        ])}>
        <div
          className="header"
          onClick={(e) => {
            e.stopPropagation();
            if (!drag.active) setMini(!mini);
          }}>
          <div className="mini-max f1">
            <ImageButton btn="minimize" onClick={() => onAdd(index)} />
            <ImageButton btn="maximize" name={mini ? "eye" : "eyeOff"} onClick={() => setMini(!mini)} />
            <ImageButton name="up" onClick={() => onMove(index, -1)} />
            <ImageButton name="down" onClick={() => onMove(index, 1)} />
            <ImageButton {...{ index, visibilityOptions, onToggleVisibility, type: "desktop", name: "computer" }} />
            <ImageButton {...{ index, visibilityOptions, onToggleVisibility, type: "laptop", name: "laptop" }} />
            <ImageButton {...{ index, visibilityOptions, onToggleVisibility, type: "tablet", name: "tablet" }} />
            <ImageButton {...{ index, visibilityOptions, onToggleVisibility, type: "mobile", name: "mobile" }} />
          </div>
          <div
            className="f1"
            onPointerDown={({ clientY, clientX }) => {
              if (!mini) return;
              clearTimeout(counter);
              const { width } = ref.current.getBoundingClientRect();
              counter = setTimeout(
                () => dispatch(dragUpdate({ active: true, index, name, width, top: clientY, left: clientX, position: index })),
                500
              );
              window.addEventListener(
                "mouseup",
                () => {
                  clearTimeout(counter);
                  counter = setTimeout(() => dispatch(dragUpdate({ active: false })), 100);
                },
                { once: true }
              );
            }}>
            <p className={styler(["text-center hand cant-select color-white", { virgin }])}>{name}</p>
          </div>
          <div className="mini-max f1 justify-right">
            {onSort ? <ImageButton onClick={onSort} name="sort" /> : null}
            {changeInner ? (
              <Tooltip label="toggle inner content">
                <div
                  className={`button ${innerVisible ? "minimize" : "other"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    changeInner(!innerVisible);
                  }}>
                  <p className="cant-touch">inner content</p>
                </div>
              </Tooltip>
            ) : null}
            <Tooltip label={`paste copied ${name}`}>
              <div
                className="button other"
                onClick={(e) => {
                  e.stopPropagation();
                  onUseDefault(index);
                }}>
                <p className="cant-touch">paste</p>
              </div>
            </Tooltip>
            <ImageButton name="copy" onClick={() => onSetAsDefault(index)} />
            <ImageButton btn="close" name="remove" onClick={() => onDelete(index)} />
          </div>
        </div>
        <div className="body">
          <div className="item">{children}</div>
        </div>
      </div>
    </div>
  );
};
export default ContainerForm;

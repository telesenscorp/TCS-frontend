import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { panelClear } from "../../configuration/redux/Panel";

function SectionDrag({ onMove, onAdd }) {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const { index, name, active, position, top, left } = useSelector(({ panel }) => panel.drag);
  function animate({ clientY, clientX }) {
    ref.current.style = `top:${clientY - 17}px;left:${clientX - 40}px`;
  }
  useEffect(() => {
    if (active) {
      window.addEventListener("mousemove", animate);
      ref.current.style = `top:${top - 17}px;left:${left - 40}px`;
    } else {
      if (name && position !== index) {
        if (index === 99) {
          onAdd(position - 1);
        } else {
          onMove(index, position - index);
        }
      }
      dispatch(panelClear());
    }
    return () => window.removeEventListener("mousemove", animate);
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={ref} className={active ? "section-drag hand" : ""}>
      <div className="flex center">
        <p className="hand cant-select color-white">{name}</p>
      </div>
    </div>
  );
}

export default SectionDrag;

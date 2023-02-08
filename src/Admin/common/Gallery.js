import _ from "lodash";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { File_URL } from "../../common/constants";
import { eventsClear, eventsUpdate } from "../../configuration/redux/Events.slice";

const Gallery = ({ label = "url", value, onChange }) => {
  const ID = useRef(_.uniqueId("gallery-")).current;
  const dispatch = useDispatch();
  const { listener, value: newValue, read } = useSelector(({ events }) => events);
  useEffect(() => {
    if (listener === ID && read) {
      onChange(newValue);
      dispatch(eventsClear());
    }
  }, [read]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="gallery-container">
      <div
        className="selected-img pointy"
        onClick={() => dispatch(eventsUpdate({ id: "gallery-modal", listener: ID, active: true, read: false }))}>
        <p>{label}</p>
        {value ? (
          <div className="img">
            <div
              className="remove"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
            />
            <img src={File_URL + value} alt="img" />
          </div>
        ) : (
          <div className="img-placeholder flex center">+</div>
        )}
      </div>
    </div>
  );
};
export default Gallery;

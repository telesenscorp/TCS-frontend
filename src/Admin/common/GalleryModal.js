import { useDispatch, useSelector } from "react-redux";
import { File_URL } from "../../common/constants";
import { authUpdate } from "../../configuration/redux/Auth.slice";
import { eventsClear, eventsUpdate } from "../../configuration/redux/Events.slice";
import { Del, Get } from "../../configuration/server";
import { styler } from "../../utils";
import FileSelector from "./FileSelector";

function GalleryModal() {
  const { gallery } = useSelector(({ auth }) => auth);
  const dispatch = useDispatch();
  const { id, active, value } = useSelector(({ events }) => events);
  const onChange = (v) => {
    dispatch(eventsUpdate({ id: "", active: false, read: true, value: v }));
  };
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("are you sure you want to delete this file?")) {
      Del(["files", "single", e.target.id], () => {
        Get("allFiles", (gallery) => {
          dispatch(authUpdate({ gallery }));
        });
      });
    }
  };
  return id === "gallery-modal" && active ? (
    <div className="gallery-modal">
      <div className="close" onClick={() => dispatch(eventsClear())}>
        +
      </div>
      <div className="gallery">
        <FileSelector onUpload={onChange} />
        {gallery?.map(({ id, link, name }) => (
          <div className="img-box" key={id}>
            <p className="img-name">{name}</p>
            <img
              alt={name}
              loading="lazy"
              src={File_URL + link}
              onClick={() => onChange(link)}
              className={styler(["gallery-card", { "card-selected": link === value }])}
            />
            <div id={id} className="del pointy" onClick={handleDelete} />
          </div>
        ))}
      </div>
    </div>
  ) : null;
}

export default GalleryModal;

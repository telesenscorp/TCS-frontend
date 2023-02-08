import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as LogoSvg } from "../../assets/logo.svg";
import { authSignOut } from "../../configuration/redux/Auth.slice";
import { toggleSideBar } from "../../configuration/redux/Layout.slice";
import { Get } from "../../configuration/server";
import { download } from "../../utils";
import IconButton from "./IconButton";
const tabs = ["Builder", "Posts", "Settings", "Mail"];
const TopBar = ({ onSwitch, onSave, onImport }) => {
  const dispatch = useDispatch();
  const { username } = useSelector(({ auth }) => auth);
  const onExport = () => {
    Promise.all([Get("content"), Get("allPosts"), Get("allMails")]).then((res) => {
      const [content, posts, mails] = res;
      download(`${new Date().toDateString()}-tcs.json`, JSON.stringify({ content, mails, posts }));
    });
  };
  return (
    <div className="top-bar flex-row center">
      <div className="tabs f1">
        <LogoSvg className="fill-white admin-logo" />
      </div>
      <div className="tabs f1">
        <span className="color-white">Hi {username}!</span>
      </div>
      <div className="tabs f2">
        {tabs.map((v, i) => (
          <div key={v} onClick={() => onSwitch(i)} className="bar-button pointy">
            <span>{v}</span>
          </div>
        ))}
      </div>
      <div className="tabs f2">
        <div onClick={onImport} className="bar-button pointy">
          <span>Import</span>
        </div>
        <div onClick={onExport} className="bar-button pointy">
          <span>Export</span>
        </div>
        <div onClick={onSave} className="bar-button pointy">
          <span>Save</span>
        </div>
        <div
          onClick={() => {
            if (window.confirm("Are you sure you want to sign out?")) {
              dispatch(authSignOut());
            }
          }}
          className="bar-button pointy">
          <span>Sign out</span>
        </div>
      </div>
      <IconButton name="alignLeft" onClick={() => dispatch(toggleSideBar())} />
    </div>
  );
};
export default TopBar;

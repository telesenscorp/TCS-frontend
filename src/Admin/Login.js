import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Logo } from "../components";
import { authUpdate } from "../configuration/redux/Auth.slice";
import { showPopUp } from "../configuration/redux/Layout.slice";
import { Post, setup } from "../configuration/server";
const Login = () => {
  const dispatch = useDispatch();
  const { username } = useSelector(({ auth }) => auth);
  const [dto, setDto] = useState({ username, password: "" });
  const [error, setError] = useState("");
  const handleSend = () => {
    if (!isFilled()) return;
    Post(
      "login",
      dto,
      (res) => {
        setError("");
        dispatch(authUpdate({ ...res, logged: true, username: dto.username }));
        setup(res.accessToken, (promptMessage) => dispatch(showPopUp({ promptMessage })));
      },
      () => {
        setError("*You made a mistake in one of the fields. Please, try again");
      }
    );
  };
  const onChange = (e) => {
    setError("");
    setDto({ ...dto, [e.target.name]: e.target.value });
  };
  const isFilled = () => {
    return dto.username && dto.password;
  };
  return (
    <div className="flex center admin" style={{ height: "100vh", width: "100vw" }}>
      <Logo color="navy-green" admin />
      <div className="login-form" onSubmit={handleSend}>
        <input
          name="username"
          value={dto.username}
          onChange={onChange}
          placeholder="USER NAME"
          onKeyUp={(e) => {
            if (e.key.toLowerCase() === "enter") {
              handleSend();
            }
          }}
        />
        <input
          name="password"
          value={dto.password}
          onChange={onChange}
          placeholder="PASSWORD"
          onKeyUp={(e) => {
            if (e.key.toLowerCase() === "enter") {
              handleSend();
            }
          }}
        />
        <button className={`submit ${isFilled() ? "" : " disabled"}`} onClick={handleSend}>
          LOGIN
        </button>
        <div className="login-error-container">{error ? <p className="login-error">{error}</p> : null}</div>
      </div>
    </div>
  );
};
export default Login;

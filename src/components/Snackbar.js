import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { hidePopUp } from "../configuration/redux/Layout.slice";
import CloseButton from "./CloseButton";
import Text from "./Text";

const Snackbar = ({admin}) => {
  const dispatch = useDispatch();
  const { visible, promptTitle, promptMessage } = useSelector(({ layout }) => layout.popUp);
  if (admin && visible) {
    return (
      <div className="admin-snackbar-box">
        <div className="close-button" onClick={() => dispatch(hidePopUp())}/>
        <div className="flex-row gap12 align-center">
        <div data-content="!" className="warning"/>
        <p>{promptMessage}</p>
        </div>
      </div>
    )
  }
  return visible ? (
    <div className="snackbar">
      <div className="snackbar-box bg-light-grey">
        <div className="flex-row justify-between">
          <Text type="H3" italic color="navy-green" mb="8">
            {promptTitle}
          </Text>
          <CloseButton onClick={() => dispatch(hidePopUp())} fill="navy-green" />
        </div>
        <Text color="navy-green">{promptMessage}</Text>
      </div>
    </div>
  ) : null;
};
export default Snackbar;

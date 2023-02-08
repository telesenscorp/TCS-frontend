import React, {useState, useEffect} from 'react';
import CloseButton from '../components/CloseButton';
import { CustomLink } from '../components/Link';
import Text from '../components/Text';
import { styler } from '../utils';

const CookiePopup = ({title, text, bgColor = "light-grey", color = "navy-green", label, to}) => {
  const [state, setState] = useState(true);
  const [hidden, setHidden] = useState(false);
  const createCookie = (name, value, days) => {
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      const expires="expires=" + date.toUTCString();
      document.cookie = `${name}=${value};${expires};path=/`;
      setState(false);
      setHidden(true);
    }
  }

  useEffect(() => {
    if (document.cookie) {
      const cookieArr = document.cookie.split('; ');
      const visitCookie = cookieArr.find((el) => el.split('=').includes("visit"));
      const userCookie = cookieArr.find((el) => el.split('=').includes("user-cookie"));
      if (visitCookie) {
        setState(false);
        setHidden(true);
    }
    if (userCookie) setState(false);
  }
  }, [])
  
 
  return  <div className={styler(["cookie-popup", "bg-" + bgColor, "color-" + color, "align-center", { hidden }, {wide: !state}])}>
    <div className='flex row'>
      <Text type="H3" italic color={color} className="popup-title">{title}</Text>
      {!state ? <CloseButton onClick={() => createCookie("visit", "hide-cookie", 3)} fill={color}/> : null}
    </div>
    <Text color={color} className='popup-description'>{text} <CustomLink {...{label, to}} className={styler(["popup-link", "color-" + color, "medium", "italic"])}/></Text>
    
    {state ? <div className='flex row'>
      <div className={styler(["button", "color-" + color])} onClick={() => setHidden(true)}>Decline</div>
      <div className={styler(["button", "color-" + color, "bold"])} onClick={() => createCookie("user-cookie", 1, 30)}>Accept</div>
    </div> : null}
  </div>;
};

export default CookiePopup;
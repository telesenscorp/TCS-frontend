import { Fragment, useId } from "react";
import { useSelector } from "react-redux";
import { Link } from ".";
import { styler, uniqueId } from "../utils";
import Image from "./Image";
import { CustomLink } from "./Link";
const Menu = ({
  links = [],
  subLinks = [],
  follows = [],
  bg = "white",
  linkColor,
  subColor,
  subHoverColor,
  followColor,
  followHoverColor,
}) => {
  const ID = useId();
  const { menu, mobileBrowser } = useSelector(({ layout }) => layout);
  return (
    <section id={ID} className={styler(["main-menu", { visible: menu?.visible }])}>
      <div className="up">
        <div className="main-links">
          {links.map(({ label, url, to }, i) => {
            return (
              <div className="link" key={uniqueId(i)}>
                <CustomLink {...{ label, to, color: linkColor }}>
                  <Image lazy className="main-menu-picture" {...{ label, url }} />
                </CustomLink>
              </div>
            );
          })}
        </div>
        {mobileBrowser ? (
          <Fragment>
            <div className="page-links">
              {subLinks.map(({ label, url, to }, i) => (
                <Link {...{ label, to }} color={subColor} after={subHoverColor} key={uniqueId(i)} />
              ))}
            </div>
            <div className="follow-links">
              {follows.map(({ label, url, to }, i) => (
                <Link
                  type="None"
                  className="underlined-link"
                  {...{ label, to }}
                  color={followColor}
                  after={followHoverColor}
                  external
                  key={uniqueId(i)}
                />
              ))}
            </div>
          </Fragment>
        ) : (
          <div className="footer-links">
            <div className="follow-links">
              {follows.map(({ label, url, to }, i) => (
                <Link
                  type="None"
                  className="underlined-link"
                  {...{ label, to }}
                  color={followColor}
                  after={followHoverColor}
                  external
                  key={uniqueId(i)}
                />
              ))}
            </div>
            <div className="page-links">
              {subLinks.map(({ label, url, to }, i) => (
                <Link type="Sub2" {...{ label, to }} color={subColor} after={subHoverColor} key={uniqueId(i)} />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className={`menu bg-${bg}`} style={{ left: menu.x, top: menu.y }} />
    </section>
  );
};

export default Menu;

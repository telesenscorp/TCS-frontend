import React, { useId } from "react";
import { Link, Logo, Text } from "../components";
import { uniqueId } from "../utils";

const Footer = ({
  pages,
  phones,
  emails,
  addresses,
  follows,
  phonesTitle,
  emailsTitle,
  addressesTitle,
  followsTitle,
  copyright,
  color,
  bg = "grey-blue",
  hoverColor,
}) => {
  const ID = useId();
  return (
    <footer id={ID} className={`width-wrapper bg-${bg}`}>
      <div className="container flex-col">
        <div className="top-footer">
          <ul className="pages">
            {pages.map((props, i) => (
              <li key={uniqueId(i)} className="label">
                <Link type="Sub" {...props} color={color} after={hoverColor} />
              </li>
            ))}
          </ul>
          <ul className="contacts">
            <li className="label contact-title">
              <Text type="Sub" color={color}>
                {phonesTitle}
              </Text>
            </li>
            {phones.map((props, i) => (
              <li key={uniqueId(i)} className="link-label">
                <Text color={color}>{props.label}</Text>
              </li>
            ))}
            <li className="label contact-title">
              <Text type="Sub" color={color}>
                {emailsTitle}
              </Text>
            </li>
            {emails.map((props, i) => (
              <li key={uniqueId(i, 1)} className="link-label">
                <Text color={color}>{props.label}</Text>
              </li>
            ))}
            <li className="label contact-title">
              <Text type="Sub" color={color}>
                {addressesTitle}
              </Text>
            </li>
            {addresses.map((props, i) => (
              <li key={uniqueId(i, 2)} className="link-label">
                <Text color={color}>{props.label}</Text>
              </li>
            ))}
          </ul>
          <ul className="follow">
            <li className="label">
              <Text type="Sub" color={color}>
                {followsTitle}
              </Text>
            </li>
            {follows.map((props, i) => (
              <li key={uniqueId(i, 3)} className="link-label">
                <Link {...props} color={color} after={hoverColor} external />
              </li>
            ))}
          </ul>
        </div>
        <div className="bottom-footer">
          <Logo color={color} />
          <Text color={color}>{copyright}</Text>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

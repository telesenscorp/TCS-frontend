import { Fragment, useId } from "react";
import { LocaleToggle, Logo, Menu, MenuButton } from "../components";
export default function Header(props) {
  const ID = useId();
  const { headerBg, color, logoColor, localeToggle } = props;
  return (
    <Fragment>
      <Menu {...props} />
      <header id={ID} className={`bg-${headerBg || "navy-green"}`}>
        <div className="root">
          <Logo color={logoColor || color} />
          <div className="frc gap32">
            <LocaleToggle {...localeToggle} />
            <MenuButton color={color} />
          </div>
        </div>
      </header>
    </Fragment>
  );
}

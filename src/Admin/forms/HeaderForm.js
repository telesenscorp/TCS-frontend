import _ from "lodash";
import { ContainerForm, FormInput, Gallery, RowEditor } from "../common";
import { ColorPicker } from "../common/ListPicker";
const toggleAttributes = ["bg", "color", "activeColor", "activeBg", "borderColor", "hoverColor"];
const HeaderForm = ({
  links = [],
  subLinks = [],
  follows = [],
  bg,
  color,
  headerBg,
  logoColor,
  linkColor,
  subColor,
  subHoverColor,
  followColor,
  followHoverColor,
  localeToggle,
  modify = () => {},
  containerMethods,
  virgin,
  visibilityOptions,
  index,
}) => {
  const onModify = (value) => {
    modify(index, {
      links,
      subLinks,
      follows,
      bg,
      color,
      headerBg,
      logoColor,
      linkColor,
      subColor,
      subHoverColor,
      followColor,
      followHoverColor,
      visibilityOptions,
      localeToggle,
      ...value,
    });
  };
  const handleVariants = (value, key, prev, idx) => {
    let Arr = _.cloneDeep(prev);
    Arr[idx] = value;
    onModify({ [key]: Arr });
  };
  const handleInject = (value, key, src, i) => {
    let Arr = _.cloneDeep(src);
    if (value) {
      if (typeof value !== "object") throw new Error("Incorrect value");
      const copyValue = { ...value };
      for (let key in copyValue) {
        copyValue[key] = "";
      }
      Arr.splice(i + 1, 0, copyValue);
    } else {
      Arr.splice(i, 1);
    }
    onModify({ [key]: Arr });
  };
  return (
    <ContainerForm name="Header" {...containerMethods} {...{ visibilityOptions, index, virgin }}>
      <section className="section-divider">
        <ColorPicker name="header bg" value={headerBg} onChange={(v) => onModify({ headerBg: v })} />
        <ColorPicker name="menu button" value={color} onChange={(v) => onModify({ color: v })} />
        <ColorPicker isFont name="logo color" value={logoColor} onChange={(v) => onModify({ logoColor: v })} />
        <ColorPicker name="menu bg" value={bg} onChange={(v) => onModify({ bg: v })} />
        <ColorPicker isFont name="link color" value={linkColor} onChange={(v) => onModify({ linkColor: v })} />
        <ColorPicker isFont name="sub-link color" value={subColor} onChange={(v) => onModify({ subColor: v })} />
        <ColorPicker isFont name="sub-link hover" value={subHoverColor} onChange={(v) => onModify({ subHoverColor: v })} />
        <ColorPicker isFont name="follow color" value={followColor} onChange={(v) => onModify({ followColor: v })} />
        <ColorPicker isFont name="follow hover" value={followHoverColor} onChange={(v) => onModify({ followHoverColor: v })} />
        {toggleAttributes.map((n) => (
          <ColorPicker
            isFont
            key={n}
            name={"toggle " + n}
            value={localeToggle[n]}
            onChange={(v) => onModify({ localeToggle: { ...localeToggle, [n]: v } })}
          />
        ))}
        <FormInput
          label="toggle border width"
          value={localeToggle.borderWidth}
          onChange={(v) => onModify({ localeToggle: { ...localeToggle, borderWidth: v } })}
        />
      </section>
      <section className="section-divider">
        <p className="section-title variant">links</p>
        {links.map(({ label, to, url }, i) => (
          <div key={i + "Hero"} className="row">
            <RowEditor
              onAdd={() => handleInject({ label, to, url }, "links", links, i)}
              onRemove={() => handleInject(undefined, "links", links, i)}
            />
            <FormInput label="label" value={label} onChange={(e) => handleVariants({ label: e, to, url }, "links", links, i)} />
            <FormInput label="to" value={to} onChange={(e) => handleVariants({ label, to: e, url }, "links", links, i)} />
            <Gallery value={url} onChange={(e) => handleVariants({ label, to, url: e }, "links", links, i)} />
          </div>
        ))}
      </section>
      <section className="section-divider">
        <p className="section-title variant">subLinks</p>
        {subLinks.map(({ label, to, url }, i) => (
          <div key={i + "Hero"} className="row">
            <RowEditor
              onAdd={() => handleInject({ label, to, url }, "subLinks", subLinks, i)}
              onRemove={() => handleInject(undefined, "subLinks", subLinks, i)}
            />
            <FormInput label="label" value={label} onChange={(e) => handleVariants({ label: e, to, url }, "subLinks", subLinks, i)} />
            <FormInput label="to" value={to} onChange={(e) => handleVariants({ label, to: e, url }, "subLinks", subLinks, i)} />
            <Gallery value={url} onChange={(e) => handleVariants({ label, to, url: e }, "subLinks", subLinks, i)} />
          </div>
        ))}
      </section>
      <section className="section-divider">
        <p className="section-title variant">follows</p>
        {follows.map(({ label, to, url }, i) => (
          <div key={i + "Hero"} className="row">
            <RowEditor
              onAdd={() => handleInject({ label, to, url }, "follows", follows, i)}
              onRemove={() => handleInject(undefined, "follows", follows, i)}
            />
            <FormInput label="label" value={label} onChange={(e) => handleVariants({ label: e, to, url }, "follows", follows, i)} />
            <FormInput label="to" value={to} onChange={(e) => handleVariants({ label, to: e, url }, "follows", follows, i)} />
            <Gallery value={url} onChange={(e) => handleVariants({ label, to, url: e }, "follows", follows, i)} />
          </div>
        ))}
      </section>
    </ContainerForm>
  );
};
export default HeaderForm;

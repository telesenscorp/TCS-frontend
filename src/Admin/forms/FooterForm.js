import _ from "lodash";
import { ContainerForm, FormInput, RowEditor } from "../common";
import { ColorPicker } from "../common/ListPicker";
const FooterForm = ({
  pages = [],
  phones = [],
  emails = [],
  addresses = [],
  follows = [],
  copyright,
  containerMethods,
  virgin,
  visibilityOptions,
  phonesTitle = "phones",
  emailsTitle = "email(s)",
  addressesTitle = "addresses",
  followsTitle = "follows",
  bg,
  color,
  hoverColor,
  modify = () => {},
  index,
}) => {
  const onModify = (value) => {
    modify(index, {
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
      bg,
      color,
      hoverColor,
      visibilityOptions,
      ...value,
    });
  };
  const handleVariants = (value, key, prev, idx) => {
    let Arr = _.cloneDeep(prev);
    Arr[idx] = value;
    onModify({ [key]: Arr });
  };
  const handleInject = (value, key, prev, i) => {
    let Arr = _.cloneDeep(prev);
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
    <ContainerForm name="Footer" {...containerMethods} {...{ visibilityOptions, index, virgin }}>
      <section className="section-divider row">
        <FormInput label="addresses title" value={phonesTitle} onChange={(e) => onModify({ phonesTitle: e })} />
        <FormInput label="addresses title" value={emailsTitle} onChange={(e) => onModify({ emailsTitle: e })} />
        <FormInput label="addresses title" value={addressesTitle} onChange={(e) => onModify({ addressesTitle: e })} />
        <FormInput label="follows title" value={followsTitle} onChange={(e) => onModify({ followsTitle: e })} />
        <FormInput label="copyright" value={copyright} onChange={(e) => onModify({ copyright: e })} />
        <ColorPicker name="background" value={bg} onChange={(e) => onModify({ bg: e })} />
        <ColorPicker isFont name="text" value={color} onChange={(e) => onModify({ color: e })} />
        <ColorPicker isFont name="hover" value={hoverColor} onChange={(e) => onModify({ hoverColor: e })} />
      </section>
      <section className="section-divider">
        <p className="section-title variant">pages</p>
        {pages.map(({ label, to }, i) => (
          <div className="row" key={"f-" + i}>
            <RowEditor
              onAdd={() => handleInject({ label, to }, "pages", pages, i)}
              onRemove={() => handleInject(undefined, "pages", pages, i)}
            />
            <FormInput label="label" value={label} onChange={(e) => handleVariants({ label: e, to }, "pages", pages, i)} />
            <FormInput label="to" value={to} onChange={(e) => handleVariants({ label, to: e }, "pages", pages, i)} />
          </div>
        ))}
      </section>
      <section className="section-divider">
        <p className="section-title variant">{phonesTitle}</p>
        {phones.map(({ label, to }, i) => (
          <div className="row" key={"g-" + i}>
            <RowEditor
              onAdd={() => handleInject({ label, to }, "phones", phones, i)}
              onRemove={() => handleInject(undefined, "phones", phones, i)}
            />
            <FormInput label="label" value={label} onChange={(e) => handleVariants({ label: e, to }, "phones", phones, i)} />
            {/* <FormInput label="to" value={to} onChange={(e) => handleVariants({ label, to: e }, "phones", phones, i)} /> */}
          </div>
        ))}
      </section>
      <section className="section-divider">
        <p className="section-title variant">{emailsTitle}</p>
        {emails.map(({ label, to }, i) => (
          <div className="row" key={"h-" + i}>
            <RowEditor
              onAdd={() => handleInject({ label, to }, "emails", emails, i)}
              onRemove={() => handleInject(undefined, "emails", emails, i)}
            />
            <FormInput label="label" value={label} onChange={(e) => handleVariants({ label: e, to }, "emails", emails, i)} />
            {/* <FormInput label="to" value={to} onChange={(e) => handleVariants({ label, to: e }, "emails", emails, i)} /> */}
          </div>
        ))}
      </section>
      <section className="section-divider">
        <p className="section-title variant">{addressesTitle}</p>
        {addresses.map(({ label, to }, i) => (
          <div className="row" key={"i-" + i}>
            <RowEditor
              onAdd={() => handleInject({ label, to }, "addresses", addresses, i)}
              onRemove={() => handleInject(undefined, "addresses", addresses, i)}
            />
            <FormInput label="label" value={label} onChange={(e) => handleVariants({ label: e, to }, "addresses", addresses, i)} />
            {/* <FormInput label="to" value={to} onChange={(e) => handleVariants({ label, to: e }, "addresses", addresses, i)} /> */}
          </div>
        ))}
      </section>
      <section className="section-divider">
        <p className="section-title variant">{followsTitle}</p>
        {follows.map(({ label, to }, i) => (
          <div className="row" key={"j-" + i}>
            <RowEditor
              onAdd={() => handleInject({ label, to }, "follows", follows, i)}
              onRemove={() => handleInject(undefined, "follows", follows, i)}
            />
            <FormInput label="label" value={label} onChange={(e) => handleVariants({ label: e, to }, "follows", follows, i)} />
            <FormInput label="to" value={to} onChange={(e) => handleVariants({ label, to: e }, "follows", follows, i)} />
          </div>
        ))}
      </section>
    </ContainerForm>
  );
};
export default FooterForm;

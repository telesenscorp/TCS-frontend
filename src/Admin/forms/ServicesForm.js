import { ContainerForm, FormInput, Gallery, RowEditor } from "../common";
import { ColorPicker } from "../common/ListPicker";
const ServicesForm = ({
  products = [],
  heading,
  bg,
  color,
  sideBg,
  sideColor,
  hoverColor,
  modify = () => {},
  containerMethods,
  virgin,
  visibilityOptions,
  index,
}) => {
  const onModify = (v) => {
    modify(index, { products, heading, bg, color, sideBg, sideColor, hoverColor, visibilityOptions, ...v });
  };
  const handleChange = (value, i) => {
    let Arr = [...products];
    Arr[i] = value;
    onModify({ products: Arr });
  };
  const handleInject = (value, i) => {
    let Arr = [...products];
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
    onModify({ products: Arr });
  };
  return (
    <ContainerForm name="Services" {...containerMethods} {...{ visibilityOptions, index, virgin }}>
      <section className="section-divider row">
        <FormInput label="side title" value={heading} onChange={(e) => onModify({ heading: e })} />
        <ColorPicker name="background" value={bg} onChange={(e) => onModify({ bg: e })} />
        <ColorPicker isFont name="text" value={color} onChange={(e) => onModify({ color: e })} />
        <ColorPicker name="side background" value={sideBg} onChange={(e) => onModify({ sideBg: e })} />
        <ColorPicker isFont name="side text" value={sideColor} onChange={(e) => onModify({ sideColor: e })} />
        <ColorPicker isFont name="hover color" value={hoverColor} onChange={(e) => onModify({ hoverColor: e })} />
      </section>
      <section className="section-divider">
        {products.map(({ title, url, to }, i) => (
          <div key={i + "Services"} className="row">
            <RowEditor onAdd={() => handleInject({ title, url, to }, i)} onRemove={() => handleInject(undefined, i)} />
            <FormInput label="title" value={title} onChange={(e) => handleChange({ url, title: e, to }, i)} />
            <Gallery value={url} onChange={(e) => handleChange({ url: e, title, to }, i)} />
            <FormInput label="to" value={to} onChange={(e) => handleChange({ url, title, to: e }, i)} />
          </div>
        ))}
      </section>
    </ContainerForm>
  );
};
export default ServicesForm;

import { ContainerForm, FormInput, Gallery, RowEditor } from "../common";
import { ColorPicker } from "../common/ListPicker";
const TechnologiesForm = ({
  technologies = [],
  heading,
  bg,
  color,
  tabBg,
  sideBg,
  sideColor,
  innerHtml,
  modify = () => {},
  containerMethods,
  virgin,
  visibilityOptions,
  index,
}) => {
  const onModify = (e) => {
    modify(index, { technologies, innerHtml, heading, bg, color, tabBg, sideBg, sideColor, visibilityOptions, ...e });
  };
  const handleChange = (value, i) => {
    let Arr = [...technologies];
    Arr[i] = value;
    onModify({ technologies: Arr });
  };
  const handleVariants = (value, lvl1, lvl2) => {
    let Arr = [...technologies];
    Arr[lvl1].variants[lvl2] = value;
    onModify({ technologies: Arr });
  };
  const handleInjectVariant = (value, lvl1, lvl2) => {
    let Arr = [...technologies];
    if (value) {
      if (typeof value !== "object") throw new Error("Incorrect value");
      const copyValue = { ...value };
      for (let key in copyValue) {
        copyValue[key] = "";
      }
      Arr[lvl1].variants.splice(lvl2 + 1, 0, copyValue);
    } else {
      Arr[lvl1].variants.splice(lvl2, 1);
    }
    onModify({ technologies: Arr });
  };
  const handleInjectTab = (value, i) => {
    let Arr = [...technologies];
    if (value) {
      if (typeof value !== "object") throw new Error("Incorrect value");
      const copyValue = JSON.parse(JSON.stringify(value));
      for (let key in copyValue) {
        if (Array.isArray(copyValue[key])) {
          for (let k in copyValue[key][0]) {
            copyValue[key][0][k] = "";
          }
          copyValue[key] = copyValue[key].splice(0, 1);
        } else copyValue[key] = "";
      }
      Arr.splice(i + 1, 0, copyValue);
    } else {
      Arr.splice(i, 1);
    }
    onModify({ technologies: Arr });
  };
  return (
    <ContainerForm
      name="Technologies"
      {...containerMethods}
      {...{ visibilityOptions, index, virgin }}>
      <section className="section-divider row">
        <FormInput label="side bar title" value={heading} onChange={(e) => onModify({ heading: e })} />
        <ColorPicker name="side background" value={sideBg} onChange={(e) => onModify({ sideBg: e })} />
        <ColorPicker isFont name="side text" value={sideColor} onChange={(e) => onModify({ sideColor: e })} />
        <ColorPicker name="background" value={bg} onChange={(e) => onModify({ bg: e })} />
        <ColorPicker isFont name="tab text" value={color} onChange={(e) => onModify({ color: e })} />
        <ColorPicker name="tab background" value={tabBg} onChange={(e) => onModify({ tabBg: e })} />
      </section>
      {technologies.map(({ title, variants }, i) => (
        <section key={"t-" + i} className="section-divider">
          <p className="section-title">Tab</p>
          <div className="section-title ">
            <RowEditor onAdd={() => handleInjectTab({ title, variants }, i)} onRemove={() => handleInjectTab(undefined, i)} />

            <FormInput label="tab title" value={title} onChange={(e) => handleChange({ title: e, variants }, i)} />
          </div>
          <p className="section-title variant">Variants</p>
          {variants.map((props, idx) => (
            <div key={idx + "l"} className="row">
              <RowEditor onAdd={() => handleInjectVariant(props, i, idx)} onRemove={() => handleInjectVariant(undefined, i, idx)} />
              <FormInput label="label" value={props.label} onChange={(e) => handleVariants({ ...props, label: e }, i, idx)} />
              <Gallery key={i + "k"} value={props.url} onChange={(e) => handleVariants({ ...props, url: e }, i, idx)} />
              <FormInput label="to" value={props.to} onChange={(e) => handleVariants({ ...props, to: e }, i, idx)} />
            </div>
          ))}
        </section>
      ))}
    </ContainerForm>
  );
};
export default TechnologiesForm;

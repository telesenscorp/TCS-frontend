import { BlogPreview } from "../../content/res";
import { ContainerForm, FormInput, Gallery, RowEditor } from "../common";
import { ColorPicker } from "../common/ListPicker";
import InnerHtml from "./InnerHtml";
const ValuesForm = ({
  values = [],
  bg,
  color,
  cardBg,
  iconFill,
  innerHtml,
  modify = () => {},
  containerMethods,
  virgin,
  visibilityOptions,
  index,
}) => {
  const onModify = (v) => {
    modify(index, { values, innerHtml, bg, color, cardBg, iconFill, visibilityOptions, ...v });
  };
  const handleChange = (value, i) => {
    let Arr = [...values];
    Arr[i] = value;
    onModify({ values: Arr });
  };
  const handleInject = (value, i) => {
    let Arr = [...values];
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
    onModify({ values: Arr });
  };
  const handleInnerContent = (flipper) => {
    onModify({ innerHtml: flipper ? { ...BlogPreview } : undefined });
  };
  return (
    <ContainerForm
      name="Values"
      {...containerMethods}
      {...{ visibilityOptions, index, virgin }}
      inner
      innerVisible={innerHtml !== undefined}
      changeInner={handleInnerContent}>
      <section className="section-divider row">
        <ColorPicker name="background" value={bg} onChange={(e) => onModify({ bg: e })} />
        <ColorPicker isFont name="text" value={color} onChange={(e) => onModify({ color: e })} />
        <ColorPicker name="card background" value={cardBg} onChange={(e) => onModify({ cardBg: e })} />
        {/* <ColorPicker name="icon color" value={iconFill} onChange={(e) => onModify({ iconFill: e })} /> */}
      </section>
      <section className="section-divider">
        {values.map(({ title, desc, url }, i) => (
          <div key={i + "Hero"} className="row">
            <RowEditor onAdd={() => handleInject({ title, desc, url }, i)} onRemove={() => handleInject(undefined, i)} />
            <FormInput label="title" value={title} onChange={(e) => handleChange({ title: e, desc, url }, i)} />
            <FormInput label="desc" value={desc} onChange={(e) => handleChange({ title, desc: e, url }, i)} />
            <Gallery value={url} onChange={(e) => handleChange({ title, desc, url: e }, i)} />
          </div>
        ))}
      </section>
      {innerHtml ? <InnerHtml {...innerHtml} modify={onModify} /> : null}
    </ContainerForm>
  );
};
export default ValuesForm;

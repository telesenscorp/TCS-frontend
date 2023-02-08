import { ContainerForm, FormInput, Gallery, RowEditor } from "../common";
import { ColorPicker } from "../common/ListPicker";
const PartnersForm = ({ partners = [], bg, color, modify = () => {}, containerMethods, virgin, visibilityOptions, index }) => {
  const onModify = (e) => {
    modify(index, { partners, bg, color, visibilityOptions, ...e });
  };
  const handleChange = (value, i) => {
    let Arr = [...partners];
    Arr[i] = value;
    onModify({ partners: Arr });
  };
  const handleInject = (value, i) => {
    let Arr = [...partners];
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
    onModify({ partners: Arr });
  };
  return (
    <ContainerForm name="Partners" {...containerMethods} {...{ visibilityOptions, index, virgin }}>
      <section className="section-divider row">
        <ColorPicker name="background" value={bg} onChange={(e) => onModify({ bg: e })} />
        <ColorPicker isFont name="text" value={color} onChange={(e) => onModify({ color: e })} />
      </section>
      <section className="section-divider">
        {partners.map((p, i) => (
          <div key={i + "Partners"} className="row">
            <RowEditor onAdd={() => handleInject(p, i)} onRemove={() => handleInject(undefined, i)} />
            <FormInput label="label" value={p.label} onChange={(e) => handleChange({ ...p, label: e }, i)} />
            <Gallery value={p.url} onChange={(e) => handleChange({ ...p, url: e }, i)} />
            {/* <FormInput label="to" value={p.to} onChange={(e) => handleChange({ ...p, to: e }, i)} />
            <FormInput label="styleProps" value={p.styleProps} onChange={(e) => handleChange({ ...p, styleProps: e }, i)} /> */}
          </div>
        ))}
      </section>
    </ContainerForm>
  );
};
export default PartnersForm;

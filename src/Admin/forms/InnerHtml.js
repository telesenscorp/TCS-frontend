import { FormInput } from "../common";
import { ColorPicker } from "../common/ListPicker";
const InnerHtml = ({ modify = () => {}, bg, color, ...props }) => {
  const onModify = (e) => {
    modify({ innerHtml: { ...props, bg, color, ...e } });
  };
  return (
    <div className="innerHtml">
      <section className="section-divider row">
        <ColorPicker name="background" value={bg} onChange={(e) => onModify({ bg: e })} />
        <ColorPicker isFont name="text" value={color} onChange={(e) => onModify({ color: e })} />
      </section>
      <section className="section-divider">
        <div className="frc">
          <FormInput label="title" value={props.title} onChange={(v) => onModify({ title: v })} />
          <FormInput label="desc" value={props.desc} onChange={(v) => onModify({ desc: v })} />
          <FormInput label="label" value={props.label} onChange={(v) => onModify({ label: v })} />
        </div>
      </section>
    </div>
  );
};
export default InnerHtml;

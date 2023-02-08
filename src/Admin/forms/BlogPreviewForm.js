import { ContainerForm, FormInput } from "../common";
import { ColorPicker } from "../common/ListPicker";
const BlogPreviewForm = ({ modify = () => {}, containerMethods, virgin, visibilityOptions, index, bg, color, ...props }) => {
  const onModify = (e) => {
    modify(index, { ...props, bg, color, visibilityOptions, ...e });
  };
  return (
    <ContainerForm name="BlogPreview" {...containerMethods} {...{ visibilityOptions, index, virgin }}>
      <section className="section-divider row">
        <ColorPicker name="background" value={bg} onChange={(e) => onModify({ bg: e })} />
        <ColorPicker isFont name="text" value={color} onChange={(e) => onModify({ color: e })} />
      </section>
      <section className="section-divider">
        <div className="frc">
          <FormInput label="title" value={props.title} onChange={(v) => onModify({ title: v })} />
          <FormInput label="subTitle" value={props.subTitle} onChange={(v) => onModify({ subTitle: v })} />
        </div>
        <div className="frc">
          <FormInput label="desc" value={props.desc} onChange={(v) => onModify({ desc: v })} />
          <FormInput label="label" value={props.label} onChange={(v) => onModify({ label: v })} />
        </div>
      </section>
    </ContainerForm>
  );
};
export default BlogPreviewForm;

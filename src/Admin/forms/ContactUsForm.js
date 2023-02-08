import { BlogPreview } from "../../content/res";
import { ContainerForm, FormInput } from "../common";
import { ColorPicker } from "../common/ListPicker";
import InnerHtml from "./InnerHtml";
const ContactUsForm = ({ bg, color, innerHtml, containerMethods, virgin, visibilityOptions, modify = () => {}, index, ...props }) => {
  const onModify = (e) => {
    modify(index, { ...props, innerHtml, bg, color, visibilityOptions, ...e });
  };
  const handleInnerContent = (flipper) => {
    onModify({ innerHtml: flipper ? { ...BlogPreview } : undefined });
  };
  return (
    <ContainerForm
      name="ContactUs"
      {...containerMethods}
      {...{ visibilityOptions, index, virgin }}
      inner
      innerVisible={innerHtml !== undefined}
      changeInner={handleInnerContent}>
      <section className="section-divider row">
        <ColorPicker name="background" value={bg} onChange={(v) => onModify({ bg: v })} />
        <ColorPicker isFont name="text" value={color} onChange={(v) => onModify({ color: v })} />
      </section>
      <section className="section-divider">
        <div className="three-col-grid">
          {Object.entries(props).map(([key, value], i) => {
            return <FormInput key={i + "k"} label={key} value={value} onChange={(v) => onModify({ [key]: v })} />;
          })}
        </div>
      </section>
      {innerHtml ? <InnerHtml {...innerHtml} modify={onModify} /> : null}
    </ContainerForm>
  );
};
export default ContactUsForm;

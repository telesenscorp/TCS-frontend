import { BlogPreview } from "../../content/res";
import { ContainerForm, FormInput } from "../common";
import { ColorPicker } from "../common/ListPicker";
import InnerHtml from "./InnerHtml";
const BannerForm = ({
  title,
  speed,
  bg,
  color,
  separatorColor,
  innerHtml,
  containerMethods,
  virgin,
  visibilityOptions,
  modify = () => {},
  index,
}) => {
  const onModify = (e) => {
    modify(index, { title, speed, innerHtml, bg, color, separatorColor, visibilityOptions, ...e });
  };
  const handleInnerContent = (flipper) => {
    onModify({ innerHtml: flipper ? { ...BlogPreview } : undefined });
  };
  return (
    <ContainerForm
      name="Banner"
      {...containerMethods}
      {...{ visibilityOptions, index, virgin }}
      inner
      innerVisible={innerHtml !== undefined}
      changeInner={handleInnerContent}>
      <section className="section-divider row">
        <FormInput label="speed (s)" value={speed} onChange={(v) => onModify({ speed: v })} />
        <ColorPicker name="background" value={bg} onChange={(v) => onModify({ bg: v })} />
        <ColorPicker isFont name="text" value={color} onChange={(v) => onModify({ color: v })} />
        <ColorPicker name="separator bg" value={separatorColor} onChange={(v) => onModify({ separatorColor: v })} />
      </section>
      <section className="section-divider">
        <FormInput label="title" value={title} onChange={(v) => onModify({ title: v })} />
      </section>
      {innerHtml ? <InnerHtml {...innerHtml} modify={onModify} /> : null}
    </ContainerForm>
  );
};
export default BannerForm;

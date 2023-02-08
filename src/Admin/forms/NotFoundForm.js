import { ContainerForm, FormInput } from "../common";
import { ColorPicker } from "../common/ListPicker";
const NotFoundForm = ({ modify = () => {}, containerMethods, virgin, visibilityOptions, index, title, bg, color }) => {
  return (
    <ContainerForm name="Not Found" {...containerMethods} {...{ visibilityOptions, index, virgin }}>
      <div className="flex-row">
        <FormInput label="title" value={title} onChange={(v) => modify(index, { title: v, bg, color, visibilityOptions })} />
        <ColorPicker name="bg" value={bg} onChange={(v) => modify(index, { title, bg: v, color, visibilityOptions })} />
        <ColorPicker isFont name="color" value={color} onChange={(v) => modify(index, { title, bg, color: v, visibilityOptions })} />
      </div>
    </ContainerForm>
  );
};
export default NotFoundForm;

import { ContainerForm, FormInput, RowEditor } from "../common";
import { ColorPicker } from "../common/ListPicker";
const CounterForm = ({ counters = [], bg, color, speed, modify = () => {}, containerMethods, virgin, visibilityOptions, index }) => {
  const onModify = (e) => {
    modify(index, { counters, bg, color, speed, visibilityOptions, ...e });
  };
  const handleChange = (value, i) => {
    let Arr = [...counters];
    Arr[i] = value;
    onModify({ counters: Arr });
  };
  const handleInject = (value, i) => {
    let Arr = [...counters];
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
    onModify({ counters: Arr });
  };
  return (
    <ContainerForm name="Counter" {...containerMethods} {...{ visibilityOptions, index, virgin }}>
      <section className="section-divider row">
        <ColorPicker name="background" value={bg} onChange={(e) => onModify({ bg: e })} />
        <ColorPicker isFont name="text" value={color} onChange={(e) => onModify({ color: e })} />
        <FormInput label="speed (s)" value={speed} onChange={(e) => onModify({ speed: e })} />
      </section>
      <section className="section-divider">
        {counters.map(({ target, label }, i) => (
          <div key={i + "Counter"} className="row">
            <RowEditor onAdd={() => handleInject({ target, label }, i)} onRemove={() => handleInject(undefined, i)} />
            <FormInput label="label" value={label} onChange={(e) => handleChange({ label: e, target }, i)} />
            <FormInput label="target" value={target} onChange={(e) => handleChange({ label, target: e }, i)} />
          </div>
        ))}
      </section>
    </ContainerForm>
  );
};
export default CounterForm;

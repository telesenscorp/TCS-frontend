import { ContainerForm, FormInput, RowEditor } from "../common";
import { ColorPicker } from "../common/ListPicker";
const QuotesForm = ({ quotes = [], bg, color, modify = () => {}, containerMethods, virgin, visibilityOptions, index }) => {
  const onModify = (e) => {
    modify(index, { quotes, bg, color, visibilityOptions, ...e });
  };
  const handleChange = (value, i) => {
    let Arr = [...quotes];
    Arr[i] = value;
    onModify({ quotes: Arr });
  };
  const handleInject = (value, i) => {
    let Arr = [...quotes];
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
    onModify({ quotes: Arr });
  };
  return (
    <ContainerForm name="Quotes" {...containerMethods} {...{ visibilityOptions, index, virgin }}>
      <section className="section-divider row">
        <ColorPicker name="background" value={bg} onChange={(e) => onModify({ bg: e })} />
        <ColorPicker isFont name="text" value={color} onChange={(e) => onModify({ color: e })} />
      </section>
      <section className="section-divider">
        {quotes.map((props, i) => (
          <div key={i + "Quotes"} className="row">
            <RowEditor onAdd={() => handleInject(props, i)} onRemove={() => handleInject(undefined, i)} />
            <FormInput label="title" value={props.title} onChange={(e) => handleChange({ ...props, title: e }, i)} />
            <FormInput label="description" value={props.desc} onChange={(e) => handleChange({ ...props, desc: e }, i)} />
            <FormInput label="author" value={props.author} onChange={(e) => handleChange({ ...props, author: e }, i)} />
            <FormInput label="company" value={props.company} onChange={(e) => handleChange({ ...props, company: e }, i)} />
          </div>
        ))}
      </section>
    </ContainerForm>
  );
};
export default QuotesForm;

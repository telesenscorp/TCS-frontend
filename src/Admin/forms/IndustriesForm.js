import { ContainerForm, FormInput, Gallery, RowEditor } from "../common";
import { ColorPicker } from "../common/ListPicker";
const IndustriesForm = ({ cards = [], heading, bg, color, modify = () => {}, containerMethods, virgin, visibilityOptions, index }) => {
  const onModify = (e) => {
    modify(index, { cards, heading, bg, color, visibilityOptions, ...e });
  };
  const handleChange = (value, i) => {
    let Arr = [...cards];
    Arr[i] = value;
    onModify({ cards: Arr });
  };
  const handleInject = (value, i) => {
    let Arr = [...cards];
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
    onModify({ cards: Arr });
  };
  return (
    <ContainerForm name="Industries" {...containerMethods} {...{ visibilityOptions, index, virgin }}>
      <section className="section-divider row">
        <FormInput value={heading} onChange={(e) => onModify({ heading: e })} />
        <ColorPicker name="background" value={bg} onChange={(e) => onModify({ bg: e })} />
        <ColorPicker isFont name="text" value={color} onChange={(e) => onModify({ color: e })} />
      </section>
      <section className="section-divider">
        {cards.map((card, i) => (
          <div key={i + "Industries"} className="row">
            <RowEditor onAdd={() => handleInject(card, i)} onRemove={() => handleInject(undefined, i)} />
            <FormInput label="label" value={card.label} onChange={(e) => handleChange({ ...card, label: e }, i)} />
            <Gallery label="desktop" value={card.url} onChange={(e) => handleChange({ ...card, url: e }, i)} />
            <Gallery label="tablet" value={card.urlTablet} onChange={(e) => handleChange({ ...card, urlTablet: e }, i)} />
            <Gallery label="mobile" value={card.urlMobile} onChange={(e) => handleChange({ ...card, urlMobile: e }, i)} />
            <ColorPicker isFont name="text" value={card.textColor} onChange={(e) => handleChange({ ...card, textColor: e }, i)} />
          </div>
        ))}
      </section>
    </ContainerForm>
  );
};
export default IndustriesForm;

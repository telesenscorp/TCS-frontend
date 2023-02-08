import { useRef } from "react";
import { ContainerForm, FormInput, Gallery, RowEditor } from "../common";
import { ColorPicker } from "../common/ListPicker";
import OnOff from "../common/OnOff";
const GalleryForm = ({
  items = [],
  innerHeading,
  heading,
  bg,
  color,
  sideBg,
  sideColor,
  modify = () => {},
  containerMethods,
  virgin,
  visibilityOptions,
  index,
}) => {
  const ref = useRef([]);
  const onModify = (v) => {
    modify(index, { innerHeading, heading, items, bg, color, sideBg, sideColor, visibilityOptions, ...v });
  };
  const onStyle = (v, t, i) => {
    ref.current[i].hug(v, t);
  };
  const editLinks = (v, i, parent) => {
    let data = [...items[parent].links];
    data[i] = v;
    handleChange({ ...items[parent], links: data }, parent);
  };
  const onAddLink = (i) => editLinks("", items[i].links.length, i);
  const handleChange = (value, i) => {
    let Arr = [...items];
    Arr[i] = value;
    onModify({ items: Arr });
  };
  const handleInject = (value, i) => {
    let Arr = [...items];
    if (value) {
      if (typeof value !== "object") throw new Error("Incorrect value");
      const copyValue = { ...value };
      for (let key in copyValue) {
        if (Array.isArray(copyValue[key])) {
          copyValue[key] = [];
        } else copyValue[key] = "";
      }
      Arr.splice(i + 1, 0, copyValue);
    } else {
      Arr.splice(i, 1);
    }
    onModify({ items: Arr });
  };
  return (
    <ContainerForm name="Gallery" {...containerMethods} {...{ visibilityOptions, index, virgin }}>
      <section className="section-divider row">
        <FormInput label="side title" value={heading} onChange={(e) => onModify({ heading: e })} />
        <FormInput label="inner title" value={innerHeading} onChange={(e) => onModify({ innerHeading: e })} />
        <ColorPicker name="background" value={bg} onChange={(e) => onModify({ bg: e })} />
        <ColorPicker isFont name="text" value={color} onChange={(e) => onModify({ color: e })} />
        <ColorPicker name="side background" value={sideBg} onChange={(e) => onModify({ sideBg: e })} />
        <ColorPicker isFont name="side text" value={sideColor} onChange={(e) => onModify({ sideColor: e })} />
      </section>
      <section className="section-divider">
        {items.map((item, i) => (
          <div key={i + "Gallery"} className="row">
            <RowEditor onAdd={() => handleInject(item, i)} onRemove={() => handleInject(undefined, i)} />
            <FormInput label="title" value={item.title} onChange={(e) => handleChange({ ...item, title: e }, i)} />
            <div className="f2">
              <FormInput
                inputRef={(el) => (ref.current[i] = el)}
                label="description"
                value={item.desc}
                onChange={(e) => handleChange({ ...item, desc: e }, i)}
              />
              {item.links?.map((val, elIdx) => (
                <FormInput key={"k" + elIdx} label={"Link: " + elIdx} value={val} onChange={(v) => editLinks(v, elIdx, i)} />
              ))}
            </div>
            <OnOff type="link" onClick={() => onStyle("L", "</a>", i)} />
            <OnOff type="addLink" onClick={() => onAddLink(i)} />
            <Gallery label="desktop" value={item.url} onChange={(e) => handleChange({ ...item, url: e }, i)} />
            <Gallery label="mobile" value={item.urlMobile} onChange={(e) => handleChange({ ...item, urlMobile: e }, i)} />
          </div>
        ))}
      </section>
    </ContainerForm>
  );
};
export default GalleryForm;

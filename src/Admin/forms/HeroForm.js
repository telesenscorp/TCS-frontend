import { ContainerForm, FormInput, Gallery } from "../common";
import { ColorPicker } from "../common/ListPicker";
const HeroForm = ({
  sectionName,
  text,
  desc,
  bg,
  color,
  getInTouch,
  wallpaper,
  scrollColor,
  scrollLabel,
  wallpaperStyle,
  modify = () => {},
  containerMethods,
  virgin,
  visibilityOptions,
  index,
}) => {
  const handleChange = (e) => {
    modify(index, {
      text,
      desc,
      bg,
      color,
      getInTouch,
      wallpaper,
      scrollColor,
      scrollLabel,
      wallpaperStyle,
      visibilityOptions,
      ...e,
    });
  };
  return (
    <ContainerForm name={sectionName || "Hero"} {...containerMethods} {...{ visibilityOptions, index, virgin }}>
      <section className="section-divider row">
        <ColorPicker name="background" value={bg} onChange={(e) => handleChange({ bg: e })} />
        <ColorPicker isFont name="text" value={color} onChange={(e) => handleChange({ color: e })} />
        <ColorPicker isFont name="scroll color" value={scrollColor} onChange={(e) => handleChange({ scrollColor: e })} />
        <Gallery label="get in touch" value={getInTouch} onChange={(e) => handleChange({ getInTouch: e })} />
        <Gallery label="wallpaper" value={wallpaper} onChange={(e) => handleChange({ wallpaper: e })} />
        <FormInput label="scroll label" value={scrollLabel} onChange={(e) => handleChange({ scrollLabel: e })} />
        <FormInput label="wallpaper style" value={wallpaperStyle} onChange={(e) => handleChange({ wallpaperStyle: e })} />
      </section>
      <section className="section-divider">
        <FormInput label="title" value={text} onChange={(e) => handleChange({ text: e })} />
        <FormInput label="desc" value={desc} onChange={(e) => handleChange({ desc: e })} />
      </section>
    </ContainerForm>
  );
};
export default HeroForm;

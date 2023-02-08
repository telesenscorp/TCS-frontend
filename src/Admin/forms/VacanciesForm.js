import _ from "lodash";
import { AreaInput, ContainerForm, FormInput, RowEditor } from "../common";
import { ColorPicker } from "../common/ListPicker";
const VacanciesForm = ({
  bg,
  color,
  contrast,
  vacancies = [],
  vacancyForm,
  modify = () => {},
  containerMethods,
  virgin,
  visibilityOptions,
  index,
  labelColor,
}) => {
  const onModify = (e) => {
    modify(index, { bg, color, contrast, vacancies, vacancyForm, labelColor, visibilityOptions, ...e });
  };
  const handleChange = (value, i, tagIdx) => {
    let Arr = _.cloneDeep(vacancies);
    if (tagIdx !== undefined) {
      Arr[i].tags[tagIdx] = { ...Arr[i].tags[tagIdx], ...value };
    } else {
      Arr[i] = { ...Arr[i], ...value };
    }
    onModify({ vacancies: Arr });
  };
  const handleVariants = (value, lvl1, lvl2) => {
    let Arr = _.cloneDeep(vacancies);
    Arr[lvl1].requirements[lvl2] = value;
    onModify({ vacancies: Arr });
  };
  const handleInjectVariant = (value, lvl1, lvl2) => {
    let Arr = _.cloneDeep(vacancies);
    if (value) {
      if (typeof value !== "object") throw new Error("Incorrect value");
      const copyValue = { ...value };
      for (let key in copyValue) {
        copyValue[key] = "";
      }
      Arr[lvl1].requirements.splice(lvl2 + 1, 0, copyValue);
    } else {
      Arr[lvl1].requirements.splice(lvl2, 1);
    }
    onModify({ vacancies: Arr });
  };
  const handleInjectTab = (value, i) => {
    let Arr = _.cloneDeep(vacancies);
    if (value) {
      if (typeof value !== "object") throw new Error("Incorrect value");
      const copyValue = JSON.parse(JSON.stringify(value));
      for (let key in copyValue) {
        if (Array.isArray(copyValue[key])) {
          copyValue[key].map((item) => {
            for (let k in item) {
              item[k] = "";
            }
            return item;
          });
          if (key !== "tags") copyValue[key] = copyValue[key].splice(0, 1);
        } else copyValue[key] = "";
      }
      Arr.splice(i + 1, 0, copyValue);
    } else {
      Arr.splice(i, 1);
    }
    onModify({ vacancies: Arr });
  };

  return (
    <ContainerForm name="Vacancies" {...containerMethods} {...{ visibilityOptions, index, virgin }}>
      <section className="section-divider two-col-grid">
        <ColorPicker name="background" value={bg} onChange={(e) => onModify({ bg: e })} />
        <ColorPicker isFont name="text" value={color} onChange={(e) => onModify({ color: e })} />
        <ColorPicker isFont name="contrast" value={contrast} onChange={(e) => onModify({ contrast: e })} />
        <ColorPicker isFont name="label" value={labelColor} onChange={(e) => onModify({ labelColor: e })} />
        {Object.entries(vacancyForm).map(([label, value], i) => {
          return (
            <FormInput key={i + "k"} {...{ label, value }} onChange={(v) => onModify({ vacancyForm: { ...vacancyForm, [label]: v } })} />
          );
        })}
      </section>
      {vacancies.map(({ title, heading, tags, requirements }, i) => (
        <section className="section-divider">
          <p className="section-title">Vacancy</p>
          <div className="row ">
            <RowEditor
              onAdd={() => handleInjectTab({ title, heading, tags, requirements }, i)}
              onRemove={() => handleInjectTab(undefined, i)}
            />
            <FormInput label="vacancy title" value={title} onChange={(v) => handleChange({ title: v }, i)} />
            <FormInput label="vacancy heading" value={heading} onChange={(v) => handleChange({ heading: v }, i)} />
          </div>
          <div className="row">
            {tags.map(({ name, value }, ti) => (
              <>
                <FormInput label="tag name" value={name} onChange={(v) => handleChange({ name: v }, i, ti)} />
                <FormInput label="tag value" value={value} onChange={(v) => handleChange({ value: v }, i, ti)} />
              </>
            ))}
          </div>
          <p className="section-title variant">Requirements</p>
          {requirements.map((props, ri) => (
            <div key={ri + "l"} className="vacancy-form">
              <div className="row">
                <RowEditor onAdd={() => handleInjectVariant(props, i, ri)} onRemove={() => handleInjectVariant(undefined, i, ri)} />
                <FormInput label="Requirement title" value={props.title} onChange={(v) => handleVariants({ ...props, title: v }, i, ri)} />
              </div>
              <AreaInput
                label="Requirement description"
                value={props.desc}
                onChange={(v) => handleVariants({ ...props, desc: v }, i, ri)}
              />
            </div>
          ))}
        </section>
      ))}
    </ContainerForm>
  );
};
export default VacanciesForm;

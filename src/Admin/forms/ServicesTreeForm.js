import _ from "lodash";
import { Fragment, useEffect, useState } from "react";
import { AreaInput, ContainerForm, FormInput, Gallery, RowEditor } from "../common";
import { SvgButton } from "../common/IconButton";
import { ColorPicker } from "../common/ListPicker";
// [{ parent, pointer, title, desc, url, secName, secTitle, secDesc }]
const levels = ["root", "first", "second", "third", "fourth", "fifth", "sixth"];
const ServicesTreeForm = ({ root, variants = [], modify = () => {}, containerMethods, virgin, visibilityOptions, index }) => {
  const [toggle, setToggle] = useState("");
  const [r, setRefresh] = useState(0);
  const handleChange = (value, i) => {
    let Arr = [...variants];
    Arr[i] = value;
    modify(index, { variants: Arr, root, visibilityOptions });
  };
  const handleInject = (value, i) => {
    let Arr = [...variants];
    if (value) {
      if (typeof value !== "object") throw new Error("Incorrect value");
      const copyValue = { ...value };
      for (let key in copyValue) {
        copyValue[key] = "";
      }
      Arr.splice(i + 1, 0, { ...copyValue, id: _.uniqueId("p-") });
    } else {
      Arr.splice(i, 1);
    }
    modify(index, { variants: Arr, root, visibilityOptions });
  };
  const handleRoot = (t, i, c) => {
    const clone = _.cloneDeep(root);
    clone[t][i] = c;
    modify(index, { variants, root: clone, visibilityOptions });
  };
  //const onRouteFinder = () => {
  // let obj = [[], [], [], [], [], [], []];
  // const original = _.cloneDeep(variants);
  // const modified = _.cloneDeep(variants).map((v) => {
  //   let id = original.find((e) => e.pointer === v.parent);
  //   let isEnding = /^:end/.test(v.pointer);
  //   return id?.id ? { ...v, pointer: isEnding ? v.pointer : v.id, parent: id.id } : { ...v, pointer: isEnding ? v.pointer : v.id };
  // });
  // modify(index, { variants: modified, root });
  // modified.forEach((e) => {
  //   if (e.parent === ":root") {
  //     obj[0].push({ parent: e.parent, to: e.id });
  //     mm[e.id] = {};
  //   }
  // });
  // obj.forEach((a, i) => {
  //   a.forEach(({ from, to }) => {
  //     modified.forEach((e) => {
  //       if (e?.parent === to) {
  //         obj[i + 1].push({ parent: e.parent, to: e.id });
  //       }
  //     });
  //   });
  // });
  //};
  const onSort = () => {
    variants.sort(function (a, b) {
      const nameA = a.parent.toUpperCase();
      const nameB = b.parent.toUpperCase();
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    });
    setRefresh(r + 1);
  };
  useEffect(() => {
    modify(index, {
      variants: variants.map((v) => ({ ...v, id: v?.id || _.uniqueId("p-"), order: v?.order || 0 })),
      root,
      visibilityOptions,
    });
    setRefresh(r + 1);
    return () => {};
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  let list = 0;
  return (
    <ContainerForm key="ServicesTree" name="ServicesTree" {...containerMethods} {...{ visibilityOptions, index, virgin, onSort }}>
      <section className="section-divider row">
        {levels.map((e, i) => (
          <Fragment key={"a-" + i}>
            <ColorPicker name={e + " bg"} value={root[e].bg} onChange={(v) => handleRoot(e, "bg", v)} />
            <ColorPicker isFont name={e + " txt color"} value={root[e].color} onChange={(v) => handleRoot(e, "color", v)} />
          </Fragment>
        ))}
      </section>
      <section className="section-divider">
        <FormInput label="root sidebar label" value={root[levels[0]].heading} onChange={(v) => handleRoot(levels[0], "heading", v)} />
        <FormInput label="root section title" value={root[levels[0]].secTitle} onChange={(v) => handleRoot(levels[0], "secTitle", v)} />
      </section>
      <section className="section-divider">
        {variants.map((props, i) => {
          if (toggle && props.pointer !== toggle && props.parent !== toggle) {
            if (i === variants.length - 1 && list < 1) setToggle(null);
            return <div key={"b-" + i} />;
          }
          list++;
          return (
            <div className="section-divider" key={"b-" + i}>
              <p className={`section-id${props.id === props.pointer ? " green" : ""}`}>ID: {props.id}</p>
              <SvgButton
                btn="point-out"
                name="branch"
                onClick={() => setToggle(props.pointer === toggle ? null : props.pointer)}
                toggle={toggle === props.pointer}
              />
              <div key={i + "ServicesTree"} className="row">
                <RowEditor onAdd={() => handleInject(props, i)} onRemove={() => handleInject(undefined, i)} />
                <FormInput label="parent" value={props.parent} onChange={(e) => handleChange({ ...props, parent: e }, i)} />
                <FormInput
                  label="pointer"
                  value={props.pointer}
                  placeholder={props?.id}
                  onChange={(e) => handleChange({ ...props, pointer: e }, i)}
                />
                <AreaInput label="title" value={props.title} onChange={(e) => handleChange({ ...props, title: e }, i)} />
                <FormInput label="order" value={props?.order} onChange={(e) => handleChange({ ...props, order: e }, i)} tiny />
                <FormInput label="desc" value={props.desc} onChange={(e) => handleChange({ ...props, desc: e }, i)} />
                <Gallery value={props.url} onChange={(e) => handleChange({ ...props, url: e }, i)} />
                <FormInput label="secName" value={props.secName} onChange={(e) => handleChange({ ...props, secName: e }, i)} />
                <FormInput label="secTitle" value={props.secTitle} onChange={(e) => handleChange({ ...props, secTitle: e }, i)} />
              </div>
              <AreaInput label="secDesc" value={props.secDesc} onChange={(e) => handleChange({ ...props, secDesc: e }, i)} />
            </div>
          );
        })}
      </section>
    </ContainerForm>
  );
};
export default ServicesTreeForm;

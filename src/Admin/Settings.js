import { Formik } from "formik";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ADMIN } from "../common/constants";
import { settingsUpdate } from "../configuration/redux/Settings.slice";
import Analytics from "./Analytics";
import { CreateUser, FormInput, WindowSection } from "./common";
import { ColorPicker } from "./common/ListPicker";

const Settings = () => {
  const dispatch = useDispatch();
  const ref = useRef(null);
  const { layout, auth } = useSelector((state) => state);
  const { cookies } = useSelector(({ settings }) => settings);

  useEffect(() => {
    ref.current.setValues(cookies);
  }, [cookies]);

  return (
    <div className="p12">
      <Formik
        innerRef={ref}
        initialValues={{ ...cookies }}
        onSubmit={(val) => dispatch(settingsUpdate({ cookies: val, language: layout.language }))}>
        {({ handleChange, values, handleSubmit }) => (
          <WindowSection label="Cookies" right={[{ name: "Save", fn: handleSubmit }]}>
            <section className="section-divider row">
              <ColorPicker name="background" value={values.bg} onChange={handleChange("bg")} />
              <ColorPicker isFont name="text" value={values.color} onChange={handleChange("color")} />
            </section>
            <section className="section-divider">
              <div className="column">
                <FormInput label="title" value={values.title} onChange={handleChange("title")} />
                <FormInput label="text" value={values.text} onChange={handleChange("text")} />
                <FormInput label="label" value={values.label} onChange={handleChange("label")} />
                <FormInput label="to" value={values.to} onChange={handleChange("to")} />
              </div>
            </section>
          </WindowSection>
        )}
      </Formik>
      {auth.role === ADMIN ? <CreateUser /> : null}
      <Analytics />
    </div>
  );
};

export default Settings;

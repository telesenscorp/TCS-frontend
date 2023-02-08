import { Formik } from "formik";
import { useEffect, useId, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { content } from "../common/translator";
import { subscribeFormikProps } from "../common/validation";
import { CheckBox, FormikInput, SendButton } from "../components";
import { showPopUp } from "../configuration/redux/Layout.slice";
import { Post } from "../configuration/server";
import BlogPreview from "./BlogPreview";
const Subscribe = ({ bg, color, emailLabel, nameLabel, checkboxLabel, promptMessage, promptTitle, innerHtml, to }) => {
  const ID = useId();
  const formikRef = useRef();
  const dispatch = useDispatch();
  const { locale } = useSelector(({ user }) => user);
  const [s, submit] = useState(0);
  const [isChecked, setChecked] = useState({ state: false, error: "" });
  const handleSend = (val, opt) => {
    if (!isChecked.state) {
      setChecked({ state: false, error: `! ${content.required[locale]}` });
    } else {
      const values = { ...val };
      Object.keys(values).forEach((key) => {
        values[key] = values[key].trim();
      });
      Post("createMail", { ...values, type: "subscribe" }, () => {
        opt.resetForm();
        dispatch(showPopUp({ promptTitle, promptMessage }));
        setChecked({ state: false, error: "" });
      });
    }
  };
  useEffect(() => {
    formikRef.current.setValues(subscribeFormikProps.initialValues);
    formikRef.current.setErrors({});
    setChecked({ state: false, error: "" });
  }, [locale]);
  return (
    <section id={ID} className="width-wrapper">
      {innerHtml ? <BlogPreview {...innerHtml} /> : null}
      <Formik innerRef={formikRef} {...subscribeFormikProps} onSubmit={handleSend}>
        {({ handleSubmit }) => (
          <div className={`subscribe-form bg-${bg}`}>
            <div className="contact-form-root subscribe">
              <FormikInput submitted={s} labelColor={color} name="firstName" label={nameLabel} required />
              <FormikInput submitted={s} labelColor={color} name="email" label={emailLabel} required last />
              <CheckBox
                to={to}
                label={checkboxLabel}
                value={isChecked.state}
                error={isChecked.error}
                onChange={(v) => setChecked({ state: v.target.checked, error: "" })}
              />
              <div className="submission frc">
                <SendButton
                  onClick={() => {
                    if (!isChecked.state) {
                      setChecked({ state: false, error: `! ${content.required[locale]}` });
                    }
                    submit(s + 1);
                    handleSubmit();
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </Formik>
    </section>
  );
};
export default Subscribe;

import { Formik } from "formik";
import React, { useEffect, useId, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { content } from "../common/translator";
import { contactFormikProps } from "../common/validation";
import { CheckBox, ClutchButton, FormikInput, SendButton } from "../components";
import { showPopUp } from "../configuration/redux/Layout.slice";
import { Post } from "../configuration/server";
import BlogPreview from "./BlogPreview";
const ContactUs = ({
  bg,
  color,
  phoneLabel,
  emailLabel,
  firstNameLabel,
  lastNameLabel,
  checkboxLabel,
  messageLabel,
  promptTitle,
  promptMessage,
  clutchLink,
  innerHtml,
  to,
}) => {
  const ID = useId();
  const ref = useRef(null);
  const formikRef = useRef(null);
  const { locale } = useSelector(({ user }) => user);
  const [s, submit] = useState(0);
  const dispatch = useDispatch();
  const [isChecked, setChecked] = useState({ state: false, error: "" });
  const handleSend = (val, opt) => {
    if (!isChecked.state) {
      setChecked({ state: false, error: `! ${content.required[locale]}` });
    } else {
      const values = { ...val };
      Object.keys(values).forEach((key) => {
        values[key] = values[key].trim();
      });
      Post("createMail", { ...values, type: "message" }, () => {
        opt.resetForm();
        dispatch(showPopUp({ promptTitle, promptMessage }));
        setChecked({ state: false, error: "" });
        ref.current.scrollIntoView(true);
      });
    }
  };
  useEffect(() => {
    formikRef.current.setValues(contactFormikProps.initialValues);
    formikRef.current.setErrors({});
    setChecked({ state: false, error: "" });
  }, [locale]);
  return (
    <section ref={ref} data={ID} id="contact-us" className="width-wrapper">
      {innerHtml ? <BlogPreview {...innerHtml} /> : null}
      <Formik innerRef={formikRef} {...contactFormikProps} onSubmit={handleSend}>
        {({ handleSubmit }) => (
          <div className={`contact-us bg-${bg}`}>
            <div className="contact-form-root">
              <FormikInput submitted={s} labelColor={color} name="firstName" label={firstNameLabel} required />
              <FormikInput submitted={s} labelColor={color} name="lastName" label={lastNameLabel} />
              <FormikInput submitted={s} labelColor={color} name="phone" label={phoneLabel} required />
              <FormikInput submitted={s} labelColor={color} name="email" label={emailLabel} required />
              <FormikInput
                submitted={s}
                labelColor={color}
                name="content"
                label={messageLabel}
                inputProps={{ maxLength: 2000 }}
                multi
                last
              />
              <CheckBox
                to={to}
                label={checkboxLabel}
                value={isChecked.state}
                error={isChecked.error}
                onChange={(v) => {
                  setChecked({ state: v.target.checked, error: "" });
                }}
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
                <ClutchButton to={clutchLink} />
              </div>
            </div>
          </div>
        )}
      </Formik>
    </section>
  );
};
export default ContactUs;

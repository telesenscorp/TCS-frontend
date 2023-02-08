import { Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { content } from "../../common/translator";
import { vacancyFormikProps } from "../../common/validation";
import { showPopUp } from "../../configuration/redux/Layout.slice";
import { BulkUpload, Post } from "../../configuration/server";
import { asyncCall, styler } from "../../utils";
import DropZone from "../DropZone";
import { CheckBox, FormikInput } from "../Input";
import SendButton from "../SendButton";
export default function SubmitForm({ apply, vacancyForm, updateHeight, labelColor }) {
  const { to, cvLabel, phoneLabel, emailLabel, firstNameLabel, lastNameLabel, checkboxLabel, messageLabel, promptTitle, promptMessage } =
    vacancyForm;
  const ref = useRef();
  const dispatch = useDispatch();
  const [isChecked, setChecked] = useState({ state: false, error: "" });
  const { locale } = useSelector(({ user }) => user);
  const [files, setFile] = useState([]);
  const [s, submit] = useState(0);
  const handleSend = (val, opt) => {
    if (!isChecked.state) {
      setChecked({ state: false, error: `! ${content.required[locale]}` });
    } else {
      const values = { ...val };
      Object.keys(values).forEach((key) => {
        values[key] = values[key].trim();
      });
      BulkUpload(files, false, ({ url }) => {
        Post("createMail", { ...values, attachment: JSON.stringify(url), type: "vacancy" }, () => {
          opt.resetForm();
          dispatch(showPopUp({ promptTitle, promptMessage }));
          setChecked({ state: false, error: "" });
          setFile([]);
          asyncCall(() => updateHeight());
        });
      });
    }
  };
  useEffect(() => {
    ref.current.setValues(vacancyFormikProps.initialValues);
    ref.current.setErrors({});
    setChecked({ state: false, error: "" });
  }, [locale]);

  return (
    <div className={styler(["vacancy-application", { apply }])}>
      <Formik innerRef={ref} {...vacancyFormikProps} onSubmit={handleSend}>
        {({ handleSubmit }) => (
          <div className="contact-form-root f1">
            <FormikInput submitted={s} name="firstName" label={firstNameLabel} required {...{ labelColor }} />
            <FormikInput submitted={s} name="lastName" label={lastNameLabel} {...{ labelColor }} />
            <FormikInput submitted={s} name="phone" label={phoneLabel} required {...{ labelColor }} />
            <FormikInput submitted={s} name="email" label={emailLabel} required {...{ labelColor }} />
            <FormikInput
              submitted={s}
              name="content"
              label={messageLabel}
              inputProps={{ maxLength: 2000 }}
              multi
              last
              onResize={updateHeight}
              {...{ labelColor }}
            />
            <DropZone
              setFile={(v) => {
                setFile(v);
                updateHeight();
              }}
              submitted={s}
              file={files}
              label={cvLabel}
              {...{ labelColor }}
            />
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
        )}
      </Formik>
    </div>
  );
}

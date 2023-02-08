import * as Yup from "yup";
const mailRegex = /^\s*[\w-\.]+@([\w-]+\.)+[\w-]{2,4}\s*$/g;
const phoneRegex = /^\s*(?:[0-9]\d|\+*)([1-4]\d|[1-9]\d+)?((?:\d{1,}?)*)(?:(\d+))?\s*$/i
export const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("required").trim("nameError"),
  email: Yup.string()
    .required("required")
    .matches(mailRegex, "emailError")
    .typeError("emailError"),
  phone: Yup.string().matches(phoneRegex, "phoneError").required("required").trim("required"),
});
export const validation = Yup.object().shape({
  password: Yup.string().required("This field is required").trim(),
  username: Yup.string().required("This field is required").trim(),
  email: Yup.string()
  .required("This field is required")
  .email("Invalid email address")
  .matches(mailRegex, "Invalid email address")
  .typeError("Invalid email address"),
  role: Yup.string().required("This field is required").oneOf(["user", "moderator", "administrator"]),
});
export const userInitialValues = {
  username: "",
  email: "",
  password: "",
  role: "",
};
export const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  content: "",
  attachment: "",
};
export const contactFormikProps = {
  initialValues,
  validationSchema,
  validateOnChange: false,
};
export const subscribeFormikProps = {
  initialValues: {
    ...initialValues,
    phone: "000",
    content: "subscribe",
  },
  validationSchema,
  validateOnChange: false,
};
export const vacancyFormikProps = {
  initialValues,
  validationSchema,
  validateOnChange: false,
};
export const settingsFormikProps = {
  initialValues: userInitialValues,
  validationSchema: validation,
  validateOnChange: false,
};

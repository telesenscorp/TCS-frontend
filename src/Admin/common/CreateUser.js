import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ADMIN, MOD, USER } from "../../common/constants";
import { settingsFormikProps } from "../../common/validation";
import { Del, Get, Post, Put } from "../../configuration/server";
import FormInput from "./FormInput";
import ListPicker from "./ListPicker";
import WindowSection from "./WindowSection";
const Roles = [
  { label: USER, value: USER },
  { label: MOD, value: MOD },
  { label: ADMIN, value: ADMIN },
];
function CreateUser() {
  const { auth } = useSelector((auth) => auth);
  const [users, setUsers] = useState([]);
  const updateUsers = () => {
    if (auth.role === ADMIN) {
      Get("allUsers", (v) => setUsers(v.filter((u) => u.id !== auth.id)));
    }
  };
  const onEditUser = ({ id, username, email, role }) => {
    if (window.confirm(`You wish to change ${username} with theses details?\nemail:  ${email}\nrole:  ${role}`)) {
      Put(["auth/user", id], { username, email, role }, updateUsers, () => window.alert("Fail"));
    }
  };
  const onDeleteUser = ({ id, username, email, role }) => {
    if (window.confirm(`You wish to delete ${username} with theses details?\nemail:  ${email}\nrole:  ${role}`)) {
      Del(["auth/user", id], updateUsers, () => window.alert("Fail"));
    }
  };
  const onCreate = ({ username, password, email, role }, { resetForm }) => {
    let msg = `You wish to create a user with theses details?\nusername: ${username}\nemail:  ${email}\npassword:  ${password}\nrole:  ${role}`;
    if (window.confirm(msg)) {
      Post(
        "createUser",
        { username, password, email, role },
        () => {
          window.alert("Success");
          resetForm();
          updateUsers();
        },
        () => window.alert("Fail")
      );
    }
  };
  useEffect(() => {
    updateUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div>
      <Formik {...settingsFormikProps} onSubmit={onCreate}>
        {({ values, dirty, errors, handleChange, handleSubmit }) => (
          <WindowSection label="Create User">
            <section className="section-divider row">
              <FormInput label="username*" error={errors.username} value={values.username} onChange={handleChange("username")} />
              <FormInput label="email*" error={errors.email} value={values.email} onChange={handleChange("email")} />
              <FormInput label="password*" error={errors.password} value={values.password} onChange={handleChange("password")} />
              <ListPicker name="role*" selected={values.role} error={errors.role} onChange={handleChange("role")} list={Roles} />
            </section>
            {dirty ? (
              <div className="p8 flex justify-right">
                <div onClick={handleSubmit} className="bar-button pointy">
                  <span>Create</span>
                </div>
              </div>
            ) : null}
          </WindowSection>
        )}
      </Formik>
      <WindowSection label="Users">
        <section className="section-divider col">
          {users.map((props, i) => (
            <div key={props.username + i} className="flex-row justify-between">
              <FormInput label="username" value={props.username} disabled />
              <FormInput label="email" value={props.email} disabled />
              <ListPicker name="role" selected={props.role} onChange={(v) => onEditUser({ ...props, role: v })} list={Roles} />
              <div className="p24 flex">
                <div onClick={() => onDeleteUser(props)} className="bar-button pointy">
                  <span>Delete</span>
                </div>
              </div>
            </div>
          ))}
        </section>
      </WindowSection>
    </div>
  );
}

export default CreateUser;

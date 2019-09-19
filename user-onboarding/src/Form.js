import React, { useState, useEffect } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

import UserCard from "./UserCard";

function OnboardingForm({ values, errors, touched, isSubmitting, status }) {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    if (status) {
      setUserList([...userList, status]);
    }
  }, [status]);

  return (
    <div>
      <Form>
        <div>
          <label>Name:</label>
          <Field type="text" name="name" placeholder="Name" />
        </div>
        <div>
          <label>Email:</label>
          {touched.email && errors.email && <p>{errors.email}</p>}
          <Field type="email" name="email" placeholder="Email" />
        </div>
        <div>
          <label>Password:</label>
          {touched.password && errors.password && <p>{errors.password}</p>}
          <Field type="password" name="password" placeholder="Password" />
        </div>
        <div>
          <label>
            <Field type="checkbox" name="tos" checked={values.tos} />
            Accept TOS
          </label>
        </div>
        <div>
          <label>Role</label>
          <Field component="select" name="role">
            <option value="frontend">Front-end</option>
            <option value="backend">Back-end</option>
            <option value="uxdesigner">UX designer</option>
          </Field>
        </div>
        <button disabled={isSubmitting}>Submit</button>
      </Form>
      {userList.map(user => (
        <UserCard
          key={user.name}
          name={user.name}
          role={user.role}
          email={user.email}
        />
      ))}
    </div>
  );
}

const FormikOnboardingForm = withFormik({
  mapPropsToValues({ name, email, password, tos, role }) {
    return {
      name: name || "",
      email: email || "",
      password: password || "",
      tos: tos || false,
      role: role || "frontend"
    };
  },
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email("Email not valid")
      .required("Email is required"),
    password: Yup.string()
      .min(16, "Password must be 16 characters or longer")
      .required("Password is required")
  }),

  handleSubmit(values, { resetForm, setStatus, setErrors, setSubmitting }) {
    if (values.email === "alreadytaken@atb.dev") {
      setErrors({ email: "That email is already taken" });
    } else {
      axios
        .post("https://reqres.in/api/users", values)
        .then(res => {
          console.log(res);
          setStatus(res.data); // Data was created successfully and logs to console
          resetForm();
          setSubmitting(false);
        })
        .catch(err => {
          console.log(err); // There was an error creating the data and logs to console
          setSubmitting(false);
        });
    }
  }
})(OnboardingForm);

export default FormikOnboardingForm;

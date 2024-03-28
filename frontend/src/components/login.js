import React from "react";
import { Alert } from "react-bootstrap";
import { Field, Form, Formik } from "formik";
import axios from "axios";
import { Link } from "react-router-dom";
import Button from './button';
import * as yup from "yup";

const Login = ({ onLogin }) => {
  
  
  const LoginSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
  });

  return (
    <div className="p-7">
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={async (values, actions) => {
          try {
            const response = await axios.post(
              "http://localhost:8080/api/auth/login",
              values
            );
        
            if (response.status === 200) {
              onLogin(values.username);
            } 
          } catch (error) {
              if (error.response && error.response.status === 401) {
                 actions.setFieldError("general", "Invalid username or password");
            } else if (error.response && error.response.status === 403) {
                 actions.setFieldError("general", "Account is locked. Please try again later.");
            } else {
              actions.setFieldError("general", "Failed to login. Please try again later.");
              
            }
          } finally {
            actions.setSubmitting(false);
          }
        }}
        
        
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit}>
            {errors.general && <Alert variant="danger">{errors.general}</Alert>}
            <div className="flex flex-col">
              <h3>Username</h3>
              <Field
                type="text"
                placeholder="Enter username"
                name="username"
                value={values.username}
                onChange={handleChange}
                isInvalid={touched.username && !!errors.username}
                className="p-2 rounded-lg h-10 text-xl"
              />
              <p className="text-fail mt-2">{errors.username}</p>
            </div>

            <div className="flex flex-col mb-10">
              <h3>Password</h3>
              <Field
                type="password"
                placeholder="Password"
                name="password"
                value={values.password}
                onChange={handleChange}
                isInvalid={touched.password && !!errors.password}
                className="p-2 rounded-lg h-10 text-xl"
              />
              <p className="text-fail mt-2">{errors.password}</p>
            </div>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </Form>
        )}
      </Formik>

      <p className="mt-6">
        Don't have an account?{" "}
        <Link to="/signup" className="text-red-pink">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;

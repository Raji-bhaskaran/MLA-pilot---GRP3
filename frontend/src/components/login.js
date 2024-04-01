import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import { Field, Form, Formik } from "formik";
import axios from "axios";
import { Link } from "react-router-dom";
import config from "../config";
import Button from "./button";
import * as yup from "yup";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

const Login = ({ onLogin, colorAccessibility }) => {
  const [showPassword, setShowPassword] = useState(false);

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
              `${config.apiUrl}/auth/login`,
              values
            );

            if (response.status === 200) {
              onLogin(values.username);
            }
          } catch (error) {
            if (error.response && error.response.status === 401) {
              actions.setFieldError("general", "Invalid username or password");
            } else if (error.response && error.response.status === 403) {
              actions.setFieldError(
                "general",
                "Account is locked. Please try again later."
              );
            } else {
              actions.setFieldError(
                "general",
                "Failed to login. Please try again later."
              );
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
              <div>
                <Field
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  isInvalid={touched.password && !!errors.password}
                  className="p-2 rounded-lg h-10 text-xl w-full"
                />
                {showPassword ? (
                  <FaRegEye
                    className="relative bottom-8 float-right right-4 w-6 h-6 cursor-pointer"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <FaRegEyeSlash
                    className="relative bottom-8 float-right right-4 w-6 h-6 cursor-pointer"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
              <p className="text-fail mt-2">{errors.password}</p>
            </div>
            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              colorAccessibility={colorAccessibility}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </Form>
        )}
      </Formik>

      <p className="mt-6">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className={`${
            colorAccessibility ? "text-[#880125]" : "text-red-pink"
          }`}
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;

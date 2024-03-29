import React from "react";
import { Form, Alert } from "react-bootstrap";
import { Field, Formik } from "formik";
import axios from "axios";
import { Link } from "react-router-dom";
import config from '../config';
import * as yup from "yup";
import Button from "./button";
import { CheckCircleOutlineOutlined, CloseOutlined } from "@material-ui/icons";

const Signup = ({ onSignup }) => {
  const SignUpSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup
      .string()
      .required("Password is required")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
        "Password invalid"
      ),
  });

  const passwordValidation = (input, touched) => {
    const hasEightCharacter = input.length >= 8;
    const hasLowercase = /[a-z]/.test(input);
    const hasUppercase = /[A-Z]/.test(input);
    const hasDigit = /\d/.test(input);
    const hasSpecialCharacter = /[!@#$%^&*]/.test(input);

    const colorSuccess = "text-success flex justify-center items-center w-full";
    const colorFail = "text-fail flex justify-center items-center w-full";

    const validationCriteria = [
      {
        isCriteriaValid: hasEightCharacter,
        text: "Min. 8 characters",
      },
      {
        isCriteriaValid: hasLowercase,
        text: "Min. 1 lowercase",
      },
      {
        isCriteriaValid: hasUppercase,
        text: "Min. 1 uppercase",
      },
      {
        isCriteriaValid: hasDigit,
        text: "Min. 1 digit",
      },
      {
        isCriteriaValid: hasSpecialCharacter,
        text: "Min. 1 special character (!@#$%^&*)",
      },
    ];

    return touched
      ? validationCriteria.map((criteria) => (
          <div className={criteria.isCriteriaValid ? colorSuccess : colorFail}>
            {criteria.isCriteriaValid ? (
              <CheckCircleOutlineOutlined fontSize="small" />
            ) : (
              <CloseOutlined fontSize="small" />
            )}
            <p className="m-0 text-sm">{criteria.text}</p>
          </div>
        ))
      : null;
  };

  return (
    <div className="p-7">
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={SignUpSchema}
        onSubmit={async (values, actions) => {
          try {
            const response = await axios.post(
              `${config.apiUrl}/auth/signup`,
              values
            );

            if (response.data === "User registered successfully!") {
              console.log("User registered successfully");
              onSignup(values.username);
            } else {
              actions.setFieldError("general", response.data);
            }
          } catch (error) {
            console.error("Error during registration", error);
            actions.setFieldError(
              "general",
              error.response?.data ||
                "An error occurred during registration. Please try again."
            );
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
          handleSubmit,
          isSubmitting,
          isValid,
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
                className="p-2 rounded-lg h-10 text-xl w-full"
              />
              <p className="text-fail mt-2">{errors.password}</p>
              {passwordValidation(values.password, !isValid)}
            </div>

            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isSubmitting || !isValid}
            >
              {isSubmitting ? "Signing up..." : "Signup"}
            </Button>
          </Form>
        )}
      </Formik>
      <p className="mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-red-pink">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Signup;

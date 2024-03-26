import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { trackHealth } from "../apiHealth";
import "bootstrap/dist/css/bootstrap.min.css";
import IconButton from "@material-ui/core/IconButton";
import VeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";
import DissatisfiedIcon from "@material-ui/icons/SentimentDissatisfied";
import NeutralIcon from "@material-ui/icons/SentimentSatisfied";
import SatisfiedIcon from "@material-ui/icons/SentimentSatisfiedAlt";
import VerySatisfiedIcon from "@material-ui/icons/SentimentVerySatisfied";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createTheme, ThemeProvider } from "@material-ui/core";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Button from "./button";

const theme = createTheme({
  palette: {
    primary: {
      main: "#D3FF86",
    },
    secondary: {
      main: "#FFFFFF",
    },
  },
});

const TrackHealth = ({ currentUser }) => {
  const [message, setMessage] = useState("");

  const TrackHealthSchema = yup.object().shape({
    date: yup.string().required(),
    tiredness: yup.string(),
    stress: yup.string(),
    height: yup
      .number()
      .min(0.1, "Please enter a number above 0.1"),
    weight: yup
      .number()
      .min(0.1, "Please enter a number above 0.1"),
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <Formik
          initialValues={{
            tiredness: "",
            stress: "",
            height: "",
            weight: "",
            date: new Date(),
          }}
          validationSchema={TrackHealthSchema}
          onSubmit={async (values, { resetForm }) => {
            console.log(values);

            const dataToSubmit = {
              username: currentUser,
              ...values,
            };

            console.log(dataToSubmit);

            try {
              const response = await trackHealth(dataToSubmit);
              console.log(response.data);

              resetForm();
              setMessage("Health data added successfully! Well done!");
              setTimeout(() => setMessage(""), 5000);
            } catch (error) {
              console.error("There was an error logging your data!", error);
            }
          }}
        >
          {({
            handleSubmit,
            handleReset,
            values,
            setFieldValue,
            isValid,
            dirty,
            touched,
          }) => (
            <FormikForm onSubmit={handleSubmit}>
              <div className="flex-col bg-black pb-6">
                <h3 className="text-white py-6">Track health data</h3>
                <Form.Group controlId="formDate" className="mb-6">
                  <Form.Label>
                    <h4 className="mr-6 text-white">Date:</h4>
                  </Form.Label>
                  <DatePicker
                    name="date"
                    selected={values.date}
                    onChange={(date) => setFieldValue("date", date)}
                    dateFormat="MMMM d, yyyy"
                    className="border border-grey rounded px-3 py-2 focus:border-red-pink text-lg"
                  />
                </Form.Group>
                <div className="bg-black w-full justify-center">
                <Form.Label>
                    <h4 className="mr-6 text-white">Tiredness:</h4>
                  </Form.Label>
                  <ThemeProvider theme={theme}>
                    <IconButton
                      name="tiredness"
                      color={
                        values.tiredness === "Very tired"
                          ? "primary"
                          : "secondary"
                      }
                      onClick={() => setFieldValue("tiredness", "Very tired")}
                    >
                      <VeryDissatisfiedIcon fontSize="large" />
                    </IconButton>
                    <IconButton
                      name="tiredness"
                      color={
                        values.tiredness === "Tired"
                          ? "primary"
                          : "secondary"
                      }
                      onClick={() => setFieldValue("tiredness", "Tired")}
                    >
                      <DissatisfiedIcon fontSize="large" />
                    </IconButton>
                    <IconButton
                      name="tiredness"
                      color={
                        values.tiredness === "Okay"
                          ? "primary"
                          : "secondary"
                      }
                      onClick={() => setFieldValue("tiredness", "Okay")}
                    >
                      <NeutralIcon fontSize="large" />
                    </IconButton>
                    <IconButton
                      name="tiredness"
                      color={
                        values.tiredness === "Pretty good"
                          ? "primary" 
                          : "secondary"
                      }
                      onClick={() => setFieldValue("tiredness", "Pretty good")}
                    >
                      <SatisfiedIcon fontSize="large" />
                    </IconButton>
                    <IconButton
                      name="tiredness"
                      color={
                        values.tiredness === "Feeling great"
                          ? "primary"
                          : "secondary"
                      }
                      onClick={() => setFieldValue("tiredness", "Feeling great")}
                    >
                      <VerySatisfiedIcon fontSize="large" />
                    </IconButton>
                  </ThemeProvider>{" "}
                  <Form.Label>
                    <h4 className="mr-6 text-white">Stress:</h4>
                  </Form.Label>
                  <ThemeProvider theme={theme}>
                    <IconButton
                      name="stress"
                      color={
                        values.stress === "Very stressed"
                          ? "primary"
                          : "secondary"
                      }
                      onClick={() => setFieldValue("stress", "Very stressed")}
                    >
                      <VeryDissatisfiedIcon fontSize="large" />
                    </IconButton>
                    <IconButton
                      name="stress"
                      color={
                        values.tiredness === "Stressed"
                          ? "primary"
                          : "secondary"
                      }
                      onClick={() => setFieldValue("stress", "Stressed")}
                    >
                      <DissatisfiedIcon fontSize="large" />
                    </IconButton>
                    <IconButton
                      name="stress"
                      color={
                        values.stress === "Okay"
                          ? "primary"
                          : "secondary"
                      }
                      onClick={() => setFieldValue("stress", "Okay")}
                    >
                      <NeutralIcon fontSize="large" />
                    </IconButton>
                    <IconButton
                      name="stress"
                      color={
                        values.stress === "Pretty good"
                          ? "primary" 
                          : "secondary"
                      }
                      onClick={() => setFieldValue("stress", "Pretty good")}
                    >
                      <SatisfiedIcon fontSize="large" />
                    </IconButton>
                    <IconButton
                      name="stress"
                      color={
                        values.stress === "Feeling great"
                          ? "primary"
                          : "secondary"
                      }
                      onClick={() => setFieldValue("stress", "Feeling great")}
                    >
                      <VerySatisfiedIcon fontSize="large" />
                    </IconButton>
                  </ThemeProvider>{" "}  
                </div>
              </div>
              
              <div className="p-7 flex-col">
                <div className="flex justify-around">
                  <Form.Group controlId="height" className="mb-10">
                    <Form.Label>
                      <h4>Height (in cm):</h4>
                    </Form.Label>
                    <Field
                      type="number"
                      name="height"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="height"
                      component="div"
                      className="text-red-pink"
                    />
                  </Form.Group>
                  <Form.Group controlId="weight" className="mb-10">
                    <Form.Label>
                      <h4>Weight (in kg):</h4>
                    </Form.Label>
                    <Field
                      type="number"
                      name="weight"
                      className="form-control"
                      step="0.01"
                    />
                    <ErrorMessage
                      name="weight"
                      component="div"
                      className="text-red-pink"
                    />
                  </Form.Group>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button
                    variant="primary"
                    disabled={!dirty || !touched || !isValid}
                    onClick={handleSubmit}
                  >
                    Save health info
                  </Button>
                  {dirty ? (
                    <Button variant="link" onClick={handleReset}>
                      Cancel
                    </Button>
                  ) : null}
                </div>
              </div>
              {message && (
                <p className="text-success pb-10 font-bold">{message}</p>
              )}
            </FormikForm>
          )}
        </Formik>
      </ThemeProvider>
    </>
  );
};

export default TrackHealth;
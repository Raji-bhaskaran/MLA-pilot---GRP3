import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { trackExercise } from "../apiExercise";
import "bootstrap/dist/css/bootstrap.min.css";
import IconButton from "@material-ui/core/IconButton";
import DirectionsRunIcon from "@material-ui/icons/DirectionsRun";
import BikeIcon from "@material-ui/icons/DirectionsBike";
import PoolIcon from "@material-ui/icons/Pool";
import FitnessCenterIcon from "@material-ui/icons/FitnessCenter";
import OtherIcon from "@material-ui/icons/HelpOutline";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createTheme, ThemeProvider } from "@material-ui/core";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import Button from "./button";
import CustomSlider from "./customSlider";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0ADD08",
    },
    secondary: {
      main: "#FFFFFF",
    },
  },
});

const TrackExercise = ({ currentUser }) => {
  const [message, setMessage] = useState("");

  const TrackExerciseSchema = yup.object().shape({
    date: yup.string().required(),
    description: yup.string(),
    duration: yup
      .number()
      .required("Please enter a number")
      .min(0.1, "Please enter a number above 0.1"),
    distance: yup
      .number()
      .test(
        "optionalMin",
        "Please enter 0 or a number above 0.01",
        function (value) {
          if (!value) {
            return true;
          }
          return value >= 0.01;
        }
      ),
    levelOfEffort: yup.number().required(),
    exerciseType: yup.string().required(),
  });

  return (
    <>
      <ThemeProvider theme={theme}>
        <Formik
          initialValues={{
            exerciseType: "",
            description: "",
            duration: 0,
            distance: 0,
            levelOfEffort: 0,
            date: new Date(),
          }}
          validationSchema={TrackExerciseSchema}
          onSubmit={async (values, { resetForm }) => {
            console.log(values);

            const dataToSubmit = {
              username: currentUser,
              ...values,
            };

            console.log(dataToSubmit);

            try {
              const response = await trackExercise(dataToSubmit);
              console.log(response.data);

              resetForm();
              setMessage("Activity logged successfully! Well done!");
              setTimeout(() => setMessage(""), 5000);
            } catch (error) {
              console.error("There was an error logging your activity!", error);
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
                <h3 className="text-white py-6">Track Exercise</h3>
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
                  <ThemeProvider theme={theme}>
                    <IconButton
                      name="exerciseType"
                      color={
                        values.exerciseType === "Running"
                          ? "primary"
                          : "secondary"
                      }
                      onClick={() => setFieldValue("exerciseType", "Running")}
                    >
                      <DirectionsRunIcon fontSize="large" />
                    </IconButton>
                    <IconButton
                      name="exerciseType"
                      color={
                        values.exerciseType === "Cycling"
                          ? "primary"
                          : "secondary"
                      }
                      onClick={() => setFieldValue("exerciseType", "Cycling")}
                    >
                      <BikeIcon fontSize="large" />
                    </IconButton>
                    <IconButton
                      name="exerciseType"
                      color={
                        values.exerciseType === "Swimming"
                          ? "primary"
                          : "secondary"
                      }
                      onClick={() => setFieldValue("exerciseType", "Swimming")}
                    >
                      <PoolIcon fontSize="large" />
                    </IconButton>
                    <IconButton
                      name="exerciseType"
                      color={
                        values.exerciseType === "Gym" ? "primary" : "secondary"
                      }
                      onClick={() => setFieldValue("exerciseType", "Gym")}
                    >
                      <FitnessCenterIcon fontSize="large" />
                    </IconButton>
                    <IconButton
                      name="exerciseType"
                      color={
                        values.exerciseType === "Other"
                          ? "primary"
                          : "secondary"
                      }
                      onClick={() => setFieldValue("exerciseType", "Other")}
                    >
                      <OtherIcon fontSize="large" />
                    </IconButton>
                  </ThemeProvider>{" "}
                </div>
              </div>
              <div className="p-7 flex-col">
                <Form.Group controlId="description" className="mb-10">
                  <Form.Label>
                    <h4>Description:</h4>
                  </Form.Label>
                  <Field
                    name="description"
                    as="textarea"
                    rows={3}
                    className="form-control"
                  />
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-pink"
                  />
                </Form.Group>
                <div className="flex justify-around">
                  <Form.Group controlId="duration" className="mb-10">
                    <Form.Label>
                      <h4>Duration (in minutes):</h4>
                    </Form.Label>
                    <Field
                      type="number"
                      name="duration"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="duration"
                      component="div"
                      className="text-red-pink"
                    />
                  </Form.Group>
                  <Form.Group controlId="distance" className="mb-10">
                    <Form.Label>
                      <h4>Distance (in km):</h4>
                    </Form.Label>
                    <Field
                      type="number"
                      name="distance"
                      className="form-control"
                      step="0.01"
                    />
                    <ErrorMessage
                      name="distance"
                      component="div"
                      className="text-red-pink"
                    />
                  </Form.Group>
                </div>

                <Form.Group controlId="levelOfEffort" className="mb-10">
                  <Form.Label>
                    <h4 className="mb-8">Level of effort:</h4>
                  </Form.Label>
                  <Field
                    name="levelOfEffort"
                    valueLabelDisplay="on"
                    as={CustomSlider}
                    defaultValue={30}
                    step={10}
                    marks
                    min={0}
                    max={100}
                    color="primary"
                  />
                  <ErrorMessage
                    name="levelOfEffort"
                    component="div"
                    className="text-red-pink"
                  />
                </Form.Group>
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="primary"
                    disabled={!dirty || !touched || !isValid}
                    onClick={handleSubmit}
                  >
                    Save activity
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

export default TrackExercise;

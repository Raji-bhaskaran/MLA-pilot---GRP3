import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import { trackExercise } from "../api"; // Import other necessary APIs if needed
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
      main: "#D3FF86",
    },
    secondary: {
      main: "#FFFFFF",
    },
  },
});

const Dashboard = ({ currentUser }) => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // You can add additional initialization logic here
  }, []);

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
        <div className="flex-col bg-black pb-6">
          <h3 className="text-white py-6">Welcome to the Fitness App, {currentUser}!</h3>
        </div>
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
            const dataToSubmit = {
              username: currentUser,
              ...values,
            };

            try {
              const response = await trackExercise(dataToSubmit);
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
              <div className="p-7">
                <Form.Group controlId="formDate" className="mb-4">
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
                {/* Other form fields */}
                <div className="flex justify-center">
                  <Button
                    variant="primary"
                    disabled={!dirty || !touched || !isValid}
                    onClick={handleSubmit}
                  >
                    Save Activity
                  </Button>
                  {dirty ? (
                    <Button variant="link" onClick={handleReset}>
                      Cancel
                    </Button>
                  ) : null}
                </div>
              </div>
              {message && (
                <p className="text-success pb-4 font-bold">{message}</p>
              )}
            </FormikForm>
          )}
        </Formik>
      </ThemeProvider>
    </>
  );
};

export default Dashboard;

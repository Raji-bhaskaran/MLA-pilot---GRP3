import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import Button from "./button";
import ExercisesIcon from "./icon";

const Journal = ({ currentUser, colorAccessibility }) => {
  const [startDate, setStartDate] = useState(moment().startOf("week").toDate());
  const [endDate, setEndDate] = useState(moment().endOf("week").toDate());
  const [exercises, setExercises] = useState([]);

  const fetchExercises = async () => {
    try {
      const url = `http://localhost:5050/stats/weekly/?user=${currentUser}&start=${moment(
        startDate
      ).format("YYYY-MM-DD")}&end=${moment(endDate).format("YYYY-MM-DD")}`;
      const response = await axios.get(url);
      console.log("API Response:", response.data);
      if (response.data.stats && Array.isArray(response.data.stats)) {
        setExercises(response.data.stats);
      } else {
        console.error("Unexpected response structure:", response.data);
        setExercises([]);
      }
    } catch (error) {
      console.error("Failed to fetch exercises", error);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [currentUser, startDate, endDate]);

  const goToPreviousWeek = () => {
    setStartDate(
      moment(startDate).subtract(1, "weeks").startOf("week").toDate()
    );
    setEndDate(moment(endDate).subtract(1, "weeks").endOf("week").toDate());
  };

  const goToNextWeek = () => {
    setStartDate(moment(startDate).add(1, "weeks").startOf("week").toDate());
    setEndDate(moment(endDate).add(1, "weeks").endOf("week").toDate());
  };

  const convertToMinSecs = (seconds) => {
    const result = new Date(seconds * 1000).toISOString().substring(14, 19);

    return result;
  };

  return (
    <>
      <h4 className="p-7">Weekly Exercise Journal</h4>
      <div className="flex justify-between items-center font-bold bg-grey">
        <Button
          variant="secondary"
          size="sm"
          onClick={goToPreviousWeek}
          className={colorAccessibility ? "border-4 border-black" : ""}
        >
          &larr; Previous
        </Button>
        <p className="text-black m-0 text-lg">
          {moment(startDate).format("YYYY-MM-DD")} to{" "}
          {moment(endDate).format("YYYY-MM-DD")}
        </p>
        <Button
          variant="secondary"
          size="sm"
          onClick={goToNextWeek}
          className={colorAccessibility ? "border-4 border-black" : ""}
        >
          Next &rarr;
        </Button>
      </div>
      <div className="p-7 bg-black text-white rounded-b-2xl drop-shadow-md">
        <br></br>
        <ul>
          {exercises && exercises.length > 0 ? (
            exercises.map((exercise, index) => (
              <li key={index} className="mb-2">
                <span className="font-bold text-light-green">
                  <ExercisesIcon icon={exercise.exerciseType} />{" "}
                  {exercise.exerciseType}
                </span>{" "}
                - {exercise.totalDuration} minutes - {exercise.totalDistance} km
                - {convertToMinSecs(exercise.avgPace)} avg per km
              </li>
            ))
          ) : (
            <li>No exercises found for this period.</li>
          )}
        </ul>
      </div>
    </>
  );
};

export default Journal;

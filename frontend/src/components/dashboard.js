import React, { useEffect, useState } from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { getAllExercisesByUser } from "../apiExercise";
import { getAllHealthByUser } from "../apiHealth";
import { startOfWeek, endOfWeek, subWeeks } from "date-fns";

const Dashboard = ({ currentUser, chartSize, colorAccessibility }) => {
  const [exercises, setExercises] = useState();
  const [exercisesThisWeek, setExercisesThisWeek] = useState([]);
  const [exercisesPreviousWeek, setExercisesPreviousWeek] = useState([]);
  const [health, setHealth] = useState();
  const [latestHealth, setLatestHealth] = useState([]);

  const fetchAllExercisesByUser = async (username) => {
    try {
      const response = await getAllExercisesByUser(username);
      console.log("All exercises by users:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch all exercises:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchAllExercisesByUser(currentUser).then((exercisesData) => {
      setExercises(exercisesData);
    });
  }, [currentUser]);

  useEffect(() => {
    if (exercises) {
      const now = new Date();
      const startOfCurrentWeek = startOfWeek(now);
      const endOfCurrentWeek = endOfWeek(now);
      const startOfPreviousWeek = startOfWeek(subWeeks(now, 1));
      const endOfPreviousWeek = endOfWeek(subWeeks(now, 1));

      const exercisesCurrentWeek = exercises.filter((exercise) => {
        const exerciseDate = new Date(exercise.date);
        return (
          exerciseDate >= startOfCurrentWeek && exerciseDate <= endOfCurrentWeek
        );
      });
      const exercisesPreviousWeek = exercises.filter((exercise) => {
        const exerciseDate = new Date(exercise.date);
        return (
          exerciseDate >= startOfPreviousWeek &&
          exerciseDate <= endOfPreviousWeek
        );
      });

      setExercisesThisWeek(exercisesCurrentWeek);
      setExercisesPreviousWeek(exercisesPreviousWeek);
    }
  }, [exercises]);

  const totalDurationThisWeek = exercisesThisWeek.reduce(
    (acc, exercise) => acc + exercise.duration,
    0
  );
  const numExercisesThisWeek = exercisesThisWeek.length;

  const totalDurationPreviousWeek = exercisesPreviousWeek.reduce(
    (acc, exercise) => acc + exercise.duration,
    0
  );
  const numExercisesPreviousWeek = exercisesPreviousWeek.length;

  const numExercises = [
    {
      label: "This week",
      value: numExercisesThisWeek || 0,
      color: colorAccessibility ? "#00417A" : "#0088FE",
    },
    {
      label: "Last week",
      value: numExercisesPreviousWeek || 0,
      color: colorAccessibility ? "#0A4237" : "#00C49F",
    },
  ];

  const duration = [
    {
      label: "This week",
      value: totalDurationThisWeek || 0,
      color: colorAccessibility ? "#00417A" : "#0088FE",
    },
    {
      label: "Last week",
      value: totalDurationPreviousWeek || 0,
      color: colorAccessibility ? "#0A4237" : "#00C49F",
    },
  ];

  const fetchAllHealthByUser = async (username) => {
    try {
      const response = await getAllHealthByUser(username);
      console.log("All health by users:", response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch all health:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchAllHealthByUser(currentUser).then((healthData) => {
      setHealth(healthData);
    });
  }, [currentUser]);

  useEffect(() => {
    if (health) {
      const sortedHealth = health.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const latestHealth = sortedHealth[0];
      setLatestHealth(latestHealth);
    }
  }, [health]);

  const calculateBMI = (weight, height) => {
    // Convert height from cm to meters
    const heightInMeters = height / 100;
    // Formula: BMI = weight (kg) / (height (m) * height (m))
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    return bmi;
};
  
  const weight = latestHealth.weight;

  const height = latestHealth.height;

  const bmi = calculateBMI(weight, height);

  const getBMILabel = (bmi) => {
    if (bmi >= 30) {
      return "Obese";
    } else if (bmi >= 25) {
      return "Overweight";
    } else if (bmi >= 18.5) {
      return "Healthy";
    } else if (bmi >= 0.1) {
      return "Underweight";
    } else {
      return "No BMI calculated";
    }
  };

  
  const sizing = {
    margin: { right: 5 },
    width: chartSize === "big" ? 300 : 150,
    height: chartSize === "big" ? 280 : 130,
    legend: { hidden: true },
  };

  const TOTAL = duration.map((item) => item.value).reduce((a, b) => a + b, 0);

  const getArcLabel = (params) => {
    return `${params.value}`;
  };

  const getArcLabelPercentage = (params) => {
    const percent = params.value / TOTAL;
    return `${(percent * 100).toFixed(0)}%`;
  };

  return (
    <>
      <h4 className="px-7 pt-7">
        Welcome, {currentUser} to the MLA Fitness App
      </h4>
      <p className="px-7">Check your progress...</p>
      <div className="flex justify-center mb-6">
        <div className="flex items-center mr-12">
          <div
            className={` ${
              colorAccessibility ? "bg-[#0A4237]" : "bg-[#00C49F]"
            } w-6 h-6 rounded mr-3`}
          ></div>
          <p className="mb-0">Last week</p>
        </div>
        <div className="flex items-center">
        <div
            className={` ${
              colorAccessibility ? "bg-[#00417A]" : "bg-[#0088FE]"
            } w-6 h-6 rounded mr-3`}
          ></div>
          <p className="mb-0">This week</p>
        </div>
      </div>
      <div className="flex justify-around">
        <div className="flex flex-col">
          <p className="font-bold">Number of exercises</p>
          <PieChart
            series={[
              {
                outerRadius: chartSize === "big" ? 100 : 60,
                data: numExercises,
                arcLabel: getArcLabel,
                paddingAngle: colorAccessibility ? 12 : 0,
              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fill: "white",
                fontSize: chartSize === "big" ? 28 : 14,
              },
            }}
            {...sizing}
          />
        </div>
        <div className="flex flex-col">
          <p className="font-bold">Duration</p>
          <PieChart
            series={[
              {
                outerRadius: chartSize === "big" ? 100 : 60,
                data: duration,
                arcLabel: getArcLabelPercentage,
                paddingAngle: colorAccessibility ? 12 : 0,
              },
            ]}
            sx={{
              [`& .${pieArcLabelClasses.root}`]: {
                fill: "white",
                fontSize: chartSize === "big" ? 28 : 14,
              },
            }}
            {...sizing}
          />
        </div>
      </div>
      <div className="py-7">
        <h4 className="px-7">Your health info</h4>
        <div className="flex justify-around">
          <p className="font-bold">Weight: {weight}kg</p>
          <p className="font-bold">BMI: {bmi} ({getBMILabel(bmi)}) </p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

import React, { useState, useEffect } from "react";
import { MenuItem, Select } from "@material-ui/core";
import ExercisesIcon from "./icon";
import config from '../config';

const Statistics = ({ currentUser }) => {
  const [data, setData] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      const query = `
        query FilteredStats($username: String!) {
          filteredStats(name: $username) {
            success
            results {
              username
              exercises {
                exerciseType
                totalDuration
                totalDistance
                avgLevelOfEffort
                avgPace
              }
            }
          }
        }
      `;

      const variables = {
        username: currentUser,
      };

      try {
        const response = await fetch(`${config.apiUrl}/api/graphql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query, variables }),
        });

        const {
          data: { filteredStats },
        } = await response.json();
        const userData = filteredStats.results[0];
        setData(userData);
      } catch (error) {
        console.error("There was an error fetching the data!", error);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleSelectChange = (event) => {
    setSelectedActivity(event.target.value);
  };

  const convertToMinSecs = (seconds) => {
    const result = new Date(seconds * 1000).toISOString().substring(14, 19);
    return result;
  };

  const getLevelOfEffortLabel = (levelOfEffort) => {
    if (levelOfEffort >= 80) {
      return "Very High Effort";
    } else if (levelOfEffort >= 60) {
      return "High Effort";
    } else if (levelOfEffort >= 40) {
      return "Moderate Effort";
    } else if (levelOfEffort >= 20) {
      return "Low Effort";
    } else {
      return "Very Low Effort";
    }
  };

  return (
    <>
      <h4 className="p-7">
        Well done, {currentUser}! This is your overall effort:
      </h4>
      <div className="p-7 bg-black text-white rounded-b-2xl drop-shadow-md">
        <Select
          value={selectedActivity}
          onChange={handleSelectChange}
          style={{
            backgroundColor: "#D3FF86",
            padding: "10px",
            margin: "10px",
            borderRadius: "16px",
            "& .MuiSelectNativeInput": {
              border: "none",
            },
            "& .MuiSelectRoot": {
              border: "none",
            },
          }}
        >
          <MenuItem value="all">All Activities</MenuItem>
          <MenuItem value="Gym">Gym</MenuItem>
          <MenuItem value="Swimming">Swimming</MenuItem>
          <MenuItem value="Cycling">Cycling</MenuItem>
          <MenuItem value="Running">Running</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
        {data && data.exercises ? (
          data.exercises
            .filter((item) =>
              selectedActivity === "all"
                ? item
                : item.exerciseType === selectedActivity
            )
            .map((item, index) => (
              <div key={index} className="p-2">
                <div className="text-light-green">
                  <ExercisesIcon icon={item.exerciseType} />
                  <strong>{item.exerciseType}</strong>
                </div>
                <div>Total Duration: {item.totalDuration} min</div>
                <div>Total Distance: {item.totalDistance} km</div>
                <div>Avg Pace: {convertToMinSecs(item.avgPace)} per km</div>
                <div>
                  Avg Effort: {getLevelOfEffortLabel(item.avgLevelOfEffort)}
                </div>
              </div>
            ))
        ) : (
          <p>No data available</p>
        )}
      </div>
    </>
  );
};

export default Statistics;

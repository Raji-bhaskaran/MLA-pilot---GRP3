import React, { useState, useEffect } from 'react';
import './statistics.css';

const Statistics = ({ currentUser }) => {
  const [data, setData] = useState([]);

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
        const response = await fetch('http://localhost:5050/api/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query, variables }),
        });

        const { data: { filteredStats } } = await response.json();
        const userData = filteredStats.results[0];
        setData(userData);
      } catch (error) {
        console.error('There was an error fetching the data!', error);
      }
    };

    fetchData();
  }, [currentUser]);

  const convertToMinSecs = (seconds) => {
    const result = new Date(seconds * 1000).toISOString().substring(14, 19);
    return result;
  };

  const getLevelOfEffortLabel = (levelOfEffort) => {
    if (levelOfEffort >= 80) {
      return 'Very High Effort';
    } else if (levelOfEffort >= 60) {
      return 'High Effort';
    } else if (levelOfEffort >= 40) {
      return 'Moderate Effort';
    } else if (levelOfEffort >= 20) {
      return 'Low Effort';
    } else {
      return 'Very Low Effort';
    }
  };

  return (
    <div className="stats-container">
      <h4>Well done, {currentUser}! This is your overall effort:</h4>
      {data && data.exercises ? (
        data.exercises.map((item, index) => (
          <div key={index} className="exercise-data">
            <div><strong>{item.exerciseType}</strong></div>
            <div>Total Duration: {item.totalDuration} min</div>
            <div>Total Distance: {item.totalDistance} km</div>
            <div>Avg Pace: {convertToMinSecs(item.avgPace)} per km</div>
            <div>Avg Effort: {getLevelOfEffortLabel(item.avgLevelOfEffort)}</div>
          </div>
        ))
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Statistics;

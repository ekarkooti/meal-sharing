import React, { useState, useEffect } from 'react';
import { Meal } from '../Meal/Meal';
import './MealsList.css'; 

export const MealsList = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/meals');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMeals(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  if (loading) {
    return (
      <div className="loading-message">
        <p>Loading meals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <p>Error fetching meals: {error}</p>
      </div>
    );
  }

  if (meals.length === 0) {
    return (
      <div className="no-meals-message">
        <p>No meals available yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="meals-list-page">
      <h2 className="meals-list-title">Available Meals</h2>
      <div className="meals-grid">
        {meals.map((meal) => (
          <Meal key={meal.id} meal={meal} />
        ))}
      </div>
    </div>
  );
};

export default MealsList;

import React, { useState, useEffect } from 'react';

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
    return <p>Loading meals...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>Error fetching meals: {error}</p>;
  }

  if (meals.length === 0) {
    return <p>No meals available!</p>;
  }

  return (
    <div className="meals-list-container">
      <h2>Available Meals</h2>
      {meals.map((meal) => (
        <div key={meal.id} className="meal-item" style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', borderRadius: '5px' }}>
          <h3>{meal.title}</h3>
          <p>Description: {meal.description}</p>
          <p>Price: DKK {meal.price}</p>
          <p>Max Reservations: {meal.max_reservations}</p> 
          <p>Location: {meal.location}</p>
        </div>
      ))}
    </div>
  );
};

export default MealsList;
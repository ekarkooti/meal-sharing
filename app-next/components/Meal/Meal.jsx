import React from 'react';
import './Meal.css';

export const Meal = ({ meal }) => {
  const { title, description, price, picture_url, servings, cuisine } = meal;

  const handleError = (e) => {
    e.target.src = 'https://placehold.co/400x250/E0E0E0/333333?text=No+Image';
    e.target.alt = 'Image not available';
  };

  return (
    <div className="meal-card">
      {picture_url && (
        <img
          src={picture_url}
          alt={title}
          className="meal-image"
          onError={handleError}
        />
      )}
      {!picture_url && (
        <div className="meal-image-placeholder">
          No Image Available
        </div>
      )}

      <div className="meal-content">
        <div>
          <h3 className="meal-title">{title}</h3>
          <p className="meal-description">{description}</p>
        </div>
        <div>
          <p className="meal-price">Price: DKK {price}</p>
          {servings && <p className="meal-detail">Serves: {servings}</p>}
          {cuisine && <p className="meal-detail">Cuisine: {cuisine}</p>}
        </div>
      </div>
    </div>
  );
};

export default Meal;
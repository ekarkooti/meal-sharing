import React from 'react';
import './Meal.css';
import Image from 'next/image'; 
import Link from 'next/link'; 

export const Meal = ({ meal }) => {
  const { id,title, description, price, picture_url, servings, cuisine } = meal;
  const defaultImageSrc = 'https://placehold.co/400x250/E0E0E0/333333?text=No+Image';
  const imageWidth = 400; 
  const imageHeight = 250;


  return (
    <Link href={`/meals/${id}`} className="meal-card-link">
    <div className="meal-card">
      {picture_url && (
        <Image
        src={picture_url || defaultImageSrc}
        alt={title || 'Meal image'}
          className="meal-image"
          width={imageWidth}
          height={imageHeight}
          layout="responsive"
        />
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
    </Link>
  );
};

export default Meal;
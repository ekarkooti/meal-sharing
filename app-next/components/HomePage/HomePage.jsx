"use client";
import Link from 'next/link';
import "./HomePage.css";
import React from 'react';

import { MealsList } from '/components/MealsList/MealsList'; 

export const HomePage = () => {
  return (
    
    <div className="home-page-container">
      <div className="homepage-intro">
        <h1>Welcome to Meal Sharing</h1>
        <p>Explore and book delicious homemade meals from your community!</p>
      </div>

      <MealsList limit={4} enablePagination={false}/>
      <div className="show-more-button-container">
        <Link href="/meals" passHref>
          <button className="show-more-button">
            Show More Meals
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;

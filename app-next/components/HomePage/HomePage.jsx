"use client";

import "./HomePage.css";
import React from 'react';

import { MealsList } from '/components/MealsList/MealsList'; 

export const HomePage = () => {
  return (
    <div className="home-page-container">
      <h1>Welcome to Meal Sharing!</h1>

      <MealsList />

    </div>
  );
};

export default HomePage;

"use client";
import Link from "next/link";
import React from "react";

import { MealsList } from "/components/MealsList/MealsList";

export const AllMeals = () => {
  return (
    <div className="home-page-container">
      <div className="homepage-intro">
        <h1>All Meals</h1>
      </div>

      <MealsList limit={8} enablePagination={true} />
    </div>
  );
};

export default AllMeals;

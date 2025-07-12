"use client";
import React, { useState, useEffect } from "react";
import { useMealsQuery } from "@/Context/MealsQueryContext/MealsQueryContext";
import { Meal } from "../Meal/Meal";
import "./MealsList.css";

export const MealsList = ({ limit = null, enablePagination = false }) => {
  const [allMealsData, setAllMealsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const { searchTerm, filter, sort } = useMealsQuery();
  let mealsToDisplay = [];
  let totalPages = 1;
  const mealsPerPage = limit || 9;

  useEffect(() => {
    const fetchAllMeals = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = new URL("http://localhost:3001/api/meals");

        if (searchTerm) url.searchParams.append("title", searchTerm);
        if (filter) url.searchParams.append("availableReservations", filter);

        if (sort) {
          const [key, dir] = sort.split("-");
          url.searchParams.append("sortKey", key);
          url.searchParams.append("sortDir", dir);
        }

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setAllMealsData(data.meals || data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMeals();
  }, [searchTerm, filter, sort]);

  if (!loading && !error && allMealsData.length > 0) {
    if (enablePagination) {
      totalPages = Math.ceil(allMealsData.length / mealsPerPage);

      if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
      } else if (currentPage === 0 && totalPages > 0) {
        setCurrentPage(1);
      }

      const startIndex = (currentPage - 1) * mealsPerPage;
      const endIndex = startIndex + mealsPerPage;
      mealsToDisplay = allMealsData.slice(startIndex, endIndex);
    } else if (limit !== null && limit > 0) {
      mealsToDisplay = allMealsData.slice(0, limit);
      totalPages = 1;
    } else {
      mealsToDisplay = allMealsData;
      totalPages = 1;
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

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

  if (mealsToDisplay.length === 0 && !loading) {
    return (
      <div className="no-meals-message">
        <p>No meals available! Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="meals-list-page">
      <div className="meals-grid">
        {mealsToDisplay.map((meal) => (
          <Meal key={meal.id} meal={meal} />
        ))}
      </div>

      {enablePagination && totalPages > 1 && (
        <div className="pagination-controls">
          <button onClick={goToPrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={goToNextPage} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

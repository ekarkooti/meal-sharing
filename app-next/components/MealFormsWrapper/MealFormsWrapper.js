"use client";

import React, { useState } from "react";
import { ReservationForm } from "../ReservationForm/ReservationForm";
import { ReviewForm } from "../ReviewForm/ReviewForm";
import "./MealFormsWrapper.css";

export const MealFormsWrapper = ({ mealId, initialAvailableReservations }) => {
  const [activeForm, setActiveForm] = useState(null);

  const handleToggleReservation = () => {
    setActiveForm(activeForm === "reservation" ? null : "reservation");
  };

  const handleToggleReview = () => {
    setActiveForm(activeForm === "review" ? null : "review");
  };

  return (
    <div className="meal-forms-wrapper">
      <div className="form-toggle-buttons">
        <button
          onClick={handleToggleReservation}
          className={`toggle-button ${
            activeForm === "reservation" ? "active" : ""
          }`}
        >
          Make a Reservation
        </button>
        <button
          onClick={handleToggleReview}
          className={`toggle-button ${activeForm === "review" ? "active" : ""}`}
        >
          Leave a Review
        </button>
      </div>

      {activeForm === "reservation" && (
        <div className="form-section">
          <h3>Make a Reservation</h3>
          <ReservationForm
            mealId={mealId}
            initialAvailableReservations={initialAvailableReservations}
          />
        </div>
      )}

      {activeForm === "review" && (
        <div className="form-section">
          <h3>Leave Your Review</h3>
          <ReviewForm mealId={mealId} />
        </div>
      )}
    </div>
  );
};

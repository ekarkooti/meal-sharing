// components/ReviewForm/ReviewForm.js
"use client";

import React, { useState } from "react";
import "./ReviewForm.css";

export const ReviewForm = ({ mealId }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stars, setStars] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const reviewData = {
      meal_id: mealId,
      title: title,
      description: description,
      stars: parseInt(stars, 10),
      created_date: new Date().toISOString().slice(0, 10),
    };

    try {
      const backendApiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
      const response = await fetch(`${backendApiUrl}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        alert(
          `Error submitting review: ${response.status} ${response.statusText}`
        );
        return;
      }

      alert("Review submitted successfully!");
      setTitle("");
      setDescription("");
      setStars(5);
    } catch (err) {
      alert(`Network error submitting review: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="review-form-container">
      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label htmlFor="reviewTitle">Title:</label>
          <input
            type="text"
            id="reviewTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={submitting}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reviewDescription">Description:</label>
          <textarea
            id="reviewDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            required
            disabled={submitting}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="reviewStars">Stars (1-5):</label>
          <input
            type="number"
            id="reviewStars"
            value={stars}
            onChange={(e) =>
              setStars(
                Math.max(1, Math.min(5, parseInt(e.target.value, 10) || 1))
              )
            }
            min="1"
            max="5"
            required
            disabled={submitting}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="submit-review-button"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

// components/ReservationForm/ReservationForm.js
"use client";

import React, { useState } from "react";
import "./ReservationForm.css";

export const ReservationForm = ({ mealId, initialAvailableReservations }) => {
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhoneNumber, setContactPhoneNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const reservationData = {
      number_of_guests: parseInt(numberOfGuests, 10),
      meal_id: parseInt(mealId, 10),
      contact_name: contactName,
      contact_email: contactEmail,
      contact_phone_number: contactPhoneNumber,
      created_date: new Date().toISOString().slice(0, 10),
    };

    try {
      const backendApiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
      const response = await fetch(`${backendApiUrl}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      });

      if (!response.ok) {
        alert(
          `Error submitting reservation: ${response.status} ${response.statusText}`
        );
        return;
      }

      alert("Reservation submitted successfully!");
      setNumberOfGuests(1);
      setContactName("");
      setContactEmail("");
      setContactPhoneNumber("");
    } catch (err) {
      alert(`Network error submitting reservation: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="reservation-form-container">
      <form onSubmit={handleSubmit} className="reservation-form">
        <div className="form-group">
          <label htmlFor="guests">Number of Guests:</label>
          <input
            type="number"
            id="guests"
            value={numberOfGuests}
            onChange={(e) =>
              setNumberOfGuests(Math.max(1, parseInt(e.target.value, 10) || 1))
            }
            min="1"
            max={
              initialAvailableReservations > 0
                ? initialAvailableReservations
                : 100
            }
            required
            disabled={submitting}
          />
          {initialAvailableReservations !== undefined &&
            initialAvailableReservations <= 0 && (
              <p className="no-seats-message">
                No seats available for this meal!
              </p>
            )}
        </div>
        <div className="form-group">
          <label htmlFor="contactName">Your Name:</label>
          <input
            type="text"
            id="contactName"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            required
            disabled={submitting}
          />
        </div>
        <div className="form-group">
          <label htmlFor="contactEmail">Your Email:</label>
          <input
            type="email"
            id="contactEmail"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            required
            disabled={submitting}
          />
        </div>
        <div className="form-group">
          <label htmlFor="contactPhone">Your Phone (Optional):</label>
          <input
            type="tel"
            id="contactPhone"
            value={contactPhoneNumber}
            onChange={(e) => setContactPhoneNumber(e.target.value)}
            disabled={submitting}
          />
        </div>
        <button
          type="submit"
          disabled={submitting || initialAvailableReservations <= 0}
          className="submit-reservation-button"
        >
          {submitting ? "Reserving..." : "Confirm Reservation"}
        </button>
      </form>
    </div>
  );
};

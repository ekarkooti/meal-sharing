"use client";
import React, { useState } from "react";
import { FaFilter } from "react-icons/fa";
import styles from "./FilterTool.css";

export const FilterButton = ({ currentFilters, onFilterApply }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control filter modal visibility

  // This function would be called by controls inside the modal (e.g., checkboxes)
  // For demonstration, it just toggles a 'isVegetarian' filter.
  const handleToggleVegetarian = () => {
    const newFilters = { ...currentFilters };
    if (newFilters.isVegetarian) {
      delete newFilters.isVegetarian; // Toggle off
    } else {
      newFilters.isVegetarian = true; // Toggle on
    }
    onFilterApply(newFilters); // Apply filters to parent state (app/meals/page.js)
    // No need to close modal immediately if you want user to apply multiple filters
    // setIsModalOpen(false); // Uncomment to close immediately after toggle
  };

  return (
    <>
      <button
        className={styles.filterButton}
        onClick={() => setIsModalOpen(true)}
      >
        <FaFilter /> Filter
        {Object.keys(currentFilters).length > 0 && (
          <span className={styles.activeFilterCount}>
            ({Object.keys(currentFilters).length})
          </span>
        )}
      </button>

      {/* Simple Modal/Dropdown Placeholder */}
      {isModalOpen && (
        <div
          className={styles.filterModalOverlay}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className={styles.filterModal}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Filter Options</h3>
            {/* Example: A checkbox for vegetarian filter */}
            <label className={styles.filterOption}>
              <input
                type="checkbox"
                checked={!!currentFilters.isVegetarian}
                onChange={handleToggleVegetarian} // Toggles the filter state
              />
              Vegetarian Meals
            </label>
            {/* Add more filter options here (e.g., categories, price ranges) */}

            <div className={styles.modalActions}>
              <button onClick={() => setIsModalOpen(false)}>Close</button>
              {/* In a more complex filter, an "Apply" button might be here,
                                which would collect all selected options and then call onFilterApply. */}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

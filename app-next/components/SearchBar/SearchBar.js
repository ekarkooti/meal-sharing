// components/SearchBar/SearchBar.js
"use client";
import React, { useState, useEffect } from "react";
import { FaSearch, FaMicrophone } from "react-icons/fa"; // Make sure react-icons is installed
import styles from "./SearchBar.css"; // Create this CSS Module

export const SearchBar = ({ currentQuery, onSearchChange }) => {
  // Internal state for the input field, to allow typing without immediate updates to parent
  const [inputValue, setInputValue] = useState(currentQuery);

  // Update internal input value if currentQuery prop changes from parent (e.g., URL sync)
  useEffect(() => {
    setInputValue(currentQuery);
  }, [currentQuery]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    // Call the debounced handler passed from the parent (app/meals/page.js)
    onSearchChange(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload on form submission
    // If user presses enter, ensure the search is triggered.
    // The debounced onSearchChange will handle the actual state update.
    onSearchChange(inputValue);
  };

  return (
    <form className={styles.searchContainer} onSubmit={handleSubmit}>
      <FaSearch className={styles.searchIcon} />
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search meals..."
        value={inputValue}
        onChange={handleChange}
      />
      <FaMicrophone className={styles.micIcon} />
    </form>
  );
};

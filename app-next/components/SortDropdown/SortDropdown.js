"use client";
import React, { useState, useRef, useEffect } from "react";
import styles from "./SortDropdown.css";
import { FaSort } from "react-icons/fa";

export const SortDropdown = ({ currentSortOrder, onSortChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const sortOptions = [
    { value: "created_at_desc", label: "Newest First" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "name_asc", label: "Name: A-Z" },
    { value: "name_desc", label: "Name: Z-A" },
  ];

  const handleSelect = (value) => {
    onSortChange(value);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOptionLabel =
    sortOptions.find((option) => option.value === currentSortOrder)?.label ||
    "Sort By";

  return (
    <div className={styles.sortDropdownContainer} ref={dropdownRef}>
      <button className={styles.sortButton} onClick={toggleDropdown}>
        <FaSort className={styles.sortIcon} />
        <span>{selectedOptionLabel}</span>
      </button>
      {isOpen && (
        <ul className={styles.dropdownMenu}>
          {sortOptions.map((option) => (
            <li
              key={option.value}
              className={`${styles.dropdownItem} ${
                currentSortOrder === option.value ? styles.active : ""
              }`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

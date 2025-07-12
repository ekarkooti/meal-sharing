// components/HomePage/HomePage.js
"use client";

import { useState, useEffect } from "react";
import Header from "../Header/Header";

export default function HomePage() {
  const [meals, setMeals] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");

  useEffect(() => {
    const fetchMeals = async () => {
      const query = searchTitle
        ? `?title=${encodeURIComponent(searchTitle)}`
        : "";
      const res = await fetch(`/api/meals${query}`);
      const data = await res.json();
      setMeals(data);
    };

    fetchMeals();
  }, [searchTitle]);

  return (
    <>
      <Header onSearch={setSearchTitle} />
      <ul>
        {meals.map((meal) => (
          <li key={meal.id}>{meal.title}</li>
        ))}
      </ul>
    </>
  );
}

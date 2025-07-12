"use client";
import { useMealsQuery } from "@/Context/MealsQueryContext/MealsQueryContext";

export default function SearchBox() {
  const { setSearchTerm } = useMealsQuery();

  return (
    <input
      type="text"
      placeholder="Search by title..."
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  );
}

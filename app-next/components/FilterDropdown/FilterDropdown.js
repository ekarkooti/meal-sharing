"use client";
import { useMealsQuery } from "@/Context/MealsQueryContext/MealsQueryContext";

export default function FilterDropdown() {
  const { setFilter } = useMealsQuery();

  return (
    <select onChange={(e) => setFilter(e.target.value)}>
      <option value="">Filter…</option>
      <option value="true">Only bookable</option>
      <option value="false">Fully booked</option>
    </select>
  );
}

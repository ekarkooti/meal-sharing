"use client";
import { useMealsQuery } from "@/Context/MealsQueryContext/MealsQueryContext";

export default function SortDropdown() {
  const { setSort } = useMealsQuery();

  return (
    <select onChange={(e) => setSort(e.target.value)}>
      <option value="">Sort…</option>
      <option value="when_date-asc">Date Asc</option>
      <option value="when_date-desc">Date Des</option>
      <option value="price-asc">Price Asc</option>
      <option value="price-desc">Price Des</option>
    </select>
  );
}

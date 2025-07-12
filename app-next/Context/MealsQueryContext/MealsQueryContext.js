"use client";
import { createContext, useContext, useState } from "react";

const MealsQueryContext = createContext();

export const MealsQueryProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState("");

  return (
    <MealsQueryContext.Provider
      value={{ searchTerm, setSearchTerm, filter, setFilter, sort, setSort }}
    >
      {children}
    </MealsQueryContext.Provider>
  );
};

export const useMealsQuery = () => useContext(MealsQueryContext);

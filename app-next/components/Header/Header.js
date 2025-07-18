"use client";
import Link from "next/link";
import SearchBox from "@/components/SearchBox/SearchBox";
import FilterDropdown from "@/components/FilterDropdown/FilterDropdown";
import SortDropdown from "@/components/SortDropdown/SortDropdown";
import "./Header.css";
import Image from "next/image";
import { useMealsQuery } from "@/Context/MealsQueryContext/MealsQueryContext";

console.log("SearchBox:", SearchBox);
console.log("FilterDropdown:", FilterDropdown);
console.log("SortDropdown:", SortDropdown);
const Header = () => {
  const { setSearchTerm } = useMealsQuery();

  return (
    <header className="app-header">
      <div className="app-left-section">
        <Link href="/">
          <Image
            src="/assets/logo4.png"
            alt="MealShare Logo"
            width={150}
            height={150}
            className="app-logo"
            priority
          />
        </Link>
        <SearchBox onSearch={setSearchTerm} />

        <FilterDropdown />
        <SortDropdown />
      </div>

      <nav className="app-nav">
        <ul>
          <li>
            <Link href="/" className="app-nav-link">
              Home
            </Link>
          </li>
          <li>
            <Link href="/meals" className="app-nav-link">
              Meals
            </Link>
          </li>
          {/* <li>
            <Link href="/reservations" className="app-nav-link">
              Reservations
            </Link>
          </li>
          <li>
            <Link href="/favorites" className="app-nav-link app-fav-icon">
              <span role="img" aria-label="Favorites">
                ❤️
              </span>
            </Link>
          </li> */}
        </ul>
      </nav>
    </header>
  );
};

export default Header;

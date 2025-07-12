// /components/Header/Header.js
import Link from "next/link";
import "./Header.css";
import Image from "next/image";

const Header = () => {
  return (
    <header className="app-header">
      <div className="app-left-section">
        {" "}
        {/* This div will now hold the logo and potentially search/filter */}
        <Link href="/">
          <Image
            src="/assets/logo4.png"
            alt="MealShare Logo"
            width={150}
            height={150}
            className="app-logo"
          />
        </Link>
        {/* Search Box Placeholder */}
        <div className="app-search-box">
          <input type="text" placeholder="Search meals..." />
          {/* You might add a search icon here later */}
        </div>
        {/* Filter Placeholder */}
        <div className="app-filter-dropdown">
          <select>
            <option value="">Filter by...</option>
            <option value="cuisine">Cuisine</option>
            <option value="dietary">Dietary</option>
          </select>
        </div>
        {/* Sort Placeholder */}
        <div className="app-sort-dropdown">
          <select>
            <option value="">Sort by...</option>
            <option value="date">Date Added</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>
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
          <li>
            <Link href="/reservations" className="app-nav-link">
              Reservations
            </Link>
          </li>
          {/* Like Heart Placeholder - ideally a small SVG icon */}
          <li>
            <Link href="/favorites" className="app-nav-link app-fav-icon">
              <span role="img" aria-label="Favorites">
                ❤️
              </span>{" "}
              {/* Using an emoji as a simple placeholder */}
              {/* Or use an actual icon library icon here: <i className="fa-solid fa-heart"></i> */}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

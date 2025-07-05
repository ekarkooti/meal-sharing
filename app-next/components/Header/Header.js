import Link from "next/link";
import "./Header.css";

const Header = () => {
  return (
    <header className="app-header">
      <div className="app-left-section"></div>

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
        </ul>
      </nav>
    </header>
  );
};

export default Header;

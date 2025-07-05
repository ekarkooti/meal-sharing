import Link from "next/link";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content-wrapper">
        <div className="footer-section footer-contact">
          <h3>Contact Us</h3>
          <p>Email: info@mealshare.com</p>
          <p>Phone: +45 12 34 56 78</p>
          <p>Address: 123 Green Street, Lyngby, Denmark</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} MealShare App. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

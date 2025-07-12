// /app/layout.js
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import { MealsQueryProvider } from "@/Context/MealsQueryContext/MealsQueryContext";

export const metadata = {
  title: "HackYourFuture",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <MealsQueryProvider>
          <Header />
          <div className="full-page-backdrop-blur"></div>
          <main>{children}</main>
          <Footer />
        </MealsQueryProvider>
      </body>
    </html>
  );
}

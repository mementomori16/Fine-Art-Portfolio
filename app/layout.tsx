import "../src/i18n"; // <--- Add this at the very top line

import NavMobile from "../src/components/NavMobile/NavMobile";
import Footer from "../src/components/Footer/Footer";
import BackToTop from "../src/components/BacktoTop/BacktoTop";
import CookieBanner from "../src/components/CookieBanner/CookieBanner";
import LayoutClientManager from "../src/components/LayoutClientWrapper/LayoutClientWrapper";

// Custom SCSS
import "./global.scss";
import "./mainLayout.scss";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="app-container">
        <NavMobile />

        <main className="main-content">
          <LayoutClientManager>
            {children}
          </LayoutClientManager>
        </main>

        <BackToTop />
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
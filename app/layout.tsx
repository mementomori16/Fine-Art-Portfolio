import NavMobile from "../src/components/NavMobile/NavMobile";
import Footer from "../src/components/Footer/Footer";
import BackToTop from "../src/components/BacktoTop/BacktoTop";
import CookieBanner from "../src/components/CookieBanner/CookieBanner";
import LayoutClientManager from "../src/components/LayoutClientWrapper/LayoutClientWrapper";
import I18nProvider from "../src/I18nProvider"; // Import the provider

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
        {/* Wrap everything inside the Client-Side Translation Safeguard */}
        <I18nProvider>
          <NavMobile />

          <main className="main-content">
            <LayoutClientManager>
              {children}
            </LayoutClientManager>
          </main>

          <BackToTop />
          <Footer />
          <CookieBanner />
        </I18nProvider>
      </body>
    </html>
  );
}
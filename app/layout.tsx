"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import NavMobile from "../src/components/NavMobile/NavMobile";
import Footer from "../src/components/Footer/Footer";
import BackToTop from "../src/components/BacktoTop/BacktoTop";
import CookieBanner from "../src/components/CookieBanner/CookieBanner";
import MysteriousCurtain from "../src/components/MysteriousCurtain/MysteriousCurtain";

// Custom SCSS
import "./global.scss";
import "./mainLayout.scss";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <html lang="en">
      <body className="app-container">
        <NavMobile />

        <main className="main-content">
          {/* We only show the curtain on the homepage root */}
          {isHome ? (
            <MysteriousCurtain>
              {children}
            </MysteriousCurtain>
          ) : (
            children
          )}
        </main>

        <BackToTop />
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
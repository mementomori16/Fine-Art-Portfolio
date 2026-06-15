"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Hamburger from "hamburger-react";
import { useTranslation } from "react-i18next";
import "./navMobile.scss";

const NavMobile = () => {
  const [isOpen, setOpen] = useState(false);
  
  // Passing 'translation' ensures it targets your primary translation catalog file cleanly
  const { t } = useTranslation("translation");

  return (
    <header className="header-mobile">
      <nav className="navbarmobile">
        <Link href="/" className="mobile-logo" onClick={() => setOpen(false)}>
          <Image 
            src="/Group 49.1.svg" 
            alt="Logo" 
            width={120} 
            height={40} 
            className="mobile-logo-img"
            priority
          />
        </Link>

        <div className="mobile-right">
          <div className="mobile-hamburger">
            {/* Toggled element uses explicit styling boundaries */}
            <Hamburger toggled={isOpen} toggle={setOpen} size={25} color="#ffffff" />
          </div>
        </div>
      </nav>

      {/* Navigation menu panel layout */}
      <div className={`mobile-menu ${isOpen ? "active" : ""}`}>
        <ul className="mobile-list">
          <li className="mobile-item">
            <Link href="/" className="mobile-link" onClick={() => setOpen(false)}>
              {t("nav.home", "Home")}
            </Link>
          </li>
          
          {/* CATEGORIES COLLECTION */}
          <li className="mobile-item">
            <Link href="/categories/oil-paintings" className="mobile-link" onClick={() => setOpen(false)}>
              {t("categories.oil_paintings", "Oil")}
            </Link>
          </li>

          <li className="mobile-item">
            <Link href="/categories/drawings" className="mobile-link" onClick={() => setOpen(false)}>
              {t("categories.drawings", "Drawings")}
            </Link>
          </li>

          <li className="mobile-item">
            <Link href="/categories/watercolors" className="mobile-link" onClick={() => setOpen(false)}>
              {t("categories.watercolors", "Watercolors")}
            </Link>
          </li>

          <li className="mobile-item">
            <Link href="/categories/other-works" className="mobile-link" onClick={() => setOpen(false)}>
              {t("categories.other_works", "Other Works")}
            </Link>
          </li>

          {/* EDITORIAL LINK */}
          <li className="mobile-item">
            <Link href="/about" className="mobile-link" onClick={() => setOpen(false)}>
              {t("about.title", "About")}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default NavMobile;
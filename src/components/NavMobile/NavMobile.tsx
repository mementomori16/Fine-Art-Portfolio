"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Hamburger from "hamburger-react";
import { useTranslation } from "react-i18next";
import "./navMobile.scss";

interface NavItem {
  href: string;
  translationKey: string;
  defaultText: string;
  isExternal?: boolean; // Added flag to scale cleanly for future external domains
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", translationKey: "nav.home", defaultText: "Home" },
  { href: "/categories/oil-paintings", translationKey: "categories.oil_paintings", defaultText: "Oil" },
  { href: "/categories/drawings", translationKey: "categories.drawings", defaultText: "Drawings" },
  { href: "/categories/watercolors", translationKey: "categories.watercolors", defaultText: "Watercolors" },
  { href: "/categories/other-works", translationKey: "categories.other_works", defaultText: "Other Works" },
  { href: "/about", translationKey: "about.title", defaultText: "About" },
  { 
    href: "https://profineart.ch", 
    translationKey: "nav.fine_art_school", 
    defaultText: "Fine Art School",
    isExternal: true 
  },
];

const NavMobile = () => {
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation("translation");

  const handleClose = () => setOpen(false);

  return (
    <header className="header-mobile">
      <nav className="navbarmobile" aria-label="Mobile Navigation">
        <Link href="/" className="mobile-logo" onClick={handleClose}>
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
          <div className="mobile-hamburger" aria-expanded={isOpen} aria-label="Toggle menu">
            <Hamburger toggled={isOpen} toggle={setOpen} size={25} color="#ffffff" />
          </div>
        </div>
      </nav>

      {/* Navigation menu panel layout */}
      <div 
        className={`mobile-menu ${isOpen ? "active" : ""}`} 
        role="dialog" 
        aria-hidden={!isOpen}
      >
        <ul className="mobile-list">
          {NAV_ITEMS.map(({ href, translationKey, defaultText }) => {
            const isActive = pathname === href;
            
            return (
              <li key={href} className="mobile-item">
                <Link 
                  href={href} 
                  className={`mobile-link ${isActive ? "active" : ""}`} 
                  onClick={handleClose}
                >
                  {t(translationKey, defaultText)}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
};

export default NavMobile;
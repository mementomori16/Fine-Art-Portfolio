"use client";

import React, { useState, useRef, useEffect } from "react";
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
  isExternal?: boolean; 
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
    defaultText: "ProFineArt School",
    isExternal: true 
  },
];

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
  { code: "fr", label: "FR" },
  { code: "ru", label: "RU" }
];

const NavMobile = () => {
  const [isOpen, setOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const pathname = usePathname();
  const { t, i18n } = useTranslation("translation");
  const langRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setOpen(false);
    setIsLangOpen(false);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentLangLabel = LANGUAGES.find(l => l.code === i18n.language)?.label || "EN";

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
          <div className="mobile-lang-dropdown" ref={langRef}>
            <button 
              className={`lang-trigger ${isLangOpen ? "open" : ""}`}
              onClick={() => setIsLangOpen(!isLangOpen)}
              aria-label="Change Language"
            >
              {currentLangLabel}
              <span className="lang-chevron" />
            </button>
            
            {isLangOpen && (
              <ul className="lang-menu">
                {LANGUAGES.map((lang) => (
                  <li key={lang.code}>
                    <button
                      className={`lang-option ${i18n.language === lang.code ? "selected" : ""}`}
                      onClick={() => changeLanguage(lang.code)}
                    >
                      {lang.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mobile-hamburger" aria-expanded={isOpen} aria-label="Toggle menu">
            <Hamburger toggled={isOpen} toggle={setOpen} size={25} color="#ffffff" />
          </div>
        </div>
      </nav>

      <div 
        className={`mobile-menu ${isOpen ? "active" : ""}`} 
        role="dialog" 
        aria-hidden={!isOpen}
      >
        <ul className="mobile-list">
          {NAV_ITEMS.map(({ href, translationKey, defaultText, isExternal }) => {
            const isActive = pathname === href;
            const labelText = t(translationKey, defaultText);
            
            return (
              <li key={href} className="mobile-item">
                {isExternal ? (
                  <a 
                    href={href} 
                    className="mobile-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleClose}
                  >
                    {labelText}
                  </a>
                ) : (
                  <Link 
                    href={href} 
                    className={`mobile-link ${isActive ? "active" : ""}`} 
                    onClick={handleClose}
                  >
                    {labelText}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
};

export default NavMobile;
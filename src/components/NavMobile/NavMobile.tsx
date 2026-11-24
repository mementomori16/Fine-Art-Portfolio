'use client';

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Hamburger from "hamburger-react";
import { useTranslation } from "react-i18next";
import "./navMobile.scss";

interface NavSubItem {
  href: string;
  translationKey: string;
}

interface NavSubGroup {
  titleKey: string;
  href?: string;
  items: NavSubItem[];
}

interface NavItem {
  href?: string;
  translationKey: string;
  isExternal?: boolean;
  subGroups?: NavSubGroup[];
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", translationKey: "nav.home" },
  {
    translationKey: "nav.paintings",
    subGroups: [
      {
        titleKey: "nav.sub.technique",
        href: "/#technique",
        items: [
          { href: "/categories/oil-paintings", translationKey: "categories.oil_paintings" },
          { href: "/categories/drawings", translationKey: "categories.drawings" },
          { href: "/categories/watercolors", translationKey: "categories.watercolors" },
          { href: "/categories/tempera", translationKey: "categories.tempera" },
        ],
      },
      {
        titleKey: "nav.sub.genre",
        href: "/#genre",
        items: [
          { href: "/stylecategories/portrait", translationKey: "styleCategories.portrait" },
          { href: "/stylecategories/nude", translationKey: "styleCategories.nude" },
          { href: "/stylecategories/landscape-still-life", translationKey: "styleCategories.landscapeStillLife" },
          { href: "/stylecategories/memento-mori", translationKey: "styleCategories.mementoMori" },
          { href: "/stylecategories/psychological-realism", translationKey: "styleCategories.psychologicalRealism" },
          { href: "/stylecategories/heritage-antiques", translationKey: "styleCategories.heritageAntiques" },
        ],
      },
    ],
  },
  { href: "/video", translationKey: "nav.video" },
  { href: "/about", translationKey: "about.title" },
  {
    href: "https://profineart.ch",
    translationKey: "nav.fine_art_school",
    isExternal: true,
  },
];

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
  { code: "fr", label: "FR" },
];

const NavMobile = () => {
  const [isOpen, setOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isPaintingsOpen, setIsPaintingsOpen] = useState(false);

  const pathname = usePathname();
  const { t, i18n } = useTranslation("translation");
  const langRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    setOpen(false);
    setIsLangOpen(false);
    setIsPaintingsOpen(false);
  };

  // Ссылка на секцию Home: закрываем меню и просим штору открыться и проскроллить
  const goToSection = (href: string) => {
    handleClose();
    const id = href.split("#")[1];
    if (id) {
      window.dispatchEvent(new CustomEvent("curtain:skip", { detail: id }));
    }
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

  const currentLangLabel =
    LANGUAGES.find((l) => l.code === i18n.language)?.label || "EN";

  return (
    <header className="header-mobile">
      <nav className="navbarmobile" aria-label="Mobile Navigation">
        <Link href="/" className="mobile-logo" onClick={handleClose}>
          <img src="/Group 49.1.svg" alt="Logo" className="mobile-logo-img" />
        </Link>

        <div className="mobile-right">
          <div className="mobile-lang-dropdown" ref={langRef}>
            <button
              className={`lang-trigger ${isLangOpen ? "open" : ""}`}
              onClick={() => setIsLangOpen(!isLangOpen)}
              aria-label="Change Language"
              aria-expanded={isLangOpen}
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
          {NAV_ITEMS.map((item) => {
            const labelText = t(item.translationKey);

            if (item.subGroups) {
              return (
                <li key={item.translationKey} className="mobile-item has-submenu">
                  <button
                    className={`mobile-link submenu-toggle ${isPaintingsOpen ? "open" : ""}`}
                    onClick={() => setIsPaintingsOpen(!isPaintingsOpen)}
                    aria-expanded={isPaintingsOpen}
                  >
                    <span>{labelText}</span>
                    <span className="chevron-arrow" aria-hidden="true" />
                  </button>

                  <div className={`submenu-wrapper ${isPaintingsOpen ? "expanded" : ""}`}>
                    {item.subGroups.map((group) => (
                      <div key={group.titleKey} className="submenu-group">
                        {group.href ? (
                          <Link
                            href={group.href}
                            className="submenu-heading submenu-heading-link"
                            onClick={() => goToSection(group.href!)}
                          >
                            {t(group.titleKey)}
                          </Link>
                        ) : (
                          <span className="submenu-heading">{t(group.titleKey)}</span>
                        )}

                        <ul className="submenu-list">
                          {group.items.map((subItem) => {
                            const isSubActive = pathname === subItem.href;
                            return (
                              <li key={subItem.href}>
                                <Link
                                  href={subItem.href}
                                  className={`mobile-link sub-link ${isSubActive ? "active" : ""}`}
                                  onClick={handleClose}
                                >
                                  {t(subItem.translationKey)}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </li>
              );
            }

            const isActive = pathname === item.href;

            return (
              <li key={item.href} className="mobile-item">
                {item.isExternal ? (
                  <a
                    href={item.href}
                    className="mobile-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleClose}
                  >
                    {labelText}
                  </a>
                ) : (
                  <Link
                    href={item.href!}
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
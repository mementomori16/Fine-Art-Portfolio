"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Hamburger from "hamburger-react";
// Import your scss
import "./navMobile.scss";

const NavMobile = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <header className="header-mobile">
      <nav className="navbarmobile">
        <Link href="/" className="mobile-logo">
          {/* Using Next.js Image component for the logo */}
          <Image 
            src="/Group 49.1.svg" 
            alt="Logo" 
            width={120} // Matches your SCSS 9.5rem roughly
            height={40}  // Matches your SCSS 3rem roughly
            className="mobile-logo-img"
            priority
          />
        </Link>

        <div className="mobile-right">
          {/* Basket icon or other elements would go here */}
          <div className="mobile-hamburger">
            <Hamburger toggled={isOpen} toggle={setOpen} size={25} />
          </div>
        </div>
      </nav>

      {/* Slide-out menu */}
      <div className={`mobile-menu ${isOpen ? "active" : ""}`}>
        <ul className="mobile-list">
          <li className="mobile-item">
            <Link href="/" className="mobile-link" onClick={() => setOpen(false)}>
              Home
            </Link>
          </li>
          {/* Add more links as needed */}
        </ul>
      </div>
    </header>
  );
};

export default NavMobile;
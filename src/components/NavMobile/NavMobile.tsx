"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Hamburger from "hamburger-react";
import "./navMobile.scss";

const NavMobile = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <header className="header-mobile">
      <nav className="navbarmobile">
        <Link href="/" className="mobile-logo">
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
            <Hamburger toggled={isOpen} toggle={setOpen} size={25} />
          </div>
        </div>
      </nav>

      {/* Moved inside the header element to lock positioning with the sticky navbar */}
      <div className={`mobile-menu ${isOpen ? "active" : ""}`}>
        <ul className="mobile-list">
          <li className="mobile-item">
            <Link href="/" className="mobile-link" onClick={() => setOpen(false)}>
              Home
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default NavMobile;
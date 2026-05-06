"use client";

import { useEffect, useState } from "react";
import "./cookieBanner.scss";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // In Next.js, we check if window exists before accessing localStorage
    const consent = typeof window !== "undefined" ? localStorage.getItem("cookie-consent") : null;
    
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-container">
        <p className="cookie-text">
          We use cookies to improve your experience on our site.
        </p>
        <div className="cookie-buttons">
          <button className="btn-cta-primary btn-sm" onClick={handleAccept}>
            Accept
          </button>
          <button className="btn-cta-secondary btn-sm" onClick={handleDecline}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
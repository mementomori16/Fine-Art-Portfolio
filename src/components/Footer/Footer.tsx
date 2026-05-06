"use client";

import React, { useState, useEffect } from 'react';
// If you haven't set up i18next yet, you can mock 't' or keep the hook if installed
import { useTranslation } from 'react-i18next'; 
import Link from 'next/link';
import { FaEnvelope, FaLock, FaDownload } from 'react-icons/fa'; 
import './footer.scss'; 

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setInstallPrompt(null);
  };

  // Safe check for translation objects
  const paymentMethods = t('footer.paymentMethods', { returnObjects: true }) || [];

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <h4 className="footer-header">{t('home.welcomeHero.companyName')}</h4>
          <p className="footer-description">{t('home.welcomeHero.serviceTitle')}</p>
        </div>

        <div className="footer-column">
          <h4 className="footer-header">{t('footer.explore')}</h4>
          <ul className="footer-links">
            <li><Link href="/courses" className="footer-nav-link">{t('home.courses')}</Link></li>
            <li><Link href="/how-it-works" className="footer-nav-link">{t('home.howItWorks')}</Link></li>
            <li><Link href="/students-works" className="footer-nav-link">{t('home.studentsWorks')}</Link></li>
            {installPrompt && (
              <li>
                <button onClick={handleInstallClick} className="footer-pwa-button">
                  <FaDownload className="pwa-icon" /> {t('footer.installApp')}
                </button>
              </li>
            )}
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="footer-header">{t('home.contact')}</h4>
          <div className="footer-contact-item">
            <FaEnvelope className="footer-icon" />
            <a href="mailto:info@profineart.ch" className="footer-nav-link">info@profineart.ch</a>
          </div>
          <Link href="/about" className="footer-nav-link about-link">{t('home.about')}</Link>
        </div>

        <div className="footer-column">
          <h4 className="footer-header">{t('footer.payments')}</h4>
          <div className="footer-stripe-info">
            <FaLock className="footer-icon-lock" />
            <span>{t('footer.processedBy')} <strong>Stripe</strong></span>
          </div>
          <div className="footer-payment-icons">
  {/* 2. Check if it's an array and ensure the parameter is typed as 'any' or 'string' */}
  {Array.isArray(paymentMethods) && paymentMethods.map((method: any) => (
    <span key={typeof method === 'string' ? method : Math.random()} className="payment-badge">
      {String(method)}
    </span>
  ))}
</div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="footer-copyright">
            &copy; 2012-2026 {t('home.welcomeHero.companyName')}. {t('footer.rights')}
          </p>
          <div className="footer-legal-section">
            <div className="footer-legal-links">
              <Link href="/legalinfo" className="footer-bottom-link">{t('footer.legal')}</Link>
              <span className="footer-separator">|</span>
              <Link href="/terms-of-use" className="footer-bottom-link">{t('footer.terms')}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
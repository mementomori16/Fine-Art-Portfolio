"use client";

import React, { useState, useEffect } from 'react';
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

  const paymentMethods = t('footer.payments.methods', { returnObjects: true }) as string[] || [];

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <h4 className="footer-header">{t('footer.company.name')}</h4>
          <p className="footer-description">{t('footer.company.description')}</p>
        </div>

        <div className="footer-column">
  <h4 className="footer-header">{t('footer.explore.title')}</h4>
  <ul className="footer-links">
    <li><Link href="/" className="footer-nav-link">{t('footer.explore.home')}</Link></li>
    <li><Link href="/categories/oil-paintings" className="footer-nav-link">{t('footer.explore.oil')}</Link></li>
    <li><Link href="/categories/drawings" className="footer-nav-link">{t('footer.explore.drawings')}</Link></li>
    <li><Link href="/categories/watercolors" className="footer-nav-link">{t('footer.explore.watercolors')}</Link></li>
    <li><Link href="/categories/other-works" className="footer-nav-link">{t('footer.explore.other')}</Link></li>
    <li><a href="https://profineart.ch" className="footer-nav-link" target="_blank" rel="noopener noreferrer">{t('footer.explore.studio')}</a></li>
  </ul>
</div>

        <div className="footer-column">
          <h4 className="footer-header">Contact</h4>
          <div className="footer-contact-item">
            <FaEnvelope className="footer-icon" />
            <a href={`mailto:${t('footer.connect.email')}`} className="footer-nav-link">{t('footer.connect.email')}</a>
          </div>
          <Link href="/about" className="footer-nav-link">About</Link>
        </div>

        <div className="footer-column">
          <h4 className="footer-header">Payments</h4>
          <div className="footer-stripe-info">
            <FaLock className="footer-icon-lock" />
            <span>Securely processed by <strong>Stripe</strong></span>
          </div>
          <div className="footer-payment-icons">
            {Array.isArray(paymentMethods) && paymentMethods.map((method, index) => (
              <span key={index} className="payment-badge">{method}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="footer-copyright">© 2012-2026 Ilya Medvedev. All rights reserved.</p>
          <div className="footer-legal-links">
            <Link href="/legal" className="footer-bottom-link">Legal Info</Link>
            <span className="footer-separator">|</span>
            <Link href="/terms" className="footer-bottom-link">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
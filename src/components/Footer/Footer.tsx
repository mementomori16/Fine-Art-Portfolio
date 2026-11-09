'use client';

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

  const paymentMethods = (t('footer.payments.methods', { returnObjects: true }) as string[]) || [];

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Brand / Main Navigation */}
        <div className="footer-column brand-col">
          <h4 className="footer-header">{t('footer.company.name')}</h4>
          <ul className="footer-links compact-nav">
            <li><Link href="/" className="footer-nav-link">{t('footer.explore.home')}</Link></li>
            <li><Link href="/about" className="footer-nav-link">{t('footer.explore.about')}</Link></li>
            <li>
              <a href="https://profineart.ch" className="footer-nav-link" target="_blank" rel="noopener noreferrer">
                {t('footer.explore.studio')}
              </a>
            </li>
          </ul>
        </div>

        {/* Categories by Technique */}
        <div className="footer-column">
          <h4 className="footer-header">{t('categories.subtitle')}</h4>
          <ul className="footer-links">
            <li><Link href="/categories/oil-paintings" className="footer-nav-link">{t('categories.oil_paintings')}</Link></li>
            <li><Link href="/categories/drawings" className="footer-nav-link">{t('categories.drawings')}</Link></li>
            <li><Link href="/categories/watercolors" className="footer-nav-link">{t('categories.watercolors')}</Link></li>
            <li><Link href="/categories/tempera" className="footer-nav-link">{t('categories.tempera')}</Link></li>
          </ul>
        </div>

        {/* Categories by Genre */}
        <div className="footer-column">
          <h4 className="footer-header">{t('styleCategories.subtitle')}</h4>
          <ul className="footer-links grid-links">
            <li><Link href="/stylecategories/portrait" className="footer-nav-link">{t('styleCategories.portrait')}</Link></li>
            <li><Link href="/stylecategories/nude" className="footer-nav-link">{t('styleCategories.nude')}</Link></li>
            <li><Link href="/stylecategories/landscape-still-life" className="footer-nav-link">{t('styleCategories.landscapeStillLife')}</Link></li>
            <li><Link href="/stylecategories/memento-mori" className="footer-nav-link">{t('styleCategories.mementoMori')}</Link></li>
            <li><Link href="/stylecategories/psychological-realism" className="footer-nav-link">{t('styleCategories.psychologicalRealism')}</Link></li>
            <li><Link href="/stylecategories/heritage-antiques" className="footer-nav-link">{t('styleCategories.heritageAntiques')}</Link></li>
          </ul>
        </div>

        {/* Contact & Payment */}
        <div className="footer-column">
          <h4 className="footer-header">{t('footer.connect.title')}</h4>
          <div className="footer-contact-item">
            <FaEnvelope className="footer-icon" />
            <a href={`mailto:${t('footer.connect.email')}`} className="footer-nav-link">
              {t('footer.connect.email')}
            </a>
          </div>

          <div className="footer-payment-wrapper">
            <h4 className="footer-header sub-header">{t('footer.payments.title')}</h4>
            <div className="footer-stripe-info">
              <FaLock className="footer-icon-lock" />
              <span>{t('footer.payments.processedBy')} <strong>Stripe</strong></span>
            </div>
            <div className="footer-payment-icons">
              {Array.isArray(paymentMethods) && paymentMethods.map((method, index) => (
                <span key={index} className="payment-badge">{method}</span>
              ))}
            </div>
          </div>

          {installPrompt && (
            <button className="footer-install-btn" onClick={handleInstallClick}>
              <FaDownload className="footer-icon-btn" /> {t('footer.actions.install')}
            </button>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="footer-copyright">{t('footer.bottom.copyright')} {t('footer.bottom.rights')}</p>
          <div className="footer-legal-links">
            <Link href="/legal" className="footer-bottom-link">{t('footer.bottom.legal')}</Link>
            <span className="footer-separator">|</span>
            <Link href="/terms" className="footer-bottom-link">{t('footer.bottom.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
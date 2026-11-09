'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import './videoPage.scss';

export default function VideoPage() {
  const { t } = useTranslation();

  return (
    <section className="video-page-section">
      <header className="video-page-header">
        <h2 className="video-page-title">
          {t('video.title', 'videos of painting process')}
        </h2>

        <div className="video-page-line-divider" />

        <p className="video-page-subtitle">
          {t('video.subtitle', 'Watch Video')}
        </p>
      </header>

      <div className="video-page-showcase-container">
        <div className="video-page-museum-card">
          <div className="video-page-frame-wrapper">
            {/* Ambient Lighting & Spotlight Effects */}
            <div className="video-page-ambient-glow" />
            <div className="video-page-spotlight-beam" />

            {/* Luxury Gold Frame holding the responsive 16:9 YouTube iFrame */}
            <div className="video-page-luxury-edge">
              <div className="video-page-canvas-container">
                <iframe
                  src="https://www.youtube.com/embed/vukD_4gG0Z0?rel=0&modestbranding=1"
                  title={t('video.title', 'videos of painting process')}
                  className="video-page-iframe"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Floor Shadow Drop */}
            <div className="video-page-floor-shadow" />
          </div>
        </div>
      </div>
    </section>
  );
}
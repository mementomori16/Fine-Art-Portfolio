'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import './videoPage.scss';

interface VideoPageProps {
  isStandalone?: boolean;
}

export default function VideoPage({ isStandalone = false }: VideoPageProps) {
  const { t } = useTranslation();

  return (
    <section className={`video-page-section ${isStandalone ? 'video-page-standalone' : ''}`}>
      <header className="video-page-header">
        <h2 className="video-page-title">
          {t('video.title', 'videos of painting process')}
        </h2>

        <div className="video-page-line-divider" />

        <p className="video-page-subtitle">
          {t('video.subtitle', 'Watch Video')}
        </p>
      </header>

      {/* Вертикальный контейнер с двумя видео */}
      <div className="video-page-list-container">
        
        {/* Видео 1: Процесс Лени */}
        <div className="video-page-showcase-container">
          <div className="video-page-museum-card">
            <div className="video-page-frame-wrapper">
              <div className="video-page-ambient-glow" />
              <div className="video-page-spotlight-beam" />

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

              <div className="video-page-floor-shadow" />
            </div>
          </div>
        </div>

        {/* Видео 2: Процесс Memento Mori */}
        <div className="video-page-showcase-container">
          <div className="video-page-museum-card">
            <div className="video-page-frame-wrapper">
              <div className="video-page-ambient-glow" />
              <div className="video-page-spotlight-beam" />

              <div className="video-page-luxury-edge">
                <div className="video-page-canvas-container">
                  <iframe
                    src="https://www.youtube.com/embed/axKn0zBr0F0?rel=0&modestbranding=1"
                    title={t('video.title', 'videos of painting process')}
                    className="video-page-iframe"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>

              <div className="video-page-floor-shadow" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
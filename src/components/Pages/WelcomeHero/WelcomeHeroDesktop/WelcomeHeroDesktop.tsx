'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './welcomeHeroDesktop.scss';

interface Slide {
  id: number;
  url: string;
  key: string;
  duration: number;
}

const DESKTOP_SLIDES: Slide[] = [
  { id: 1, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1781178189/IMGP3286PH26-2-500b-3_e1rlu3.jpg', key: 'welcomehero.royalGore', duration: 5500 },
  { id: 2, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779697676/DSC_0973ph2026-4-500kb_b42u5g.jpg', key: 'welcomehero.portraitStudy', duration: 5500 },
  { id: 3, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779782494/Vanitas_ph2026500KB2_gyxk8l.jpg', key: 'welcomehero.vanitas', duration: 5500 },
  { id: 4, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613680/IMG_4838ph2026-2-500kb_qsqudt.jpg', key: 'welcomehero.compositionIV', duration: 5500 },
  { id: 5, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1781212326/varnished-and-photoshoped-small-3_cu2jcg.jpg', key: 'welcomehero.varnishedStudy', duration: 5500 },
  { id: 6, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1781178170/Lena_scannedph26-500kb-2_plmlnc.jpg', key: 'welcomehero.lenaScanned', duration: 5500 },
  { id: 7, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613717/The_best_photo_Autopsia_of_a_commited_suicide_girl%D0%B7%D1%8026500kb_bup3cx.jpg', key: 'welcomehero.autopsia', duration: 5500 },
  { id: 8, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779703943/IMGP0914ph2026-500kb_eaxsbn.jpg', key: 'welcomehero.imgp0914', duration: 5500 },
];

export default function WelcomeHero() {
  const { t } = useTranslation();
  const [index, setIndex] = useState(1);
  const [transition, setTransition] = useState(true);

  const slides = [
    DESKTOP_SLIDES[DESKTOP_SLIDES.length - 1],
    ...DESKTOP_SLIDES,
    DESKTOP_SLIDES[0],
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIndex((prev) => prev + 1), 2000);
    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    if (index === slides.length - 1) {
      setTimeout(() => {
        setTransition(false);
        setIndex(1);
      }, 1100);
    }
    setTimeout(() => setTransition(true), 50);
  }, [index, slides.length]);

  const trackStyle = {
    transform: `translateX(calc(-${index * 42}vw - ${index * 2.5}rem))`,
    transition: transition ? 'transform 1.2s cubic-bezier(0.25,1,0.2,1)' : 'none',
  };

  return (
    <section className="heroSection">
      <div className="galleryViewport">
        <div className="galleryTrack" style={trackStyle}>
          {slides.map((slide, i) => {
            const isActive = i === index;
            return (
              <div
                key={`${slide.id}-${i}`}
                className={`artCard ${isActive ? 'active' : ''} ${i < index ? 'left' : ''} ${i > index ? 'right' : ''}`}
              >
                <div className="cardFrame">
                  {isActive && <div className="backGlow" />}
                  <div className="goldFrame">
                    <img src={slide.url} alt={t(`${slide.key}.title`)} className="fineArtImage" />
                  </div>
                  <div className="shadowBase" />
                </div>
                <div className="artworkMeta">
                  <h3>{t(`${slide.key}.title`)}</h3>
                  <p>{t(`${slide.key}.medium`)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
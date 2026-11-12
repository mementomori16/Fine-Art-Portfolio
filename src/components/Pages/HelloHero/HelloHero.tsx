'use client';

import React, { useEffect, useRef, useState } from 'react';
import './helloHero.scss';

const HERO_IMAGES = [
  'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779620844/ph2026kineret-2-500kb_qzscpo.jpg',
  'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613680/IMG_4838ph2026-2-500kb_qsqudt.jpg',
  'https://res.cloudinary.com/dpayqcrg5/image/upload/v1791641325/IMG_4285-2ph2026-2-500kb_i00dnd.jpg',
  'https://res.cloudinary.com/dpayqcrg5/image/upload/v1782937567/good_Alla_2026_photoshop-500kb_q5prhs.jpg',
  'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779781882/detail2021-ph2026_l7zv21.jpg',
];

interface HelloHeroProps {
  images?: string[];
  slideDuration?: number; // мс между сменами
  fadeDuration?: number; // мс самого перехода
  navbarHeight?: string;
}

export default function HelloHero({
  images = HERO_IMAGES,
  slideDuration = 3000,
  fadeDuration = 350,
  navbarHeight = '0px',
}: HelloHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const currentRef = useRef(0);

  // Предзагрузка и декодирование, чтобы следующая картинка была готова заранее
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.decode?.().catch(() => {});
    });
  }, [images]);

  useEffect(() => {
    if (images.length <= 1) return;

    let clearTimer: ReturnType<typeof setTimeout>;

    const interval = setInterval(() => {
      const from = currentRef.current;
      const next = (from + 1) % images.length;

      currentRef.current = next;
      setPrevIndex(from);
      setCurrentIndex(next);

      // Скрываем уходящий слой только когда новый уже полностью непрозрачен,
      // поэтому сброс его анимации никто не видит
      clearTimer = setTimeout(() => setPrevIndex(null), fadeDuration + 50);
    }, slideDuration);

    return () => {
      clearInterval(interval);
      clearTimeout(clearTimer);
    };
  }, [images.length, slideDuration, fadeDuration]);

  // Движение длится ровно до момента, когда слой скрывается: без паузы и замедления в конце
  const scanDuration = `${(slideDuration + fadeDuration + 50) / 1000}s`;

  return (
    <section
      className="helloHeroSection"
      style={
        {
          '--nav-height': navbarHeight,
          '--fade-duration': `${fadeDuration}ms`,
          '--scan-duration': scanDuration,
        } as React.CSSProperties
      }
    >
      {images.map((url, idx) => {
        const state =
          idx === currentIndex ? 'active' : idx === prevIndex ? 'leaving' : '';
        return (
          <div
            key={url}
            className={`verticalScanLayer ${state}`}
            style={{ '--hero-img': `url("${url}")` } as React.CSSProperties}
          />
        );
      })}

      <div className="heroOverlay">
        <h1 className="heroTitle">
          <img
            className="heroLogo"
            src="/ILYA MEDVEDEV.svg"
            alt="Илья Медведев"
            draggable={false}
          />
        </h1>
        <p className="heroSubtitle">Contemporary Artist</p>
      </div>
    </section>
  );
}
'use client';

import React, { useEffect, useState } from 'react';
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
  slideDuration?: number;
  navbarHeight?: string;
}

export default function HelloHero({
  images = HERO_IMAGES,
  slideDuration = 5000,
  navbarHeight = '0px',
}: HelloHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, slideDuration);

    return () => clearInterval(interval);
  }, [images.length, slideDuration]);

  return (
    <section
      className="helloHeroSection"
      style={{ '--nav-height': navbarHeight } as React.CSSProperties}
    >
      {images.map((url, idx) => (
        <div
          key={url}
          className={`verticalScanLayer ${idx === currentIndex ? 'active' : ''}`}
          style={{ '--hero-img': `url("${url}")` } as React.CSSProperties}
        />
      ))}
    </section>
  );
}
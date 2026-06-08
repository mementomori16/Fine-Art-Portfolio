'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import './welcomeHero.scss';

const DESKTOP_SLIDES = [
  { id: 1, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779787009/DSC_0973ph2026CLOSEUP2_tutyef.jpg', duration: 3100 },
  { id: 2, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779785075/IMGP3286PH26-3-500b_hfmhx2.jpg', duration: 2000 },
  { id: 3, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779782494/Vanitas_ph2026500KB2_gyxk8l.jpg', duration: 2000 },
  { id: 4, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613680/IMG_4838ph2026-2-500kb_qsqudt.jpg', duration: 3100 },
  { id: 5, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779779810/varnished-and-photoshoped-small-2-16-9_l7ip9v.jpg', duration: 3100 },
];

const MOBILE_SLIDES = [
  { id: 13, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613717/IMGP3286PH26-2-500b_nidce0.jpg', duration: 3100 },
  { id: 14, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779781882/detail2021-ph2026_l7zv21.jpg', duration: 3000 },
  { id: 15, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613717/The_best_photo_Autopsia_of_a_commited_suicide_girl%D0%B7%D1%8026500kb_bup3cx.jpg', duration: 3000 },
  { id: 16, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779779810/varnished-and-photoshoped-small-2-16-9_l7ip9v.jpg', duration: 3000 },
];

const AUDIO_SRC =
  'https://res.cloudinary.com/dpayqcrg5/video/upload/v1780349012/Audio_%D0%92%D0%B0%D0%B4%D0%B8%D0%BC_%D0%A5%D1%80%D0%B0%D0%BF%D0%B0%D1%87%D0%BE%D0%B2_%D0%A4%D1%96%D0%BD%D0%B0%D0%BB_1982_o2x8vg.webm';

export default function WelcomeHero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const slides = isMobile ? MOBILE_SLIDES : DESKTOP_SLIDES;

  useEffect(() => {
    if (!slides.length) return;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, slides[currentIndex].duration);

    return () => clearTimeout(timer);
  }, [currentIndex, slides]);

  const toggleSound = () => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.play().then(() => {
        audioRef.current!.muted = false;
        setIsMuted(false);
      });
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  return (
    <section className="heroSection">
      <audio ref={audioRef} src={AUDIO_SRC} loop muted />

      {slides.map((slide, index) => {
        const isActive = index === currentIndex;

        return (
          <div
            key={slide.id}
            className={`slideContainer ${isActive ? 'active' : ''}`}
          >
            <div className="imageContainer">
              <Image
                src={slide.url}
                alt=""
                fill
                priority={index === 0}
                style={{ objectFit: 'cover' }}
              />
            </div>

            <div className="lightOverlay" />
          </div>
        );
      })}

      <button onClick={toggleSound} className="audioButton">
  {isMuted ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M11 5L6 9H2V15H6L11 19V5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <line
        x1="18"
        y1="6"
        x2="6"
        y2="18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
  <path
    d="M11 5L6 9H2V15H6L11 19V5Z"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinejoin="round"
  />

  {/* ✅ optically centered slash */}
  <line
    x1="18.5"
    y1="6.5"
    x2="5.5"
    y2="19.5"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
  />
</svg>
  )}
</button>
    </section>
  );
}
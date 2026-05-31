'use client';

import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import './welcomeHero.scss';

const DESKTOP_SLIDES = [
  { id: 1, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613764/IMG_4691-ph2026-500kb_ep3ujr.jpg', duration: 3100 },
  { id: 2, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613732/IMG_8469ph2026-500kb_fipv2h.jpg', duration: 2000 },
  { id: 3, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779781882/detail2021-ph2026_l7zv21.jpg', duration: 2000 },
  { id: 4, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613680/IMG_4838ph2026-2-500kb_qsqudt.jpg', duration: 3100 },
  { id: 5, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779785075/IMGP3286PH26-3-500b_hfmhx2.jpg', duration: 3100 },
  { id: 6, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779787009/DSC_0973ph2026CLOSEUP2_tutyef.jpg', duration: 3100 },
  { id: 7, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1780072416/ed500kb_eb2ppw.jpg', duration: 3100 },
  { id: 8, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779779810/varnished-and-photoshoped-small-2-16-9_l7ip9v.jpg', duration: 3100 },
  { id: 9, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1780066797/scanned_small._detail-ph2026-500kb_mjxh6o.jpg', duration: 3100 },
];

const MOBILE_SLIDES = [
  { id: 13, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613717/IMGP3286PH26-2-500b_nidce0.jpg', duration: 3100 },
  { id: 14, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779702842/IMG_4906_photoshoped_2026-2_-500kb_dgqsps.jpg', duration: 3000 },
  { id: 15, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779781882/detail2021-ph2026_l7zv21.jpg', duration: 3000 },
  { id: 16, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779793833/photoshoped_2026_Royal_Gore._Oil_on_canvas_111_x_200_cm._2008._500kb_iyxrpi.jpg', duration: 3100 },
  { id: 17, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613731/varnished-and-photoshoped-small-2-500kb_jgndqr.jpg', duration: 3000 },
  { id: 18, url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779792941/IMG_0354-2026-3500kb_yixqtl.jpg', duration: 3000 },
];

const AUDIO_SRC =
  'https://res.cloudinary.com/dpayqcrg5/video/upload/v1779620423/Music_Eduard_Sasolov_sun5js.mp4';

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
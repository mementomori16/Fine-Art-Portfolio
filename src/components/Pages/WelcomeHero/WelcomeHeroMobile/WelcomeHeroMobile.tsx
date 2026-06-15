'use client';

import React, { useEffect, useState } from 'react';
import './welcomeHeroMobile.scss';

interface Slide {
  id: number;
  url: string;
}

const MOBILE_SLIDES: Slide[] = [
  {
    id: 1,
    url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779793833/photoshoped_2026_Royal_Gore._Oil_on_canvas_111_x_200_cm._2008._500kb_iyxrpi.jpg',
  },
  {
    id: 2,
    url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779781882/detail2021-ph2026_l7zv21.jpg',
  },
  {
    id: 3,
    url: 'https://res.cloudinary.com/dpayqcrg5/image/upload/v1779613701/IMG_4550ph26-500kb_lqn3zn.jpg',
  },
];

export default function WelcomeHeroMobile() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MOBILE_SLIDES.length);
    }, 4500);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="heroMobile">
      <div className="mobileTrack">
        {MOBILE_SLIDES.map((slide, i) => {
          const isActive = i === index;

          return (
            <div
              key={slide.id}
              className={`mobileCard ${isActive ? 'active' : ''}`}
            >
              <div className="mobileCardFrame">

                {isActive && <div className="mobileBackGlow" />}
                {isActive && <div className="mobileTopLight" />}

                <div className="mobileGoldFrame">
                  <img src={slide.url} className="mobileFineArtImage" />
                </div>

                <div className="mobileShadowBase" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
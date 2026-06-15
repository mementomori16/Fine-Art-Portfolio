'use client';

import { useEffect, useState } from 'react';
import WelcomeHeroDesktop from './WelcomeHeroDesktop/WelcomeHeroDesktop';
import WelcomeHeroMobile from './WelcomeHeroMobile/WelcomeHeroMobile';

export default function WelcomeHero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
   const check = () => {
  const width = window.innerWidth;

  // Treat EVERYTHING below desktop-safe carousel as mobile
  const isMobileOrTablet = width < 1200;

  setIsMobile(isMobileOrTablet);
};

    check();

    window.addEventListener('resize', check);
    window.addEventListener('orientationchange', check);

    return () => {
      window.removeEventListener('resize', check);
      window.removeEventListener('orientationchange', check);
    };
  }, []);

  return isMobile ? <WelcomeHeroMobile /> : <WelcomeHeroDesktop />;
}
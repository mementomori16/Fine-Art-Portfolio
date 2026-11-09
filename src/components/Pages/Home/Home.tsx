'use client';

import React, { useRef } from 'react';
import HelloHero from '../HelloHero/HelloHero';
import Categories from '../Categories/Categories';
import StyleCategories from '../StyleCategories/StyleCategories';
import VideoPage from '../../VideoPage/VideoPage';
import './home.scss';

const Home: React.FC = () => {
  const categoriesSectionRef = useRef<HTMLDivElement>(null);

  const handleScrollToNext = () => {
    if (categoriesSectionRef.current) {
      categoriesSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <div className="homepage-wrapper">
      <HelloHero />

      <div ref={categoriesSectionRef}>
        <StyleCategories />
        <Categories />
        <VideoPage />
      </div>
    </div>
  );
};

export default Home;
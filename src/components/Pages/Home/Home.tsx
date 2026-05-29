'use client';

import React, { useEffect, useRef } from 'react';
import WelcomeHero from '../WelcomeHero/WelcomeHero'; // Adjust this import path if needed to match where your file sits
import Categories from '../Categories/Categories';
import './home.scss'; 

const TypedWelcomeHero = WelcomeHero as React.ComponentType<{ onArrowClick: () => void }>;

const Home: React.FC = () => {
    // Reference point targeting the Video component wrapper right below the slider
    const videoSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.body.style.backgroundColor = '#171717';
        return () => {
            document.body.style.backgroundColor = ''; 
        };
    }, []);

    // Fires when the WelcomeHero scroll arrow is clicked
    const handleScrollToNext = () => {
        if (videoSectionRef.current) {
            videoSectionRef.current.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start' 
            });
        }
    };

    return (
        <div className="homepage-wrapper">
            <WelcomeHero />
            <div>
                <Categories />
            </div>
        </div>
    );
};

export default Home;

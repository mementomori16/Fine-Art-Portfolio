"use client";

import React from 'react';
import { useTranslation } from 'react-i18next'; // Ensure i18n is configured for Next.js
import VideoPlayer from '../VideoPlayer/VideoPlayer'; // Update path as needed
import './videoPage.scss';

const VideoPage: React.FC = () => {
    const { t } = useTranslation();
    const myVideoId = "rWHMvqnIGmE"; 

    return (
        <section className="text-component-section masterclass-final-clean">
            <div className="container">
                <header className="text-header">
                    <h2 className="text-main-title">{t('masterclass.title')}</h2>
                </header>
                
                <div className="subtitle-wrapper">
                    <h3 className="text-subtitle masterclass-sub-size">{t('masterclass.subtitle')}</h3>
                </div>

                <div className="video-centering-wrapper">
                    <VideoPlayer videoId={myVideoId} />
                </div>
            </div>
        </section>
    );
};

export default VideoPage;
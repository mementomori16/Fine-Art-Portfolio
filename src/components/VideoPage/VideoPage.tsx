"use client";

import React from 'react';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import './videoPage.scss';

const VideoPage: React.FC = () => {
    // Correct video identifier
    const myVideoId = "4-twr7Wgs14"; 

    return (
        <section className="text-component-section masterclass-final-clean">
            <div className="container">
                <div className="video-centering-wrapper">
                    <VideoPlayer videoId={myVideoId} />
                </div>
            </div>
        </section>
    );
};

export default VideoPage;
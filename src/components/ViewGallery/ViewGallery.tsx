"use client";

import React, { useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import "./viewGallery.scss";

interface ImageData {
  url: string;
  title: string;
  date: string;
  thumbnail?: string;
}

interface ViewGalleryProps {
  images: ImageData[];
  currentImageId: number;
  onClose: () => void;
}

const ViewGallery: React.FC<ViewGalleryProps> = ({
  images,
  currentImageId,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(currentImageId);
  const [isLoaded, setIsLoaded] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [maxScale, setMaxScale] = useState(5);
  const [resetFn, setResetFn] = useState<() => void>(() => () => {});

  const transitionToImage = (index: number) => {
    if (index === currentIndex) return;
    setOpacity(0);
    setIsLoaded(false);
    setTimeout(() => {
      setCurrentIndex(index);
      resetFn();
    }, 400);
  };

  useEffect(() => {
    if (!images[currentIndex]) return;
    const img = new Image();
    img.src = images[currentIndex].url;
    img.onload = () => {
      const isSmall = img.width < 1000 || img.height < 1000;
      setMaxScale(isSmall ? 3 : 6);
      setIsLoaded(true);
      setOpacity(1);
    };
  }, [currentIndex, images]);

  return (
    <div className="viewGallery">
      <button className="close-button" onClick={onClose} aria-label="Close Gallery">
        ✕
      </button>

      <TransformWrapper
        centerOnInit
        centerZoomedOut
        minScale={1}
        initialScale={1}
        maxScale={maxScale}
        wheel={{ step: 0.012 }}
        doubleClick={{ disabled: true }}
        limitToBounds
      >
        {({ zoomIn, zoomOut, resetTransform }) => {
          if (!resetFn) setResetFn(() => resetTransform);
          return (
            <>
              <TransformComponent>
                {images.length > 0 && (
                  <img
                    src={images[currentIndex].url}
                    alt="artwork"
                    className={`largeImage ${isLoaded ? "loaded" : ""}`}
                    style={{ opacity: isLoaded ? opacity : 0 }}
                  />
                )}
              </TransformComponent>

              <div className="zoomControls">
                <button onClick={() => zoomIn(0.3)} className="zoomButton" aria-label="Zoom In">
                  <span>+</span>
                </button>
                <button onClick={() => zoomOut(0.3)} className="zoomButton" aria-label="Zoom Out">
                  <span>−</span>
                </button>
              </div>

              {images.length > 1 && (
                <>
                  <button className="arrow top-left" onClick={() => transitionToImage((currentIndex - 1 + images.length) % images.length)}>
                    {"‹"}
                  </button>
                  <button className="arrow top-right" onClick={() => transitionToImage((currentIndex + 1) % images.length)}>
                    {"›"}
                  </button>
                </>
              )}
            </>
          );
        }}
      </TransformWrapper>

      {images.length > 0 && (
        <div className="imageInfo" style={{ opacity }}>
          <h2 className="imageTitle">{images[currentIndex].title}</h2>
          <p className="imageDate">{images[currentIndex].date}</p>
        </div>
      )}

      <div className="thumbnailsContainer">
        <div className="thumbnails">
          {images.map((img, i) => (
            <img
              key={i}
              src={img.thumbnail || img.url}
              className={`thumbnail ${i === currentIndex ? "active" : ""}`}
              onClick={() => transitionToImage(i)}
              alt="thumbnail"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewGallery;
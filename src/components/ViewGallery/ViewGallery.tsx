"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import "./viewGallery.scss";

interface ImageData {
  url: string;
  fallbackUrl?: string;
  title: string;
  date: string;
  thumbnail?: string;
}

interface ViewGalleryProps {
  images: ImageData[];
  currentImageId: number;
  onClose: () => void;
}

const SWIPE_THRESHOLD = 50;
const ZOOMED_SCALE = 1.02;

const ViewGallery: React.FC<ViewGalleryProps> = ({
  images,
  currentImageId,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(currentImageId);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSrc, setActiveSrc] = useState("");
  const [maxScale, setMaxScale] = useState(5);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);

  const gesture = useRef({
    active: false,
    startX: 0,
    startY: 0,
    maxTouches: 0,
    wasZoomed: false,
  });

  const transitionToImage = (index: number) => {
    if (index === currentIndex) return;
    setCurrentIndex(index);
    transformRef.current?.resetTransform(0);
  };

  const latest = useRef({ currentIndex, length: images.length, transitionToImage });
  latest.current = { currentIndex, length: images.length, transitionToImage };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const getScale = (): number => {
      const content = el.querySelector<HTMLElement>(".react-transform-component");
      if (!content) return 1;
      const t = getComputedStyle(content).transform;
      if (!t || t === "none") return 1;
      const m = t.match(/^matrix(?:3d)?\(([^)]+)\)$/);
      if (!m) return 1;
      return parseFloat(m[1].split(",")[0]) || 1;
    };

    const onStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        gesture.current = {
          active: true,
          startX: e.touches[0].clientX,
          startY: e.touches[0].clientY,
          maxTouches: 1,
          wasZoomed: getScale() > ZOOMED_SCALE,
        };
      } else {
        gesture.current.maxTouches = Math.max(
          gesture.current.maxTouches,
          e.touches.length
        );
      }
    };

    const onEnd = (e: TouchEvent) => {
      if (e.touches.length > 0) return;

      const g = gesture.current;
      if (!g.active) return;
      g.active = false;

      if (g.maxTouches > 1) return;
      if (g.wasZoomed || getScale() > ZOOMED_SCALE) return;

      const t = e.changedTouches[0];
      const dx = g.startX - t.clientX;
      const dy = g.startY - t.clientY;

      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy) * 1.5) {
        return;
      }

      const { currentIndex: idx, length, transitionToImage: go } = latest.current;
      if (dx > 0) go((idx + 1) % length);
      else go((idx - 1 + length) % length);
    };

    const onCancel = () => {
      gesture.current.active = false;
    };

    const opts = { capture: true, passive: true } as const;
    el.addEventListener("touchstart", onStart, opts);
    el.addEventListener("touchend", onEnd, opts);
    el.addEventListener("touchcancel", onCancel, opts);

    return () => {
      el.removeEventListener("touchstart", onStart, opts);
      el.removeEventListener("touchend", onEnd, opts);
      el.removeEventListener("touchcancel", onCancel, opts);
    };
  }, []);

  useEffect(() => {
    const current = images[currentIndex];
    if (!current) return;

    setIsLoaded(false);
    setActiveSrc(current.url);

    const img = new Image();
    img.src = current.url;

    if (img.complete && img.naturalWidth > 0) {
      const isSmall = img.naturalWidth < 1000 || img.naturalHeight < 1000;
      setMaxScale(isSmall ? 3 : 6);
      setIsLoaded(true);
      return;
    }

    img.onload = () => {
      const isSmall = img.naturalWidth < 1000 || img.naturalHeight < 1000;
      setMaxScale(isSmall ? 3 : 6);
      setIsLoaded(true);
    };

    img.onerror = () => {
      const fallback = current.fallbackUrl || current.thumbnail || "";
      if (fallback && fallback !== current.url) {
        setActiveSrc(fallback);
      }
      setIsLoaded(true);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [currentIndex, images]);

  const currentImg = images[currentIndex];

  return (
    <div className="viewGallery">
      <button className="close-button" onClick={onClose} aria-label="Close Gallery">
        ✕
      </button>

      <div className="gallerySwipeContainer" ref={containerRef}>
        <TransformWrapper
          ref={transformRef}
          centerOnInit
          centerZoomedOut
          minScale={1}
          initialScale={1}
          maxScale={maxScale}
          wheel={{ step: 0.012 }}
          doubleClick={{ disabled: true }}
          limitToBounds
        >
          {({ zoomIn, zoomOut }) => (
            <>
              <TransformComponent>
                {currentImg && (
                  <img
                    src={activeSrc || currentImg.url}
                    alt="artwork"
                    className={`largeImage ${isLoaded ? "loaded" : ""}`}
                    style={{
                      opacity: isLoaded ? 1 : 0.7,
                      transition: "opacity 0.2s ease",
                    }}
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
                <div className="arrowContainer">
                  <button
                    className="arrow top-left"
                    onClick={() => transitionToImage((currentIndex - 1 + images.length) % images.length)}
                  >
                    {"‹"}
                  </button>
                  <button
                    className="arrow top-right"
                    onClick={() => transitionToImage((currentIndex + 1) % images.length)}
                  >
                    {"›"}
                  </button>
                </div>
              )}
            </>
          )}
        </TransformWrapper>
      </div>

      {currentImg && (
        <div className="imageInfo">
          <h2 className="imageTitle">{currentImg.title}</h2>
          <p className="imageDate">{currentImg.date}</p>
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
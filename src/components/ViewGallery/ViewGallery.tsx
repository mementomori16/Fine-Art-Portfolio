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
const ZOOMED_SCALE = 1.02; // выше этого значения картина считается увеличенной

const ViewGallery: React.FC<ViewGalleryProps> = ({
  images,
  currentImageId,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(currentImageId);
  const [isLoaded, setIsLoaded] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [maxScale, setMaxScale] = useState(5);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const transformRef = useRef<ReactZoomPanPinchRef | null>(null);
  const switchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSwitching = useRef(false);

  // Состояние текущего жеста пальцем (ref: не сбрасывается при ререндере)
  const gesture = useRef({
    active: false,
    startX: 0,
    startY: 0,
    maxTouches: 0,
    wasZoomed: false,
  });

  const transitionToImage = (index: number) => {
    if (index === currentIndex) return;
    if (switchTimer.current) clearTimeout(switchTimer.current);

    isSwitching.current = true;
    setOpacity(0);
    setIsLoaded(false);
    switchTimer.current = setTimeout(() => {
      setCurrentIndex(index);
      transformRef.current?.resetTransform(0);
    }, 400);
  };

  // Всегда актуальные значения для нативных обработчиков (они регистрируются один раз)
  const latest = useRef({ currentIndex, length: images.length, transitionToImage });
  latest.current = { currentIndex, length: images.length, transitionToImage };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Масштаб читаем из CSS transform самой картинки: не зависит от версии библиотеки
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
        // новый жест
        gesture.current = {
          active: true,
          startX: e.touches[0].clientX,
          startY: e.touches[0].clientY,
          maxTouches: 1,
          wasZoomed: getScale() > ZOOMED_SCALE,
        };
      } else {
        // добавился второй палец: это щипок
        gesture.current.maxTouches = Math.max(
          gesture.current.maxTouches,
          e.touches.length
        );
      }
    };

    const onEnd = (e: TouchEvent) => {
      if (e.touches.length > 0) return; // ещё остались пальцы: жест не закончен

      const g = gesture.current;
      if (!g.active) return;
      g.active = false;

      // зум двумя пальцами, перемещение увеличенной картины или идущее переключение: не свайп
      if (g.maxTouches > 1) return;
      if (g.wasZoomed || getScale() > ZOOMED_SCALE) return;
      if (isSwitching.current) return;

      const t = e.changedTouches[0];
      const dx = g.startX - t.clientX;
      const dy = g.startY - t.clientY;

      // длинное и преимущественно горизонтальное движение
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

    // capture: обработчики срабатывают раньше библиотеки зума, и она не может «съесть» событие
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
    if (!images[currentIndex]) return;
    const img = new Image();
    img.src = images[currentIndex].url;
    img.onload = () => {
      const isSmall = img.width < 1000 || img.height < 1000;
      setMaxScale(isSmall ? 3 : 6);
      setIsLoaded(true);
      setOpacity(1);
      isSwitching.current = false;
    };
    img.onerror = () => {
      isSwitching.current = false;
    };
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [currentIndex, images]);

  useEffect(() => {
    return () => {
      if (switchTimer.current) clearTimeout(switchTimer.current);
    };
  }, []);

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
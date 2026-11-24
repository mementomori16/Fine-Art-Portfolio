'use client';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import './mysteriousCurtain.scss';

interface CurtainProps {
  children: React.ReactNode;
  forceOpen: boolean;
  onOpen: () => void;
}

const OPEN_DURATION = 2.2;
const transition = {
  duration: OPEN_DURATION,
  ease: [0.65, 0, 0.35, 1] as const,
};

// Пока картинка не загрузилась, шторка плоская тёмная, потом картинка плавно проявляется
function CurtainImage() {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <img
      ref={imgRef}
      src="/clean-curtain.png"
      alt=""
      aria-hidden="true"
      className="curtain-img"
      fetchPriority="high"
      decoding="async"
      onLoad={() => setLoaded(true)}
      style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease' }}
    />
  );
}

export default function MysteriousCurtain({ children, forceOpen, onOpen }: CurtainProps) {
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [curtainGone, setCurtainGone] = useState(forceOpen);
  const openedRef = useRef(forceOpen);

  useEffect(() => {
    if (forceOpen) {
      openedRef.current = true;
      setIsOpen(true);
    }
  }, [forceOpen]);

  const handleOpen = useCallback(() => {
    if (openedRef.current) return;
    openedRef.current = true;
    setIsOpen(true);
    onOpen();
  }, [onOpen]);

  // Мгновенно открыть штору без анимации и (если задан id) проскроллить к секции.
  // Используется ссылками меню /#technique и /#genre.
  const skipTo = useCallback(
    (id?: string) => {
      if (!openedRef.current) {
        openedRef.current = true;
        setIsOpen(true);
        setCurtainGone(true);
        onOpen();
      }
      if (id) {
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      }
    },
    [onOpen]
  );

  // Заход по ссылке с якорем (например, с другой страницы на /#technique)
  useEffect(() => {
    const id = window.location.hash.replace('#', '');
    if (id) skipTo(id);
  }, [skipTo]);

  // Клик по ссылке меню, когда уже находимся на главной
  useEffect(() => {
    const onSkip = (e: Event) => skipTo((e as CustomEvent<string>).detail);
    window.addEventListener('curtain:skip', onSkip);
    return () => window.removeEventListener('curtain:skip', onSkip);
  }, [skipTo]);

  // Пока шторы закрыты: Enter и пробел открывают, прокрутка заблокирована
  useEffect(() => {
    if (isOpen) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpen();
      }
    };
    window.addEventListener('keydown', onKey);

    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.overflow;
    const prevBody = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      html.style.overflow = prevHtml;
      body.style.overflow = prevBody;
    };
  }, [isOpen, handleOpen]);

  const injectStart = (node: React.ReactNode): React.ReactNode => {
    if (React.isValidElement(node)) {
      return React.cloneElement(node as React.ReactElement<{ start?: boolean }>, {
        start: isOpen,
      });
    }
    if (Array.isArray(node)) {
      return node.map((child, i) => (
        <React.Fragment key={i}>{injectStart(child)}</React.Fragment>
      ));
    }
    return node;
  };

  return (
    <div className={`curtain-wrapper ${isOpen ? 'is-open' : ''}`}>
      <div
        className="video-content-layer"
        style={{
          visibility: isOpen ? 'visible' : 'hidden',
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.6s ease',
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
      >
        {injectStart(children)}
      </div>

      {!isOpen && (
        <div
          className="curtain-active-area"
          role="button"
          tabIndex={0}
          aria-label="Enter the site"
          onClick={handleOpen}
        >
          <div className="curtain-vignette" />
          <div className="curtain-hint-container">
            <div className="curtain-backlight" />
            <div className="curtain-hint">ENTER</div>
          </div>
        </div>
      )}

      {!curtainGone && (
        <>
          <motion.div
            className="curtain-half left"
            initial={false}
            animate={{ x: isOpen ? '-100%' : '0%' }}
            transition={transition}
            onAnimationComplete={() => {
              if (isOpen) setCurtainGone(true);
            }}
          >
            <CurtainImage />
          </motion.div>
          <motion.div
            className="curtain-half right"
            initial={false}
            animate={{ x: isOpen ? '100%' : '0%' }}
            transition={transition}
          >
            <CurtainImage />
          </motion.div>
        </>
      )}
    </div>
  );
}
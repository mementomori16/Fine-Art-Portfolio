'use client';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import './mysteriousCurtain.scss';

interface CurtainProps {
  children: React.ReactNode;
  forceOpen: boolean;
  onOpen: () => void;
}

const OPEN_DURATION = 2.2; // сек (было 2.8)
const transition = {
  duration: OPEN_DURATION,
  ease: [0.65, 0, 0.35, 1] as const,
};

export default function MysteriousCurtain({ children, forceOpen, onOpen }: CurtainProps) {
  const [isOpen, setIsOpen] = useState(forceOpen);
  // шторы убираем из DOM, когда они уехали: не держим в памяти картинку 200vw
  const [curtainGone, setCurtainGone] = useState(forceOpen);
  const openedRef = useRef(forceOpen);

  // Синхронизация: если forceOpen меняется после первого рендера
  // (deep-link, reduced-motion, восстановление состояния) — шторка открывается.
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

  // Пока шторы закрыты: Enter и пробел открывают сразу (надпись ENTER это обещает),
  // и прокрутка страницы заблокирована
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

  // Надёжный проброс start в одиночный child (HelloHero).
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
          {/* Половины едут через transform (GPU), а не через width: без перерасчёта раскладки */}
          <motion.div
            className="curtain-half left"
            initial={false}
            animate={{ x: isOpen ? '-100%' : '0%' }}
            transition={transition}
            onAnimationComplete={() => {
              if (isOpen) setCurtainGone(true);
            }}
          >
            <img src="/clean-curtain.png" alt="" aria-hidden="true" className="curtain-img" />
          </motion.div>
          <motion.div
            className="curtain-half right"
            initial={false}
            animate={{ x: isOpen ? '100%' : '0%' }}
            transition={transition}
          >
            <img src="/clean-curtain.png" alt="" aria-hidden="true" className="curtain-img" />
          </motion.div>
        </>
      )}
    </div>
  );
}
'use client';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import './mysteriousCurtain.scss';

interface CurtainProps {
  children: React.ReactNode;
  forceOpen: boolean;
  onOpen: () => void;
}

export default function MysteriousCurtain({ children, forceOpen, onOpen }: CurtainProps) {
  const [isOpen, setIsOpen] = useState(forceOpen);

  // Синхронизация: если forceOpen меняется после первого рендера
  // (deep-link, reduced-motion, восстановление состояния) — шторка открывается.
  useEffect(() => {
    if (forceOpen) setIsOpen(true);
  }, [forceOpen]);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    onOpen();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen();
    }
  };

  const transition = {
    duration: 2.8,
    ease: [0.65, 0, 0.35, 1] as const,
  };

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
          aria-label="Открыть сайт"
          onClick={handleOpen}
          onKeyDown={handleKeyDown}
        >
          <div className="curtain-vignette" />
          <div className="curtain-hint-container">
            <div className="curtain-backlight" />
            <div className="curtain-hint">ENTER</div>
          </div>
        </div>
      )}

      <motion.div
        className="curtain-half left"
        initial={{ width: forceOpen ? '0%' : '50%' }}
        animate={{ width: isOpen ? '0%' : '50%', x: isOpen ? '-5%' : '0%' }}
        transition={transition}
      >
        <img src="/clean-curtain.png" alt="" aria-hidden="true" className="curtain-img" />
      </motion.div>
      <motion.div
        className="curtain-half right"
        initial={{ width: forceOpen ? '0%' : '50%' }}
        animate={{ width: isOpen ? '0%' : '50%', x: isOpen ? '5%' : '0%' }}
        transition={transition}
      >
        <img src="/clean-curtain.png" alt="" aria-hidden="true" className="curtain-img" />
      </motion.div>
    </div>
  );
}
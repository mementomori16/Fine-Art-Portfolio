'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import './mysteriousCurtain.scss';

interface CurtainProps {
  children: React.ReactNode;
  forceOpen: boolean;
  onOpen: () => void;
}

export default function MysteriousCurtain({ children, forceOpen, onOpen }: CurtainProps) {
  const [isOpen, setIsOpen] = useState(forceOpen);

  const handleOpen = () => {
    setIsOpen(true);
    onOpen();
  };

  // FIXED: Explicitly cast to any or define the tuple to satisfy TypeScript
  const transition = {
    duration: 2.8,
    ease: [0.65, 0, 0.35, 1] as any,
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
        {children}
      </div>

      {!isOpen && (
        <div className="curtain-active-area" onClick={handleOpen}>
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
      />
      <motion.div
        className="curtain-half right"
        initial={{ width: forceOpen ? '0%' : '50%' }}
        animate={{ width: isOpen ? '0%' : '50%', x: isOpen ? '5%' : '0%' }}
        transition={transition}
      />
    </div>
  );
}
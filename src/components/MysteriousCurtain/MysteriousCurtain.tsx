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
  // Use the layout state to determine the starting position
  const [isOpen, setIsOpen] = useState(forceOpen);

  const handleOpen = () => {
    setIsOpen(true);
    onOpen(); // Permanently saves the open status in LayoutClientManager
  };

  const transition: any = {
    duration: 2.8,
    ease: [0.65, 0, 0.35, 1],
  };

  return (
    <div
      className={`curtain-wrapper ${isOpen ? 'is-open' : ''}`}
      onClick={handleOpen}
    >
      {/* CONTENT (hidden before open) */}
      <div
        className="video-content-layer"
        style={{
          pointerEvents: isOpen ? 'auto' : 'none',
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      >
        {children}
      </div>

      {/* ENTER TEXT — no animation = no glitch */}
      {!isOpen && (
        <div className="curtain-hint">
          Enter
        </div>
      )}

      {/* LEFT */}
      <motion.div
        className="curtain-half left"
        initial={{ width: forceOpen ? '0%' : '50%' }}
        animate={{
          width: isOpen ? '0%' : '50%',
          x: isOpen ? '-5%' : '0%',
        }}
        transition={transition}
      />

      {/* RIGHT */}
      <motion.div
        className="curtain-half right"
        initial={{ width: forceOpen ? '0%' : '50%' }}
        animate={{
          width: isOpen ? '0%' : '50%',
          x: isOpen ? '5%' : '0%',
        }}
        transition={transition}
      />
    </div>
  );
}
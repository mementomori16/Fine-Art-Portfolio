'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function MysteriousCurtain({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  // Smooth, professional transition
  const transition: any = {
    duration: 2.8,
    ease: [0.65, 0, 0.35, 1],
  };

  return (
    <div className="curtain-wrapper" onClick={() => setIsOpen(true)}>
      {/* Revealed Website Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>

      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="curtain-hint"
          >
            Enter
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Curtain - Exactly 50% */}
      <motion.div
        className="curtain-half left"
        initial={{ width: '50%' }}
        animate={{ 
          width: isOpen ? '0%' : '50%',
          x: isOpen ? '-5%' : '0%' 
        }}
        transition={transition}
      />

      {/* Right Curtain - Exactly 50% */}
      <motion.div
        className="curtain-half right"
        initial={{ width: '50%' }}
        animate={{ 
          width: isOpen ? '0%' : '50%',
          x: isOpen ? '5%' : '0%' 
        }}
        transition={transition}
      />
    </div>
  );
}
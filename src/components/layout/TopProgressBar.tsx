import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function TopProgressBar() {
  const [isAnimating, setIsAnimating] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 800); // 800ms simulated load time for premium feel
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          initial={{ width: "0%", opacity: 1 }}
          animate={{ width: "100%", opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="fixed top-0 left-0 h-[3px] z-[100] bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink"
          style={{ 
            boxShadow: '0 0 15px rgba(14,165,233,0.8), 0 0 25px rgba(139,92,246,0.6)' 
          }}
        >
          <div className="absolute top-0 right-0 h-full w-[100px] bg-white opacity-50 blur-[5px] -translate-y-1/2" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

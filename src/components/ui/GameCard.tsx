import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Users, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface Game {
  id: string;
  title: string;
  image: string;
  category: string;
  playersActive?: number;
  rating?: number;
}

export function GameCard({ game, index = 0 }: { game: Game; index?: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative rounded-2xl overflow-hidden glass-panel border border-white/5 hover:border-white/20 transition-all duration-500 bg-white/5 hover:bg-white/10"
      style={{
         boxShadow: isHovered ? '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 40px rgba(139,92,246,0.2)' : '0 10px 20px -5px rgba(0,0,0,0.5)',
         transformStyle: 'preserve-3d',
         transformPerspective: 1000
      }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent z-10 pointer-events-none transition-opacity duration-500" />
      
      <motion.div 
         animate={{ scale: isHovered ? 1.1 : 1 }}
         transition={{ duration: 0.7, ease: "easeOut" }}
         className="w-full h-48 md:h-56 bg-dark-bg"
      >
        <img 
          src={game.image} 
          alt={game.title} 
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => {
             e.currentTarget.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80";
          }}
        />
      </motion.div>
      
      <div className="absolute top-3 right-3 z-20 flex gap-2">
        <motion.div 
           animate={{ y: isHovered ? 0 : -5, opacity: 1 }}
           className="px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white flex items-center gap-1 shadow-lg"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse" />
          {game.playersActive || Math.floor(Math.random() * 2000)}
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-5 z-20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
        <motion.div 
          animate={{ x: isHovered ? 5 : 0 }}
          className="text-[10px] font-black text-neon-blue tracking-widest uppercase mb-1 drop-shadow-md"
        >
          {game.category}
        </motion.div>
        
        <motion.h3 
          animate={{ x: isHovered ? 5 : 0, color: isHovered ? '#fff' : '#e2e8f0' }}
          className="text-lg md:text-xl font-display font-black mb-2 leading-tight drop-shadow-lg"
        >
          {game.title}
        </motion.h3>
        
        <div className="flex items-center gap-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill={i < Math.floor(game.rating || 4) ? "currentColor" : "none"} className={i >= Math.floor(game.rating || 4) ? "text-gray-600" : ""} />
            ))}
          </div>
          <span className="text-xs text-gray-300 font-bold">{game.rating?.toFixed(1) || '4.8'}</span>
        </div>

        <Link 
          to={`/play/${game.id}`}
          className="flex w-full items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 py-3 rounded-xl font-black text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)] translate-y-4 group-hover:translate-y-0 delay-100 uppercase tracking-wider"
        >
          <Play size={16} fill="currentColor" />
          Launch Game
        </Link>
      </div>
    </motion.div>
  );
}

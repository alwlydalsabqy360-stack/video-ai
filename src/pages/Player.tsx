import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Maximize, Heart, Share2, Users, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { doc, getDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { motion } from 'framer-motion';

export default function Player() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [liked, setLiked] = useState(false);
  const [gameInfo, setGameInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeFailed, setIframeFailed] = useState(false);

  useEffect(() => {
    async function loadGame() {
      if (!gameId) return;
      try {
        const gameSnap = await getDoc(doc(db, 'games', gameId));
        if (gameSnap.exists()) {
          setGameInfo({ id: gameSnap.id, ...gameSnap.data() });
        } else {
           navigate('/');
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `games/${gameId}`);
      } finally {
        setLoading(false);
      }
    }
    loadGame();
  }, [gameId, navigate]);

  const toggleFullscreen = () => {
    // Basic pseudo-fullscreen. For a real app, use the HTML5 Fullscreen API:
    // document.documentElement.requestFullscreen()
    setIsFullscreen(!isFullscreen);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full animate-spin mb-4" />
      </div>
    )
  }

  if (!gameInfo) return null;

  return (
    <div className={`mx-auto flex flex-col lg:flex-row gap-8 pb-12 transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 bg-black/95 backdrop-blur-3xl' : 'max-w-7xl'}`}>
      
      {/* Main Game Area */}
      <div className={`flex-1 flex flex-col ${isFullscreen ? 'p-0 w-full h-[100dvh]' : ''}`}>
        
        {!isFullscreen && (
          <Button variant="ghost" className="self-start gap-2 mb-6" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} /> Back to Hub
          </Button>
        )}

        {/* The Game Iframe Container */}
        <div 
          className={`relative bg-black shadow-[0_0_50px_rgba(0,180,216,0.15)] overflow-hidden transition-all duration-300 flex-1 min-h-[400px] md:min-h-[600px] ${
            isFullscreen ? 'rounded-none border-none shadow-none w-full h-full' : 'rounded-3xl border border-white/5 w-full aspect-video'
          }`}
        >
          {/* Enhanced loading overlay */}
          {!iframeLoaded && !iframeFailed && (
            <div className="absolute inset-0 bg-dark-bg/80 backdrop-blur-sm flex flex-col items-center justify-center z-0 pointer-events-none">
               <div className="relative">
                  <div className="w-20 h-20 border-4 border-white/10 rounded-full" />
                  <div className="absolute top-0 left-0 w-20 h-20 border-4 border-neon-pink border-t-transparent rounded-full animate-spin" />
               </div>
               <p className="text-neon-pink font-display font-bold mt-6 tracking-widest uppercase animate-pulse">Initializing Nexus Engine...</p>
               <p className="text-gray-500 font-sans text-sm mt-3 animate-pulse">Loading connection to host...</p>
            </div>
          )}

          {iframeFailed && (
            <div className="absolute inset-0 bg-dark-bg flex flex-col items-center justify-center z-10 p-8 text-center">
               <AlertCircle size={48} className="text-red-500 mb-4" />
               <h3 className="text-2xl font-bold text-white mb-2">Host Connection Failed</h3>
               <p className="text-gray-400 mb-6 max-w-md mx-auto">This game's external host may block standard embedded connections. Try launching it in an external secured window.</p>
               <Button onClick={() => window.open(gameInfo.url, '_blank', 'noopener,noreferrer')} variant="neon-blue" className="px-8">
                 Launch Game Backup
               </Button>
            </div>
          )}
          
          <iframe 
            src={gameInfo.url}
            className={`absolute inset-0 w-full h-full z-10 bg-black transition-opacity duration-1000 ${iframeLoaded ? 'opacity-100' : 'opacity-0'}`}
            allow="fullscreen; autoplay; gamepad"
            title={gameInfo.title}
            onLoad={() => setIframeLoaded(true)}
            onError={() => setIframeFailed(true)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock"
          />

          {/* Player Overlays */}
          <div className={`absolute top-4 right-4 z-20 flex gap-2 transition-opacity duration-300 ${isFullscreen ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
            <Button size="icon" variant={isFullscreen ? "neon-pink" : "secondary"} onClick={toggleFullscreen} className={isFullscreen ? "bg-black/50 backdrop-blur-md border-neon-pink text-neon-pink" : ""}>
              <Maximize size={18} />
            </Button>
          </div>
        </div>

        {/* Game Info Panel below player */}
        {!isFullscreen && (
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="mt-8"
          >
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-4">
              <div className="flex gap-6 items-center md:items-start">
                <img src={gameInfo.image} className="w-24 h-24 rounded-2xl object-cover shadow-[0_0_20px_rgba(255,255,255,0.1)] border border-white/5 hidden md:block" alt={gameInfo.title} />
                <div>
                  <h1 className="text-3xl md:text-4xl font-display font-black text-white mb-2 drop-shadow-lg">{gameInfo.title}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-gray-400">
                    <span className="bg-white/5 py-1 px-3 rounded-lg border border-white/5">{gameInfo.developer || 'NEXUS ORIGINAL'}</span>
                    <span className="flex items-center gap-1.5 text-neon-blue bg-neon-blue/10 py-1 px-3 rounded-lg border border-neon-blue/20">
                      <Users size={14} /> {gameInfo.playersActive?.toLocaleString() || 1205} ACTIVE
                    </span>
                    <span className="flex items-center gap-1 text-yellow-500">
                      ★ {gameInfo.rating?.toFixed(1) || '4.8'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button 
                  variant={liked ? 'neon-pink' : 'secondary'} 
                  className="flex items-center gap-2 px-6 h-12"
                  onClick={() => setLiked(!liked)}
                >
                  <Heart size={18} className={liked ? "fill-current" : ""} /> 
                  <span className="hidden sm:inline">{liked ? 'Liked' : 'Like'}</span>
                </Button>
                <Button variant="secondary" className="flex items-center gap-2 px-6 h-12">
                  <Share2 size={18} /> <span className="hidden sm:inline">Share</span>
                </Button>
              </div>
            </div>

            <div className="glass-panel p-6 md:p-8 mt-8 border-t border-l border-white/5">
              <h3 className="text-xl font-bold font-display tracking-wide mb-4 border-b border-dark-border pb-3 text-neon-blue">Game Intel</h3>
              <p className="text-gray-300 leading-relaxed max-w-4xl text-lg">
                {gameInfo.description || 'Welcome to the Nexus. Prepare for a seamless HTML5 gaming experience directly in your browser. Survive, compete, and climb the global leaderboards.'}
              </p>
              
              <div className="flex flex-wrap gap-3 mt-8">
                {gameInfo.tags?.map((tag: string) => (
                  <span key={tag} className="px-4 py-1.5 bg-dark-bg border border-dark-border rounded-full text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:border-white/20 transition-colors cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

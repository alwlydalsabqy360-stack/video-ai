import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameCard, Game } from '../components/ui/GameCard';
import { Button } from '../components/ui/Button';
import { Play, TrendingUp, Sparkles, Gamepad2, Search, Filter, Crosshair, Car, Users, Puzzle, Map, Ghost } from 'lucide-react';
import { collection, onSnapshot, query, limit } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

const CATEGORIES = ['All', 'Action', 'Racing', 'Multiplayer', 'Puzzle', 'Adventure', 'Horror', 'Arcade', 'Shooter', 'Sports'];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Action: <Crosshair size={24} />,
  Racing: <Car size={24} />,
  Multiplayer: <Users size={24} />,
  Puzzle: <Puzzle size={24} />,
  Adventure: <Map size={24} />,
  Horror: <Ghost size={24} />,
  Arcade: <Gamepad2 size={24} />,
  Shooter: <Crosshair size={24} />,
  Sports: <Users size={24} />
};

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only limits to 100 without orderBy to avoid needing a composite index which fails the query
    const q = query(collection(db, 'games'), limit(150));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Game));
      
      // Client-side sort by newest
      data.sort((a: any, b: any) => {
        const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
        const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
        return timeB - timeA;
      });

      setGames(data);
      setLoading(false);
    }, (error) => {
       console.error("Fetch games error: ", error);
       handleFirestoreError(error, OperationType.LIST, 'games');
       setLoading(false);
    });
    return () => unsub();
  }, []);

  const filteredGames = games.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (g.tags && g.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesCategory = selectedCategory === 'All' || g.category?.toLowerCase() === selectedCategory.toLowerCase() || (g.tags && g.tags.some((t: string) => t.toLowerCase() === selectedCategory.toLowerCase()));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pb-20 max-w-7xl mx-auto p-4 md:p-8">
      {/* Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full h-[400px] md:h-[500px] rounded-[30px] overflow-hidden mb-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] border border-white/5"
      >
        <img 
          src="https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80" 
          alt="Hero Banner" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent flex items-center p-8 md:p-16">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-neon-blue text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md shadow-[0_0_15px_rgba(14,165,233,0.2)]"
            >
               SYSTEM ONLINE <Sparkles size={14} className="ml-2" />
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-display font-black text-white mb-6 leading-[1.1] drop-shadow-xl"
            >
              ENTER THE <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink drop-shadow-[0_0_20px_rgba(139,92,246,0.3)]">NEXUS</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl text-gray-300 mb-10 max-w-lg font-medium"
            >
              Drop into the ultimate HTML5 multiplayer universe. Play instantly across all devices—no downloads required.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button size="lg" className="flex items-center gap-3 bg-white text-black hover:bg-gray-100 rounded-xl px-8 h-14 font-black shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all hover:scale-105 active:scale-95">
                <Play fill="currentColor" size={20} /> START EXPLORING
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Advanced Search Bar */}
      <div className="sticky top-0 z-30 bg-dark-bg/80 backdrop-blur-2xl py-4 mb-8 -mx-4 px-4 md:-mx-8 md:px-8 border-b border-white/5 shadow-2xl">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input 
            type="text" 
            placeholder="Search 10,000+ games..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 focus:outline-none focus:border-neon-blue text-white transition-all focus:bg-white/10 shadow-inner text-lg font-medium"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="relative">
             <div className="w-20 h-20 border-4 border-white/10 rounded-full" />
             <div className="absolute top-0 left-0 w-20 h-20 border-4 border-neon-blue border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-neon-blue font-display font-bold mt-6 tracking-widest uppercase animate-pulse">Establishing Link...</p>
        </div>
      ) : (
        <>
          {searchQuery ? (
            <section className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-display font-black flex items-center gap-3 drop-shadow-md">
                  <Filter className="text-neon-blue" /> 
                  Search Results ({filteredGames.length})
                </h2>
              </div>
              {filteredGames.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  <AnimatePresence>
                    {filteredGames.map((game, i) => (
                      <motion.div key={game.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}>
                        <GameCard game={game} index={i} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-20 bg-white/5 border border-white/5 rounded-3xl">
                  <Gamepad2 size={64} className="mx-auto text-gray-600 mb-6" />
                  <h3 className="text-2xl font-bold text-gray-400 mb-2">No games found</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">We couldn't find any games matching your current search parameters.</p>
                  <Button variant="secondary" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>Clear Search</Button>
                </div>
              )}
            </section>
          ) : (
            <>
              {/* Featured Categories (New Section) */}
              <section className="mb-14">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-display font-black drop-shadow-md">
                    Explore Sectors
                  </h2>
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar px-2 -mx-2">
                  {CATEGORIES.slice(1).map((cat, i) => {
                    const isSelected = selectedCategory === cat;
                    return (
                      <motion.button
                        key={cat}
                        onClick={() => setSelectedCategory(isSelected ? 'All' : cat)}
                        whileHover={{ y: -5, scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex-shrink-0 flex flex-col items-center justify-center w-28 h-28 md:w-32 md:h-32 rounded-[24px] border transition-all duration-300 ${
                          isSelected 
                            ? 'bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 border-neon-blue shadow-[0_0_30px_rgba(14,165,233,0.3)]' 
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className={`mb-3 transition-colors duration-300 ${isSelected ? 'text-neon-blue' : 'text-gray-400'}`}>
                          {CATEGORY_ICONS[cat] || <Gamepad2 size={24} />}
                        </div>
                        <span className={`text-xs md:text-sm font-bold uppercase tracking-widest ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                          {cat}
                        </span>
                      </motion.button>
                    )
                  })}
                </div>
              </section>

              {/* Main Games Grid */}
              <section className="mb-16">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-display font-black flex items-center gap-4 drop-shadow-md">
                    {selectedCategory === 'All' ? (
                       <><TrendingUp className="text-neon-pink w-8 h-8" /> Trending Now</>
                    ) : (
                       <><Filter className="text-neon-blue w-8 h-8" /> {selectedCategory} Games</>
                    )}
                  </h2>
                </div>
                
                {filteredGames.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {filteredGames.map((game, i) => (
                      <GameCard key={game.id} game={game} index={i} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/5 border border-white/5 rounded-3xl text-center py-20">
                    <p className="text-gray-400 text-lg">No games found in this sector. More incoming soon.</p>
                  </div>
                )}
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}

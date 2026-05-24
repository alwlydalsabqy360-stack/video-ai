import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';
import { Trophy, Star, Gamepad2, Users, Settings } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function Profile() {
  const { user } = useAuthStore();

  if (!user) {
    return <div className="text-center mt-20 text-gray-400">Please log in to view your profile.</div>;
  }

  const xpPercentage = (user.xp / 10000) * 100; // Fake max xp for level up

  return (
    <div className="max-w-6xl mx-auto pb-12">
      
      {/* Profile Header */}
      <div className="relative mb-24">
        {/* Banner */}
        <div className="h-64 w-full rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.15)] bg-gradient-to-r from-indigo-900 via-purple-900 to-black">
           <img 
              src="https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80" 
              className="w-full h-full object-cover opacity-60 mix-blend-overlay"
              alt="Banner" 
           />
        </div>

        {/* Avatar & Basic Info */}
        <div className="absolute -bottom-16 left-8 flex items-end gap-6">
          <div className="relative group">
            <img 
              src={user.photoURL || ''} 
              alt={user.displayName || 'Player'} 
              className="w-32 h-32 rounded-2xl border-4 border-dark-bg object-cover shadow-[0_0_30px_rgba(176,38,255,0.6)]"
            />
            <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
              <span className="text-white text-xs font-bold uppercase tracking-wider">Change</span>
            </div>
            {/* Level Badge */}
            <div className="absolute -bottom-4 -right-4 bg-neon-purple w-12 h-12 rounded-full border-4 border-dark-bg flex items-center justify-center shadow-[0_0_15px_#b026ff]">
              <span className="text-white font-display font-black text-lg">{user.level}</span>
            </div>
          </div>
          
          <div className="mb-2">
            <h1 className="text-4xl font-display font-black text-white drop-shadow-md">{user.displayName}</h1>
            <p className="text-neon-blue font-mono font-bold">@nexus_guest_77</p>
          </div>
        </div>

        <div className="absolute -bottom-10 right-8">
           <Button variant="secondary" className="gap-2 rounded-full px-6">
             <Settings size={18} /> Edit Profile
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & XP */}
        <div className="space-y-8">
          <div className="glass-panel p-6 pb-8">
            <div className="flex justify-between items-end mb-4">
               <div>
                 <h3 className="text-gray-400 font-medium mb-1">Current XP</h3>
                 <p className="text-3xl font-display font-bold text-white">{user.xp.toLocaleString()}</p>
               </div>
               <div className="text-right">
                 <p className="text-sm text-gray-500 mb-1">Next Level</p>
                 <p className="text-neon-purple font-mono font-bold">10,000 XP</p>
               </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-3 bg-black/50 rounded-full border border-white/5 overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }}
                 animate={{ width: `${xpPercentage}%` }}
                 transition={{ duration: 1, ease: "easeOut" }}
                 className="h-full bg-gradient-to-r from-neon-purple to-neon-blue shadow-[0_0_10px_#00f0ff]"
               />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="glass-panel p-5 text-center transition-transform hover:scale-105 duration-300">
               <Trophy className="mx-auto text-yellow-400 mb-2 w-8 h-8" />
               <p className="text-gray-400 text-sm">Victories</p>
               <p className="text-2xl font-bold font-display">142</p>
             </div>
             <div className="glass-panel p-5 text-center transition-transform hover:scale-105 duration-300">
               <Gamepad2 className="mx-auto text-neon-pink mb-2 w-8 h-8" />
               <p className="text-gray-400 text-sm">Matches</p>
               <p className="text-2xl font-bold font-display">894</p>
             </div>
          </div>
        </div>

        {/* Right Column: Achievements & Friends */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-panel p-6">
             <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold flex items-center gap-2">
                  <Star className="text-yellow-400" /> Recent Achievements
                </h2>
                <button className="text-sm text-neon-blue hover:underline">View All</button>
             </div>
             
             <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 bg-white/5 border border-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors">
                     <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center border border-yellow-400/30">
                        <Trophy className="text-yellow-400 w-6 h-6" />
                     </div>
                     <div className="flex-1">
                        <h4 className="font-bold text-white">First Blood {i + 1}</h4>
                        <p className="text-sm text-gray-400">Eliminate an enemy within 30 seconds.</p>
                     </div>
                     <div className="text-neon-purple font-mono font-bold text-sm bg-neon-purple/10 px-3 py-1 rounded-full">
                       +500 XP
                     </div>
                  </div>
                ))}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

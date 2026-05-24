import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Gamepad2, ShoppingCart, Trophy, Users, Settings, ShieldAlert } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../store/useAuthStore';

export default function Sidebar({ className }: { className?: string }) {
  const { pathname } = useLocation();
  const { user } = useAuthStore();
  
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Games', path: '/games', icon: Gamepad2 },
    { name: 'Shop', path: '/shop', icon: ShoppingCart },
    { name: 'Challenges', path: '/challenges', icon: Trophy },
    { name: 'Friends', path: '/friends', icon: Users },
  ];

  return (
    <aside className={cn("w-20 lg:w-72 bg-black/40 backdrop-blur-3xl border-r border-white/5 flex flex-col justify-between py-6 z-40 hidden md:flex shadow-[10px_0_30px_rgba(0,0,0,0.5)] transition-all duration-300", className)}>
      <div className="px-4 lg:px-8">
        <Link to="/" className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center font-display font-black text-xl shadow-[0_0_20px_rgba(157,78,221,0.5)] border border-white/20">
            N
          </div>
          <span className="font-display font-black text-2xl hidden lg:block tracking-widest uppercase">
            NEXUS<span className="text-neon-blue drop-shadow-[0_0_10px_rgba(0,180,216,0.8)]">PLAY</span>
          </span>
        </Link>

        <p className="hidden lg:block text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 mb-4 ml-2">Main Menu</p>
        
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 px-3 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                  isActive 
                    ? "text-white bg-gradient-to-r from-neon-purple/20 to-transparent border border-neon-purple/30 shadow-[inset_0_0_20px_rgba(157,78,221,0.15)]" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1/2 w-1.5 rounded-r-md bg-neon-purple shadow-[0_0_10px_#9d4edd]" />
                )}
                <Icon size={22} className={cn("transition-transform duration-500 group-hover:scale-110", isActive && "text-neon-purple drop-shadow-[0_0_8px_rgba(157,78,221,0.8)]")} />
                <span className="font-bold hidden lg:block text-sm tracking-wide">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="px-4 lg:px-8 space-y-2">
        <p className="hidden lg:block text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 mb-4 ml-2">System</p>
        
        {user?.isAdmin && (
          <Link to="/admin" className="flex items-center gap-4 px-3 py-3 rounded-2xl text-neon-pink hover:bg-neon-pink/10 transition-all border border-transparent hover:border-neon-pink/20 group relative overflow-hidden">
             <ShieldAlert size={22} className="transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(247,37,133,0.8)]" />
             <span className="font-bold hidden lg:block text-sm tracking-wide">Admin Core</span>
          </Link>
        )}
        <Link to="/settings" className="flex items-center gap-4 px-3 py-3 rounded-2xl text-gray-400 hover:text-white hover:bg-white/5 transition-all group border border-transparent">
           <Settings size={22} className="transition-transform duration-500 group-hover:rotate-90" />
           <span className="font-bold hidden lg:block text-sm tracking-wide">Settings</span>
        </Link>
      </div>
    </aside>
  );
}

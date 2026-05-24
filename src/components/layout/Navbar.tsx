import React, { useState } from 'react';
import { Search, Bell, MessageSquare, Coins, ChevronDown, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

export default function Navbar() {
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="h-[88px] glass-panel border-t-0 border-l-0 border-r-0 border-b border-white/5 rounded-none z-30 px-6 flex flex-shrink-0 items-center justify-between shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-3xl bg-black/40">
      
      {/* Mobile Logo */}
      <div className="md:hidden flex items-center gap-2">
        <Link to="/">
          <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-neon-purple to-neon-blue flex items-center justify-center font-display font-black text-lg shadow-[0_0_20px_rgba(0,180,216,0.5)]">
            N
          </div>
        </Link>
      </div>

      {/* Global Search */}
      <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-2xl px-5 py-3 w-[450px] focus-within:border-neon-blue/60 focus-within:bg-white/10 focus-within:shadow-[0_0_20px_rgba(0,180,216,0.15)] transition-all duration-300 group">
        <Search size={18} className="text-gray-400 group-focus-within:text-neon-blue transition-colors" />
        <input 
          type="text" 
          placeholder="Search for games, players, tournaments..." 
          className="bg-transparent border-none outline-none text-[15px] font-medium ml-3 w-full text-white placeholder-gray-500"
        />
        <div className="flex items-center justify-center w-6 h-6 rounded border border-white/20 bg-white/5 text-[10px] font-bold text-gray-400 ml-2">/</div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6 relative">
        
        {isAuthenticated && user ? (
          <>
            {/* Coins */}
            <div className="hidden sm:flex items-center gap-2.5 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(234,179,8,0.1)]">
              <Coins size={18} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
              <span className="text-[15px] font-black text-yellow-500 tracking-wide">{user.coins?.toLocaleString() || 0}</span>
            </div>

            <div className="h-8 w-px bg-white/10 hidden md:block" />

            {/* Actions */}
            <button className="relative text-gray-400 hover:text-white transition-colors">
              <MessageSquare size={22} />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-neon-pink rounded-full shadow-[0_0_5px_#f72585] animate-pulse" />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Bell size={22} />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-3 hover:bg-white/5 p-1.5 pr-4 rounded-full transition-colors border border-transparent hover:border-white/10 outline-none">
                <div className="relative">
                  <img src={user.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} alt="User" className="w-10 h-10 rounded-full border-2 border-neon-purple object-cover shadow-[0_0_15px_rgba(157,78,221,0.4)]" />
                  <div className="absolute -bottom-1 -right-1 bg-neon-purple text-[10px] font-black px-1.5 py-0.5 rounded text-white font-display border border-black/50 tracking-wider">
                    L{user.level || 1}
                  </div>
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-[15px] font-bold truncate max-w-[120px] leading-tight">{user.displayName || 'Guest'}</div>
                  <div className="text-[11px] font-black text-emerald-400 uppercase tracking-widest mt-0.5 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_currentColor]"></div>ONLINE</div>
                </div>
                <ChevronDown size={16} className={`text-gray-400 hidden lg:block transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-16 w-56 bg-dark-panel backdrop-blur-3xl border border-white/10 rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.8)] py-2 z-50 overflow-hidden text-sm">
                   <div className="px-5 py-3 border-b border-white/5 mb-1">
                     <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-1">Signed in as</p>
                     <p className="font-bold truncate text-white">{user.email || 'guest@nexus.gg'}</p>
                   </div>
                   <Link to="/profile" onClick={() => setDropdownOpen(false)} className="block px-5 py-2.5 hover:bg-white/5 text-gray-200 transition-colors">
                     My Profile
                   </Link>
                   <Link to="/settings" onClick={() => setDropdownOpen(false)} className="block px-5 py-2.5 hover:bg-white/5 text-gray-200 transition-colors">
                     Account Settings
                   </Link>
                   {user.isAdmin && (
                     <Link to="/admin" onClick={() => setDropdownOpen(false)} className="block px-5 py-2.5 hover:bg-neon-pink/10 text-neon-pink font-bold border-t border-white/5 mt-1 pt-3 transition-colors">
                       Admin Dashboard
                     </Link>
                   )}
                   <button onClick={handleLogout} className="w-full text-left px-5 py-3 flex items-center gap-3 hover:bg-white/5 text-red-400 border-t border-white/5 mt-1 transition-colors">
                     <LogOut size={16} /> Sign Out
                   </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Button asLink to="/login" variant="ghost" className="font-bold uppercase tracking-wider text-xs px-6">Log In</Button>
            <Button asLink to="/login" variant="neon-purple" className="font-bold uppercase tracking-wider text-xs px-6 shadow-[0_0_20px_rgba(157,78,221,0.4)] hover:shadow-[0_0_30px_rgba(157,78,221,0.6)]">Sign Up</Button>
          </div>
        )}
      </div>
    </header>
  );
}

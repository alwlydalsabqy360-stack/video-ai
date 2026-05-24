import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    navigate('/');
  }

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel p-8 md:p-12 w-full max-w-md relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/20 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-blue/20 rounded-full blur-[80px] -z-10 -translate-x-1/2 translate-y-1/2" />
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-blue font-display font-black text-3xl shadow-[0_0_30px_rgba(176,38,255,0.4)] mb-6">
            N
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Log in to enter the Nexus.</p>
        </div>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
              placeholder="player@nexus.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <input 
              type="password" 
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-gray-600 bg-black/40 text-neon-purple focus:ring-neon-purple" />
              <span className="text-gray-400">Remember me</span>
            </label>
            <a href="#" className="text-neon-blue hover:underline">Forgot password?</a>
          </div>

          <Button type="submit" variant="neon-purple" className="w-full h-12 text-lg mt-4">
            Initialize Login Sequence
          </Button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-400 mb-4 text-sm">Or connect using</p>
          <button onClick={handleGoogleSignIn} className="w-full bg-white text-black hover:bg-gray-200 transition-colors py-3 rounded-xl font-bold flex items-center justify-center gap-3">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.89 16.8 15.72 17.58V20.34H19.29C21.38 18.42 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
              <path d="M12 23C14.97 23 17.46 22.02 19.29 20.34L15.72 17.58C14.73 18.24 13.48 18.64 12 18.64C9.14 18.64 6.7 16.71 5.82 14.13H2.13V16.99C3.95 20.61 7.68 23 12 23Z" fill="#34A853"/>
              <path d="M5.82 14.13C5.59 13.47 5.46 12.76 5.46 12C5.46 11.24 5.59 10.53 5.82 9.87V7.01H2.13C1.38 8.5 0.95 10.2 0.95 12C0.95 13.8 1.38 15.5 2.13 16.99L5.82 14.13Z" fill="#FBBC05"/>
              <path d="M12 5.36C13.62 5.36 15.07 5.92 16.21 7L19.4 3.81C17.45 2 14.97 1 12 1C7.68 1 3.95 3.39 2.13 7.01L5.82 9.87C6.7 7.29 9.14 5.36 12 5.36Z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>
      </motion.div>
    </div>
  );
}

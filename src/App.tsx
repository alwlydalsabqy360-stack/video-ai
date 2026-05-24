import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Player from './pages/Player';
import Admin from './pages/Admin';
import { AuthProvider } from './components/AuthProvider';
import { PageTransition } from './components/layout/PageTransition';
import { TopProgressBar } from './components/layout/TopProgressBar';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="/play/:gameId" element={<PageTransition><Player /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <TopProgressBar />
        <div className="flex h-screen w-screen overflow-hidden bg-dark-bg text-white selection:bg-neon-purple/40 selection:text-white">
          <Sidebar className="hidden md:flex flex-shrink-0" />
          
          <div className="flex flex-col flex-1 min-w-0">
            <Navbar />
            
            <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth pointer-events-auto">
              <AnimatedRoutes />
            </main>
          </div>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'neon-blue' | 'neon-purple';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  asLink?: boolean;
  to?: string;
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  asLink,
  to,
  children, 
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-white text-black hover:bg-gray-200",
    secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/5",
    ghost: "bg-transparent hover:bg-white/10 text-gray-300 hover:text-white",
    'neon-blue': "bg-transparent text-neon-blue border border-neon-blue neon-border-blue hover:bg-neon-blue hover:text-black",
    'neon-purple': "bg-transparent text-neon-purple border border-neon-purple neon-border-purple hover:bg-neon-purple hover:text-white",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-8 py-4 text-lg font-bold",
    icon: "h-10 w-10",
  };

  const styles = cn(baseStyles, variants[variant], sizes[size], className);

  if (asLink && to) {
    return (
      <Link to={to} className={styles}>
        {children}
      </Link>
    );
  }

  return (
    <motion.button 
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.95 }}
      className={styles} 
      {...props}
    >
      {children}
    </motion.button>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled 
          ? 'bg-black/60 backdrop-blur-xl border-white/10 py-4' 
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.jpg" alt="KOFE House" className="h-16 w-16 object-cover rounded-full border-2 border-white/10" />
        </div>

        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(197, 42, 46, 0.4)" }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#C52A2E] hover:bg-[#A02225] text-white px-6 py-2 rounded-full font-medium transition-colors"
        >
          Order Now
        </motion.button>
      </div>
    </nav>
  );
}

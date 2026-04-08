import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col dark:bg-[#0B1120]">
      {/* Premium SaaS Dot Pattern Background */}
      <div 
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.15) 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      />
      {/* Subtle top light gradient */}
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-900/10 dark:to-transparent pointer-events-none -z-10" />
      
      <Navbar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 animate-slide-up">
        <Outlet />
      </main>
    </div>
  );
};

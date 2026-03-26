import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export const MainLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col">
      {/* Decorative background blobs for rich aesthetics */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-200/40 rounded-full blur-[100px] -z-10 animate-fade-in pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[40%] bg-teal-200/40 rounded-full blur-[100px] -z-10 animate-fade-in pointer-events-none" />
      
      <Navbar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 animate-slide-up">
        <Outlet />
      </main>
    </div>
  );
};

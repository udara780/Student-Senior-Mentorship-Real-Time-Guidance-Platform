import React from 'react';
import { Outlet } from 'react-router-dom';
import campusImg from '../assets/campus.png';

export const AuthLayout = () => {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-6">
      {/* Immersive Campus Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url(${campusImg})` }}
      />
      
      {/* Sophisticated Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-slate-900/40 via-slate-900/60 to-slate-950/80 backdrop-blur-[2px]" />
      <div className="absolute top-0 left-0 w-full h-full z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-primary-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] bg-teal-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-2xl animate-slide-up relative z-20">
        <Outlet />
      </div>
    </div>
  );
};

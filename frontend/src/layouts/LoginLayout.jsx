import React from 'react';
import { Outlet } from 'react-router-dom';
import lgImg from '../assets/lgImg.jpg';

export const LoginLayout = () => {
  return (
    <div className="min-h-screen flex items-center relative overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${lgImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Subtle dark overlay for readability */}
      <div className="absolute inset-0 z-10 bg-black/40" />

      {/* Form — left-aligned on desktop, centered on mobile */}
      <div
        className="
          relative z-20
          w-full
          flex justify-center
          px-6
          sm:justify-start
          sm:pl-[8%]
          md:pl-[10%]
        "
      >
        <div className="w-full max-w-md animate-slide-up">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

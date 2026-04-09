import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import heroImg from '../../assets/hero.png';

export default function LandingPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const textContainerRef = useRef(null);
  const indicatorRef = useRef(null);

  const [canScroll, setCanScroll] = useState(false);
  const isNavigatingRef = useRef(false);

  useEffect(() => {
    // We will manually split the text for staggered animation
    const letters = textContainerRef.current.children;

    // 1. Initial Timeline setup
    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => setCanScroll(true), 500);
      }
    });

    // Reset initial states for 3D Entrance
    gsap.set(containerRef.current, { perspective: 1000 });
    gsap.set(imgRef.current, { z: -800, rotationX: 45, rotationY: -30, opacity: 0, scale: 0.5 });
    gsap.set(letters, { y: 100, opacity: 0, rotationX: -90 });

    // Image 3D fly-in with elastic easing
    tl.to(imgRef.current, {
      z: 0,
      rotationX: 0,
      rotationY: 0,
      opacity: 1,
      scale: 1,
      duration: 2,
      ease: "elastic.out(1, 0.5)"
    })
      // Text Letters staggered flip-up
      .to(letters, {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 1,
        stagger: 0.08,
        ease: "back.out(1.7)"
      }, "-=1.5");

    // Ambient floating on the image (separate tween to not block timeline completion)
    const floatTween = gsap.to(imgRef.current, {
      y: -15,
      rotationZ: 2,
      duration: 3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 2 // Start smoothly after entrance
    });

    return () => {
      tl.kill();
      floatTween.kill();
    };
  }, []);

  useEffect(() => {
    if (!canScroll || isNavigatingRef.current) return;

    const handleScroll = (e) => {
      // DeltaY > 20 captures mouse wheel pushes
      if (e.deltaY > 20) initiateTransition();
    };

    let touchStartY = 0;
    const handleTouchStart = (e) => { touchStartY = e.changedTouches[0].screenY; };
    const handleTouchEnd = (e) => {
      // 50px buffer for swipe-up gestures
      if (touchStartY - e.changedTouches[0].screenY > 50) initiateTransition();
    };
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'Enter') initiateTransition();
    };

    window.addEventListener('wheel', handleScroll);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canScroll]);

  const initiateTransition = () => {
    if (isNavigatingRef.current) return;
    isNavigatingRef.current = true;
    
    // Explicitly hide indicator via GSAP instead of triggering a React Rerender with state
    if (indicatorRef.current) {
        gsap.to(indicatorRef.current, { opacity: 0, duration: 0.2 });
    }

    const exitTl = gsap.timeline({
      onComplete: () => {
        navigate('/login');
      }
    });

    // Exit Animation: Swipe the entire landing page upwards
    exitTl.to(containerRef.current, {
      y: "-100vh", // Use absolute vh to ensure it clears the screen definitively
      duration: 0.8,
      ease: "power3.inOut"
    });
  };

  // Text we want to animate individually
  const title = "TeamUp";

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A] overflow-hidden select-none transition-colors cursor-pointer"
      onClick={() => initiateTransition()}
    >
      <div
        className="flex flex-col items-center justify-center gap-8 w-full pointer-events-none"
      >
        <img
          ref={imgRef}
          src={heroImg}
          alt="TeamUp Logo"
          className="w-40 md:w-56 lg:w-64 drop-shadow-[0_0_35px_rgba(59,130,246,0.4)]"
          style={{ transformStyle: 'preserve-3d' }}
        />

        <h1
          ref={textContainerRef}
          className="flex text-5xl md:text-7xl font-bold tracking-tight text-transparent drop-shadow-[0_0_15px_rgba(99,102,241,0.5)] font-heading"
          style={{ perspective: 1000 }}
        >
          {title.split('').map((char, i) => (
            <span
              key={i}
              className="inline-block bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"
              style={{ transformOrigin: '50% 100%' }}
            >
              {char === " " ? "\u00A0" : !!char ? char : ""}
            </span>
          ))}
        </h1>
      </div>

      {/* Scroll indicator */}
      <div
        ref={indicatorRef}
        className={`absolute bottom-12 text-slate-400/60 text-sm tracking-widest uppercase transition-opacity duration-1000 pointer-events-none ${canScroll ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="flex flex-col items-center gap-2">
          <span>Click anywhere to Explore</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-slate-400/60 to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
}


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { GraduationCap, Briefcase } from 'lucide-react';
import campusImg from '../../assets/campus.png';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-6 animate-fade-in">
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

      <div className="w-full max-w-4xl animate-slide-up relative z-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight drop-shadow-2xl">
            <span className="bg-gradient-to-r from-white via-primary-100 to-white bg-clip-text text-transparent">Guidance Platform</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-100 font-medium max-w-2xl mx-auto drop-shadow-md opacity-90">
            Connect with verified seniors to guide your future, or share your experience as a mentor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card 
            className="flex flex-col items-center justify-center p-12 text-center cursor-pointer hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 border border-white/20 hover:border-primary-400 group bg-white/10 backdrop-blur-md shadow-2xl"
            onClick={() => alert("Student flow is planned for the next major release Phase!")}
          >
            <div className="w-24 h-24 bg-primary-400/20 group-hover:bg-primary-400/30 text-white rounded-full flex items-center justify-center mb-6 transition-all duration-300 shadow-xl border border-white/20">
              <GraduationCap size={48} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">As a Student</h2>
            <p className="text-slate-200 font-medium">Find verified seniors and request 1-on-1 mentorship sessions.</p>
          </Card>

          <Card 
            className="flex flex-col items-center justify-center p-12 text-center cursor-pointer hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 border border-white/20 hover:border-teal-400 group bg-white/10 backdrop-blur-md shadow-2xl"
            onClick={() => navigate('/register')}
          >
            <div className="w-24 h-24 bg-teal-400/20 group-hover:bg-teal-400/30 text-white rounded-full flex items-center justify-center mb-6 transition-all duration-300 shadow-xl border border-white/20">
              <Briefcase size={48} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">As a Senior</h2>
            <p className="text-slate-200 font-medium">Share your invaluable experience and guide the next generation.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Users, Calendar, MessageSquare, Video, Clock, CheckCircle, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Professional Welcome Header */}
      <div className="relative overflow-hidden bg-white/40 dark:bg-slate-800/40 p-8 rounded-3xl shadow-xl border border-white/60 dark:border-slate-700/50 backdrop-blur-md transition-all duration-500">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome back, <span className="bg-gradient-to-r from-primary-600 to-teal-400 bg-clip-text text-transparent">{user?.name}</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg font-medium max-w-xl">
              Your mentorship is making a real impact. Here's a quick look at your activity today.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary-500/10 border transition-all duration-300 ${user?.isVerified
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800'
              : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800'
              }`}>
              <CheckCircle size={18} />
              {user?.isVerified ? 'VERIFIED SENIOR' : 'VERIFICATION PENDING'}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest px-2">
              Senior Workspace ID: {user?._id?.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-400/10 rounded-full blur-[80px] -mr-32 -mt-32 dark:bg-primary-500/5" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/10 rounded-full blur-[60px] -ml-24 -mb-24 dark:bg-teal-500/5" />
      </div>

      {/* Impact Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Pending Requests', value: '12', icon: Clock, color: 'primary' },
          { label: 'Active Mentees', value: '08', icon: Users, color: 'teal' },
          { label: 'Upcoming Sessions', value: '04', icon: Calendar, color: 'blue' },
          { label: 'Total Guidance', value: '156h', icon: Star, color: 'amber' },
        ].map((stat, i) => (
          <div key={i} className="group p-6 rounded-2xl bg-white/50 dark:bg-slate-800/40 border border-white/60 dark:border-slate-700/40 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary-500/5 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-bold text-slate-300 dark:text-slate-600 uppercase tracking-tighter">Impact Score</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-black text-slate-800 dark:text-slate-100 tabular-nums tracking-tight">{stat.value}</p>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Core Management Sections */}
      <div>
        <div className="flex items-center justify-between mb-6 px-1">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
            Core Management
            <span className="h-px w-16 bg-slate-200 dark:bg-slate-700 md:w-32" />
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Action Cards Mapping */}
          <Card className="group flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 border border-white/20 dark:bg-slate-800/50 relative overflow-hidden h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary-500" />
            <div className="w-16 h-16 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mb-6 mt-2 group-hover:rotate-6 transition-transform duration-500 shadow-sm border border-primary-100 dark:border-primary-900/30">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Mentorship Inbox</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 flex-1 leading-relaxed px-2">
              Review incoming student requests and accept new guidance opportunities.
            </p>
            <Link to="/requests" className="w-full mt-auto">
              <Button variant="outline" className="w-full border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-transparent font-bold py-2.5 rounded-xl hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 transition-all">Open Inbox</Button>
            </Link>
          </Card>

          <Card className="group flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 border border-white/20 dark:bg-slate-800/50 relative overflow-hidden h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-teal-500" />
            <div className="w-16 h-16 bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 rounded-2xl flex items-center justify-center mb-6 mt-2 group-hover:-rotate-6 transition-transform duration-500 shadow-sm border border-teal-100 dark:border-teal-900/30">
              <Calendar size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Weekly Schedule</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 flex-1 leading-relaxed px-2">
              Optimize your availability and manage your interactive mentorship calendar.
            </p>
            <Link to="/availability" className="w-full mt-auto">
              <Button variant="outline" className="w-full border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-transparent font-bold py-2.5 rounded-xl hover:bg-teal-500 hover:text-white dark:hover:bg-teal-500 transition-all">Manage Time</Button>
            </Link>
          </Card>

          <Card className="group flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 border border-white/20 dark:bg-slate-800/50 relative overflow-hidden h-full">
            <div className="absolute top-0 left-0 w-full h-1 bg-sky-500" />
            <div className="w-16 h-16 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 rounded-2xl flex items-center justify-center mb-6 mt-2 group-hover:scale-110 transition-transform duration-500 shadow-sm border border-sky-100 dark:border-sky-900/30">
              <MessageSquare size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Message Center</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 flex-1 leading-relaxed px-2">
              Real-time communication with active mentees via secure chat rooms.
            </p>
            <Link to="/chat" className="w-full mt-auto">
              <Button variant="outline" className="w-full border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-transparent font-bold py-2.5 rounded-xl hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 transition-all">Join Chats</Button>
            </Link>
          </Card>

          <Card className="group flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 border border-white/20 dark:bg-slate-800/50 relative overflow-hidden h-full border-t-amber-500">
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-6 mt-2 group-hover:animate-pulse-slow transition-transform duration-500 shadow-sm border border-amber-100 dark:border-amber-900/30">
              <Video size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2 leading-tight">Live Guidance</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 flex-1 leading-relaxed px-2">
              Access your upcoming video sessions and manage interactive guidance tools.
            </p>
            <Link to="/sessions" className="w-full mt-auto">
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-amber-500/20 border-none transition-all">Launch Meetings</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}

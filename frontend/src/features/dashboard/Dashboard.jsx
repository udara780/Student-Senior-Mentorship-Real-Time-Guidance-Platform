import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Users, Calendar, MessageSquare, Video, Clock, CheckCircle, Star, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChatbotToggle from '../../components/ChatbotToggle';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    pendingRequests: 0,
    activeMentees: 0,
    upcomingSessions: 0,
    totalGuidance: '0h'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Professional Welcome Header */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[2rem] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-200/60 dark:border-slate-800 transition-all duration-500">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
              Welcome back, <span className="bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent">{user?.name}</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg sm:text-xl font-medium max-w-2xl leading-relaxed">
              Your mentorship is making a real impact. Here's a quick look at your activity today.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <div className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-sm font-semibold shadow-sm border transition-all duration-300 ${user?.isVerified
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
              : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800'
              }`}>
              <CheckCircle size={18} className={user?.isVerified ? "text-emerald-500" : "text-amber-500"} />
              {user?.isVerified ? 'VERIFIED SENIOR' : 'VERIFICATION PENDING'}
            </div>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest px-2">
              Workspace ID: {user?._id?.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-primary-400/10 to-indigo-500/10 rounded-full blur-[80px] -mr-32 -mt-32 dark:from-primary-500/5 dark:to-indigo-500/5 pointer-events-none" />
      </div>

      {/* Impact Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Pending Requests', value: stats.pendingRequests, icon: Clock, color: 'blue' },
          { label: 'Active Mentees', value: stats.activeMentees, icon: Users, color: 'indigo' },
          { label: 'Upcoming Sessions', value: stats.upcomingSessions, icon: Calendar, color: 'violet' },
          { label: 'Total Guidance', value: stats.totalGuidance, icon: Star, color: 'amber' },
        ].map((stat, i) => (
          <Card key={i} className={`group relative overflow-hidden flex flex-col justify-between border-b-4 border-b-transparent hover:border-b-${stat.color}-500 transition-all duration-300`}>
            {/* Soft accent gradient at top right corner */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${stat.color}-500/5 rounded-full blur-2xl group-hover:bg-${stat.color}-500/10 transition-colors`} />

            <div className="flex justify-between items-start mb-6 z-10 relative">
              <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                <stat.icon size={24} />
              </div>
            </div>

            <div className="space-y-1.5 z-10 relative">
              {loading ? (
                <div className="h-10 w-16 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-lg" />
              ) : (
                <p className="text-4xl font-extrabold text-slate-800 dark:text-slate-50 font-heading tracking-tight tabular-nums">{stat.value}</p>
              )}
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Core Management Sections */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-8 px-1">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3 font-heading">
            Core Management
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Mentorship Inbox */}
          <Card className="group flex flex-col items-start hover:-translate-y-1.5 h-full relative overflow-hidden">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
              <Users size={28} />
            </div>
            <div className="flex items-center gap-2.5 mb-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-heading tracking-tight">Mentorship Inbox</h3>
              {!loading && stats.pendingRequests > 0 && (
                <span className="flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full animate-pulse shadow-md shadow-red-500/30">
                  {stats.pendingRequests} New
                </span>
              )}
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 flex-1 leading-relaxed">
              Review incoming student requests and accept new guidance opportunities.
            </p>
            <Link to="/requests" className="w-full mt-auto">
              <Button variant="secondary" className="w-full rounded-xl py-2.5 font-bold group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent dark:group-hover:bg-blue-500 transition-colors shadow-none text-slate-700 bg-slate-50 group-hover:shadow-lg group-hover:shadow-blue-500/20">
                Open Inbox <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Card>

          {/* Weekly Schedule */}
          <Card className="group flex flex-col items-start hover:-translate-y-1.5 h-full relative overflow-hidden">
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-5 group-hover:-rotate-6 transition-transform duration-500">
              <Calendar size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 font-heading tracking-tight">Weekly Schedule</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 flex-1 leading-relaxed">
              Optimize your availability and manage your interactive mentorship calendar.
            </p>
            <Link to="/availability" className="w-full mt-auto">
              <Button variant="secondary" className="w-full rounded-xl py-2.5 font-bold group-hover:bg-indigo-600 group-hover:text-white group-hover:border-transparent dark:group-hover:bg-indigo-500 transition-colors shadow-none text-slate-700 bg-slate-50 group-hover:shadow-lg group-hover:shadow-indigo-500/20">
                Manage Time <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Card>

          {/* Message Center */}
          <Card className="group flex flex-col items-start hover:-translate-y-1.5 h-full relative overflow-hidden">
            <div className="w-14 h-14 bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
              <MessageSquare size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 font-heading tracking-tight">Message Center</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 flex-1 leading-relaxed">
              Real-time communication with active mentees via secure chat rooms.
            </p>
            <Link to="/chat" className="w-full mt-auto">
              <Button variant="secondary" className="w-full rounded-xl py-2.5 font-bold group-hover:bg-violet-600 group-hover:text-white group-hover:border-transparent dark:group-hover:bg-violet-500 transition-colors shadow-none text-slate-700 bg-slate-50 group-hover:shadow-lg group-hover:shadow-violet-500/20">
                Join Chats <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Card>

          {/* Live Guidance */}
          <Card className="group flex flex-col items-start hover:-translate-y-1.5 h-full relative overflow-hidden">
            <div className="w-14 h-14 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
              <Video size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 font-heading tracking-tight">Live Guidance</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 flex-1 leading-relaxed">
              Access your upcoming video sessions and manage interactive guidance tools.
            </p>
            <Link to="/sessions" className="w-full mt-auto">
              <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md shadow-primary-500/20">
                Launch Meetings <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>
      <ChatbotToggle />
    </div>
  );
}


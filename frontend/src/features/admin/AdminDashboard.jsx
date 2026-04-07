import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import toast from 'react-hot-toast';
import {
  Users, ShieldCheck, Clock, Calendar, CheckCircle, XCircle,
  UserCheck, TrendingUp, ChevronRight, User, Sparkles,
} from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // id of request being processed

  useEffect(() => {
    fetchStats();
    fetchPendingRequests();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const { data } = await api.get('/admin/mentor-requests');
      setPendingRequests(data);
    } catch {
      toast.error('Failed to load mentor requests');
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleDecision = async (userId, action) => {
    setActionLoading(userId);
    try {
      const { data } = await api.put(`/admin/mentor-requests/${userId}/${action}`);
      toast.success(data.message);
      // Remove from pending list immediately (optimistic)
      setPendingRequests(prev => prev.filter(r => r._id !== userId));
      // Refresh stats
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action} request`);
    } finally {
      setActionLoading(null);
    }
  };

  const statCards = stats
    ? [
        { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'indigo', sub: 'Registered on platform' },
        { label: 'Active Mentors', value: stats.totalMentors, icon: UserCheck, color: 'emerald', sub: 'Verified seniors' },
        { label: 'Pending Applications', value: stats.pendingMentorRequests, icon: Clock, color: 'amber', sub: 'Awaiting your review', urgent: stats.pendingMentorRequests > 0 },
        { label: 'Total Sessions', value: stats.totalSessions, icon: Calendar, color: 'violet', sub: `${stats.activeSessions} upcoming` },
      ]
    : [];

  return (
    <div className="space-y-10 animate-fade-in pb-12">

      {/* Header */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[2rem] shadow-sm border border-slate-200/60 dark:border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm uppercase tracking-widest">
              <ShieldCheck size={16} />
              Admin Control Panel
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
              Welcome, <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">{user?.name}</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">
              Manage the mentorship platform and review incoming mentor applications.
            </p>
          </div>
          <Link to="/admin/users">
            <Button variant="primary" className="flex items-center gap-2 shadow-lg shadow-indigo-500/20">
              <Users size={18} /> Manage Users <ChevronRight size={16} />
            </Button>
          </Link>
        </div>
        <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-gradient-to-br from-indigo-400/10 to-violet-500/10 rounded-full blur-[80px] -mr-24 -mt-24 pointer-events-none" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loadingStats
          ? Array(4).fill(0).map((_, i) => (
              <Card key={i} className="h-36 animate-pulse bg-slate-100 dark:bg-slate-800 border-none shadow-none" />
            ))
          : statCards.map((stat, i) => (
              <Card
                key={i}
                className={`group relative overflow-hidden flex flex-col justify-between border-b-4 border-b-transparent hover:border-b-${stat.color}-500 transition-all duration-300 ${stat.urgent ? 'ring-2 ring-amber-400/40' : ''}`}
              >
                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-${stat.color}-500/5 rounded-full blur-2xl group-hover:bg-${stat.color}-500/10 transition-colors`} />
                <div className="flex justify-between items-start mb-4 z-10 relative">
                  <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon size={22} />
                  </div>
                  {stat.urgent && (
                    <span className="animate-pulse text-[10px] font-bold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">
                      ACTION NEEDED
                    </span>
                  )}
                </div>
                <div className="space-y-0.5 z-10 relative">
                  <p className="text-4xl font-extrabold text-slate-800 dark:text-slate-50 font-heading tracking-tight tabular-nums">{stat.value}</p>
                  <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{stat.label}</p>
                  <p className="text-xs text-slate-400 font-medium">{stat.sub}</p>
                </div>
              </Card>
            ))}
      </div>

      {/* Pending Mentor Requests */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
              <Sparkles size={20} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-heading">Pending Mentor Applications</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Review and decide on incoming mentor requests</p>
            </div>
          </div>
          {pendingRequests.length > 0 && (
            <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-bold text-sm px-3 py-1 rounded-full">
              {pendingRequests.length} pending
            </span>
          )}
        </div>

        {loadingRequests ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : pendingRequests.length === 0 ? (
          <Card className="py-16 text-center border-dashed border-2 border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 shadow-none">
            <CheckCircle size={40} className="mx-auto mb-3 text-emerald-400 opacity-60" />
            <p className="font-bold text-slate-600 dark:text-slate-300 text-lg">All caught up!</p>
            <p className="text-slate-400 text-sm font-medium mt-1">No pending mentor applications right now.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingRequests.map(req => (
              <Card
                key={req._id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 p-6 hover:shadow-lg transition-all duration-300 border border-slate-200 dark:border-slate-700"
              >
                {/* Avatar + Info */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-900/40 dark:to-violet-900/40 flex items-center justify-center flex-shrink-0 border-2 border-indigo-100 dark:border-indigo-900 overflow-hidden">
                    {req.profilePhoto ? (
                      <img src={req.profilePhoto} alt={req.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={26} className="text-indigo-500 dark:text-indigo-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 leading-tight">{req.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{req.email}</p>
                    {req.bio && (
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1.5 line-clamp-2">{req.bio}</p>
                    )}
                    {req.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {req.skills.slice(0, 5).map((skill, i) => (
                          <span key={i} className="text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                            {skill}
                          </span>
                        ))}
                        {req.skills.length > 5 && (
                          <span className="text-[11px] font-semibold text-slate-400">+{req.skills.length - 5} more</span>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-slate-400 font-medium mt-2">
                      Applied {format(new Date(req.createdAt), 'MMM d, yyyy · h:mm a')}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 w-full sm:w-auto flex-shrink-0">
                  <Button
                    variant="ghost"
                    onClick={() => handleDecision(req._id, 'reject')}
                    disabled={actionLoading === req._id}
                    className="flex-1 sm:flex-none flex items-center gap-2 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-semibold"
                  >
                    <XCircle size={18} />
                    {actionLoading === req._id ? 'Processing...' : 'Reject'}
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => handleDecision(req._id, 'approve')}
                    disabled={actionLoading === req._id}
                    className="flex-1 sm:flex-none flex items-center gap-2 shadow-md shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
                  >
                    <CheckCircle size={18} />
                    {actionLoading === req._id ? 'Processing...' : 'Approve'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Quick Platform Overview */}
      {stats && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
              <TrendingUp size={20} className="text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-heading">Platform Overview</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Student Accounts', value: stats.totalStudents, color: 'bg-blue-50 dark:bg-blue-900/10 text-blue-700 dark:text-blue-300' },
              { label: 'Active Sessions (Scheduled)', value: stats.activeSessions, color: 'bg-violet-50 dark:bg-violet-900/10 text-violet-700 dark:text-violet-300' },
              { label: 'Completed Sessions', value: stats.totalSessions - stats.activeSessions, color: 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-300' },
            ].map((item, i) => (
              <div key={i} className={`rounded-2xl p-5 ${item.color} border border-current border-opacity-10`}>
                <p className="text-3xl font-extrabold font-heading tabular-nums">{item.value}</p>
                <p className="text-sm font-semibold mt-1 opacity-80">{item.label}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

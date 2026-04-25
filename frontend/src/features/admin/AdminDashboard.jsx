import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import toast from 'react-hot-toast';
import {
  Users, ShieldCheck, Clock, Calendar, CheckCircle, XCircle,
  UserCheck, TrendingUp, ChevronRight, User, Sparkles, LogOut,
  AlertTriangle, LayoutDashboard,
} from 'lucide-react';
import { format } from 'date-fns';
import UsersPanel from './UsersPanel';

/* ── Inline style helpers ──────────────────────────────────────────────── */
const glass = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '20px',
};

const gradients = {
  indigo: 'linear-gradient(135deg,#6366f1,#818cf8)',
  emerald: 'linear-gradient(135deg,#10b981,#34d399)',
  amber: 'linear-gradient(135deg,#f59e0b,#fbbf24)',
  violet: 'linear-gradient(135deg,#8b5cf6,#a78bfa)',
};

/* ── Mini SVG Donut ────────────────────────────────────────────────────── */
function DonutChart({ completed = 0, active = 0, total = 0 }) {
  const r = 54, cx = 64, cy = 64, circ = 2 * Math.PI * r;
  const pct = total > 0 ? completed / total : 0;
  const dash = pct * circ;
  return (
    <svg width="128" height="128" viewBox="0 0 128 128">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="14" />
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke="url(#dg)" strokeWidth="14" strokeLinecap="round"
        strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={circ / 4}
        style={{ transition: 'stroke-dasharray 1s ease' }} />
      <defs>
        <linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#f1f5f9" fontSize="22" fontWeight="bold">{total}</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="#94a3b8" fontSize="10">Total</text>
    </svg>
  );
}

/* ── Mini CSS Bar Chart ────────────────────────────────────────────────── */
function BarChart({ total = 0, active = 0, completed = 0, pending = 0 }) {
  const bars = [
    { label: 'Total', value: total, color: '#6366f1' },
    { label: 'Active', value: active, color: '#10b981' },
    { label: 'Done', value: completed, color: '#8b5cf6' },
    { label: 'Pending', value: pending, color: '#f59e0b' },
  ];
  const max = Math.max(...bars.map(b => b.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '18px', height: '110px', padding: '0 8px' }}>
      {bars.map((b, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
          <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 600 }}>{b.value}</span>
          <div style={{
            width: '100%', borderRadius: '8px 8px 4px 4px',
            background: `linear-gradient(to top, ${b.color}99, ${b.color})`,
            height: `${Math.max((b.value / max) * 80, 6)}px`,
            transition: 'height 0.8s ease',
            boxShadow: `0 0 12px ${b.color}55`,
          }} />
          <span style={{ color: '#64748b', fontSize: '10px' }}>{b.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Main Component ────────────────────────────────────────────────────── */
export default function AdminDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

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
      setPendingRequests(prev => prev.filter(r => r._id !== userId));
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action} request`);
    } finally {
      setActionLoading(null);
    }
  };

  const statCards = stats
    ? [
        { label: 'Total Users', value: stats.totalUsers, icon: Users, grad: gradients.indigo, glow: '#6366f1' },
        { label: 'Active Mentors', value: stats.totalMentors, icon: UserCheck, grad: gradients.emerald, glow: '#10b981' },
        { label: 'Pending Apps', value: stats.pendingMentorRequests, icon: Clock, grad: gradients.amber, glow: '#f59e0b', urgent: stats.pendingMentorRequests > 0 },
        { label: 'Total Sessions', value: stats.totalSessions, icon: Calendar, grad: gradients.violet, glow: '#8b5cf6' },
      ]
    : [];

  const page = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#0b0f1a 0%,#111827 60%,#0f172a 100%)',
    padding: '2rem',
    fontFamily: `'Inter','Poppins',sans-serif`,
  };

  const alerts = stats ? [
    stats.pendingMentorRequests > 3 && { type: 'warn',   msg: `${stats.pendingMentorRequests} mentor applications awaiting review.` },
    stats.totalMentors === 0        && { type: 'danger', msg: 'No active mentors on the platform yet.' },
    stats.activeSessions > 15       && { type: 'warn',   msg: `High load — ${stats.activeSessions} sessions scheduled.` },
  ].filter(Boolean) : [];

  const tabs = [
    { id: 'overview', label: 'Overview',  icon: LayoutDashboard },
    { id: 'users',    label: 'All Users', icon: Users },
  ];

  return (
    <div style={page}>

      {/* Tab Nav */}
      <div style={{ display:'flex', gap:'6px', marginBottom:'1.5rem', background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:'14px', padding:'5px', width:'fit-content' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{ display:'flex', alignItems:'center', gap:'7px', padding:'8px 18px', borderRadius:'10px', border:'none', fontWeight:700, fontSize:'0.85rem', cursor:'pointer', transition:'all 0.2s',
              background: activeTab===t.id ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent',
              color: activeTab===t.id ? '#fff' : '#64748b',
              boxShadow: activeTab===t.id ? '0 4px 14px rgba(99,102,241,0.35)' : 'none' }}>
            <t.icon size={15}/>{t.label}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {activeTab==='users' && (
        <div>
          <div style={{ marginBottom:'1.5rem' }}>
            <h2 style={{ margin:0, color:'#f1f5f9', fontWeight:700, fontSize:'1.2rem' }}>User Management</h2>
            <p style={{ margin:'4px 0 0', color:'#64748b', fontSize:'0.82rem' }}>Search, filter and review all registered users</p>
          </div>
          <UsersPanel />
        </div>
      )}

      {/* Overview Tab */}
      {activeTab==='overview' && <>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{ ...glass, padding: '2rem 2.5rem', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '280px', height: '280px', background: 'radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#818cf8', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              <ShieldCheck size={14} /> Admin Control Panel
            </div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
              Welcome, <span style={{ background: 'linear-gradient(90deg,#818cf8,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{user?.name}</span>
            </h1>
            <p style={{ margin: '0.4rem 0 0', color: '#64748b', fontSize: '0.95rem' }}>Manage the mentorship platform and review incoming applications.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link to="/admin/users">
              <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: '12px', padding: '0.65rem 1.4rem', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 20px rgba(99,102,241,0.4)', transition: 'transform 0.2s,box-shadow 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(99,102,241,0.55)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.4)'; }}>
                <Users size={16} /> Manage Users <ChevronRight size={15} />
              </button>
            </Link>
            <button
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '7px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', color: '#f87171', borderRadius: '12px', padding: '0.65rem 1.2rem', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; e.currentTarget.style.boxShadow = '0 0 16px rgba(239,68,68,0.25)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.boxShadow = ''; }}
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {loadingStats
          ? Array(4).fill(0).map((_, i) => (
              <div key={i} style={{ ...glass, height: '130px', animation: 'pulse 1.5s infinite' }} />
            ))
          : statCards.map((s, i) => (
              <div key={i} style={{ ...glass, padding: '1.5rem', cursor: 'default', transition: 'transform 0.25s,box-shadow 0.25s', position: 'relative', overflow: 'hidden', boxShadow: s.urgent ? `0 0 0 1.5px rgba(245,158,11,0.5),0 8px 32px rgba(245,158,11,0.12)` : `0 8px 32px rgba(0,0,0,0.3)` }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'; e.currentTarget.style.boxShadow = `0 0 30px ${s.glow}40,0 12px 40px rgba(0,0,0,0.4)`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = s.urgent ? `0 0 0 1.5px rgba(245,158,11,0.5),0 8px 32px rgba(245,158,11,0.12)` : `0 8px 32px rgba(0,0,0,0.3)`; }}>
                <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', background: `radial-gradient(circle,${s.glow}25 0%,transparent 70%)`, pointerEvents: 'none' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: s.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 14px ${s.glow}55` }}>
                    <s.icon size={20} color="#fff" />
                  </div>
                  {s.urgent && <span style={{ fontSize: '10px', fontWeight: 800, background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '20px', padding: '2px 8px' }}>ACTION</span>}
                </div>
                <p style={{ margin: 0, fontSize: '2.2rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.02em' }}>{s.value}</p>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8' }}>{s.label}</p>
              </div>
            ))}
      </div>

      {/* ── Analytics Row ──────────────────────────────────────────────── */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>

          {/* Bar Chart Card */}
          <div style={{ ...glass, padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <p style={{ margin: 0, color: '#f1f5f9', fontWeight: 700, fontSize: '1rem' }}>Session Analytics</p>
                <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '0.78rem' }}>Platform activity overview</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '6px 10px' }}>
                <TrendingUp size={13} color="#818cf8" />
                <span style={{ color: '#818cf8', fontSize: '0.75rem', fontWeight: 600 }}>Overview</span>
              </div>
            </div>
            <BarChart
              total={stats.totalSessions}
              active={stats.activeSessions}
              completed={stats.totalSessions - stats.activeSessions}
              pending={stats.pendingMentorRequests}
            />
            <div style={{ display: 'flex', gap: '16px', marginTop: '1rem', flexWrap: 'wrap' }}>
              {[['#6366f1', 'Total'], ['#10b981', 'Active'], ['#8b5cf6', 'Done'], ['#f59e0b', 'Pending']].map(([c, l]) => (
                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c, display: 'inline-block', boxShadow: `0 0 6px ${c}` }} />
                  <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Donut Card */}
          <div style={{ ...glass, padding: '1.75rem', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <p style={{ margin: 0, color: '#f1f5f9', fontWeight: 700, fontSize: '1rem' }}>Session Breakdown</p>
              <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '0.78rem' }}>Completed vs Active</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', flex: 1 }}>
              <DonutChart
                total={stats.totalSessions}
                completed={stats.totalSessions - stats.activeSessions}
                active={stats.activeSessions}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                {[
                  { label: 'Completed', value: stats.totalSessions - stats.activeSessions, color: '#6366f1' },
                  { label: 'Active / Upcoming', value: stats.activeSessions, color: '#10b981' },
                  { label: 'Total', value: stats.totalSessions, color: '#8b5cf6' },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600 }}>{item.label}</span>
                      <span style={{ color: '#f1f5f9', fontSize: '0.78rem', fontWeight: 700 }}>{item.value}</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '6px', height: '5px', overflow: 'hidden' }}>
                      <div style={{ width: `${stats.totalSessions > 0 ? (item.value / stats.totalSessions) * 100 : 0}%`, height: '100%', background: item.color, borderRadius: '6px', transition: 'width 0.8s ease', boxShadow: `0 0 8px ${item.color}` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Platform Overview Mini Cards ───────────────────────────────── */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Student Accounts', value: stats.totalStudents, color: '#3b82f6', glow: '#3b82f6' },
            { label: 'Upcoming Sessions', value: stats.activeSessions, color: '#8b5cf6', glow: '#8b5cf6' },
            { label: 'Completed Sessions', value: stats.totalSessions - stats.activeSessions, color: '#10b981', glow: '#10b981' },
          ].map((item, i) => (
            <div key={i} style={{ ...glass, padding: '1.25rem', transition: 'transform 0.25s', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ width: '36px', height: '4px', borderRadius: '4px', background: item.color, marginBottom: '0.75rem', boxShadow: `0 0 8px ${item.glow}` }} />
              <p style={{ margin: 0, fontSize: '1.9rem', fontWeight: 800, color: '#f1f5f9' }}>{item.value}</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>{item.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Pending Mentor Requests Table ──────────────────────────────── */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'linear-gradient(135deg,#f59e0b,#fbbf24)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(245,158,11,0.35)' }}>
              <Sparkles size={18} color="#0f172a" />
            </div>
            <div>
              <h2 style={{ margin: 0, color: '#f1f5f9', fontWeight: 700, fontSize: '1.05rem' }}>Pending Mentor Applications</h2>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.78rem' }}>Review and decide on incoming requests</p>
            </div>
          </div>
          {pendingRequests.length > 0 && (
            <span style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '20px', padding: '4px 14px', fontSize: '0.8rem', fontWeight: 700 }}>
              {pendingRequests.length} pending
            </span>
          )}
        </div>

        {loadingRequests ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Array(3).fill(0).map((_, i) => (
              <div key={i} style={{ ...glass, height: '100px' }} />
            ))}
          </div>
        ) : pendingRequests.length === 0 ? (
          <div style={{ ...glass, padding: '4rem', textAlign: 'center' }}>
            <CheckCircle size={40} color="#10b981" style={{ margin: '0 auto 12px', opacity: 0.6, display: 'block' }} />
            <p style={{ margin: 0, color: '#f1f5f9', fontWeight: 700, fontSize: '1.05rem' }}>All caught up!</p>
            <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '0.85rem' }}>No pending mentor applications right now.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pendingRequests.map(req => (
              <div key={req._id} style={{ ...glass, padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', transition: 'transform 0.2s,box-shadow 0.2s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 24px rgba(99,102,241,0.15),0 8px 32px rgba(0,0,0,0.35)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>

                {/* Avatar + Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '0' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg,rgba(99,102,241,0.3),rgba(139,92,246,0.3))', border: '2px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                    {req.profilePhoto
                      ? <img src={req.profilePhoto} alt={req.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <User size={22} color="#818cf8" />}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ margin: 0, color: '#f1f5f9', fontWeight: 700, fontSize: '0.95rem' }}>{req.name}</h3>
                    <p style={{ margin: '2px 0 4px', color: '#64748b', fontSize: '0.8rem' }}>{req.email}</p>
                    {req.bio && <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '340px' }}>{req.bio}</p>}
                    {req.skills?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '6px' }}>
                        {req.skills.slice(0, 5).map((skill, i) => (
                          <span key={i} style={{ fontSize: '10px', fontWeight: 700, background: 'rgba(99,102,241,0.12)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '20px', padding: '1px 8px' }}>{skill}</span>
                        ))}
                        {req.skills.length > 5 && <span style={{ color: '#475569', fontSize: '10px' }}>+{req.skills.length - 5} more</span>}
                      </div>
                    )}
                    <p style={{ margin: '6px 0 0', color: '#475569', fontSize: '0.72rem' }}>Applied {format(new Date(req.createdAt), 'MMM d, yyyy · h:mm a')}</p>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                  <button
                    onClick={() => handleDecision(req._id, 'reject')}
                    disabled={actionLoading === req._id}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', borderRadius: '10px', padding: '0.5rem 1.1rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; e.currentTarget.style.boxShadow = '0 0 14px rgba(239,68,68,0.25)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.boxShadow = ''; }}>
                    <XCircle size={15} />
                    {actionLoading === req._id ? 'Processing...' : 'Reject'}
                  </button>
                  <button
                    onClick={() => handleDecision(req._id, 'approve')}
                    disabled={actionLoading === req._id}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', color: '#fff', borderRadius: '10px', padding: '0.5rem 1.1rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.35)', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(16,185,129,0.5)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(16,185,129,0.35)'; }}>
                    <CheckCircle size={15} />
                    {actionLoading === req._id ? 'Processing...' : 'Approve'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* System Alerts */}
      {alerts.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <AlertTriangle size={16} color="#f59e0b" />
            <span style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.95rem' }}>System Alerts</span>
          </div>
          {alerts.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', marginBottom: '8px',
              background: a.type === 'danger' ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)',
              border: `1px solid ${a.type === 'danger' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
              <AlertTriangle size={15} color={a.type === 'danger' ? '#f87171' : '#fbbf24'} />
              <span style={{ color: a.type === 'danger' ? '#f87171' : '#fbbf24', fontSize: '0.85rem', fontWeight: 600 }}>{a.msg}</span>
            </div>
          ))}
        </div>
      )}

      </>}
    </div>
  );
}

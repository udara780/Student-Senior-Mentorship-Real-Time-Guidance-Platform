import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Search, User, Shield, GraduationCap, Filter } from 'lucide-react';

const glass = {
  background: 'rgba(255,255,255,0.04)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
};

const roleBadge = (role) => {
  const map = {
    senior:  { bg: 'rgba(99,102,241,0.15)',  color: '#818cf8', label: 'Mentor'  },
    student: { bg: 'rgba(59,130,246,0.15)',  color: '#60a5fa', label: 'Student' },
    admin:   { bg: 'rgba(245,158,11,0.15)',  color: '#fbbf24', label: 'Admin'   },
  };
  const s = map[role] || map.student;
  return (
    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}33`,
      borderRadius: '20px', padding: '2px 10px', fontSize: '11px', fontWeight: 700 }}>
      {s.label}
    </span>
  );
};

const statusBadge = (mentorStatus) => {
  if (mentorStatus === 'approved') return <span style={{ background: 'rgba(16,185,129,0.12)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '20px', padding: '2px 10px', fontSize: '11px', fontWeight: 700 }}>Verified</span>;
  if (mentorStatus === 'pending')  return <span style={{ background: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '20px', padding: '2px 10px', fontSize: '11px', fontWeight: 700 }}>Pending</span>;
  if (mentorStatus === 'rejected') return <span style={{ background: 'rgba(239,68,68,0.12)',  color: '#f87171', border: '1px solid rgba(239,68,68,0.25)',  borderRadius: '20px', padding: '2px 10px', fontSize: '11px', fontWeight: 700 }}>Rejected</span>;
  return null;
};

export default function UsersPanel() {
  const [users, setUsers]       = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage]         = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search)     params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);
      const { data } = await api.get(`/admin/users?${params}`);
      setUsers(data.users);
      setTotal(data.total);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [search, roleFilter, page]);

  return (
    <div>
      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search name or email…"
            style={{ width: '100%', paddingLeft: '34px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#f1f5f9', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        <select
          value={roleFilter}
          onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
          style={{ padding: '8px 14px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#f1f5f9', fontSize: '0.85rem', outline: 'none' }}>
          <option value="">All Roles</option>
          <option value="student">Students</option>
          <option value="senior">Mentors</option>
        </select>
      </div>

      {/* Table */}
      <div style={{ ...glass, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['User', 'Email', 'Role', 'Status', 'Joined'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#64748b', fontWeight: 700, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i}><td colSpan={5} style={{ padding: '14px 16px' }}>
                  <div style={{ height: '18px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', animation: 'pulse 1.5s infinite' }} />
                </td></tr>
              ))
            ) : users.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#475569' }}>No users found.</td></tr>
            ) : (
              users.map(u => (
                <tr key={u._id}
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,rgba(99,102,241,0.3),rgba(139,92,246,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                        {u.profilePhoto ? <img src={u.profilePhoto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={16} color="#818cf8" />}
                      </div>
                      <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{u.email}</td>
                  <td style={{ padding: '12px 16px' }}>{roleBadge(u.role)}</td>
                  <td style={{ padding: '12px 16px' }}>{statusBadge(u.mentorStatus)}</td>
                  <td style={{ padding: '12px 16px', color: '#475569', fontSize: '12px' }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {total > 10 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ color: '#64748b', fontSize: '12px' }}>Showing {users.length} of {total} users</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: page === 1 ? '#334155' : '#94a3b8', cursor: page === 1 ? 'default' : 'pointer', fontSize: '12px' }}>
                Prev
              </button>
              <button onClick={() => setPage(p => p + 1)} disabled={users.length < 10}
                style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: users.length < 10 ? '#334155' : '#94a3b8', cursor: users.length < 10 ? 'default' : 'pointer', fontSize: '12px' }}>
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

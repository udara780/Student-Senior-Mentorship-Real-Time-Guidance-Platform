import React, { useState, useContext, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logoImg from '../assets/hero.png';
import { AuthContext } from '../context/AuthContext';
import { LogOut, X, User, ChevronDown, LayoutDashboard, Bell } from 'lucide-react';

const styles = `
.navbar-container {
  font-family: 'Poppins', sans-serif;
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.25rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-logo {
  font-size: 1.8rem;
  font-weight: 950;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  letter-spacing: -0.05em;
  background: linear-gradient(135deg, #3b82f6 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.navbar-logo:hover {
  transform: scale(1.03) translateY(-1px);
  filter: drop-shadow(0 0 15px rgba(168, 85, 247, 0.3));
}

.navbar-logo-img {
  width: 48px;
  height: 48px;
  object-fit: contain;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-radius: 12px;
}

@media (min-width: 1024px) {
  .navbar-logo-img {
    width: 64px;
    height: 64px;
  }
  .navbar-logo {
    font-size: 2.2rem;
    gap: 1.2rem;
  }
}

.navbar-logo:hover .navbar-logo-img {
  transform: scale(1.1);
}

.navbar-links {
  display: flex;
  gap: 2.5rem;
  align-items: center;
}

.nav-link {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  position: relative;
  transition: all 0.3s ease;
  padding: 0.25rem 0;
}

.nav-link:hover {
  color: white;
}

.nav-link.active {
  color: white;
  font-weight: 600;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0%;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transition: width 0.3s ease;
  border-radius: 2px;
}

.nav-link:hover::after, .nav-link.active::after {
  width: 100%;
}


.mobile-menu-btn {
  display: none;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  animation: navPulse 2s infinite;
}

/* Notification Bell Icon Styles */
.nav-noti-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.5rem;
  text-decoration: none;
  color: #94a3b8;
}

.nav-noti-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
}

.nav-noti-btn:hover .nav-noti-icon-container {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.nav-noti-btn.active .nav-noti-icon-container {
  background: rgba(99, 102, 241, 0.15);
  border-color: rgba(99, 102, 241, 0.3);
  color: #818cf8;
  box-shadow: 0 0 15px rgba(99,102,241,0.2);
}

.nav-noti-badge {
  position: absolute;
  top: 0px;
  right: -2px;
  background: #ef4444;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 0.65rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 0 2px rgba(15,23,42,0.9);
  animation: navPulse 2s infinite;
}

@media (max-width: 768px) {
  .navbar-links {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(15, 23, 42, 0.95);
    backdrop-filter: blur(16px);
    padding: 1.5rem 2rem;
    gap: 1.5rem;
    align-items: flex-start;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
  
  .navbar-links.mobile-open {
    display: flex;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .nav-link::after {
    display: none;
  }
  
  .nav-link {
    width: 100%;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
}

/* ── Logout Confirm Modal ─────────────────────────────────────────────────── */
.logout-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(6px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.15s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.logout-modal {
  background: #1e293b;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  padding: 2.5rem 2.5rem 2rem;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 32px 80px rgba(0,0,0,0.5);
  animation: slideUp 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes slideUp {
  from { transform: translateY(24px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

.logout-modal-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.12);
  border: 2px solid rgba(239,68,68,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
}

.logout-modal h3 {
  color: #f1f5f9;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  letter-spacing: -0.3px;
}

.logout-modal p {
  color: #94a3b8;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0 0 2rem;
}

.logout-modal-actions {
  display: flex;
  gap: 0.75rem;
}

.modal-btn-cancel {
  flex: 1;
  padding: 0.75rem;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.04);
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Poppins', sans-serif;
}

.modal-btn-cancel:hover {
  background: rgba(255,255,255,0.08);
  color: #e2e8f0;
}

.modal-btn-confirm {
  flex: 1;
  padding: 0.75rem;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Poppins', sans-serif;
  box-shadow: 0 4px 16px rgba(239,68,68,0.35);
}

.modal-btn-confirm:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(239,68,68,0.45);
}

/* ── Profile Avatar & Dropdown ───────────────────────────────────────────── */
.nav-avatar-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.nav-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #a855f7 100%);
  border: 2px solid rgba(255,255,255,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.25s ease;
  flex-shrink: 0;
}

.nav-avatar:hover {
  border-color: rgba(168,85,247,0.7);
  box-shadow: 0 0 0 4px rgba(168,85,247,0.15);
  transform: scale(1.05);
}

.nav-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.nav-avatar-initials {
  font-size: 0.95rem;
  font-weight: 700;
  color: white;
  letter-spacing: 0.5px;
  user-select: none;
}

.nav-avatar-chevron {
  color: #94a3b8;
  margin-left: 4px;
  transition: transform 0.2s ease;
  cursor: pointer;
}

.nav-avatar-chevron.open {
  transform: rotate(180deg);
}

.nav-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  min-width: 220px;
  background: rgba(15, 23, 42, 0.97);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.5);
  overflow: hidden;
  animation: dropdownIn 0.18s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 9999;
}

@keyframes dropdownIn {
  from { opacity: 0; transform: translateY(-8px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)   scale(1);    }
}

.nav-dropdown-header {
  padding: 1rem 1.25rem 0.75rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.nav-dropdown-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #f1f5f9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-dropdown-email {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  padding: 0.75rem 1.25rem;
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
  font-family: 'Poppins', sans-serif;
  text-decoration: none;
}

.nav-dropdown-item:hover {
  background: rgba(255,255,255,0.04);
  color: #e2e8f0;
}

.nav-dropdown-item.danger {
  color: #f87171;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.nav-dropdown-item.danger:hover {
  background: rgba(239,68,68,0.08);
  color: #fca5a5;
}

@keyframes navPulse {
  0%, 100% { box-shadow: 0 0 0 2px rgba(15,23,42,0.9), 0 0 0 4px rgba(239,68,68,0); }
  50%       { box-shadow: 0 0 0 2px rgba(15,23,42,0.9), 0 0 0 6px rgba(239,68,68,0.35); }
}

/* --- Notification Dropdown --- */
.nav-noti-dropdown {
  position: absolute;
  top: calc(100% + 1rem);
  right: -80px; 
  width: 340px;
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1.2rem;
  backdrop-filter: blur(16px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
  z-index: 1000;
  max-height: 400px;
  overflow-y: auto;
  cursor: default;
}

@media (max-width: 768px) {
  .nav-noti-dropdown {
    right: 0;
    width: 300px;
  }
}

.nav-noti-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 0.8rem;
  border-radius: 12px;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid transparent;
  color: inherit;
  margin-bottom: 0.5rem;
}
.nav-noti-item:last-child {
  margin-bottom: 0;
}
.nav-noti-item:hover {
  background: rgba(59, 130, 246, 0.08);
  border-color: rgba(59, 130, 246, 0.3);
}

.nav-noti-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: white;
  flex-shrink: 0;
  font-size: 0.9rem;
  object-fit: cover;
}

.nav-noti-text {
  font-size: 0.85rem;
  color: #e2e8f0;
  line-height: 1.4;
  margin: 0 0 0.3rem 0;
}
.nav-noti-time {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
}
`;

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingRequests, setPendingRequests] = useState([]);        // mentorship requests (for mentors)
  const [groupJoinRequests, setGroupJoinRequests] = useState([]);    // group join requests (for leaders)
  const [groupResponses, setGroupResponses] = useState([]);          // group request responses (for students)
  const [inAppNotifications, setInAppNotifications] = useState([]);  // meeting link + general alerts
  const [showNotiDropdown, setShowNotiDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const notiRef = useRef(null);
  const navigate = useNavigate();

  // AuthContext may be undefined on public pages — safe fallback
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const logout = authContext?.logout;

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const confirmLogout = () => {
    if (logout) logout();
    setShowLogoutModal(false);
    setShowDropdown(false);
    navigate('/register');
  };

  // Get user initials for avatar fallback
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (notiRef.current && !notiRef.current.contains(e.target)) {
        setShowNotiDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch all notifications for any logged-in user (mentorship + group)
  useEffect(() => {
    if (!user) return;
    const token = sessionStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchAll = async () => {
      try {
        const results = await Promise.allSettled([
          // Mentorship incoming (for mentors)
          (user.role === 'senior' || user.interestedInMentorship)
            ? fetch('/api/requests/incoming', { headers }).then(r => r.ok ? r.json() : [])
            : Promise.resolve([]),
          // Group join incoming (for group leaders)
          fetch('/api/group-requests/incoming', { headers }).then(r => r.ok ? r.json() : []),
          // Group request responses (for students)
          fetch('/api/group-requests/responses', { headers }).then(r => r.ok ? r.json() : []),
          // In-app notifications (meeting links, etc.) for all users
          fetch('/api/notifications/my', { headers }).then(r => r.ok ? r.json() : []),
        ]);

        const mentorPending  = (results[0].value || []).filter(r => r.status === 'pending');
        const groupIncoming  = results[1].value || [];
        const groupResp      = results[2].value || [];
        const inAppNotifs    = results[3].value || [];

        setPendingRequests(mentorPending);
        setGroupJoinRequests(groupIncoming);
        setGroupResponses(groupResp);
        setInAppNotifications(inAppNotifs);
        setPendingCount(mentorPending.length + groupIncoming.length + groupResp.length + inAppNotifs.length);
      } catch (_) {}
    };

    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, [user]);

  return (
    <>
      <style>{styles}</style>
      <nav className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-logo" onClick={() => navigate('/home')}>
            <img src={logoImg} alt="TeamUp Logo" className="navbar-logo-img" />
            TeamUp
          </div>

          <button className="mobile-menu-btn" onClick={handleMobileMenuToggle}>
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>

          <div className={`navbar-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <NavLink to="/profile/setup" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>Edit Profile</NavLink>
            <NavLink to="/create-group" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>Create Group</NavLink>
            <NavLink to="/find-group" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>Find Group</NavLink>
            <NavLink to="/mentors" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>Request Mentor</NavLink>
            {user && (
              <div
                className={`nav-noti-btn ${showNotiDropdown ? 'active' : ''}`}
                onClick={(e) => {
                   if (e.target.closest('.nav-noti-dropdown')) return;
                   setShowNotiDropdown(!showNotiDropdown);
                }}
                ref={notiRef}
                title="Notifications"
                style={{ cursor: 'pointer', position: 'relative' }}
              >
                <div className="nav-noti-icon-container">
                  <Bell size={20} strokeWidth={2.5} />
                </div>
                {pendingCount > 0 && (
                  <span className="nav-noti-badge">
                    {pendingCount > 9 ? '9+' : pendingCount}
                  </span>
                )}
                
                {/* Unified Notification Dropdown */}
                {showNotiDropdown && (
                  <div className="nav-noti-dropdown" onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.8rem' }}>
                      <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '1.05rem', fontWeight: 800 }}>Notifications</h4>
                      {(user?.role === 'senior' || user?.interestedInMentorship) && (
                        <NavLink
                           to="/inbox"
                           onClick={() => { setShowNotiDropdown(false); closeMenu(); }}
                           style={{ fontSize: '0.8rem', color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}
                        >
                          View Inbox
                        </NavLink>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

                      {/* ── Mentorship requests (view-only, for mentors) ── */}
                      {pendingRequests.map(req => (
                        <div key={`m-${req._id}`} className="nav-noti-item">
                          {req.student?.profilePhoto
                            ? <img src={req.student.profilePhoto} className="nav-noti-avatar" alt="Avatar" />
                            : <div className="nav-noti-avatar">{getInitials(req.student?.name)}</div>
                          }
                          <div style={{ flex: 1 }}>
                            <p className="nav-noti-text">
                              <strong style={{ color: '#fff' }}>{req.student?.name || 'Unknown'}</strong> has requested mentorship
                            </p>
                            <p className="nav-noti-time">{new Date(req.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}

                      {/* ── Group join requests (actionable, for leaders) ── */}
                      {groupJoinRequests.map(req => (
                        <div 
                           key={`g-${req._id}`} 
                           className="nav-noti-item" 
                           style={{ flexDirection: 'column', gap: '0.6rem', cursor: 'pointer' }}
                           onClick={() => { navigate(`/student/${req.student._id}`); closeMenu(); setShowNotiDropdown(false); }}
                           title="Click to view full profile"
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                            {req.student?.profilePhoto
                              ? <img src={req.student.profilePhoto} className="nav-noti-avatar" alt="Avatar" />
                              : <div className="nav-noti-avatar">{getInitials(req.student?.name)}</div>
                            }
                            <div style={{ flex: 1 }}>
                              <p className="nav-noti-text">
                                <strong style={{ color: '#fff' }}>{req.student?.name || 'Unknown'}</strong> requested to join <strong style={{ color: '#a78bfa' }}>{req.group?.moduleName || 'your group'}</strong>
                              </p>
                              <p className="nav-noti-time">{new Date(req.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', paddingLeft: '3rem' }}>
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  const token = sessionStorage.getItem('token');
                                  const res = await fetch(`/api/group-requests/${req._id}/approve`, {
                                    method: 'PUT',
                                    headers: { Authorization: `Bearer ${token}` },
                                  });
                                  if (res.ok) {
                                    setGroupJoinRequests(prev => prev.filter(r => r._id !== req._id));
                                    setPendingCount(c => Math.max(0, c - 1));
                                  }
                                } catch (_) {}
                              }}
                              style={{ flex: 1, padding: '0.35rem 0.6rem', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)', borderRadius: '8px', color: '#4ade80', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
                            >
                              ✓ Accept
                            </button>
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  const token = sessionStorage.getItem('token');
                                  const res = await fetch(`/api/group-requests/${req._id}/reject`, {
                                    method: 'PUT',
                                    headers: { Authorization: `Bearer ${token}` },
                                  });
                                  if (res.ok) {
                                    setGroupJoinRequests(prev => prev.filter(r => r._id !== req._id));
                                    setPendingCount(c => Math.max(0, c - 1));
                                  }
                                } catch (_) {}
                              }}
                              style={{ flex: 1, padding: '0.35rem 0.6rem', background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '8px', color: '#f87171', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
                            >
                              ✕ Reject
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* ── Group response notifications (view-only, for students) ── */}
                      {groupResponses.map(req => (
                        <div key={`gr-${req._id}`} className="nav-noti-item">
                          <div className="nav-noti-avatar" style={{ background: req.status === 'approved' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)' }}>
                            {req.status === 'approved' ? '✓' : '✕'}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p className="nav-noti-text">
                              Your request to join <strong style={{ color: '#a78bfa' }}>{req.group?.moduleName || 'a group'}</strong> was{' '}
                              <strong style={{ color: req.status === 'approved' ? '#4ade80' : '#f87171' }}>
                                {req.status === 'approved' ? 'accepted' : 'rejected'}
                              </strong>
                            </p>
                            <p className="nav-noti-time">{new Date(req.updatedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}

                      {/* ── In-app notifications (meeting links) ── */}
                      {inAppNotifications.map(notif => (
                        <div key={`n-${notif._id}`} className="nav-noti-item">
                          <div className="nav-noti-avatar" style={{ background: 'rgba(99,102,241,0.2)', color: '#818cf8', fontSize: '1rem' }}>
                            🔗
                          </div>
                          <div style={{ flex: 1 }}>
                            <p className="nav-noti-text">{notif.message}</p>
                            {notif.link && notif.type === 'meeting_link' && (
                              <a
                                href={notif.link}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                style={{ fontSize: '0.75rem', color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}
                              >
                                Join Meeting →
                              </a>
                            )}
                            <p className="nav-noti-time">{new Date(notif.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}

                      {/* ── Empty state ── */}
                      {pendingRequests.length === 0 && groupJoinRequests.length === 0 && groupResponses.length === 0 && inAppNotifications.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                          <p style={{ margin: 0, fontSize: '0.9rem' }}>You have no new notifications.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Profile Avatar (top-right, always visible when logged in) ── */}
          {user && (
            <div className="nav-avatar-wrapper" ref={dropdownRef}>
              <div
                className="nav-avatar"
                onClick={() => setShowDropdown(v => !v)}
                title={user.name}
              >
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} alt={user.name} />
                ) : (
                  <span className="nav-avatar-initials">{getInitials(user.name)}</span>
                )}
              </div>
              <ChevronDown
                size={14}
                className={`nav-avatar-chevron ${showDropdown ? 'open' : ''}`}
                onClick={() => setShowDropdown(v => !v)}
              />

              {/* Dropdown */}
              {showDropdown && (
                <div className="nav-dropdown">
                  {/* User info header */}
                  <div className="nav-dropdown-header">
                    <div className="nav-dropdown-name">{user.name}</div>
                    <div className="nav-dropdown-email">{user.email}</div>
                  </div>

                  {/* Dashboard */}
                  <NavLink
                    to="/dashboard"
                    className="nav-dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <LayoutDashboard size={15} />
                    Dashboard
                  </NavLink>

                  {/* Logout */}
                  <button
                    className="nav-dropdown-item danger"
                    onClick={() => { setShowDropdown(false); setShowLogoutModal(true); }}
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* ── Logout Confirm Modal ─────────────────────────────────────────── */}
      {showLogoutModal && (
        <div className="logout-modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="logout-modal" onClick={e => e.stopPropagation()}>
            {/* Close X */}
            <button
              onClick={() => setShowLogoutModal(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div className="logout-modal-icon">
              <LogOut size={32} color="#ef4444" />
            </div>

            <h3>Sign out?</h3>
            <p>
              Are you sure you want to log out of your account?<br />
              You'll need to sign in again to access your dashboard.
            </p>

            <div className="logout-modal-actions">
              <button className="modal-btn-cancel" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>
              <button className="modal-btn-confirm" onClick={confirmLogout}>
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
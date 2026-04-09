import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logoImg from '../assets/hero.png';
import { AuthContext } from '../context/AuthContext';
import { LogOut, X } from 'lucide-react';

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

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.1rem;
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.35);
  border-radius: 10px;
  color: #f87171;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: 'Poppins', sans-serif;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.12);
  border-color: rgba(239, 68, 68, 0.6);
  color: #fca5a5;
  transform: translateY(-1px);
}

.mobile-menu-btn {
  display: none;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
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
`;

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
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
    navigate('/register');
  };

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
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>Request Mentor</NavLink>

            {/* Logout button — only shown when user is logged in */}
            {user && (
              <button
                className="logout-btn"
                onClick={() => { closeMenu(); setShowLogoutModal(true); }}
                title="Log out"
              >
                <LogOut size={16} />
                Logout
              </button>
            )}
          </div>
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
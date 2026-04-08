import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logoImg from '../assets/hero.png';

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
`;

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <style>{styles}</style>
      <nav className="navbar-container">
        <div className="navbar-content">
          <div className="navbar-logo" onClick={() => navigate('/')}>
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
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
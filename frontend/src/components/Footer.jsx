import React from 'react';
import { NavLink } from 'react-router-dom';
import { Mail, Globe, Link as LinkIcon } from 'lucide-react';
import logoImg from '../assets/hero.png';

const styles = `
.footer-container {
  font-family: 'Poppins', sans-serif;
  background: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding: 4rem 2rem 2rem;
  margin-top: auto;
  color: #f8fafc;
  width: 100%;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.footer-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 3rem;
}

.footer-brand {
  max-width: 350px;
}

.footer-logo {
  font-size: 2.2rem;
  font-weight: 950;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.6rem;
  letter-spacing: -0.05em;
  background: linear-gradient(135deg, #3b82f6 0%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.footer-logo:hover {
  transform: scale(1.03) translateY(-1px);
  filter: drop-shadow(0 0 15px rgba(168, 85, 247, 0.3));
}

.footer-logo-img {
  width: 64px;
  height: 64px;
  object-fit: contain;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-radius: 14px;
}

@media (min-width: 1024px) {
  .footer-logo-img {
    width: 80px;
    height: 80px;
  }
  .footer-logo {
    font-size: 1.8rem;
    gap: 1rem;
  }
}

.footer-logo:hover .footer-logo-img {
  transform: scale(1.1);
}

.footer-tagline {
  color: #94a3b8;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.footer-socials {
  display: flex;
  gap: 1.25rem;
}

.social-link {
  color: #94a3b8;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.social-link:hover {
  color: white;
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.4);
  transform: translateY(-3px);
  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.3);
}

.footer-nav {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
}

.nav-group h4 {
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #3b82f6;
  margin-bottom: 1.5rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.footer-link {
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  display: inline-block;
}

.footer-link:hover {
  color: white;
  transform: translateX(5px);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright {
  color: #64748b;
  font-size: 0.9rem;
}

.footer-contact {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-contact:hover {
  color: #3b82f6;
}

@media (max-width: 768px) {
  .footer-container {
    padding: 3rem 1.5rem 1.5rem;
  }

  .footer-top {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .footer-brand {
    max-width: 100%;
  }
  
  .footer-logo {
    justify-content: center;
  }
  
  .footer-socials {
    justify-content: center;
  }
  
  .footer-nav {
    width: 100%;
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
`;

const Footer = () => {
    return (
        <>
            <style>{styles}</style>
            <footer className="footer-container">
                <div className="footer-content">
                    <div className="footer-top">
                        <div className="footer-brand">
                            <NavLink to="/" className="footer-logo">
                                <img src={logoImg} alt="TeamUp Logo" className="footer-logo-img" />
                                TeamUp
                            </NavLink>
                            <p className="footer-tagline">
                                Empowering SLIIT students to collaborate, innovate, and find
                                the perfect project teams for their academic success.
                            </p>
                            <div className="footer-socials">
                                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-link" title="Website">
                                    <Globe size={18} />
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn">
                                    <LinkIcon size={18} />
                                </a>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link" title="Contact">
                                    <Mail size={18} />
                                </a>
                            </div>
                        </div>

                        <div className="footer-nav">
                            <div className="nav-group">
                                <h4>Platform</h4>
                                <div className="footer-links">
                                    <NavLink to="/" className="footer-link">Home</NavLink>
                                    <NavLink to="/profile" className="footer-link">Edit Profile</NavLink>
                                    <NavLink to="/create-group" className="footer-link">Create Group</NavLink>
                                    <NavLink to="/find-group" className="footer-link">Find Group</NavLink>
                                </div>
                            </div>
                            <div className="nav-group">
                                <h4>Support</h4>
                                <div className="footer-links">
                                    <a href="#" className="footer-link">Guidelines</a>
                                    <a href="#" className="footer-link">Help Center</a>
                                    <a href="#" className="footer-link">Terms of Service</a>
                                    <a href="#" className="footer-link">Privacy Policy</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p className="copyright">© 2026 StudentHub. All rights reserved.</p>
                        <a href="mailto:support@studenthub.sliit.lk" className="footer-contact">
                            <Mail size={16} /> contact@studenthub.lk
                        </a>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;

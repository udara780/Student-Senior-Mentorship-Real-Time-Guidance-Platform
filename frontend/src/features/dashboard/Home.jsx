import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImg from '../../assets/colleagues-reading-from-book-study-session.jpg';
import profileImg from '../../assets/Screenshot 2026-03-28 040725.png';
import createGroupImg from '../../assets/10324362.png';
import findGroupImg from '../../assets/front-view-male-student-red-checkered-shirt-with-backpack-holding-files-copybook-thinking-light-blue-wall.jpg';
import mentorImg from '../../assets/diverse-colleague-men-shaking-hands-together.jpg';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
 
:root {
  --primary-color: #3b82f6;
  --primary-hover: #2563eb;
  --accent-1: #10b981;
  --accent-2: #3b82f6;
  --text-muted: #94a3b8;
  --bg-dark: #0f172a;
  --glass-bg: rgba(30, 41, 59, 0.7);
}
 
* { box-sizing: border-box; }

body {
  margin: 0;
  background: radial-gradient(circle at top right, #1e293b 0%, #0f172a 40%, #020617 100%);
  color: white;
  min-height: 100vh;
}
 
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
  font-family: 'Poppins', sans-serif;
}
 
.hero-section {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 650px;
  margin-bottom: 4rem;
  overflow: hidden;
  background-image: url('${heroImg}');
  background-size: cover;
  background-position: center;
  width: 100vw;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}
 
.hero-content-wrapper {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}
 
.hero-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(15,23,42,0.92) 20%, rgba(15,23,42,0.4) 55%, transparent 100%);
  z-index: 0;
}
 
.hero-content {
  position: relative;
  z-index: 1;
  text-align: left;
  max-width: 600px;
}
 
.hero-content h1 {
  font-family: 'Poppins', sans-serif;
  font-size: 4.75rem;
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -0.04em;
  margin-bottom: 1.5rem;
  color: #fff;
}
 
.gradient-text {
  background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
 
.hero-description {
  font-size: 1.15rem;
  line-height: 1.7;
  color: #cbd5e1;
  margin-bottom: 2.75rem;
  max-width: 480px;
  font-weight: 300;
}
 
.hero-cta { margin-bottom: 3.5rem; }
 
.hero-btn {
  padding: 1rem 2.25rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: 'Poppins', sans-serif;
}
 
.hero-btn.primary {
  background: var(--primary-color);
  color: white;
  border: none;
  box-shadow: 0 8px 24px -8px rgba(59,130,246,0.6);
}
 
.hero-btn.primary:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
}
 
.hero-stats { display: flex; gap: 3rem; }
.stat-item { display: flex; flex-direction: column; }
 
.stat-value {
  font-family: 'Poppins', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  color: white;
}
 
.stat-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 500;
}
 
/* ── SECTION TITLE ── */
.widgets-title {
  font-family: 'Poppins', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.widgets-title::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.1), transparent);
}

.widgets-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  align-items: stretch;
}

@media (max-width: 1200px) {
  .widgets-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .widgets-grid {
    grid-template-columns: 1fr;
  }
}

.widget {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(16px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
}

.widget::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  opacity: 0.8;
  z-index: 10;
}

.widget:nth-child(1)::before { background: linear-gradient(90deg, #10b981, #34d399); }
.widget:nth-child(2)::before { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
.widget:nth-child(3)::before { background: linear-gradient(90deg, #3b82f6, #60a5fa); }
.widget:nth-child(4)::before { background: linear-gradient(90deg, #8b5cf6, #c084fc); }

.widget:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
  border-color: rgba(255, 255, 255, 0.2);
}

.widget-image-container {
  width: 100%;
  height: 220px;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--bg-dark);
}

.widget-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.widget:hover .widget-image {
  transform: scale(1.1);
}

.widget-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 2rem;
  width: 100%;
}

.widget-title {
  font-family: inherit;
  font-size: 1.35rem;
  font-weight: 700;
  color: white;
  margin: 0 0 0.75rem 0;
  text-align: center;
}

.widget-desc {
  color: #94a3b8;
  font-size: 1rem;
  line-height: 1.6;
  text-align: center;
  margin: 0 0 1.5rem 0;
}

/* Buttons */
.mt-auto { margin-top: auto; }

.primary-btn {
  background: var(--primary-color);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  width: 100%;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  font-family: inherit;
  margin-top: 1.5rem;
}
.primary-btn:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

@media (max-width: 1024px) {
  .hero-section {
    flex-direction: column;
    text-align: center;
    gap: 3rem;
  }
  .hero-content {
    max-width: 100%;
  }
  .hero-stats {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .hero-content h1 { font-size: 3rem; }
  .home-container { padding: 2rem 1rem; }
}
`;

const Home = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('studentProfile');
        if (saved) setProfile(JSON.parse(saved));
    }, []);

    const getInitials = (name) => {
        if (!name || typeof name !== 'string') return 'ST';
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        if (parts.length === 1 && parts[0]) return parts[0][0].toUpperCase();
        return 'ST';
    };

    return (
        <>
            <style>{styles}</style>
            <Navbar />

            <section className="hero-section">
                <div className="hero-content-wrapper">
                    <div className="hero-content">
                        <h1>Find Your Perfect <br /><span className="gradient-text">Project Team</span></h1>
                        <p className="hero-description">
                            Find the perfect project team, showcase your technical skills,
                            and bring your SLIIT innovation projects to life with a community
                            of talented peers.
                        </p>
                        {/* <div className="hero-cta">
              <button className="hero-btn primary" onClick={() => navigate('/create-group')}>
                Get Started
              </button>
            </div> */}
                        <div className="hero-stats">
                            <div className="stat-item">
                                <span className="stat-value">500+</span>
                                <span className="stat-label">Students</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">120+</span>
                                <span className="stat-label">Groups</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">45+</span>
                                <span className="stat-label">Resources</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="home-container">
                <h2 className="widgets-title">Quick Actions</h2>

                <div className="widgets-grid">

                    {/* Edit Profile Widget */}
                    <div className="widget glass-panel">
                        <div className="widget-image-container">
                            <img src={profileImg} alt="Edit Profile" className="widget-image" loading="eager" fetchPriority="high" decoding="sync" />
                        </div>
                        <div className="widget-content">
                            <h2 className="widget-title">Edit Profile</h2>
                            <p className="widget-desc">Update your personal details</p>
                            <button className="primary-btn mt-auto" onClick={() => navigate('/profile')}>Edit Profile</button>
                        </div>
                    </div>

                    {/* Create Group Widget */}
                    <div className="widget glass-panel">
                        <div className="widget-image-container">
                            <img src={createGroupImg} alt="Create Group" className="widget-image" loading="eager" fetchPriority="high" decoding="sync" />
                        </div>
                        <div className="widget-content">
                            <h2 className="widget-title">Create Group</h2>
                            <p className="widget-desc">Start a group for your module</p>
                            <button className="primary-btn mt-auto" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }} onClick={() => navigate('/create-group')}>Create Group</button>
                        </div>
                    </div>

                    {/* Find a Group Widget */}
                    <div className="widget glass-panel">
                        <div className="widget-image-container">
                            <img src={findGroupImg} alt="Find a Group" className="widget-image" loading="eager" fetchPriority="high" decoding="sync" />
                        </div>
                        <div className="widget-content">
                            <h2 className="widget-title">Find a Group</h2>
                            <p className="widget-desc">Join existing student groups</p>
                            <button className="primary-btn mt-auto" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }} onClick={() => navigate('/find-group')}>Find Group</button>
                        </div>
                    </div>

                    {/* Request Mentor Widget */}
                    <div className="widget glass-panel">
                        <div className="widget-image-container">
                            <img src={mentorImg} alt="Request Mentor" className="widget-image" loading="eager" fetchPriority="high" decoding="sync" />
                        </div>
                        <div className="widget-content">
                            <h2 className="widget-title">Request Mentor</h2>
                            <p className="widget-desc">Connect seniors for guidance.</p>
                            <button className="primary-btn mt-auto" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }} onClick={() => navigate('/mentors')}>Find Mentors</button>
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </>
    );
};

export default Home;
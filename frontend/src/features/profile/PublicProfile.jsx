import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, User, Tag } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const styles = `
.mp-page {
  min-height: 100vh;
  background: #0f172a;
  background-image:
    radial-gradient(circle at 20% 20%, rgba(59,130,246,0.12) 0%, transparent 40%),
    radial-gradient(circle at 80% 80%, rgba(168,85,247,0.12) 0%, transparent 40%);
  padding: 3rem 1.5rem;
  font-family: 'Poppins', sans-serif;
  color: #f1f5f9;
}

.mp-inner {
  max-width: 860px;
  margin: 0 auto;
  animation: mpFadeIn 0.5s ease;
}

@keyframes mpFadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.mp-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.08);
  color: #94a3b8;
  padding: 0.55rem 1.1rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 2.5rem;
  font-family: 'Poppins', sans-serif;
}

.mp-back-btn:hover {
  background: rgba(255,255,255,0.1);
  color: #e2e8f0;
  transform: translateX(-4px);
}

.mp-hero {
  background: rgba(15,23,42,0.85);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px;
  padding: 3rem;
  display: flex;
  gap: 2.5rem;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(16px);
  position: relative;
  overflow: hidden;
}

.mp-hero::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #a855f7);
}

@media (max-width: 640px) {
  .mp-hero { flex-direction: column; align-items: center; text-align: center; }
}

.mp-avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #a855f7);
  border: 3px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 8px 24px rgba(59,130,246,0.3);
}

.mp-avatar img { width: 100%; height: 100%; object-fit: cover; }

.mp-avatar-initials {
  font-size: 2.8rem;
  font-weight: 800;
  color: white;
}

.mp-hero-info { flex: 1; }

.mp-name {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #f1f5f9, #cbd5e1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 0.4rem;
}

.mp-role-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(34,197,94,0.12);
  border: 1px solid rgba(34,197,94,0.25);
  color: #4ade80;
  padding: 0.3rem 0.9rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.mp-bio {
  color: #94a3b8;
  line-height: 1.7;
  font-size: 0.95rem;
  margin: 0.75rem 0 1.25rem;
}

.mp-card {
  background: rgba(15,23,42,0.82);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(12px);
}

.mp-section-title {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.mp-section-title svg { color: #3b82f6; }

.mp-skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.mp-skill-tag {
  background: rgba(59,130,246,0.1);
  border: 1px solid rgba(59,130,246,0.25);
  color: #60a5fa;
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-size: 0.82rem;
  font-weight: 500;
}

.mp-empty {
  color: #64748b;
  font-size: 0.9rem;
  font-style: italic;
}

.mp-skeleton-box {
  background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 12px;
}

@keyframes shimmer {
  0%   { background-position: 200% center; }
  100% { background-position: -200% center; }
}
`;

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return parts.length === 1
    ? parts[0][0].toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function PublicProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setProfileUser(res.data);
      } catch (err) {
        toast.error('Could not load user profile.');
        navigate(-1); // go back if not found
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const skills = Array.isArray(profileUser?.skills) ? profileUser.skills : [];

  return (
    <>
      <style>{styles}</style>
      <div className="mp-page">
        <div className="mp-inner">
          <button className="mp-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={16} /> Go Back
          </button>

          {loading ? (
            // Skeleton
            <div className="mp-hero">
              <div className="mp-skeleton-box" style={{ width: 110, height: 110, borderRadius: '50%' }} />
              <div style={{ flex: 1 }}>
                <div className="mp-skeleton-box" style={{ height: 36, width: '55%', marginBottom: 12 }} />
                <div className="mp-skeleton-box" style={{ height: 20, width: '30%', marginBottom: 20 }} />
                <div className="mp-skeleton-box" style={{ height: 16, width: '90%', marginBottom: 8 }} />
                <div className="mp-skeleton-box" style={{ height: 16, width: '70%', marginBottom: 24 }} />
              </div>
            </div>
          ) : profileUser ? (
            <>
              {/* Hero Card */}
              <div className="mp-hero">
                <div className="mp-avatar">
                  {profileUser.profilePhoto ? (
                    <img src={profileUser.profilePhoto} alt={profileUser.name} />
                  ) : (
                    <span className="mp-avatar-initials">{getInitials(profileUser.name)}</span>
                  )}
                </div>
                <div className="mp-hero-info">
                  <h1 className="mp-name">{profileUser.name}</h1>
                  <div className="mp-role-badge">
                    <User size={13} /> {profileUser.role === 'senior' ? 'Mentor' : 'Student'}
                  </div>
                  {profileUser.studentId && (
                    <p className="mp-bio" style={{ marginBottom: '0.2rem' }}><strong>Student ID:</strong> {profileUser.studentId}</p>
                  )}
                  {profileUser.bio && <p className="mp-bio">{profileUser.bio}</p>}
                </div>
              </div>

              {/* Skills */}
              <div className="mp-card">
                <div className="mp-section-title">
                  <Tag size={18} /> Skills & Expertise
                </div>
                {skills.length > 0 ? (
                  <div className="mp-skills-grid">
                    {skills.map((skill, i) => (
                      <span key={i} className="mp-skill-tag">{skill}</span>
                    ))}
                  </div>
                ) : (
                  <p className="mp-empty">No skills listed yet.</p>
                )}
              </div>

              {/* Bio detail */}
              <div className="mp-card">
                <div className="mp-section-title">
                  <BookOpen size={18} /> About
                </div>
                <p style={{ color: '#94a3b8', lineHeight: 1.75, fontSize: '0.95rem', margin: 0 }}>
                  {profileUser.bio || 'This user has not added a biography yet.'}
                </p>
              </div>

            </>
          ) : null}
        </div>
      </div>
    </>
  );
}

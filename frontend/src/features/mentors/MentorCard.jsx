import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Eye, Send, CheckCircle, Briefcase } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const cardStyles = `
.mentor-card {
  background: rgba(15, 23, 42, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(12px);
}

.mentor-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #3b82f6, #a855f7);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.mentor-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.3);
  border-color: rgba(168, 85, 247, 0.25);
}

.mentor-card:hover::before {
  opacity: 1;
}

/* Sections */
.mc-left {
  flex-shrink: 0;
}

.mc-center {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0; /* for text truncation */
}

.mc-right {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  min-width: 140px;
}

/* Avatar */
.mc-avatar {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #a855f7);
  border: 2px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.mc-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mc-avatar-initials {
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
}

/* Details */
.mc-header-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.mc-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mc-role {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  color: #a855f7;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.2);
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
}

.mc-bio {
  font-size: 0.85rem;
  color: #94a3b8;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.mc-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.2rem;
}

.mc-skill-tag {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.25);
  color: #60a5fa;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;
}

/* Actions */
.mc-btn {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  transition: all 0.2s ease;
  font-family: 'Poppins', sans-serif;
}

.mc-btn-primary {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  box-shadow: 0 4px 12px rgba(59,130,246,0.3);
}

.mc-btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59,130,246,0.4);
}

.mc-btn-primary:disabled {
  background: rgba(59,130,246,0.15);
  color: #60a5fa;
  cursor: not-allowed;
  box-shadow: none;
}

.mc-btn-secondary {
  background: rgba(255,255,255,0.05);
  color: #94a3b8;
  border: 1px solid rgba(255,255,255,0.1);
}

.mc-btn-secondary:hover {
  background: rgba(255,255,255,0.1);
  color: #e2e8f0;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .mentor-card {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }
  
  .mc-header-row {
    justify-content: center;
  }
  
  .mc-skills {
    justify-content: center;
  }
  
  .mc-right {
    width: 100%;
    flex-direction: row;
  }
  
  .mentor-card::before {
    top: 0; left: 0; right: 0; bottom: auto;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #a855f7);
  }
}
`;

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return parts.length === 1
    ? parts[0][0].toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function MentorCard({ mentor, requestStatus, onRequested }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const isRequested = requestStatus === 'pending' || requestStatus === 'accepted';

  const handleRequest = async () => {
    setLoading(true);
    try {
      await api.post('/requests', { seniorId: mentor._id, message: '' });
      toast.success('Mentor request sent successfully! 🎉');
      onRequested(mentor._id);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send request.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const skills = Array.isArray(mentor.skills) ? mentor.skills : [];

  return (
    <>
      <style>{cardStyles}</style>
      <div className="mentor-card">
        {/* LEFT SECTION (Profile) */}
        <div className="mc-left">
          <div className="mc-avatar">
            {mentor.profilePhoto ? (
              <img src={`/${mentor.profilePhoto}`} alt={mentor.name} />
            ) : (
              <span className="mc-avatar-initials">{getInitials(mentor.name)}</span>
            )}
          </div>
        </div>

        {/* CENTER SECTION (Details) */}
        <div className="mc-center">
          <div className="mc-header-row">
            <h3 className="mc-name" title={mentor.name}>{mentor.name}</h3>
            <span className="mc-role">
              <Briefcase size={10} /> Senior Mentor
            </span>
          </div>

          <p className="mc-bio">{mentor.bio || 'Experienced senior Mentor ready to guide students in their academic journey.'}</p>

          {skills.length > 0 && (
            <div className="mc-skills">
              {skills.slice(0, 5).map((skill, i) => (
                <span key={i} className="mc-skill-tag">{skill}</span>
              ))}
              {skills.length > 5 && (
                <span className="mc-skill-tag">+{skills.length - 5}</span>
              )}
            </div>
          )}
        </div>

        {/* RIGHT SECTION (Actions) */}
        <div className="mc-right">
          <button
            className="mc-btn mc-btn-primary"
            onClick={handleRequest}
            disabled={isRequested || loading}
          >
            {isRequested ? (
              <><CheckCircle size={14} /> Requested</>
            ) : loading ? (
              'Sending...'
            ) : (
              <><Send size={14} /> Request</>
            )}
          </button>
          <button
            className="mc-btn mc-btn-secondary"
            onClick={() => navigate(`/mentors/${mentor._id}`)}
          >
            <Eye size={14} /> View Profile
          </button>
        </div>
      </div>
    </>
  );
}

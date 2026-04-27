import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Code, Plus, User, Search, CheckCircle2, AlertCircle, Layers, Crown, Sparkles } from 'lucide-react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import ChatbotToggle from '../../components/ChatbotToggle';

const styles = `
/* ─── Ambient background ──────────────────────────────────────── */
.cg-mesh {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.cg-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: cgFloat 14s ease-in-out infinite;
}
.cg-blob-1 {
  width: 540px; height: 540px;
  top: -120px; right: -80px;
  background: radial-gradient(circle, rgba(59,130,246,0.22) 0%, transparent 70%);
}
.cg-blob-2 {
  width: 480px; height: 480px;
  bottom: -100px; left: -80px;
  background: radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%);
  animation-delay: -7s; animation-direction: reverse;
}
.cg-blob-3 {
  width: 350px; height: 350px;
  top: 45%; left: 35%;
  background: radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%);
  animation-delay: -3s;
}
@keyframes cgFloat {
  0%,100% { transform: translate(0,0) scale(1); }
  33%  { transform: translate(18px,-18px) scale(1.04); }
  66%  { transform: translate(-14px,14px) scale(0.97); }
}

/* ─── Layout ──────────────────────────────────────────────────── */
.cg-container {
  max-width: 820px;
  margin: 0 auto;
  padding: 3.5rem 2rem 5rem;
  position: relative;
  z-index: 1;
}

/* ─── Page header ─────────────────────────────────────────────── */
.cg-page-header {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 2.8rem;
}
.cg-header-icon {
  width: 54px; height: 54px;
  border-radius: 16px;
  background: linear-gradient(135deg, #10b981, #3b82f6);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 20px rgba(16,185,129,0.35);
  flex-shrink: 0;
}
.cg-header-text h1 {
  margin: 0;
  font-size: 2.6rem;
  font-weight: 900;
  background: linear-gradient(135deg, #34d399 0%, #60a5fa 55%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.15;
}
.cg-header-text p {
  margin: 0.35rem 0 0;
  color: #94a3b8;
  font-size: 1.05rem;
}

/* ─── Glass card ──────────────────────────────────────────────── */
.cg-card {
  background: linear-gradient(160deg, rgba(30,41,59,0.85) 0%, rgba(15,23,42,0.95) 100%);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 24px;
  backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
  overflow: hidden;
  margin-bottom: 1.5rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.cg-card:hover {
  border-color: rgba(96,165,250,0.18);
  box-shadow: 0 30px 60px -15px rgba(0,0,0,0.6);
}
.cg-card-bar { height: 4px; width: 100%; }
.bar-teal-blue  { background: linear-gradient(90deg,#10b981,#3b82f6,#8b5cf6); }
.bar-blue-pink  { background: linear-gradient(90deg,#3b82f6,#8b5cf6,#ec4899); }
.bar-green-teal { background: linear-gradient(90deg,#059669,#10b981,#3b82f6); }
.cg-card-body { padding: 2rem; }

/* ─── Section header ──────────────────────────────────────────── */
.cg-section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.6rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.cg-section-icon {
  width: 34px; height: 34px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.si-teal  { background: linear-gradient(135deg,#10b981,#059669); }
.si-blue  { background: linear-gradient(135deg,#3b82f6,#6366f1); }
.si-purple{ background: linear-gradient(135deg,#8b5cf6,#ec4899); }
.cg-section-label {
  font-size: 1rem;
  font-weight: 700;
  color: #f1f5f9;
}
.cg-section-note {
  margin-left: auto;
  font-size: 0.78rem;
  color: #64748b;
  font-weight: 400;
}

/* ─── Form grid & groups ─────────────────────────────────────── */
.cg-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}
@media (max-width: 640px) {
  .cg-form-grid { grid-template-columns: 1fr; }
}
.cg-input-group {
  margin-bottom: 1.2rem;
}
.cg-input-group label {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #cbd5e1;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.cg-label-icon { color: #34d399; }

.cg-input {
  width: 100%;
  background: rgba(8,15,30,0.6);
  border: 1px solid rgba(255,255,255,0.1);
  color: #f1f5f9;
  padding: 0.85rem 1.1rem;
  border-radius: 14px;
  font-size: 0.97rem;
  font-family: inherit;
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  box-shadow: 0 4px 10px rgba(0,0,0,0.15) inset;
  box-sizing: border-box;
}
.cg-input::placeholder { color: #475569; }
.cg-input:focus {
  outline: none;
  border-color: #10b981;
  background: rgba(8,15,30,0.85);
  box-shadow: 0 0 0 3px rgba(16,185,129,0.18), 0 4px 10px rgba(0,0,0,0.15) inset;
  transform: translateY(-1px);
}
.cg-input.cg-error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239,68,68,0.15);
}
.cg-error-msg {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: #f87171;
  font-size: 0.78rem;
  margin-top: 0.4rem;
  font-weight: 500;
}

/* ─── Leader card ────────────────────────────────────────────── */
.cg-leader-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, rgba(59,130,246,0.1), rgba(99,102,241,0.1));
  border: 1px solid rgba(59,130,246,0.25);
  border-radius: 16px;
  padding: 1rem 1.2rem;
  margin-bottom: 1.5rem;
}
.cg-leader-avatar {
  width: 46px; height: 46px;
  border-radius: 50%;
  background: linear-gradient(135deg,#3b82f6,#8b5cf6);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 6px 14px rgba(59,130,246,0.35);
  flex-shrink: 0;
  font-weight: 800;
  font-size: 1.1rem;
  color: white;
}
.cg-leader-info h4 {
  margin: 0 0 0.2rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #f1f5f9;
}
.cg-leader-info p {
  margin: 0;
  font-size: 0.8rem;
  color: #64748b;
}
.cg-leader-badge {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(59,130,246,0.12);
  border: 1px solid rgba(59,130,246,0.25);
  color: #60a5fa;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

/* ─── Max members row ────────────────────────────────────────── */
.cg-max-members-row {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.5rem;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  padding: 0.9rem 1.2rem;
}
.cg-max-members-row label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #cbd5e1;
  flex: 1;
}
.cg-max-input {
  width: 80px;
  background: rgba(8,15,30,0.7);
  border: 1px solid rgba(255,255,255,0.12);
  color: #f1f5f9;
  padding: 0.5rem 0.8rem;
  border-radius: 10px;
  font-size: 1rem;
  font-family: inherit;
  text-align: center;
  transition: all 0.3s;
}
.cg-max-input:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16,185,129,0.15);
}

/* ─── Member slot ────────────────────────────────────────────── */
.cg-member-slot {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 1.1rem 1.2rem;
  margin-bottom: 0.9rem;
  animation: cgSlideIn 0.3s cubic-bezier(0.22,1,0.36,1);
  transition: border-color 0.3s ease;
}
.cg-member-slot:hover {
  border-color: rgba(16,185,129,0.2);
}
@keyframes cgSlideIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.cg-member-slot-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.7rem;
}
.cg-member-num {
  width: 24px; height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg,#10b981,#3b82f6);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.72rem;
  font-weight: 800;
  color: white;
  flex-shrink: 0;
}
.cg-member-slot-header span {
  font-size: 0.83rem;
  font-weight: 600;
  color: #94a3b8;
}
.cg-member-opt {
  font-size: 0.72rem;
  color: #475569;
  margin-left: 0.3rem;
}

/* ─── Profile preview ────────────────────────────────────────── */
.cg-profile-preview {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  background: linear-gradient(135deg,rgba(16,185,129,0.1),rgba(59,130,246,0.08));
  border: 1px solid rgba(16,185,129,0.25);
  padding: 0.75rem 1rem;
  border-radius: 12px;
  margin-top: 0.6rem;
  animation: cgSlideIn 0.25s ease;
}
.cg-preview-avatar {
  width: 36px; height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg,#10b981,#059669);
  display: flex; align-items: center; justify-content: center;
  font-weight: 800;
  font-size: 0.85rem;
  color: white;
  flex-shrink: 0;
}
.cg-preview-info h4 {
  font-size: 0.88rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 0.15rem;
}
.cg-preview-info p {
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
}

/* ─── Submit button ──────────────────────────────────────────── */
.cg-submit-btn {
  width: 100%;
  padding: 1.1rem 2rem;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg,#10b981 0%,#3b82f6 55%,#8b5cf6 100%);
  color: white;
  font-size: 1.1rem;
  font-weight: 800;
  font-family: inherit;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  box-shadow: 0 8px 24px rgba(16,185,129,0.3);
}
.cg-submit-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,rgba(255,255,255,0.12),transparent);
  opacity: 0;
  transition: opacity 0.3s;
}
.cg-submit-btn:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 0 16px 36px rgba(16,185,129,0.4);
}
.cg-submit-btn:hover:not(:disabled)::before { opacity: 1; }
.cg-submit-btn:active { transform: scale(0.98); }
.cg-submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* ─── Entry animations ───────────────────────────────────────── */
@keyframes cgFadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
.cg-anim   { animation: cgFadeUp 0.65s cubic-bezier(0.22,1,0.36,1) forwards; }
.cg-delay1 { animation-delay: 0.1s; opacity: 0; }
.cg-delay2 { animation-delay: 0.2s; opacity: 0; }
.cg-delay3 { animation-delay: 0.3s; opacity: 0; }
`;

const CreateGroup = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    moduleName: '',
    moduleCode: '',
    projectTitle: '',
    maxMembers: 4,
    members: []
  });

  const [allStudents, setAllStudents] = useState([]);
  const [previews, setPreviews] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await api.get('/users/students');
        setAllStudents(response.data);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };
    fetchStudents();
  }, []);

  const handleMaxMembersChange = (e) => {
    const count = parseInt(e.target.value) || 0;
    if (count > 10) return;
    setFormData(prev => {
      const newMembers = [...prev.members];
      if (count - 1 > newMembers.length) {
        for (let i = newMembers.length; i < count - 1; i++) {
          newMembers.push({ studentId: '', name: '' });
        }
      } else {
        newMembers.splice(count - 1);
      }
      return { ...prev, maxMembers: count, members: newMembers };
    });
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...formData.members];
    newMembers[index][field] = value;
    setFormData({ ...formData, members: newMembers });

    if (field === 'studentId') {
      if (value.trim() === '') {
        setPreviews(prev => ({ ...prev, [index]: null }));
        setErrors(prev => ({ ...prev, [`member_${index}`]: null }));
      } else if (value.length >= 10) {
        const foundUser = allStudents.find(u => (u.studentId || u._id) === value);
        if (foundUser) {
          setPreviews(prev => ({ ...prev, [index]: { ...foundUser, academicYear: foundUser.bio?.includes('Year') ? foundUser.bio.split(' ')[0] + ' ' + foundUser.bio.split(' ')[1] : 'Year Not Specified' } }));
          setErrors(prev => ({ ...prev, [`member_${index}`]: null }));
        } else {
          setPreviews(prev => ({ ...prev, [index]: null }));
          setErrors(prev => ({ ...prev, [`member_${index}`]: 'User not found' }));
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) { alert("You must have a profile to create a group!"); return; }

    const filledMembers = formData.members.filter(m => m.studentId.trim() !== '');
    if (filledMembers.some(m => !previews[formData.members.indexOf(m)])) {
      alert("Please ensure all provided member IDs are valid and registered.");
      return;
    }

    const newGroup = {
      leaderId: currentUser.studentId || currentUser._id || 'Unknown',
      leaderName: currentUser.name || 'Unknown',
      moduleName: formData.moduleName,
      moduleCode: formData.moduleCode,
      projectTitle: formData.projectTitle || null,
      maxMembers: formData.maxMembers,
      members: [
        { studentId: currentUser.studentId || currentUser._id || 'LeaderID', name: currentUser.name || 'Leader' },
        ...filledMembers.map(m => ({
          studentId: m.studentId,
          name: previews[formData.members.indexOf(m)]?.name || 'Unknown'
        }))
      ]
    };

    try {
      await api.post('/groups', newGroup);
      alert("Group created successfully!");
      navigate('/find-group');
    } catch (error) {
      console.error('Error creating group:', error);
      const msg = error.response?.data?.message || 'Failed to create group. Please check connection and try again.';
      alert(msg);
    }
  };

  const getInitials = (name = '') => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name[0]?.toUpperCase() || 'L';
  };

  return (
    <>
      <style>{styles}</style>

      {/* Ambient mesh */}
      <div className="cg-mesh" aria-hidden="true">
        <div className="cg-blob cg-blob-1" />
        <div className="cg-blob cg-blob-2" />
        <div className="cg-blob cg-blob-3" />
      </div>

      <div className="cg-container">

        {/* Page Header */}
        <div className="cg-page-header cg-anim">
          <div className="cg-header-icon">
            <Layers size={26} color="white" />
          </div>
          <div className="cg-header-text">
            <h1>Create Project Group</h1>
            <p>Fill in the details to form your academic team</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* ── Module Information Card ──────────────────── */}
          <div className="cg-card cg-anim cg-delay1">
            <div className="cg-card-bar bar-teal-blue" />
            <div className="cg-card-body">
              <div className="cg-section-header">
                <div className="cg-section-icon si-teal">
                  <BookOpen size={17} color="white" />
                </div>
                <span className="cg-section-label">Module Information</span>
              </div>

              <div className="cg-form-grid">
                <div className="cg-input-group">
                  <label><BookOpen size={13} className="cg-label-icon" /> Module Name</label>
                  <input
                    type="text"
                    className="cg-input"
                    placeholder="e.g. IT Project Management"
                    value={formData.moduleName}
                    onChange={(e) => setFormData({ ...formData, moduleName: e.target.value })}
                    required
                  />
                </div>
                <div className="cg-input-group">
                  <label><Code size={13} className="cg-label-icon" /> Module Code</label>
                  <input
                    type="text"
                    className="cg-input"
                    placeholder="e.g. IT3020"
                    value={formData.moduleCode}
                    onChange={(e) => setFormData({ ...formData, moduleCode: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="cg-input-group" style={{ marginBottom: 0 }}>
                <label><Sparkles size={13} className="cg-label-icon" /> Project Title <span style={{ color: '#475569', textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                <input
                  type="text"
                  className="cg-input"
                  placeholder="Enter your project topic..."
                  value={formData.projectTitle}
                  onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* ── Team Composition Card ────────────────────── */}
          <div className="cg-card cg-anim cg-delay2">
            <div className="cg-card-bar bar-blue-pink" />
            <div className="cg-card-body">
              <div className="cg-section-header">
                <div className="cg-section-icon si-blue">
                  <Users size={17} color="white" />
                </div>
                <span className="cg-section-label">Team Composition</span>
                <span className="cg-section-note">Members can be added later</span>
              </div>

              {/* Max members */}
              <div className="cg-max-members-row">
                <label htmlFor="maxMembers" style={{ marginBottom: 0 }}>
                  <Users size={15} style={{ color: '#60a5fa', verticalAlign: 'middle', marginRight: '0.4rem' }} />
                  Maximum Group Size
                </label>
                <input
                  id="maxMembers"
                  type="number"
                  min="2"
                  max="10"
                  className="cg-max-input"
                  value={formData.maxMembers}
                  onChange={handleMaxMembersChange}
                />
              </div>

              {/* Leader slot */}
              <div className="cg-leader-card">
                <div className="cg-leader-avatar">
                  {currentUser?.name ? getInitials(currentUser.name) : 'L'}
                </div>
                <div className="cg-leader-info">
                  <h4>{currentUser?.name || 'Loading profile...'}</h4>
                  <p>{currentUser?.studentId || currentUser?._id || 'ID not set'}</p>
                </div>
                <div className="cg-leader-badge">
                  <Crown size={11} /> Leader
                </div>
              </div>

              {/* Member slots */}
              {formData.members.map((member, index) => (
                <div key={index} className="cg-member-slot">
                  <div className="cg-member-slot-header">
                    <div className="cg-member-num">{index + 2}</div>
                    <span>Member {index + 2} <span className="cg-member-opt">(Optional)</span></span>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'relative' }}>
                      <Search size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
                      <input
                        type="text"
                        className={`cg-input ${errors[`member_${index}`] ? 'cg-error' : ''}`}
                        placeholder="Enter University ID (e.g. IT21004562)"
                        value={member.studentId}
                        onChange={(e) => handleMemberChange(index, 'studentId', e.target.value)}
                        style={{ paddingLeft: '2.5rem' }}
                      />
                    </div>
                    {previews[index] && (
                      <div className="cg-profile-preview">
                        <div className="cg-preview-avatar">
                          {previews[index].name?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="cg-preview-info">
                          <h4>{previews[index].name}</h4>
                          <p>{previews[index].academicYear} • {previews[index].studentId}</p>
                        </div>
                        <CheckCircle2 size={18} color="#10b981" style={{ marginLeft: 'auto', flexShrink: 0 }} />
                      </div>
                    )}
                    {errors[`member_${index}`] && (
                      <p className="cg-error-msg">
                        <AlertCircle size={13} /> {errors[`member_${index}`]}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Submit ──────────────────────────────────── */}
          <div className="cg-anim cg-delay3">
            <button type="submit" className="cg-submit-btn" disabled={!currentUser}>
              <Layers size={20} />
              Create Project Group
            </button>
          </div>

        </form>
      </div>

      <ChatbotToggle />
    </>
  );
};

export default CreateGroup;

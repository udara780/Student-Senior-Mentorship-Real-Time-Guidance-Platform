import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, BookOpen, Code, Plus, Trash2, User, Search, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import ChatbotToggle from '../../components/ChatbotToggle';

const styles = `
.create-group-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.form-card {
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 2.5rem;
  backdrop-filter: blur(12px);
  box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.5);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: #f8fafc;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (max-width: 640px) {
  .form-grid { grid-template-columns: 1fr; }
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.8rem;
  font-size: 0.95rem;
  color: #e2e8f0;
}

.input-field {
  width: 100%;
  background: rgba(15, 23, 42, 0.6);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  transition: all 0.3s;
}

.input-field:focus {
  border-color: #10b981;
  outline: none;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15);
}

.members-section {
  background: rgba(15, 23, 42, 0.3);
  padding: 1.5rem;
  border-radius: 16px;
  margin-bottom: 2rem;
}

.member-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
  align-items: end;
  margin-bottom: 1rem;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.profile-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.8rem;
  border-radius: 12px;
  margin-top: 0.5rem;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.preview-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.preview-info h4 {
  font-size: 0.9rem;
  margin: 0;
}

.preview-info p {
  font-size: 0.8rem;
  color: #94a3b8;
  margin: 0;
}

.submit-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  padding: 1rem;
  border-radius: 12px;
  width: 100%;
  font-weight: 700;
  font-size: 1.1rem;
  margin-top: 1rem;
  transition: all 0.3s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}


.error-text {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.4rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
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
    if (count > 10) return; // Suggested limit
    
    setFormData(prev => {
      const newMembers = [...prev.members];
      if (count - 1 > newMembers.length) {
        // Add fields (count - 1 because leader is excluded)
        for (let i = newMembers.length; i < count - 1; i++) {
          newMembers.push({ studentId: '', name: '' });
        }
      } else {
        // Remove fields
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
    
    if (!currentUser) {
      alert("You must have a profile to create a group!");
      return;
    }

    const filledMembers = formData.members.filter(m => m.studentId.trim() !== '');

    // Validation: Only validate inputs that were actually filled
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

  return (
    <>
      <style>{styles}</style>
      <div className="create-group-container">


        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Create Project Group</h1>
          <p style={{ color: '#94a3b8' }}>Fill in the details to form your academic team</p>
        </header>

        <div className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="section-title">
              <BookOpen size={20} className="form-icon" /> Module Information
            </div>
            
            <div className="form-grid">
              <div className="input-group">
                <label><BookOpen size={18} /> Module Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. IT Project Management" 
                  value={formData.moduleName}
                  onChange={(e) => setFormData({...formData, moduleName: e.target.value})}
                  required 
                />
              </div>
              <div className="input-group">
                <label><Code size={18} /> Module Code</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. IT3020" 
                  value={formData.moduleCode}
                  onChange={(e) => setFormData({...formData, moduleCode: e.target.value})}
                  required 
                />
              </div>
            </div>

            <div className="input-group" style={{ marginBottom: '2.5rem' }}>
              <label><Plus size={18} /> Project Title (Optional)</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Enter project topic (optional)" 
                value={formData.projectTitle}
                onChange={(e) => setFormData({...formData, projectTitle: e.target.value})}
              />
            </div>

            <div className="section-title">
              <Users size={20} className="form-icon" /> Team Composition
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginLeft: 'auto', fontWeight: 'normal' }}>
                * Members can be added later
              </span>
            </div>

            <div className="input-group" style={{ maxWidth: '200px' }}>
              <label>Maximum Members</label>
              <input 
                type="number" 
                min="2" 
                max="10" 
                className="input-field" 
                value={formData.maxMembers}
                onChange={handleMaxMembersChange}
              />
            </div>

            <div className="members-section">
              <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="preview-avatar" style={{ background: '#3b82f6' }}>L</div>
                  <div>
                    <h4 style={{ margin: 0 }}>Group Leader (You)</h4>
                    <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{currentUser?.name || 'Loading profile...'}</p>
                  </div>
                </div>
              </div>

              {formData.members.map((member, index) => (
                <div key={index} className="input-group">
                  <label>Member {index + 2} University ID <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: 'normal' }}>(Optional)</span></label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="text" 
                      className={`input-field ${errors[`member_${index}`] ? 'error' : ''}`}
                      placeholder="e.g. IT21004562" 
                      value={member.studentId}
                      onChange={(e) => handleMemberChange(index, 'studentId', e.target.value)}
                    />
                    {previews[index] && (
                      <div className="profile-preview">
                        <CheckCircle2 size={16} color="#10b981" />
                        <div className="preview-info">
                          <h4>{previews[index].name}</h4>
                          <p>{previews[index].academicYear} • {previews[index].studentId}</p>
                        </div>
                      </div>
                    )}
                    {errors[`member_${index}`] && (
                      <p className="error-text"><AlertCircle size={14} /> {errors[`member_${index}`]}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button type="submit" className="submit-btn" disabled={!currentUser}>
              Create Group
            </button>
          </form>
        </div>
      </div>
      <ChatbotToggle />
    </>
  );
};

export default CreateGroup;

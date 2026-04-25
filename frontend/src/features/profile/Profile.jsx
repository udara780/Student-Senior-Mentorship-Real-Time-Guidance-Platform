import React, { useState, useRef, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Mail, Hash, BookOpen, Calendar,
  Award, Star, Save, Camera, CheckCircle2, AlertCircle,
  GraduationCap, Briefcase, Heart, X
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import ChatbotToggle from '../../components/ChatbotToggle';
const styles = `
:root {
  --primary: #3b82f6;
  --primary-hover: #2563eb;
  --vibrant-accent: #a855f7;
  --bg-dark: #0f172a;
  --card-bg: rgba(15, 23, 42, 0.8);
  --border: rgba(255, 255, 255, 0.1);
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --error: #ef4444;
}

.profile-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 4rem 2rem;
  flex: 1;
  position: relative;
  z-index: 1;
}

/* Background elements for academic theme */
.bg-blob {
  position: fixed;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  z-index: -1;
  filter: blur(60px);
}

.blob-1 { top: -100px; right: -100px; }
.blob-2 { bottom: -100px; left: -100px; }

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 3.5rem;
}


.header-text h1 {
  font-size: 2.8rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, var(--text-main), #cbd5e1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}

.header-text p {
  margin: 0.5rem 0 0 0;
  color: var(--text-muted);
  font-size: 1.1rem;
}

.profile-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2.5rem;
}

@media (max-width: 900px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }
}

.column-sticky {
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.profile-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
  border-radius: 24px;
  padding: 2.5rem;
  backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.profile-card:hover {
  border-color: rgba(16, 185, 129, 0.3);
}

.profile-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 4px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
}

.avatar-wrapper {
  position: relative;
  width: 140px;
  height: 140px;
  margin: 0 auto 1.5rem;
}

.avatar-large {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border: 3px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
}

.avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  font-weight: 800;
  font-size: 3.5rem;
  color: var(--primary);
}

.camera-btn {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background: var(--primary);
  color: white;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 3px solid #1e293b;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.camera-btn:hover {
  transform: scale(1.1);
  background: var(--primary-hover);
}

.text-center { text-align: center; }

.section-title {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

@media (max-width: 640px) {
  .form-grid { grid-template-columns: 1fr; }
}

.form-group {
  margin-bottom: 1.8rem;
  position: relative;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 500;
  margin-bottom: 0.8rem;
  color: #e2e8f0;
  font-size: 0.95rem;
}

.form-icon {
  color: var(--primary);
}

.input-field {
  width: 100%;
  background: rgba(15, 23, 42, 0.6);
  border: 1.5px solid var(--border);
  color: white;
  padding: 1rem 1.2rem;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s;
}

.input-field:focus {
  outline: none;
  border-color: var(--primary);
  background: rgba(15, 23, 42, 0.9);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
}

select.input-field {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%233b82f6' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1.2rem center;
  background-size: 1.2rem;
  padding-right: 3rem;
  cursor: pointer;
  color: white;
}

select.input-field option {
  background-color: #0f172a;
  color: white;
  padding: 1rem;
}

select.input-field:invalid, 
select.input-field option[value=""] {
  color: #64748b;
}

.input-field.error {
  border-color: var(--error);
}

.error-message {
  color: var(--error);
  font-size: 0.8rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.success-icon {
  position: absolute;
  right: 1.2rem;
  top: 3rem;
  color: var(--primary);
}

.mentorship-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(16, 185, 129, 0.05);
  padding: 1.2rem;
  border-radius: 16px;
  border: 1px dashed rgba(16, 185, 129, 0.3);
  margin-bottom: 2rem;
}

.toggle-info h4 {
  margin: 0;
  color: var(--text-main);
  font-size: 1rem;
}

.toggle-info p {
  margin: 0.3rem 0 0 0;
  color: var(--text-muted);
  font-size: 0.85rem;
}

.switch {
  position: relative;
  display: inline-block;
  width: 54px;
  height: 28px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #334155;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--primary);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.save-btn {
  background: linear-gradient(135deg, var(--primary), var(--primary-hover));
  color: white;
  border: none;
  padding: 1.2rem 2rem;
  border-radius: 14px;
  font-size: 1.2rem;
  font-weight: 700;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4);
}

.save-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 30px -5px rgba(16, 185, 129, 0.6);
}

.save-btn:active {
  transform: translateY(0);
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 1.2rem;
  justify-content: center;
}

.skill-tag {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399;
  padding: 0.4rem 0.9rem;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 500;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease forwards;
}
`;

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user, updateProfile, updateProfilePhoto } = useContext(AuthContext);

  // Apply dark background to the full page while this component is mounted
  useEffect(() => {
    const prevBg = document.body.style.backgroundColor;
    const prevImage = document.body.style.backgroundImage;
    const prevAttch = document.body.style.backgroundAttachment;

    document.body.style.backgroundColor = '#0f172a';
    document.body.style.backgroundImage =
      'radial-gradient(circle at 15% 50%, rgba(99, 102, 241, 0.15), transparent 25%), ' +
      'radial-gradient(circle at 85% 30%, rgba(192, 132, 252, 0.15), transparent 25%)';
    document.body.style.backgroundAttachment = 'fixed';

    return () => {
      document.body.style.backgroundColor = prevBg;
      document.body.style.backgroundImage = prevImage;
      document.body.style.backgroundAttachment = prevAttch;
    };
  }, []);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    studentId: user?.studentId || '',
    email: user?.email || '',
    academicYear: user?.academicYear || '',
    semester: user?.semester || '',
    gpa: user?.gpa || '',
    skills: Array.isArray(user?.skills) ? user.skills.join(', ') : '',
    interestedInMentorship: user?.interestedInMentorship || false,
    profilePic: user?.profilePhoto || null
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        studentId: user.studentId || '',
        email: user.email || '',
        academicYear: user.academicYear || '',
        semester: user.semester || '',
        gpa: user.gpa || '',
        skills: Array.isArray(user.skills) ? user.skills.join(', ') : '',
        interestedInMentorship: user.interestedInMentorship || false,
        profilePic: user.profilePhoto || null
      });
    }
  }, [user]);

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);

  // Validation Logic
  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Full name is required';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = 'Full Name must contain only alphabetic characters (letters and spaces)';
        }
        break;

      case 'studentId':
        const idRegex = /^[A-Z]{2}\d{8}$/;
        if (!value) error = 'Student ID is required';
        else if (!idRegex.test(value)) error = 'Format: 2 letters + 8 digits (e.g., IT21004562)';
        break;

      case 'email':
        if (!value) error = 'University email is required';
        else if (!value.endsWith('@my.sliit.lk')) error = 'Must end with @my.sliit.lk';
        else {
          const idInEmail = value.split('@')[0];
          if (idInEmail !== formData.studentId) error = 'Email ID must match Student ID';
        }
        break;

      case 'gpa':
        if (value === '') {
          error = 'GPA is required';
        } else {
          const gpaNum = parseFloat(value);
          if (isNaN(gpaNum)) {
            error = 'GPA must be a numeric value';
          } else if (gpaNum < 0 || gpaNum > 4.0) {
            error = 'GPA must be between 0.0 and 4.0';
          }
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === 'checkbox' ? checked : value;

    // Strict input filtering for Full Name
    if (name === 'name') {
      // Automatically remove numbers and special characters in real-time
      val = val.replace(/[^a-zA-Z\s]/g, '');
    }

    setFormData(prev => ({ ...prev, [name]: val }));

    // Clear error when typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Special case: if studentId changes, validate email consistency
    if (name === 'studentId') {
      const emailError = validateField('email', formData.email);
      setErrors(prev => ({ ...prev, studentId: validateField('studentId', value), email: emailError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size too large. Please select an image under 5MB.');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Only validate fields that have a validation rule
    const fieldsToValidate = ['name', 'studentId', 'email', 'gpa'];
    const newErrors = {};
    fieldsToValidate.forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error(Object.values(newErrors)[0]);
      return;
    }

    setIsSubmitted(true);
    try {
      // 1. Upload photo if a new one was selected
      if (photoFile) {
        const fd = new FormData();
        fd.append('profilePhoto', photoFile);
        const photoResult = await updateProfilePhoto(fd);
        if (!photoResult.success) {
          setIsSubmitted(false);
          return;
        }
      }

      // 2. Save details to the backend
      const skillsArray = formData.skills
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const requestPayload = {
        name: formData.name,
        interestedInMentorship: formData.interestedInMentorship,
        skills: skillsArray,
      };

      if (formData.studentId) requestPayload.studentId = formData.studentId;
      if (formData.academicYear) requestPayload.academicYear = formData.academicYear;
      if (formData.semester) requestPayload.semester = formData.semester;
      if (formData.gpa !== '') requestPayload.gpa = Number(formData.gpa);

      const result = await updateProfile(requestPayload);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setIsSubmitted(false);
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong. Please try again.');
      setIsSubmitted(false);
    }
  };

  const splitSkills = formData.skills.split(',').map(s => s.trim()).filter(s => s);

  const getInitials = (name) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    if (parts.length === 1 && parts[0]) return parts[0][0].toUpperCase();
    return 'ST';
  };

  return (
    <>
      <style>{styles}</style>

      <div className="bg-blob blob-1"></div>
      <div className="bg-blob blob-2"></div>

      <div className="profile-container animate-fade-in">
        <div className="profile-header">

          <div className="header-text">
            <h1>Student Portal</h1>
            <p>Academic Profile & Group Management</p>
          </div>
        </div>

        <div className="profile-layout">

          {/* Identity Column */}
          <div className="column-sticky">
            <div className="profile-card text-center">
              <div className="avatar-wrapper">
                <div className="avatar-large">
                  {formData.profilePic ? (
                    <img
                      src={
                        formData.profilePic.startsWith('data:')
                          ? formData.profilePic
                          : `http://localhost:5000${formData.profilePic}`
                      }
                      alt="Profile"
                    />
                  ) : (
                    <span className="avatar-initials">{getInitials(formData.name)}</span>
                  )}
                </div>
                <div className="camera-btn" onClick={triggerFileInput} title="Upload Profile Picture">
                  <Camera size={18} />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
              </div>

              <h2 style={{ fontSize: '1.6rem', marginBottom: '0.4rem', color: '#f8fafc' }}>
                {formData.name || 'Student Name'}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>{formData.studentId || 'ID Pending'}</span>
                {formData.studentId && !errors.studentId && <CheckCircle2 size={14} className="form-icon" />}
              </div>

              <div className="mentorship-toggle">
                <div className="toggle-info" style={{ textAlign: 'left' }}>
                  <h4>Mentorship</h4>
                  {/* Status-aware label */}
                  {user?.mentorStatus === 'pending' && (
                    <p style={{ color: '#f59e0b', fontWeight: 600, fontSize: '0.8rem', margin: '2px 0 0' }}>
                      ⏳ Request Pending — awaiting admin review
                    </p>
                  )}
                  {user?.mentorStatus === 'approved' && (
                    <p style={{ color: '#10b981', fontWeight: 700, fontSize: '0.8rem', margin: '2px 0 0' }}>
                      ✅ Verified Mentor
                    </p>
                  )}
                  {user?.mentorStatus === 'rejected' && (
                    <p style={{ color: '#ef4444', fontWeight: 600, fontSize: '0.8rem', margin: '2px 0 0' }}>
                      ❌ Rejected — toggle to re-apply
                    </p>
                  )}
                  {(!user?.mentorStatus || user?.mentorStatus === 'none') && (
                    <p>{formData.interestedInMentorship ? 'Open to mentor' : 'Not interested'}</p>
                  )}
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    name="interestedInMentorship"
                    checked={formData.interestedInMentorship}
                    onChange={handleChange}
                    disabled={user?.mentorStatus === 'pending' || user?.mentorStatus === 'approved'}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div style={{ textAlign: 'left', marginTop: '1rem' }}>
                <div className="section-title" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
                  <Star size={16} /> Expertise Area
                </div>
                <div className="skills-tags">
                  {splitSkills.length > 0 ? (
                    splitSkills.map((skill, i) => (
                      <span key={i} className="skill-tag">{skill}</span>
                    ))
                  ) : (
                    <span className="text-muted" style={{ width: '100%', textAlign: 'center' }}>No skills listed</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Details Form Column */}
          <div className="profile-card">
            <form onSubmit={handleSave} noValidate>
              <div className="section-title">
                <GraduationCap size={20} /> Personal & Academic Credentials
              </div>

              <div className="form-group">
                <label><User size={18} className="form-icon" /> Full Name</label>
                <input
                  type="text"
                  name="name"
                  className={`input-field ${errors.name ? 'error' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Full Name (e.g., Binuja Fernando)"
                  required
                />
                {errors.name && <div className="error-message"><AlertCircle size={14} /> {errors.name}</div>}
                {!errors.name && formData.name && <CheckCircle2 size={18} className="success-icon" />}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label><Hash size={18} className="form-icon" /> Student ID</label>
                  <input
                    type="text"
                    name="studentId"
                    className={`input-field ${errors.studentId ? 'error' : ''}`}
                    value={formData.studentId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Student ID (e.g., IT21004562)"
                    required
                  />
                  {errors.studentId && <div className="error-message"><AlertCircle size={14} /> {errors.studentId}</div>}
                  {!errors.studentId && formData.studentId && <CheckCircle2 size={18} className="success-icon" />}
                </div>

                <div className="form-group">
                  <label><Mail size={18} className="form-icon" /> University Email</label>
                  <input
                    type="email"
                    name="email"
                    className={`input-field ${errors.email ? 'error' : ''}`}
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter University Email (e.g., IT21...)"
                    required
                  />
                  {errors.email && <div className="error-message"><AlertCircle size={14} /> {errors.email}</div>}
                  {!errors.email && formData.email && <CheckCircle2 size={18} className="success-icon" />}
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label><BookOpen size={18} className="form-icon" /> Academic Year</label>
                  <select
                    name="academicYear"
                    className="input-field"
                    value={formData.academicYear}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="Year 1">Year 1</option>
                    <option value="Year 2">Year 2</option>
                    <option value="Year 3">Year 3</option>
                    <option value="Year 4">Year 4</option>
                  </select>
                </div>

                <div className="form-group">
                  <label><Calendar size={18} className="form-icon" /> Current Semester</label>
                  <select
                    name="semester"
                    className="input-field"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Semester</option>
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                  </select>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label><Award size={18} className="form-icon" /> Current GPA</label>
                  <input
                    type="number"
                    step="0.01"
                    name="gpa"
                    className={`input-field ${errors.gpa ? 'error' : ''}`}
                    value={formData.gpa}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter GPA (e.g., 3.80)"
                  />
                  {errors.gpa && <div className="error-message"><AlertCircle size={14} /> {errors.gpa}</div>}
                </div>

                <div className="form-group">
                  <label><Briefcase size={18} className="form-icon" /> Special Skills</label>
                  <input
                    type="text"
                    name="skills"
                    className="input-field"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="Enter Skills (e.g., React, Java, UI/UX...)"
                  />
                </div>
              </div>

              <button type="submit" className="save-btn" disabled={isSubmitted}>
                {isSubmitted ? (
                  <>Processing...</>
                ) : (
                  <>
                    <Save size={22} />
                    Sync Academic Profile
                  </>
                )}
              </button>

              <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                <Heart size={14} style={{ color: 'var(--error)' }} /> Information is strictly used for group matching only.
              </p>
            </form>
          </div>

        </div>
      </div>
      <ChatbotToggle />
    </>
  );
};

export default Profile;

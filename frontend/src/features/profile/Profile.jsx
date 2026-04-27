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
  --primary-dark: #2563eb;
  --accent: #a855f7;
  --accent-2: #ec4899;
  --emerald: #10b981;
  --bg-dark: #0f172a;
  --card-bg: rgba(15, 23, 42, 0.75);
  --border: rgba(255, 255, 255, 0.08);
  --border-hover: rgba(96, 165, 250, 0.4);
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
  --error: #ef4444;
  --success: #10b981;
}

/* ─── Profile Page Styles ──────────────────────────────────────────────────── */

.profile-page-root {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

/* Ambient mesh background */
.profile-mesh {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.profile-mesh-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.55;
}
.pmb-1 {
  width: 600px; height: 600px;
  top: -150px; right: -100px;
  background: radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%);
  animation: blobFloat 12s ease-in-out infinite;
}
.pmb-2 {
  width: 500px; height: 500px;
  bottom: -120px; left: -80px;
  background: radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%);
  animation: blobFloat 15s ease-in-out infinite reverse;
}
.pmb-3 {
  width: 400px; height: 400px;
  top: 40%; left: 40%;
  background: radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%);
  animation: blobFloat 10s ease-in-out infinite 2s;
}
@keyframes blobFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(20px, -20px) scale(1.05); }
  66% { transform: translate(-15px, 15px) scale(0.97); }
}

.profile-container {
  max-width: 1050px;
  margin: 0 auto;
  padding: 3.5rem 2rem 5rem;
  position: relative;
  z-index: 1;
}

/* ── Page header ─────────────────────── */
.profile-page-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 3rem;
}
.profile-page-header .pph-icon-wrap {
  width: 56px; height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 20px rgba(59,130,246,0.4);
  flex-shrink: 0;
}
.pph-text h1 {
  margin: 0;
  font-size: 2.6rem;
  font-weight: 900;
  background: linear-gradient(135deg, #60a5fa 0%, #c084fc 55%, #f472b6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.15;
}
.pph-text p {
  margin: 0.4rem 0 0;
  color: #94a3b8;
  font-size: 1.05rem;
}

/* ── Layout ──────────────────────────── */
.profile-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  align-items: start;
}
@media (max-width: 900px) {
  .profile-layout { grid-template-columns: 1fr; }
}

.column-sticky {
  position: sticky;
  top: 2rem;
  height: fit-content;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ── Generic glass card ──────────────── */
.pg-card {
  background: linear-gradient(160deg, rgba(30,41,59,0.85) 0%, rgba(15,23,42,0.95) 100%);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 24px;
  backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
  position: relative;
}
.pg-card:hover {
  border-color: rgba(96,165,250,0.2);
  box-shadow: 0 30px 60px -15px rgba(0,0,0,0.6);
}
.pg-card-top-bar {
  height: 4px;
  width: 100%;
}
.bar-blue-purple  { background: linear-gradient(90deg,#3b82f6,#8b5cf6,#ec4899); }
.bar-green-blue   { background: linear-gradient(90deg,#10b981,#3b82f6); }

.pg-card-body {
  padding: 2rem;
}
@media (max-width: 640px) {
  .pg-card-body { padding: 1.5rem; }
}

/* ── Avatar section ──────────────────── */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  margin-bottom: 1.5rem;
}
.avatar-ring-wrapper {
  position: relative;
  width: 120px; height: 120px;
  margin-bottom: 1.2rem;
}
.avatar-glow-ring {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: linear-gradient(135deg,#3b82f6,#a855f7,#ec4899);
  opacity: 0.7;
  filter: blur(6px);
  z-index: 0;
  animation: ringPulse 3s ease-in-out infinite;
}
@keyframes ringPulse {
  0%,100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 0.9; transform: scale(1.04); }
}
.avatar-circle {
  position: relative;
  z-index: 1;
  width: 120px; height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg,#1e293b,#0f172a);
  border: 3px solid rgba(255,255,255,0.1);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(0,0,0,0.4);
}
.avatar-circle img {
  width: 100%; height: 100%;
  object-fit: cover;
}
.avatar-initials-large {
  font-size: 3.2rem;
  font-weight: 900;
  background: linear-gradient(135deg,#60a5fa,#c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.camera-trigger {
  position: absolute;
  z-index: 2;
  bottom: 0; right: 0;
  width: 36px; height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg,#3b82f6,#8b5cf6);
  border: 2px solid #0f172a;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175,0.885,0.32,1.275);
  box-shadow: 0 4px 12px rgba(59,130,246,0.4);
}
.camera-trigger:hover {
  transform: scale(1.15);
  box-shadow: 0 6px 20px rgba(139,92,246,0.5);
}
.avatar-name {
  font-size: 1.4rem;
  font-weight: 800;
  color: #f8fafc;
  margin: 0 0 0.3rem;
  text-align: center;
}
.avatar-id-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(59,130,246,0.1);
  border: 1px solid rgba(59,130,246,0.25);
  padding: 0.3rem 0.9rem;
  border-radius: 20px;
  color: #60a5fa;
  font-size: 0.85rem;
  font-weight: 600;
}

/* ── Mentorship toggle ───────────────── */
.mentorship-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: linear-gradient(135deg, rgba(16,185,129,0.07) 0%, rgba(59,130,246,0.07) 100%);
  border: 1px solid rgba(16,185,129,0.2);
  border-radius: 16px;
  padding: 1rem 1.2rem;
}
.mentorship-card-icon {
  width: 38px; height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg,#10b981,#3b82f6);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.toggle-info h4 {
  margin: 0 0 0.2rem;
  font-size: 0.95rem;
  font-weight: 700;
  color: #f8fafc;
}
.toggle-info p {
  margin: 0;
  font-size: 0.8rem;
  color: #94a3b8;
}
.switch {
  position: relative;
  display: inline-block;
  width: 52px; height: 26px;
  flex-shrink: 0;
}
.switch input { opacity: 0; width: 0; height: 0; }
.pf-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: #334155;
  border-radius: 34px;
  transition: 0.35s;
}
.pf-slider:before {
  content: '';
  position: absolute;
  width: 18px; height: 18px;
  left: 4px; bottom: 4px;
  background: white;
  border-radius: 50%;
  transition: 0.35s;
}
input:checked + .pf-slider {
  background: linear-gradient(135deg,#10b981,#3b82f6);
}
input:checked + .pf-slider:before {
  transform: translateX(26px);
}

/* ── Skills preview ──────────────────── */
.skills-preview-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.8rem;
}
.skills-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.skill-pill {
  background: linear-gradient(135deg,rgba(59,130,246,0.12),rgba(139,92,246,0.12));
  border: 1px solid rgba(96,165,250,0.25);
  color: #a5b4fc;
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  transition: all 0.2s ease;
}
.skill-pill:hover {
  background: linear-gradient(135deg,rgba(59,130,246,0.25),rgba(139,92,246,0.25));
  border-color: rgba(96,165,250,0.5);
  transform: translateY(-2px);
}
.skills-cloud-empty {
  color: #475569;
  font-size: 0.85rem;
  font-style: italic;
}

/* ── Form card ───────────────────────── */
.form-section-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.8rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.fsh-icon {
  width: 36px; height: 36px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.fsh-icon-blue   { background: linear-gradient(135deg,#3b82f6,#6366f1); }
.fsh-icon-purple { background: linear-gradient(135deg,#8b5cf6,#ec4899); }
.fsh-label {
  font-size: 1rem;
  font-weight: 700;
  color: #f1f5f9;
}

.pf-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
}
@media (max-width: 640px) {
  .pf-form-grid { grid-template-columns: 1fr; }
}

.pf-form-group {
  position: relative;
  margin-bottom: 1.4rem;
}
.pf-form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.88rem;
  font-weight: 600;
  color: #cbd5e1;
  margin-bottom: 0.55rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.pf-label-icon { color: #60a5fa; }

.pf-input {
  width: 100%;
  background: rgba(8, 15, 30, 0.6);
  border: 1px solid rgba(255,255,255,0.1);
  color: #f1f5f9;
  padding: 0.9rem 1.1rem;
  border-radius: 14px;
  font-size: 0.97rem;
  font-family: inherit;
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  box-shadow: 0 4px 10px rgba(0,0,0,0.15) inset;
  box-sizing: border-box;
}
.pf-input::placeholder { color: #475569; }
.pf-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: rgba(8,15,30,0.85);
  box-shadow: 0 0 0 3px rgba(59,130,246,0.18), 0 4px 10px rgba(0,0,0,0.15) inset;
  transform: translateY(-1px);
}
.pf-input.pf-error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239,68,68,0.15);
}
.pf-input.pf-valid {
  border-color: rgba(16,185,129,0.5);
}

select.pf-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='%2360a5fa' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
  padding-right: 2.8rem;
  cursor: pointer;
}
select.pf-input option {
  background: #0f172a;
  color: #f1f5f9;
}

.pf-error-msg {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  color: #f87171;
  font-size: 0.78rem;
  margin-top: 0.35rem;
  font-weight: 500;
}
.pf-success-icon {
  position: absolute;
  right: 1rem;
  bottom: 0.95rem;
  color: #34d399;
  pointer-events: none;
}

.pf-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
  margin: 2rem 0;
}

/* ── Save button ─────────────────────── */
.save-btn-wrap { margin-top: 0.5rem; }
.pf-save-btn {
  width: 100%;
  padding: 1.1rem 2rem;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg,#3b82f6 0%,#8b5cf6 60%,#ec4899 100%);
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
  box-shadow: 0 8px 24px rgba(99,102,241,0.35);
}
.pf-save-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg,rgba(255,255,255,0.15),transparent);
  opacity: 0;
  transition: opacity 0.3s;
}
.pf-save-btn:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 0 16px 36px rgba(99,102,241,0.5);
}
.pf-save-btn:hover:not(:disabled)::before { opacity: 1; }
.pf-save-btn:active { transform: scale(0.98); }
.pf-save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.pf-save-btn .btn-spinner {
  width: 20px; height: 20px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.pf-privacy-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  margin-top: 1.2rem;
  color: #475569;
  font-size: 0.82rem;
}

/* ── Entry animations ────────────────── */
@keyframes slideUpFade {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: slideUpFade 0.7s cubic-bezier(0.22,1,0.36,1) forwards;
}
.anim-delay-1 { animation-delay: 0.1s; opacity: 0; }
.anim-delay-2 { animation-delay: 0.2s; opacity: 0; }
.anim-delay-3 { animation-delay: 0.3s; opacity: 0; }
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

      {/* Ambient mesh */}
      <div className="profile-mesh" aria-hidden="true">
        <div className="profile-mesh-blob pmb-1" />
        <div className="profile-mesh-blob pmb-2" />
        <div className="profile-mesh-blob pmb-3" />
      </div>

      <div className="profile-container">

        {/* ── Page Header ─────────────────── */}
        <div className="profile-page-header animate-fade-in">
          <div className="pph-icon-wrap">
            <GraduationCap size={26} color="white" />
          </div>
          <div className="pph-text">
            <h1>Student Portal</h1>
            <p>Academic Profile &amp; Group Management</p>
          </div>
        </div>

        <div className="profile-layout">

          {/* ── Left sticky column ─────────── */}
          <div className="column-sticky">

            {/* Avatar / identity card */}
            <div className="pg-card animate-fade-in anim-delay-1">
              <div className="pg-card-top-bar bar-blue-purple" />
              <div className="pg-card-body">

                <div className="avatar-section">
                  <div className="avatar-ring-wrapper">
                    <div className="avatar-glow-ring" />
                    <div className="avatar-circle">
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
                        <span className="avatar-initials-large">{getInitials(formData.name)}</span>
                      )}
                    </div>
                    <div className="camera-trigger" onClick={triggerFileInput} title="Change Photo">
                      <Camera size={15} color="white" />
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      style={{ display: 'none' }}
                    />
                  </div>

                  <h2 className="avatar-name">{formData.name || 'Your Name'}</h2>
                  <div className="avatar-id-badge">
                    <Hash size={12} />
                    {formData.studentId || 'ID Pending'}
                    {formData.studentId && !errors.studentId && <CheckCircle2 size={12} style={{ color: '#34d399' }} />}
                  </div>
                </div>

                {/* Mentorship toggle */}
                <div className="mentorship-card">
                  <div className="mentorship-card-icon">
                    <Heart size={18} color="white" />
                  </div>
                  <div className="toggle-info" style={{ flex: 1 }}>
                    <h4>Mentorship</h4>
                    {user?.mentorStatus === 'pending' && (
                      <p style={{ color: '#f59e0b', fontWeight: 600 }}>⏳ Pending admin review</p>
                    )}
                    {user?.mentorStatus === 'approved' && (
                      <p style={{ color: '#10b981', fontWeight: 700 }}>✅ Verified Mentor</p>
                    )}
                    {user?.mentorStatus === 'rejected' && (
                      <p style={{ color: '#ef4444', fontWeight: 600 }}>❌ Rejected — toggle to re-apply</p>
                    )}
                    {(!user?.mentorStatus || user?.mentorStatus === 'none') && (
                      <p>{formData.interestedInMentorship ? 'Open to mentoring' : 'Not interested'}</p>
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
                    <span className="pf-slider" />
                  </label>
                </div>

              </div>
            </div>

            {/* Skills cloud card */}
            <div className="pg-card animate-fade-in anim-delay-2">
              <div className="pg-card-top-bar bar-green-blue" />
              <div className="pg-card-body">
                <div className="skills-preview-title">
                  <Star size={13} style={{ color: '#60a5fa' }} />
                  Expertise Area
                </div>
                <div className="skills-cloud">
                  {splitSkills.length > 0 ? (
                    splitSkills.map((skill, i) => (
                      <span key={i} className="skill-pill">{skill}</span>
                    ))
                  ) : (
                    <span className="skills-cloud-empty">Add skills in the form →</span>
                  )}
                </div>
              </div>
            </div>

          </div>{/* /column-sticky */}

          {/* ── Right form column ──────────── */}
          <div className="pg-card animate-fade-in anim-delay-3">
            <div className="pg-card-top-bar bar-blue-purple" />
            <div className="pg-card-body">
              <form onSubmit={handleSave} noValidate>

                {/* Section: Personal */}
                <div className="form-section-header">
                  <div className="fsh-icon fsh-icon-blue">
                    <User size={18} color="white" />
                  </div>
                  <span className="fsh-label">Personal &amp; Identity</span>
                </div>

                <div className="pf-form-group">
                  <label><User size={14} className="pf-label-icon" /> Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className={`pf-input ${errors.name ? 'pf-error' : (formData.name && !errors.name ? 'pf-valid' : '')}`}
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g., Binuja Fernando"
                    required
                  />
                  {errors.name && <div className="pf-error-msg"><AlertCircle size={13} /> {errors.name}</div>}
                  {!errors.name && formData.name && <CheckCircle2 size={16} className="pf-success-icon" />}
                </div>

                <div className="pf-form-grid">
                  <div className="pf-form-group">
                    <label><Hash size={14} className="pf-label-icon" /> Student ID</label>
                    <input
                      type="text"
                      name="studentId"
                      className={`pf-input ${errors.studentId ? 'pf-error' : (formData.studentId && !errors.studentId ? 'pf-valid' : '')}`}
                      value={formData.studentId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g., IT21004562"
                      required
                    />
                    {errors.studentId && <div className="pf-error-msg"><AlertCircle size={13} /> {errors.studentId}</div>}
                    {!errors.studentId && formData.studentId && <CheckCircle2 size={16} className="pf-success-icon" />}
                  </div>

                  <div className="pf-form-group">
                    <label><Mail size={14} className="pf-label-icon" /> University Email</label>
                    <input
                      type="email"
                      name="email"
                      className={`pf-input ${errors.email ? 'pf-error' : (formData.email && !errors.email ? 'pf-valid' : '')}`}
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g., IT21004562@my.sliit.lk"
                      required
                    />
                    {errors.email && <div className="pf-error-msg"><AlertCircle size={13} /> {errors.email}</div>}
                    {!errors.email && formData.email && <CheckCircle2 size={16} className="pf-success-icon" />}
                  </div>
                </div>

                <div className="pf-divider" />

                {/* Section: Academic */}
                <div className="form-section-header">
                  <div className="fsh-icon fsh-icon-purple">
                    <GraduationCap size={18} color="white" />
                  </div>
                  <span className="fsh-label">Academic Details</span>
                </div>

                <div className="pf-form-grid">
                  <div className="pf-form-group">
                    <label><BookOpen size={14} className="pf-label-icon" /> Academic Year</label>
                    <select
                      name="academicYear"
                      className="pf-input"
                      value={formData.academicYear}
                      onChange={handleChange}
                    >
                      <option value="">Select Year</option>
                      <option value="Year 1">Year 1</option>
                      <option value="Year 2">Year 2</option>
                      <option value="Year 3">Year 3</option>
                      <option value="Year 4">Year 4</option>
                    </select>
                  </div>

                  <div className="pf-form-group">
                    <label><Calendar size={14} className="pf-label-icon" /> Current Semester</label>
                    <select
                      name="semester"
                      className="pf-input"
                      value={formData.semester}
                      onChange={handleChange}
                    >
                      <option value="">Select Semester</option>
                      <option value="Semester 1">Semester 1</option>
                      <option value="Semester 2">Semester 2</option>
                    </select>
                  </div>
                </div>

                <div className="pf-form-grid">
                  <div className="pf-form-group">
                    <label><Award size={14} className="pf-label-icon" /> Current GPA</label>
                    <input
                      type="number"
                      step="0.01"
                      name="gpa"
                      className={`pf-input ${errors.gpa ? 'pf-error' : ''}`}
                      value={formData.gpa}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="e.g., 3.80"
                    />
                    {errors.gpa && <div className="pf-error-msg"><AlertCircle size={13} /> {errors.gpa}</div>}
                  </div>

                  <div className="pf-form-group">
                    <label><Briefcase size={14} className="pf-label-icon" /> Special Skills</label>
                    <input
                      type="text"
                      name="skills"
                      className="pf-input"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="React, Java, UI/UX..."
                    />
                  </div>
                </div>

                <div className="save-btn-wrap">
                  <button type="submit" className="pf-save-btn" disabled={isSubmitted}>
                    {isSubmitted ? (
                      <><div className="btn-spinner" /> Saving...</>
                    ) : (
                      <><Save size={20} /> Sync Academic Profile</>
                    )}
                  </button>
                  <p className="pf-privacy-note">
                    <Heart size={13} style={{ color: '#ef4444' }} />
                    Information is used strictly for group matching only.
                  </p>
                </div>

              </form>
            </div>
          </div>

        </div>{/* /profile-layout */}
      </div>{/* /profile-container */}

      <ChatbotToggle />
    </>
  );
};

export default Profile;

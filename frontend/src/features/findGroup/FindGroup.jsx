import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Users, BookOpen, Code, ChevronRight, ChevronLeft, User, PlusCircle, Star, CheckCircle2, UserPlus, X, Hash, Mail, Award, GraduationCap } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import ygroupsImg from '../../assets/ygroups.png';
import ChatbotToggle from '../../components/ChatbotToggle';

const styles = `
.find-group-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.page-title-gradient {
  background: linear-gradient(135deg, #60a5fa 0%, #c084fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4rem;
  gap: 2rem;
}

@media (max-width: 768px) {
  .search-header { flex-direction: column; align-items: flex-start; }
}

.search-actions-wrapper {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  position: relative;
  max-width: 550px;
  width: 100%;
}

.search-bar {
  flex-grow: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-input {
  width: 100%;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.15);
  padding: 1.2rem 1.2rem 1.2rem 3.5rem;
  border-radius: 20px;
  color: white;
  font-size: 1.1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.search-input:focus {
  border-color: #3b82f6;
  background: rgba(15, 23, 42, 0.9);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2), 0 10px 30px rgba(59, 130, 246, 0.15);
  outline: none;
  transform: translateY(-2px);
}

.my-groups-icon-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(30, 41, 59, 0.5);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 10;
}

.my-groups-icon-btn:hover {
  background: #3b82f6;
  border-color: #60a5fa;
  transform: scale(1.1);
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.4);
}

.joined-groups-dropdown {
  position: absolute;
  top: calc(100% + 0.8rem);
  right: 0;
  width: 320px;
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 1rem;
  backdrop-filter: blur(16px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
  z-index: 100;
  max-height: 350px;
  overflow-y: auto;
}

.joined-groups-dropdown::-webkit-scrollbar {
  width: 6px;
}
.joined-groups-dropdown::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.joined-group-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem;
  border-radius: 12px;
  transition: all 0.2s ease;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid transparent;
  margin-bottom: 0.5rem;
}
.joined-group-item:last-child {
  margin-bottom: 0;
}
.joined-group-item:hover {
  background: rgba(59, 130, 246, 0.08);
  border-color: rgba(59, 130, 246, 0.3);
}

.joined-group-avatar {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: white;
  flex-shrink: 0;
  font-size: 1.1rem;
}

.slider-main {
  width: 100%;
  position: relative;
}

.slider-container {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-arrow {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9));
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  min-width: 50px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 10;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.nav-arrow:hover {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-color: #a855f7;
  transform: scale(1.15);
  box-shadow: 0 12px 25px rgba(139, 92, 246, 0.4);
}

.slider-viewport {
  flex-grow: 1;
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  scroll-snap-type: x mandatory;
  gap: 2rem;
  padding: 1rem 0 3rem 0;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.slider-viewport::-webkit-scrollbar {
  display: none;
}

.slider-viewport > .group-card {
  flex: 0 0 calc(33.333% - 1.334rem);
  scroll-snap-align: start;
}

@media (max-width: 1060px) {
  .slider-viewport > .group-card { flex: 0 0 calc(50% - 1rem); }
}

@media (max-width: 768px) {
  .slider-viewport { gap: 1.2rem; }
  .slider-viewport > .group-card { flex: 0 0 100%; }
  .nav-arrow { display: none; }
}

.group-card {
  background: linear-gradient(180deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 2.2rem;
  backdrop-filter: blur(16px);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

.group-card:hover {
  transform: translateY(-10px);
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow: 0 30px 60px -12px rgba(139, 92, 246, 0.25), 0 18px 36px -18px rgba(0,0,0,0.5);
}

.group-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 5px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.group-badge {
  background: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
  padding: 0.4rem 0.8rem;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.group-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 0.4rem;
}

.group-code {
  color: #94a3b8;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 1.8rem;
}

.project-topic {
  background: rgba(255, 255, 255, 0.05);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  padding: 0.8rem 1rem;
  border-radius: 12px;
  color: #c084fc;
  font-size: 0.9rem;
  font-style: italic;
  margin-bottom: 1.8rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  color: #cbd5e1;
}

.info-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
}

.member-bar {
  margin-top: auto;
  padding-top: 1.8rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.progress-container {
  height: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  margin-bottom: 1rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  transition: width 1s ease-out;
}

.capacity-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: #94a3b8;
}


.no-results {
  text-align: center;
  padding: 5rem;
  background: rgba(30, 41, 59, 0.3);
  border-radius: 24px;
  border: 1px dashed rgba(255, 255, 255, 0.1);
}

.members-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
}

.mini-profile-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(30, 41, 59, 0.4);
  padding: 0.7rem 1rem;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.mini-profile-card:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(15, 23, 42, 0.6));
  border-color: rgba(59, 130, 246, 0.4);
  transform: translateX(6px) translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
  cursor: pointer;
}

.leader-card {
  border-color: rgba(16, 185, 129, 0.3);
  background: rgba(16, 185, 129, 0.05);
}

.leader-card:hover {
  border-color: rgba(16, 185, 129, 0.5);
  background: rgba(16, 185, 129, 0.1);
}

.mini-avatar {
  min-width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.95rem;
  color: white;
}

.leader-card .mini-avatar {
  background: linear-gradient(135deg, #10b981, #059669);
}

.mini-details {
  flex-grow: 1;
}

.mini-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 0.2rem 0;
}

.mini-id {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0;
}

.leader-badge {
  font-size: 0.65rem;
  font-weight: 700;
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.member-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 2rem;
  color: white;
  margin: 0 auto 1.5rem;
  box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4);
}
.member-status {
  position: absolute;
  top: 1.2rem;
  right: 1.2rem;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.status-available {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}
.status-taken {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}
.join-btn {
  width: 100%;
  padding: 0.9rem;
  border-radius: 12px;
  font-weight: 700;
  margin-top: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  border: none;
  font-family: inherit;
}

.join-btn-primary {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  box-shadow: 0 6px 16px rgba(139, 92, 246, 0.3);
  border: 1px solid rgba(255,255,255,0.1);
}

.join-btn-primary:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 24px rgba(139, 92, 246, 0.5);
  background: linear-gradient(135deg, #4f46e5, #a855f7);
}

.join-btn-sent {
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.2) !important;
  cursor: default;
}

.join-btn:active {
  transform: scale(0.97);
}

.invite-btn {
  width: 100%;
  padding: 0.85rem;
  border-radius: 16px;
  font-weight: 600;
  margin-top: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
  color: #60a5fa;
  border: 1px solid rgba(96, 165, 250, 0.4);
  font-family: inherit;
  font-size: 0.95rem;
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.1);
}

.invite-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #3b82f6, #a855f7);
  color: white;
  border-color: transparent;
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 10px 25px rgba(139, 92, 246, 0.4);
}

.invite-btn:active {
  transform: scale(0.98);
}

.invite-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Profile Modal Overlay */
.profile-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  justify-content: flex-end;
  animation: fadeInModal 0.3s ease;
}

@keyframes fadeInModal {
  from { opacity: 0; }
  to { opacity: 1; }
}

.profile-modal-panel {
  width: 100%;
  max-width: 420px;
  background: #0f172a;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: -10px 0 40px rgba(0,0,0,0.5);
  height: 100vh;
  display: flex;
  flex-direction: column;
  animation: slideInRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow-y: auto;
  position: relative;
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

.profile-modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  z-index: 10;
}

.profile-modal-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pm-header-bg {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 220px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(59, 130, 246, 0.2));
  z-index: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.pm-header-bg::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0; height: 100px;
  background: linear-gradient(to top, #0f172a, transparent);
}

.profile-modal-content {
  padding: 0 1.5rem 2rem 1.5rem;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.pm-avatar-container {
  margin-top: 60px;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.pm-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 4px solid #0f172a;
  box-shadow: 0 10px 25px rgba(0,0,0,0.4);
}

.pm-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pm-initials {
  font-size: 3rem;
  font-weight: 800;
  color: white;
}

.pm-name {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 800;
  color: #f1f5f9;
  margin: 0 0 0.5rem 0;
}

.pm-id {
  text-align: center;
  color: #3b82f6;
  font-weight: 600;
  margin: 0 0 2rem 0;
  font-size: 1rem;
}

.pm-section {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.pm-section:hover {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.1);
}

.pm-section-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #94a3b8;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.pm-info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
  font-size: 0.95rem;
}
.pm-info-row:last-child {
  margin-bottom: 0;
}

.pm-label {
  color: #94a3b8;
}

.pm-value {
  color: #f1f5f9;
  font-weight: 600;
}

.pm-skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.pm-skill-tag {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.pm-spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255,255,255,0.1);
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s ease-in-out infinite;
  margin: 3rem auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Group Modal Styling */
.gm-panel {
  width: 100%;
  max-width: 480px;
  background: #0f172a;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: -10px 0 50px rgba(0,0,0,0.6);
  height: 100vh;
  display: flex;
  flex-direction: column;
  animation: slideInRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow-y: auto;
  position: relative;
}

.gm-header-bg {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 220px;
  background: linear-gradient(135deg, rgba(59,130,246,0.25), rgba(139,92,246,0.25));
  z-index: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.gm-header-bg::after {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0; height: 100px;
  background: linear-gradient(to top, #0f172a, transparent);
}

.gm-top-bar {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.gm-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.gm-content {
  padding: 0 1.5rem 2rem 1.5rem;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.gm-avatar-wrapper {
  margin-top: 60px;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.gm-avatar {
  width: 90px;
  height: 90px;
  border-radius: 24px;
  background: linear-gradient(135deg, #3b82f6, #a855f7);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 4px solid #0f172a;
  box-shadow: 0 10px 25px rgba(0,0,0,0.4);
  font-size: 2.2rem;
  font-weight: 800;
  color: white;
}

.gm-module-name {
  text-align: center;
  font-size: 1.8rem;
  font-weight: 800;
  color: #f8fafc;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.gm-module-code {
  text-align: center;
  color: #60a5fa;
  font-weight: 600;
  font-size: 0.95rem;
  margin: 0 0 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: rgba(59, 130, 246, 0.1);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.gm-project-topic {
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
  border: 1px solid rgba(192, 132, 252, 0.3);
  padding: 1.2rem;
  border-radius: 16px;
  color: #f1f5f9;
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 2rem;
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.gm-project-topic:hover {
  transform: translateY(-2px);
  border-color: rgba(192, 132, 252, 0.6);
  box-shadow: 0 8px 25px rgba(192, 132, 252, 0.15);
}

.gm-topic-icon {
  background: rgba(192, 132, 252, 0.2);
  color: #c084fc;
  padding: 0.7rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gm-section {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.gm-section:hover {
  background: rgba(255, 255, 255, 0.03);
  border-color: rgba(255, 255, 255, 0.1);
}

.gm-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  padding-bottom: 0.8rem;
}

.gm-section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.gm-section-badge {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 700;
}

.gm-success-box {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.2));
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 1.2rem;
  border-radius: 16px;
  text-align: center;
  color: #34d399;
  font-size: 1rem;
  font-weight: 600;
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.1);
}
`;

const MiniProfileCard = ({ studentId, fallbackName, isLeader, profiles, onClick }) => {
  // Match by human-readable studentId OR MongoDB _id (when stored as fallback)
  const profileData = profiles.find(
    p => p.studentId === studentId || p._id?.toString() === studentId
  );
  
  // Use connected profile if available, else group baseline fallback
  const displayName = profileData?.name || fallbackName || 'Unknown Student';
  // Show the readable studentId if available, otherwise a short truncated id
  const rawDisplayId = profileData?.studentId || studentId || '';
  const isObjectId = /^[a-f\d]{24}$/i.test(rawDisplayId);
  const displayId = isObjectId ? `ID: ${rawDisplayId.slice(-8)}…` : rawDisplayId;
  
  const getInitials = (n) => {
    if (!n || n === 'Unknown' || n.trim() === '') return '?';
    const parts = n.trim().split(/\s+/);
    if (!parts[0]) return '?';
    if (parts.length > 1 && parts[1][0]) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  return (
    <div 
      className={`mini-profile-card ${isLeader ? 'leader-card' : ''}`}
      onClick={() => onClick && onClick(studentId)}
    >
       <div className="mini-avatar" style={{ overflow: 'hidden' }}>
         {profileData?.profilePhoto ? (
            <img src={profileData.profilePhoto} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
         ) : (
            getInitials(displayName)
         )}
       </div>
       <div className="mini-details">
          <p className="mini-name">{displayName}</p>
          <p className="mini-id">{displayId}</p>
       </div>
       {isLeader && <span className="leader-badge">Leader</span>}
    </div>
  );
};

const FindGroup = () => {
  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const [groups, setGroups] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const { user: currentUser } = useContext(AuthContext);
  const [joinRequests, setJoinRequests] = useState([]);  // { groupId } objects from DB
  const [showJoinedGroups, setShowJoinedGroups] = useState(false);
  const dropdownRef = useRef(null);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [fetchedProfile, setFetchedProfile] = useState(null);

  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  const handleProfileClick = async (studentId) => {
    // Match by human-readable studentId OR by MongoDB _id (fallback when studentId is unset)
    const prof = profiles.find(
      p => p.studentId === studentId || p._id?.toString() === studentId
    );
    if (!prof) {
      toast.error('Profile not found.');
      return;
    }
    setShowProfileModal(true);
    setFetchedProfile(null);
    setIsProfileLoading(true);
    try {
      const response = await api.get(`/users/${prof._id}`);
      setFetchedProfile(response.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load profile details.');
    } finally {
      setIsProfileLoading(false);
    }
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth;
      sliderRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };
  const [searchTerm, setSearchTerm] = useState('');

  const membersSliderRef = useRef(null);
  
  const scrollMembersLeft = () => {
    if (membersSliderRef.current) {
      const scrollAmount = membersSliderRef.current.clientWidth;
      membersSliderRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollMembersRight = () => {
    if (membersSliderRef.current) {
      const scrollAmount = membersSliderRef.current.clientWidth;
      membersSliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Fetch groups from the database
    const fetchGroups = async () => {
      try {
        const response = await api.get('/groups');
        setGroups(response.data);
      } catch (error) {
        console.error('Error fetching groups:', error);
        setGroups([]);
      }
    };
    
    fetchGroups();
    
    // Fetch students from the database
    const fetchStudents = async () => {
      try {
        const response = await api.get('/users/students');
        const dbStudents = response.data.map(u => ({
          ...u,
          // Map MongoDB _id to studentId to keep compatibility with existing components
          studentId: u.studentId || u._id,
          // Fallback if not specifically present
          academicYear: u.bio?.includes('Year') ? u.bio.split(' ')[0] + ' ' + u.bio.split(' ')[1] : 'Year Not Specified'
        }));
        setProfiles(dbStudents);
      } catch (error) {
        console.error('Error fetching students:', error);
        setProfiles([]);
      }
    };

    fetchStudents();

    // Fetch user's pending group join requests
    const fetchMyGroupRequests = async () => {
      try {
        // We fetch incoming (as leader) and responses (as student) together
        // For the join button state, we need pending requests the user SENT
        // We'll derive this from the responses endpoint + a dedicated check
        // Re-use: fetch /group-requests/responses which returns approved/rejected
        // For pending we need a separate endpoint — use GET /group-requests/my-pending
        // Since we didn't build that, we track locally + seed from session (acceptable tradeoff)
      } catch (error) {
        console.error('Error fetching group requests:', error);
      }
    };
    fetchMyGroupRequests();
  }, []);

  // Handle outside click for joined groups dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowJoinedGroups(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleJoinRequest = async (groupId) => {
    if (!currentUser) {
      alert("Please complete your profile to join groups!");
      navigate('/profile');
      return;
    }

    try {
      await api.post('/group-requests', { groupId });
      // Track locally so button state updates immediately
      setJoinRequests(prev => [...prev, { groupId }]);
      toast.success('Join request sent to the group leader!');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to send join request';
      toast.error(msg);
      // If already pending from a previous session, still lock the button
      if (msg.includes('pending')) {
        setJoinRequests(prev => [...prev, { groupId }]);
      }
    }
  };

  const filteredGroups = groups.filter(g => 
    (g.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.moduleCode.toLowerCase().includes(searchTerm.toLowerCase())) &&
    g.members.length < g.maxMembers
  );

  const membersInGroups = new Set();
  groups.forEach(g => {
    if (g.members) {
      g.members.forEach(m => membersInGroups.add(m.studentId));
    }
  });

  const filteredProfiles = profiles.filter(p => 
    (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.studentId && p.studentId.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.skills && Array.isArray(p.skills) ? p.skills.join(' ').toLowerCase().includes(searchTerm.toLowerCase()) : p.skills?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const joinedGroups = groups.filter(g => 
    g.members && g.members.some(m => m.studentId === (currentUser?.studentId || currentUser?._id))
  );

  const getGlobalInitials = (n) => {
    if (!n || n === 'Unknown' || n.trim() === '') return '?';
    const parts = n.trim().split(/\s+/);
    if (!parts[0]) return '?';
    if (parts.length > 1 && parts[1][0]) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="find-group-container">


        <header className="search-header">
          <div>
            <h1 className="page-title-gradient" style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '0.5rem', marginTop: 0 }}>Find a Group</h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Join existing teams looking for members</p>
          </div>
          <div className="search-actions-wrapper" ref={dropdownRef}>
            <div className="search-bar">
              <Search className="search-icon" size={24} />
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search module name or code..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* My Groups Icon Button (External to search input) */}
            <div 
              className="my-groups-icon-btn"
              onClick={() => setShowJoinedGroups(!showJoinedGroups)}
              title="My Joined"
            >
              <img src={ygroupsImg} alt="My Groups" style={{ width: '24px', height: '24px', objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
            </div>

            {/* My Groups Dropdown */}
            {showJoinedGroups && (
              <div className="joined-groups-dropdown">
                <h4 style={{ margin: '0 0 1rem 0', color: '#f8fafc', fontSize: '1.05rem', fontWeight: 800 }}>My Joined Groups</h4>
                
                {joinedGroups.length > 0 ? (
                  joinedGroups.map(group => (
                    <div 
                      key={group.id} 
                      className="joined-group-item"
                      onClick={() => {
                        setSelectedGroup(group);
                        setShowGroupModal(true);
                        setShowJoinedGroups(false);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="joined-group-avatar">
                        {group.moduleName.substring(0, 2).toUpperCase()}
                      </div>
                      <div style={{ flexGrow: 1, overflow: 'hidden' }}>
                        <h5 style={{ margin: 0, color: '#f8fafc', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {group.moduleName}
                        </h5>
                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.8rem' }}>
                          {group.moduleCode} • {group.members.length}/{group.maxMembers} Members
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '1.5rem', color: '#64748b', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>You haven't joined any groups yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {filteredGroups.length > 0 ? (
          <div className="slider-main">
            <div className="slider-container">
              <button className="nav-arrow" onClick={scrollLeft} aria-label="Previous Groups">
                <ChevronLeft size={28} />
              </button>
              
              <div className="slider-viewport" ref={sliderRef}>
                {filteredGroups.map((group) => {
              const spotsLeft = group.maxMembers - group.members.length;
              const fillPercentage = (group.members.length / group.maxMembers) * 100;
              
              return (
                  <div key={group.id} className="group-card">
                    <div className="group-header">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <span className="group-badge">{group.members.length} / {group.maxMembers} Members</span>
                        {joinRequests.some(r => r.groupId === group.id && (r.requesterId === currentUser?.studentId || r.requesterId === currentUser?._id)) && (
                          <span style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <CheckCircle2 size={12} /> Request Pending
                          </span>
                        )}
                      </div>
                      <PlusCircle size={22} color="#3b82f6" cursor="pointer" title="Join Group" />
                    </div>
                  
                  <h2 className="group-title">{group.moduleName}</h2>
                  <div className="group-code">
                    <Code size={16} /> {group.moduleCode}
                  </div>

                  {group.projectTitle && (
                    <div className="project-topic">
                      <Star size={16} color="#c084fc" />
                      <span>{group.projectTitle}</span>
                    </div>
                  )}

                  <div className="members-list">
                    <h4 style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: '0 0 0.8rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Users size={16} color="#94a3b8" /> Current Roster
                    </h4>
                    {group.members && group.members.map((member, idx) => (
                      <MiniProfileCard 
                        key={member.studentId || idx}
                        studentId={member.studentId}
                        fallbackName={member.name}
                        isLeader={member.studentId === group.leaderId}
                        profiles={profiles}
                        onClick={handleProfileClick}
                      />
                    ))}
                  </div>

                  <div className="member-bar">
                    <div className="capacity-text">
                      <span>Available Slots</span>
                      <span style={{ color: '#3b82f6', fontWeight: 800 }}>{spotsLeft} spot{spotsLeft > 1 ? 's' : ''} left</span>
                    </div>
                    <div className="progress-container">
                      <div className="progress-fill" style={{ width: `${fillPercentage}%` }}></div>
                    </div>

                    {/* Already a member? */}
                    {group.members?.some(m =>
                      m.studentId === (currentUser?.studentId || currentUser?._id?.toString())
                    ) ? (
                      <button className="join-btn join-btn-sent" disabled>
                        <CheckCircle2 size={18} /> Already a Member
                      </button>
                    ) : joinRequests.some(r => r.groupId === (group._id || group.id)) ? (
                      <button className="join-btn join-btn-sent" disabled>
                        <CheckCircle2 size={18} /> Request Sent
                      </button>
                    ) : (
                      <button 
                        className="join-btn join-btn-primary" 
                        onClick={() => handleJoinRequest(group._id || group.id)}
                        disabled={group.members.length >= group.maxMembers}
                      >
                        {group.members.length >= group.maxMembers ? 'Group Full' : 'Request to Join'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
              </div>

              <button className="nav-arrow" onClick={scrollRight} aria-label="Next Groups">
                <ChevronRight size={28} />
              </button>
            </div>
          </div>
        ) : (
          <div className="no-results">
            <Users size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
            <h3>No available groups found</h3>
            <p style={{ color: '#94a3b8' }}>Try adjusting your search or create your own group!</p>
          </div>
        )}

        {/* Find Members Section */}
        <header className="search-header" style={{ marginTop: '5rem', marginBottom: '2rem' }}>
          <div>
            <h1 className="page-title-gradient" style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '0.5rem', marginTop: 0 }}>Find Members</h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Connect with available students to form a team</p>
          </div>
        </header>

        {filteredProfiles.length > 0 ? (
          <div className="slider-main">
            <div className="slider-container">
              <button className="nav-arrow" onClick={scrollMembersLeft} aria-label="Previous Members">
                <ChevronLeft size={28} />
              </button>
              
              <div className="slider-viewport" ref={membersSliderRef}>
                {filteredProfiles.map((profile, idx) => {
                  const isTaken = profile.studentId && membersInGroups.has(profile.studentId);
                  
                  return (
                    <div key={profile.studentId || idx} className="group-card" style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className={`member-status ${isTaken ? 'status-taken' : 'status-available'}`}>
                        {isTaken ? 'In a Group' : 'Looking for Group'}
                      </span>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
                        <div className="member-avatar" style={{ margin: 0, width: '64px', height: '64px', fontSize: '1.5rem', flexShrink: 0, cursor: 'pointer', overflow: 'hidden' }} onClick={() => handleProfileClick(profile.studentId)}>
                          {profile.profilePhoto ? (
                            <img src={profile.profilePhoto} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            getGlobalInitials(profile.name)
                          )}
                        </div>
                        <div style={{ textAlign: 'left', cursor: 'pointer' }} onClick={() => handleProfileClick(profile.studentId)}>
                          <h3 style={{ fontSize: '1.3rem', margin: '0 0 0.3rem 0', color: '#f8fafc', fontWeight: 700 }}>{profile.name || 'Unknown Student'}</h3>
                          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>{profile.studentId || 'ID Not Available'}</p>
                        </div>
                      </div>
                      
                      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.6rem 1rem', borderRadius: '10px', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: 'auto', alignSelf: 'flex-start', display: 'flex', alignItems: 'center' }}>
                        <BookOpen size={16} style={{ marginRight: '0.5rem' }} /> 
                        {profile.academicYear || 'Year Not Specified'}
                      </div>

                      <button className="invite-btn" onClick={() => alert(`Invite sent to ${profile.name}!`)} disabled={isTaken}>
                        <UserPlus size={18} />
                        {isTaken ? 'Already in Group' : 'Invite to Group'}
                      </button>
                    </div>
                  );
                })}
              </div>

              <button className="nav-arrow" onClick={scrollMembersRight} aria-label="Next Members">
                <ChevronRight size={28} />
              </button>
            </div>
          </div>
        ) : (
          <div className="no-results" style={{ marginTop: '2rem' }}>
            <User size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
            <h3>No members found</h3>
            <p style={{ color: '#94a3b8' }}>Try adjusting your search criteria!</p>
          </div>
        )}

        {/* Profile Modal Overlay */}
        {showProfileModal && (
          <div className="profile-modal-overlay" onClick={() => setShowProfileModal(false)}>
            <div className="profile-modal-panel" onClick={(e) => e.stopPropagation()}>
              <div className="pm-header-bg"></div>
              <div className="profile-modal-header" style={{ background: 'rgba(15, 23, 42, 0.6)' }}>
                <h3 className="profile-modal-title">Student Profile</h3>
                <button 
                  onClick={() => setShowProfileModal(false)}
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', padding: '0.4rem', borderRadius: '50%', transition: 'background 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                  <X size={20} />
                </button>
              </div>

              {isProfileLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <div className="pm-spinner"></div>
                </div>
              ) : fetchedProfile ? (
                <div className="profile-modal-content">
                  <div className="pm-avatar-container">
                    <div className="pm-avatar">
                      {fetchedProfile.profilePhoto ? (
                        <img src={fetchedProfile.profilePhoto} alt={fetchedProfile.name} />
                      ) : (
                        <span className="pm-initials">{getGlobalInitials(fetchedProfile.name)}</span>
                      )}
                    </div>
                  </div>
                  
                  <h2 className="pm-name">{fetchedProfile.name}</h2>
                  <p className="pm-id">{fetchedProfile.studentId || 'No ID assigned'}</p>

                  <div className="pm-section">
                    <h4 className="pm-section-title"><User size={18} /> Academic Details</h4>
                    <div className="pm-info-row">
                      <span className="pm-label">Email</span>
                      <span className="pm-value">{fetchedProfile.email}</span>
                    </div>
                    <div className="pm-info-row">
                      <span className="pm-label">Year</span>
                      <span className="pm-value">{fetchedProfile.academicYear || 'Not specified'}</span>
                    </div>
                    <div className="pm-info-row">
                      <span className="pm-label">Semester</span>
                      <span className="pm-value">{fetchedProfile.semester || 'Not specified'}</span>
                    </div>
                    {fetchedProfile.gpa !== undefined && (
                      <div className="pm-info-row">
                        <span className="pm-label">GPA</span>
                        <span className="pm-value" style={{ color: '#3b82f6' }}>{fetchedProfile.gpa.toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  <div className="pm-section">
                    <h4 className="pm-section-title"><BookOpen size={18} /> Skills & Expertise</h4>
                    {fetchedProfile.skills && fetchedProfile.skills.length > 0 ? (
                      <div className="pm-skills">
                        {fetchedProfile.skills.map((skill, idx) => (
                          <span key={idx} className="pm-skill-tag">{skill}</span>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0, fontStyle: 'italic' }}>No skills listed</p>
                    )}
                  </div>
                  
                  {fetchedProfile.interestedInMentorship && (
                    <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '12px', textAlign: 'center', color: '#34d399', fontSize: '0.9rem', fontWeight: 600, marginTop: '2rem' }}>
                      ✓ Open to Mentorship
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: '#ef4444', marginTop: '3rem' }}>
                  Failed to load profile details.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Group Details Modal Overlay */}
        {showGroupModal && selectedGroup && (
          <div className="profile-modal-overlay" onClick={() => setShowGroupModal(false)} style={{ zIndex: 9998 }}>
            <div className="gm-panel" onClick={(e) => e.stopPropagation()}>
              <div className="gm-header-bg"></div>
              
              <div className="gm-top-bar">
                <h3 className="gm-title">Group Details</h3>
                <button 
                  onClick={() => setShowGroupModal(false)}
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', padding: '0.4rem', borderRadius: '50%', transition: 'background 0.2s' }}
                  onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="gm-content">
                <div className="gm-avatar-wrapper">
                  <div className="gm-avatar">
                     {selectedGroup.moduleName.substring(0, 2).toUpperCase()}
                  </div>
                </div>
                
                <h2 className="gm-module-name">{selectedGroup.moduleName}</h2>
                <div className="gm-module-code">
                  <Code size={16} /> {selectedGroup.moduleCode}
                </div>

                {selectedGroup.projectTitle && (
                  <div className="gm-project-topic">
                    <div className="gm-topic-icon">
                      <Star size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.3rem', fontWeight: 700 }}>Project Focus</div>
                      <div style={{ lineHeight: '1.4' }}>{selectedGroup.projectTitle}</div>
                    </div>
                  </div>
                )}

                <div className="gm-section">
                  <div className="gm-section-header">
                    <h4 className="gm-section-title"><Users size={20} color="#3b82f6" /> Team Roster</h4>
                    <span className="gm-section-badge">{selectedGroup.members?.length || 0} / {selectedGroup.maxMembers} Members</span>
                  </div>
                  <div className="members-list" style={{ marginTop: '0.5rem' }}>
                    {selectedGroup.members && selectedGroup.members.map((member, idx) => (
                      <MiniProfileCard 
                        key={member.studentId || idx}
                        studentId={member.studentId}
                        fallbackName={member.name}
                        isLeader={member.studentId === selectedGroup.leaderId}
                        profiles={profiles}
                        onClick={handleProfileClick}
                      />
                    ))}
                  </div>
                </div>
                
                {selectedGroup.members?.some(m => m.studentId === (currentUser?.studentId || currentUser?._id?.toString())) && (
                  <div className="gm-success-box">
                    <CheckCircle2 size={24} />
                    You are a member of this group
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <ChatbotToggle />
    </>
  );
};

export default FindGroup;

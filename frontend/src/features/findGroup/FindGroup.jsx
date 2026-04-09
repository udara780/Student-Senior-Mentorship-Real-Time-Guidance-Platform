import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Users, BookOpen, Code, ChevronRight, ChevronLeft, User, PlusCircle, Star, CheckCircle2, UserPlus } from 'lucide-react';
import api from '../../services/api';

const styles = `
.find-group-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
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

.search-bar {
  flex-grow: 1;
  position: relative;
  max-width: 600px;
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
  background: rgba(30, 41, 59, 0.5);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  padding: 1.2rem 1.2rem 1.2rem 3.5rem;
  border-radius: 18px;
  color: white;
  font-size: 1.1rem;
  transition: all 0.3s;
}

.search-input:focus {
  border-color: #3b82f6;
  background: rgba(30, 41, 59, 0.8);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
  outline: none;
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
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.nav-arrow:hover {
  background: #3b82f6;
  border-color: #60a5fa;
  transform: scale(1.15);
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.4);
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
  background: rgba(30, 41, 59, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 2.2rem;
  backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  flex-direction: column;
}

.group-card:hover {
  transform: translateY(-8px);
  border-color: #3b82f6;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5);
}

.group-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 4px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
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

.back-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  transition: all 0.3s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(-5px);
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
  background: rgba(15, 23, 42, 0.4);
  padding: 0.7rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.mini-profile-card:hover {
  background: rgba(15, 23, 42, 0.6);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateX(4px);
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
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.join-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
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
  border-radius: 12px;
  font-weight: 600;
  margin-top: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background: rgba(59, 130, 246, 0.08);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
  font-family: inherit;
  font-size: 0.95rem;
}

.invite-btn:hover:not(:disabled) {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.invite-btn:active {
  transform: scale(0.98);
}

.invite-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
`;

const MiniProfileCard = ({ studentId, fallbackName, isLeader, profiles }) => {
  const profileData = profiles.find(p => p.studentId === studentId);
  
  // Use connected profile if available, else group baseline fallback
  const displayName = profileData?.name || fallbackName || 'Unknown Student';
  const displayId = profileData ? studentId : (studentId || 'Profile not available');
  
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
    <div className={`mini-profile-card ${isLeader ? 'leader-card' : ''}`}>
       <div className="mini-avatar">{getInitials(displayName)}</div>
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
  const [currentUser, setCurrentUser] = useState(null);
  const [joinRequests, setJoinRequests] = useState([]);

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
    // Load datasets from mock databases
    const savedGroups = JSON.parse(localStorage.getItem('allGroups') || '[]');
    const savedRequests = JSON.parse(localStorage.getItem('joinRequests') || '[]');
    const user = JSON.parse(localStorage.getItem('studentProfile'));
    
    setGroups(savedGroups);
    setJoinRequests(savedRequests);
    setCurrentUser(user);

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
        // Fallback to local storage if API fails
        const savedProfiles = JSON.parse(localStorage.getItem('allStudents') || '[]');
        setProfiles(savedProfiles);
      }
    };

    fetchStudents();
  }, []);

  const handleJoinRequest = (groupId) => {
    if (!currentUser) {
      alert("Please complete your profile to join groups!");
      navigate('/profile');
      return;
    }

    const newRequest = {
      id: Date.now(),
      groupId,
      requesterId: currentUser.studentId,
      requesterName: currentUser.name,
      status: 'pending'
    };

    const updatedRequests = [...joinRequests, newRequest];
    setJoinRequests(updatedRequests);
    localStorage.setItem('joinRequests', JSON.stringify(updatedRequests));
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
        <button className="back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={24} />
        </button>

        <header className="search-header">
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Find a Group</h1>
            <p style={{ color: '#94a3b8' }}>Join existing teams looking for members</p>
          </div>
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
                        {joinRequests.some(r => r.groupId === group.id && r.requesterId === currentUser?.studentId) && (
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

                    {joinRequests.some(r => r.groupId === group.id && r.requesterId === currentUser?.studentId) ? (
                      <button className="join-btn join-btn-sent" disabled>
                        <CheckCircle2 size={18} /> Request Sent
                      </button>
                    ) : (
                      <button 
                        className="join-btn join-btn-primary" 
                        onClick={() => handleJoinRequest(group.id)}
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
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Find Members</h1>
            <p style={{ color: '#94a3b8' }}>Connect with available students to form a team</p>
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
                        <div className="member-avatar" style={{ margin: 0, width: '64px', height: '64px', fontSize: '1.5rem', flexShrink: 0 }}>
                          {getGlobalInitials(profile.name)}
                        </div>
                        <div style={{ textAlign: 'left' }}>
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
      </div>
    </>
  );
};

export default FindGroup;

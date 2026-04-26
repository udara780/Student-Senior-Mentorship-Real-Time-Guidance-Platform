import React, { useState, useEffect, useCallback } from 'react';
import { Search, SlidersHorizontal, Users, X, ChevronDown } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import MentorCard from './MentorCard';

const styles = `
.ml-page {
  min-height: 100vh;
  background: #0f172a;
  background-image:
    radial-gradient(circle at 10% 10%, rgba(59,130,246,0.1) 0%, transparent 35%),
    radial-gradient(circle at 90% 90%, rgba(168,85,247,0.1) 0%, transparent 35%);
  padding: 3rem 1.5rem 4rem;
  font-family: 'Poppins', sans-serif;
  color: #f1f5f9;
}

.ml-inner {
  max-width: 1200px;
  margin: 0 auto;
}

/* ─── Header ─────────────────────────────────────────────── */
.ml-header {
  margin-bottom: 2.5rem;
  animation: mlFade 0.5s ease;
}

@keyframes mlFade {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.ml-header h1 {
  font-size: 2.4rem;
  font-weight: 800;
  background: linear-gradient(135deg, #f1f5f9 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 0.4rem;
}

.ml-header p {
  color: #64748b;
  font-size: 1rem;
  margin: 0;
}

.ml-count-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(59,130,246,0.1);
  border: 1px solid rgba(59,130,246,0.2);
  color: #60a5fa;
  padding: 0.35rem 0.9rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 0.75rem;
}

/* ─── Controls ────────────────────────────────────────────── */
.ml-controls {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
}

.ml-search-wrapper {
  position: relative;
  flex: 1;
  min-width: 220px;
}

.ml-search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #475569;
}

.ml-search-input {
  width: 100%;
  background: rgba(15,23,42,0.85);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  color: #f1f5f9;
  padding: 0.75rem 1rem 0.75rem 2.8rem;
  font-size: 0.9rem;
  font-family: 'Poppins', sans-serif;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.ml-search-input::placeholder { color: #475569; }

.ml-search-input:focus {
  outline: none;
  border-color: rgba(59,130,246,0.5);
  box-shadow: 0 0 0 4px rgba(59,130,246,0.1);
}

.ml-filter-select {
  background: rgba(15,23,42,0.85);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  color: #94a3b8;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  font-size: 0.88rem;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.9rem center;
  transition: border-color 0.2s ease;
}

.ml-filter-select:focus {
  outline: none;
  border-color: rgba(59,130,246,0.5);
  color: #f1f5f9;
}

.ml-filter-select option {
  background: #0f172a;
  color: #f1f5f9;
}

.ml-clear-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  color: #64748b;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Poppins', sans-serif;
  white-space: nowrap;
}

.ml-clear-btn:hover { color: #e2e8f0; background: rgba(255,255,255,0.08); }

/* ─── Layout ────────────────────────────────────────────────── */
.ml-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}


/* ─── Skeleton ─────────────────────────────────────────────── */
.ml-skeleton-card {
  background: rgba(15,23,42,0.82);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: row;
  gap: 1.5rem;
  align-items: center;
}

@media (max-width: 768px) {
  .ml-skeleton-card {
    flex-direction: column;
  }
}

.ml-skel {
  background: linear-gradient(90deg,
    rgba(255,255,255,0.04) 0%,
    rgba(255,255,255,0.08) 50%,
    rgba(255,255,255,0.04) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0%   { background-position: 200% center; }
  100% { background-position: -200% center; }
}

/* ─── Empty state ─────────────────────────────────────────── */
.ml-empty {
  grid-column: 1/-1;
  text-align: center;
  padding: 5rem 2rem;
}

.ml-empty-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(59,130,246,0.08);
  border: 1px solid rgba(59,130,246,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
}

.ml-empty h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0 0 0.5rem;
}

.ml-empty p {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
}
`;

// Skill domain categories for filtering
const DOMAINS = [
  { value: '', label: 'All Domains' },
  { value: 'web', label: 'Web Development' },
  { value: 'ai', label: 'AI / Machine Learning' },
  { value: 'mobile', label: 'Mobile Development' },
  { value: 'data', label: 'Data Science' },
  { value: 'network', label: 'Networking' },
  { value: 'security', label: 'Cybersecurity' },
  { value: 'cloud', label: 'Cloud / DevOps' },
];

const DOMAIN_KEYWORDS = {
  web:      ['web', 'react', 'vue', 'angular', 'node', 'html', 'css', 'javascript', 'frontend', 'backend', 'fullstack'],
  ai:       ['ai', 'ml', 'machine learning', 'deep learning', 'pytorch', 'tensorflow', 'nlp', 'computer vision'],
  mobile:   ['mobile', 'android', 'ios', 'flutter', 'react native', 'swift', 'kotlin'],
  data:     ['data', 'python', 'pandas', 'sql', 'tableau', 'analytics', 'statistics'],
  network:  ['network', 'tcp/ip', 'routing', 'cisco', 'ccna', 'subnetting'],
  security: ['security', 'cybersecurity', 'ethical hacking', 'penetration', 'kali'],
  cloud:    ['cloud', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'devops'],
};

function matchesDomain(mentor, domain) {
  if (!domain) return true;
  const keywords = DOMAIN_KEYWORDS[domain] || [];
  const haystack = [
    mentor.name,
    mentor.bio,
    ...(Array.isArray(mentor.skills) ? mentor.skills : []),
  ].join(' ').toLowerCase();
  return keywords.some(kw => haystack.includes(kw));
}

function SkeletonCard() {
  return (
    <div className="ml-skeleton-card">
      {/* Left */ }
      <div className="ml-skel" style={{ width: 76, height: 76, borderRadius: '50%', flexShrink: 0 }} />
      {/* Center */ }
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
        <div className="ml-skel" style={{ height: 20, width: '40%' }} />
        <div className="ml-skel" style={{ height: 16, width: '80%' }} />
        <div className="ml-skel" style={{ height: 16, width: '60%' }} />
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
          <div className="ml-skel" style={{ height: 22, width: 60, borderRadius: 12 }} />
          <div className="ml-skel" style={{ height: 22, width: 70, borderRadius: 12 }} />
          <div className="ml-skel" style={{ height: 22, width: 50, borderRadius: 12 }} />
        </div>
      </div>
      {/* Right */ }
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: 140, flexShrink: 0 }}>
        <div className="ml-skel" style={{ height: 38, width: '100%', borderRadius: 10 }} />
        <div className="ml-skel" style={{ height: 38, width: '100%', borderRadius: 10 }} />
      </div>
    </div>
  );
}

export default function MentorList() {
  const [mentors, setMentors]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [query, setQuery]             = useState('');
  const [domain, setDomain]           = useState('');
  const [requestedIds, setRequestedIds] = useState(new Set());

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [seniorsRes, requestsRes] = await Promise.all([
          api.get('/users/seniors'),
          api.get('/requests/my'),
        ]);

        setMentors(seniorsRes.data);

        // Build a set of seniorIds that already have pending/accepted requests
        const alreadyRequestedIds = new Set(
          requestsRes.data
            .filter(r => r.status === 'pending' || r.status === 'accepted')
            .map(r => r.senior?._id || r.senior)
        );
        setRequestedIds(alreadyRequestedIds);
      } catch (err) {
        toast.error('Failed to load mentors.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const handleRequested = useCallback((mentorId) => {
    setRequestedIds(prev => new Set([...prev, mentorId]));
  }, []);

  const clearFilters = () => {
    setQuery('');
    setDomain('');
  };

  const hasFilters = query.trim() || domain;

  const filtered = mentors.filter(m => {
    if (!m.isVerified) return false;          // Frontend safeguard: verified only
    const q = query.toLowerCase().trim();
    const nameMatch = m.name?.toLowerCase().includes(q);
    const skillMatch = Array.isArray(m.skills) && m.skills.some(s => s.toLowerCase().includes(q));
    const textMatch = !q || nameMatch || skillMatch;
    return textMatch && matchesDomain(m, domain);
  });

  return (
    <>
      <style>{styles}</style>
      <div className="ml-page">
        <div className="ml-inner">

          {/* Header */}
          <div className="ml-header">
            <h1>Find Your Mentor</h1>
            <p>Discover experienced seniors who can guide your academic and professional journey.</p>
            {!loading && (
              <div className="ml-count-badge">
                <Users size={14} />
                {filtered.length} mentor{filtered.length !== 1 ? 's' : ''} available
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="ml-controls">
            <div className="ml-search-wrapper">
              <Search size={16} className="ml-search-icon" />
              <input
                className="ml-search-input"
                type="text"
                placeholder="Search by name or skill…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>

            <select
              className="ml-filter-select"
              value={domain}
              onChange={e => setDomain(e.target.value)}
            >
              {DOMAINS.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>

            {hasFilters && (
              <button className="ml-clear-btn" onClick={clearFilters}>
                <X size={14} /> Clear
              </button>
            )}
          </div>

          {/* Grid */}
          <div className="ml-grid">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : filtered.length > 0 ? (
              filtered.map(mentor => (
                <MentorCard
                  key={mentor._id}
                  mentor={mentor}
                  requestStatus={requestedIds.has(mentor._id) ? 'pending' : null}
                  onRequested={handleRequested}
                />
              ))
            ) : (
              <div className="ml-empty">
                <div className="ml-empty-icon">
                  <Users size={32} color="#3b82f6" />
                </div>
                <h3>No mentors found</h3>
                <p>
                  {hasFilters
                    ? 'Try adjusting your search or filters.'
                    : 'No senior mentors have registered yet.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

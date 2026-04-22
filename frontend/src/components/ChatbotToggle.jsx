import React, { useState, useRef, useEffect } from 'react';
import helperIcon from '../assets/helper.png';

// ── Smart response engine ──────────────────────────────────────────────────
const getResponse = (message) => {
  const msg = message.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|hiya|yo|sup|good morning|good evening|good afternoon)\b/.test(msg)) {
    return "Hello! 👋 I'm your AI Study Assistant. I can help you with study groups, mentors, sessions, and more. What do you need?";
  }

  // Name / identity
  if (/\b(your name|who are you|what are you|are you a bot|are you ai)\b/.test(msg)) {
    return "I'm the AI Study Assistant built into this platform. I can guide you through finding groups, requesting mentors, viewing sessions, and more! 🤖";
  }

  // Study group / create group
  if (/\b(create group|make group|new group|start group|form group)\b/.test(msg)) {
    return "To create a study group, click **Create Group** in the top navigation. Fill in your module name, module code, and add team members using their student IDs. 📚";
  }

  // Find group / join group
  if (/\b(find group|join group|search group|look for group|browse group|group list)\b/.test(msg)) {
    return "Head to **Find Group** in the navigation bar. You can search by module name or code, browse available groups, and send a join request directly from there! 🔍";
  }

  // Mentor / senior
  if (/\b(mentor|senior|mentorship|guidance|find mentor|request mentor|get mentor)\b/.test(msg)) {
    return "To request a mentor, go to **Request Mentor** in the navigation. Browse verified senior students, view their skills and availability, and send a mentorship request. 🎓";
  }

  // Profile / edit profile
  if (/\b(profile|edit profile|update profile|my details|my info|student id|gpa|academic)\b/.test(msg)) {
    return "You can edit your academic profile from **Edit Profile** in the nav. Add your Student ID (e.g. IT21004562), GPA, academic year, semester, and skills. Make sure your email matches your Student ID! ✏️";
  }

  // Sessions / meetings / schedule
  if (/\b(session|sessions|meeting|meetings|schedule|book|booking|upcoming)\b/.test(msg)) {
    return "Sessions are scheduled by your mentor. Once a session is booked, you can view it in the **Sessions** page. Meeting details and links will appear there. 📅";
  }

  // Chat / message
  if (/\b(chat|message|talk|communicate|inbox|dm)\b/.test(msg)) {
    return "Once your mentorship request is accepted, a private chat room opens automatically. Go to **Chat** in your dashboard to message your mentor in real time. 💬";
  }

  // Availability
  if (/\b(availability|available|time slot|slot|schedule time)\b/.test(msg)) {
    return "Seniors manage their availability slots. As a student, you can view a mentor's available times when requesting a session through their profile. 🕐";
  }

  // Login / register / sign in
  if (/\b(login|log in|sign in|register|sign up|account|password|forgot)\b/.test(msg)) {
    return "To log in, go to the Login page. To create an account, click Register. If you forget your password, please contact your platform admin for assistance. 🔐";
  }

  // Admin / admin panel
  if (/\b(admin|admin panel|admin dashboard|manage users)\b/.test(msg)) {
    return "The Admin Panel is only accessible to platform administrators. Admins can approve mentor applications, manage users, and view platform statistics. 🛡️";
  }

  // Notifications
  if (/\b(notification|notifications|alert|alerts|bell)\b/.test(msg)) {
    return "Notifications appear as a bell icon in the top navigation bar. You'll be notified when a mentor accepts or rejects your request, or when a new session is booked. 🔔";
  }

  // Dark mode / theme
  if (/\b(dark mode|light mode|theme|night mode)\b/.test(msg)) {
    return "You can toggle Dark/Light mode using the moon or sun icon in the top navigation bar! 🌙☀️";
  }

  // Skills / expertise
  if (/\b(skill|skills|expertise|technology|tech stack|programming|language)\b/.test(msg)) {
    return "Skills can be added in your **Edit Profile** page under 'Special Skills'. Enter them comma-separated (e.g. React, Java, UI/UX). They appear on your public profile too! 💡";
  }

  // Help / what can you do
  if (/\b(help|what can you do|features|options|commands|how does this work)\b/.test(msg)) {
    return `Here's what I can help you with:\n\n📚 Create or Find a study group\n🎓 Request a mentor\n📅 Understand sessions & scheduling\n✏️ Edit your academic profile\n💬 Use the real-time chat\n🔔 Understand notifications\n\nJust type your question!`;
  }

  // Thanks / thank you
  if (/\b(thank|thanks|thank you|appreciate|great|awesome|perfect|helpful)\b/.test(msg)) {
    return "You're welcome! 😊 Feel free to ask me anything else about the platform anytime.";
  }

  // Bye / goodbye
  if (/\b(bye|goodbye|see you|later|exit|close|done)\b/.test(msg)) {
    return "Goodbye! 👋 Come back anytime if you have questions. Good luck with your studies!";
  }

  // Fallback
  return `I'm not sure I understand that. Try asking about:\n\n• **Study groups** (create, find, join)\n• **Mentors** (find, request)\n• **Sessions & scheduling**\n• **Profile editing**\n• **Chat & notifications**\n\nOr type **help** to see all options. 😊`;
};


// ── Component ──────────────────────────────────────────────────────────────
const ChatbotToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "👋 Hi! I'm your AI Study Assistant. I can help you find study groups, connect with mentors, or answer questions about the platform." },
    { from: 'bot', text: 'What would you like help with today?' },
  ]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const sendUserMessage = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { from: 'user', text: trimmed }]);
    setInputValue('');
    setIsTyping(true);

    // Simulate typing delay (700–1200ms based on response length)
    const response = getResponse(trimmed);
    const delay = Math.min(400 + response.length * 5, 1400);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { from: 'bot', text: response }]);
    }, delay);
  };

  const handleSend = () => sendUserMessage(inputValue);
  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSend(); };
  const handleSuggestion = (text) => sendUserMessage(text);

  const suggestions = [
    'Find a study group',
    'Request a mentor',
    'How do sessions work?',
    'How to edit my profile?',
  ];

  // ─ render helpers ─
  const renderText = (text) =>
    text.split('\n').map((line, i) => (
      <span key={i}>
        {line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
          j % 2 === 1 ? <strong key={j}>{part}</strong> : part
        )}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));

  return (
    <>
      {/* ── Slide-in Panel ──────────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '360px',
          maxWidth: '90vw',
          height: '100vh',
          zIndex: 9998,
          transform: isOpen ? 'translateX(0)' : 'translateX(110%)',
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 100%)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          boxShadow: isOpen ? '-12px 0 40px rgba(0,0,0,0.5)' : 'none',
          pointerEvents: isOpen ? 'all' : 'none',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.1rem 1.25rem', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(12px)', flexShrink: 0 }}>
          <img src={helperIcon} alt="Bot" style={{ width: 34, height: 34, objectFit: 'contain', borderRadius: '50%' }} />
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, color: '#f1f5f9', fontWeight: 700, fontSize: '0.95rem' }}>Platform Assistant</p>
            <p style={{ margin: 0, color: '#34d399', fontSize: '0.72rem', fontWeight: 500 }}>● Online</p>
          </div>

        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.1rem 1.1rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {messages.map((msg, i) =>
            msg.from === 'bot' ? (
              <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                <img src={helperIcon} alt="Bot" style={{ width: 26, height: 26, objectFit: 'contain', flexShrink: 0, marginTop: 3 }} />
                <div style={{ background: 'rgba(59,130,246,0.11)', border: '1px solid rgba(59,130,246,0.18)', borderRadius: '0 13px 13px 13px', padding: '0.7rem 0.85rem', maxWidth: '84%', color: '#e2e8f0', fontSize: '0.855rem', lineHeight: 1.65 }}>
                  {renderText(msg.text)}
                </div>
              </div>
            ) : (
              <div key={i} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', borderRadius: '13px 0 13px 13px', padding: '0.7rem 0.85rem', maxWidth: '84%', color: '#fff', fontSize: '0.855rem', lineHeight: 1.65, boxShadow: '0 4px 12px rgba(59,130,246,0.28)' }}>
                  {msg.text}
                </div>
              </div>
            )
          )}

          {/* Typing indicator */}
          {isTyping && (
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
              <img src={helperIcon} alt="Bot" style={{ width: 26, height: 26, objectFit: 'contain', flexShrink: 0, marginTop: 3 }} />
              <div style={{ background: 'rgba(59,130,246,0.11)', border: '1px solid rgba(59,130,246,0.18)', borderRadius: '0 13px 13px 13px', padding: '0.75rem 1rem', display: 'flex', gap: '4px', alignItems: 'center' }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#60a5fa', display: 'inline-block', animation: `bounce 1.2s infinite ${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          )}

          {/* Suggestion chips — only before first user message */}
          {messages.filter((m) => m.from === 'user').length === 0 && !isTyping && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.2rem' }}>
              {suggestions.map((s) => (
                <button key={s} onClick={() => handleSuggestion(s)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '0.38rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(59,130,246,0.14)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.38)'; e.currentTarget.style.color = '#60a5fa'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#94a3b8'; }}
                >{s}</button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bounce keyframes */}
        <style>{`@keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }`}</style>

        {/* Input */}
        <div style={{ padding: '0.8rem 1rem 0.9rem', borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(12px)', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.11)', borderRadius: '13px', padding: '0.5rem 0.55rem 0.5rem 0.95rem' }}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              disabled={isTyping}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#f1f5f9', fontSize: '0.875rem', fontFamily: 'inherit', minWidth: 0 }}
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              style={{ background: inputValue.trim() && !isTyping ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(255,255,255,0.07)', border: 'none', borderRadius: '9px', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: inputValue.trim() && !isTyping ? 'pointer' : 'default', flexShrink: 0, transition: 'all 0.2s' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={inputValue.trim() && !isTyping ? 'white' : '#475569'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p style={{ margin: '0.45rem 0 0', textAlign: 'center', color: '#334155', fontSize: '0.67rem' }}>AI responses are for guidance only.</p>
        </div>
      </div>

      {/* ── Floating Toggle Button ─────────────────────────────────── */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        style={{ position: 'fixed', bottom: isOpen ? '9rem' : '1.75rem', right: '1.75rem', zIndex: 9999, cursor: 'pointer', width: 60, height: 60, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'bottom 0.35s cubic-bezier(0.4,0,0.2,1), transform 0.25s ease', transform: isOpen ? 'rotate(10deg) scale(1.08)' : 'scale(1)', filter: 'drop-shadow(0 6px 18px rgba(0,0,0,0.4))' }}
        title={isOpen ? 'Close Assistant' : 'Open Assistant'}
      >
        <img src={helperIcon} alt="Chat Assistant" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
    </>
  );
};

export default ChatbotToggle;

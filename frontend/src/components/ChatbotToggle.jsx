import React, { useState, useRef, useEffect } from 'react';
import helperIcon from '../assets/helper.png';

// ── Smart response engine ──────────────────────────────────────────────────
const getResponse = (message) => {
  const msg = message.toLowerCase().trim();

  // ── Greetings ─────────────────────────────────────────────────────────────
  if (/^(hi|hello|hey|hiya|yo|sup|good morning|good evening|good afternoon)\b/.test(msg)) {
    return "Hello! 👋 I'm your Platform Assistant. I can help with study groups, mentors, sessions, profile setup, errors, and more. What do you need?";
  }

  // ── Identity ───────────────────────────────────────────────────────────────
  if (/\b(your name|who are you|what are you|are you a bot|are you ai)\b/.test(msg)) {
    return "I'm the Platform Assistant built into TeamUp. I can guide you through finding groups, requesting mentors, updating your profile, creating teams, and resolving issues. 🤖";
  }

  // ── HOME / DASHBOARD ──────────────────────────────────────────────────────
  if (/\b(home|dashboard|home page|main page|landing|start|where am i)\b/.test(msg)) {
    return "The **Home / Dashboard** is your central hub. From here you can:\n\n• Click **Edit Profile** to update your academic details\n• Click **Find Group** to browse and join study groups\n• Click **Create Group** to form a new team\n• View notifications via the 🔔 bell icon in the navbar\n\nUse the top navigation to move between sections. 🏠";
  }

  // ── PROFILE ───────────────────────────────────────────────────────────────
  if (/\b(profile|edit profile|update profile|my details|my info|my account|student portal)\b/.test(msg)) {
    return "To edit your profile, click **Edit Profile** in the navigation bar. You can update:\n\n• **Full Name** — letters & spaces only\n• **Student ID** — 2 letters + 8 digits (e.g. IT21004562)\n• **University Email** — must end with @my.sliit.lk and match your ID\n• **Academic Year** — Year 1 to Year 4\n• **Semester** — Semester 1 or 2\n• **GPA** — between 0.0 and 4.0\n• **Skills** — comma-separated (e.g. React, Java, UI/UX)\n\nClick **Sync Academic Profile** to save. ✏️";
  }

  if (/\b(student id|id format|id error|wrong id|invalid id)\b/.test(msg)) {
    return "Your **Student ID** format is: **2 capital letters + 8 digits**\nExample: `IT21004562`\n\nCommon mistakes:\n• Lowercase letters (use IT not it)\n• Wrong number of digits\n• Spaces or special characters\n\nFix the format — the field will turn green ✅ when valid.";
  }

  if (/\b(email|university email|email error|email format|sliit email|email not matching)\b/.test(msg)) {
    return "Your **University Email** must:\n\n1. End with `@my.sliit.lk`\n2. Have your **Student ID** before the @ (e.g. IT21004562@my.sliit.lk)\n\nIf you see 'Email ID must match Student ID', make sure the part before @ exactly equals your Student ID field. 📧";
  }

  if (/\b(gpa|grade point|gpa error|invalid gpa|gpa range)\b/.test(msg)) {
    return "Your **GPA** must be a number between **0.0 and 4.0**.\n\nExamples: `3.80`, `2.50`, `4.00`\n\nIf the field has a red border, correct the value and click somewhere else to clear the error. 📊";
  }

  if (/\b(profile photo|photo|picture|avatar|upload photo|change photo|camera)\b/.test(msg)) {
    return "To update your **profile photo**:\n\n1. Go to **Edit Profile**\n2. Click the 📷 camera icon on your avatar\n3. Select an image (max **5MB**)\n4. Preview appears immediately\n5. Click **Sync Academic Profile** to save\n\nIf you see 'File size too large', choose a smaller image. 🖼️";
  }

  if (/\b(skill|skills|expertise|add skill|special skill)\b/.test(msg)) {
    return "To add **Skills** to your profile:\n\n1. Go to **Edit Profile**\n2. Find the **Special Skills** field\n3. Type comma-separated skills: e.g. `React, Node.js, Figma, Java`\n4. Click **Sync Academic Profile** to save\n\nSkills appear as colorful tags on your profile and are visible to group leaders and mentors. 💡";
  }

  if (/\b(mentorship toggle|mentorship switch|open to mentor|interested in mentorship)\b/.test(msg)) {
    return "The **Mentorship Toggle** on your profile controls whether you appear as available to mentor students.\n\n• **OFF** → You won't receive mentor requests\n• **ON** → Your application goes to admin for approval\n\nStatuses:\n⏳ **Pending** — awaiting admin review\n✅ **Approved** — verified mentor\n❌ **Rejected** — toggle again to re-apply\n\nYou cannot toggle while Pending or Approved. 🎓";
  }

  if (/\b(save profile|profile not saving|sync profile|profile error|failed to save)\b/.test(msg)) {
    return "If your profile isn't saving, check:\n\n1. **Red borders** on any field — fix those first\n2. **Email mismatch** — email prefix must match Student ID\n3. **GPA out of range** — must be 0.0 to 4.0\n4. **Network issue** — check your internet\n5. **Session expired** — try logging out and back in\n\nPress F12 to open the browser console for more details. 🔧";
  }

  // ── CREATE GROUP ──────────────────────────────────────────────────────────
  if (/\b(create group|make group|new group|start group|form group|create team)\b/.test(msg)) {
    return "To **Create a Group**:\n\n1. Click **Create Group** in the navigation\n2. Fill in **Module Name** (e.g. IT Project Management)\n3. Fill in **Module Code** (e.g. IT3020)\n4. Optionally add a **Project Title**\n5. Set **Maximum Group Size** (2–10)\n6. Optionally enter member **Student IDs** — validated live\n7. Click **Create Project Group**\n\nYou are automatically the **Group Leader**. Members can also join later via join requests! 📚";
  }

  if (/\b(module name|module code|module info)\b/.test(msg)) {
    return "When creating a group you need:\n\n• **Module Name** — e.g. `IT Project Management`\n• **Module Code** — e.g. `IT3020`\n• **Project Title** — optional, e.g. `AI-Powered Platform`\n\nThese appear on your group card so other students can find your team. 📋";
  }

  if (/\b(max members|group size|team size|how many members)\b/.test(msg)) {
    return "**Maximum Members** sets how many people can join your group (including you as leader). Range: **2 to 10**.\n\nWhen you increase the number, new member input slots appear. Members added later via join requests also count toward this limit. 👥";
  }

  if (/\b(add member|member slots|member id|member not found|invalid member)\b/.test(msg)) {
    return "To add members when creating a group:\n\n1. Set **Maximum Members** to your desired size\n2. Type a student's **University ID** in each slot\n3. A **green preview card** appears if the student is found ✅\n4. A **red error** appears if not found ❌\n\nLeave slots empty — members can join later via a join request. 🔍";
  }

  if (/\b(group creation error|failed to create|create group error)\b/.test(msg)) {
    return "If group creation fails:\n\n1. **Missing fields** — Module Name and Code are required\n2. **Invalid member ID** — ensure all filled slots show a green preview\n3. **Profile incomplete** — you need a name and studentId set\n4. **Network error** — check your internet\n5. **Server error** — the backend may be down\n\nRefresh and try again. 🔧";
  }

  // ── FIND GROUP ────────────────────────────────────────────────────────────
  if (/\b(find group|browse group|search group|group list|available groups|discover group)\b/.test(msg)) {
    return "To **Find a Group**:\n\n1. Click **Find Group** in the navigation\n2. Use the **search bar** to filter by module name or code\n3. Browse group cards — each shows module info, capacity, and leader\n4. Click **Request to Join** on any group with open spots\n5. The group leader approves or rejects your request\n\nYou'll get a 🔔 notification when the leader responds! 🔍";
  }

  if (/\b(join group|join request|request to join|send request|join button)\b/.test(msg)) {
    return "To **join a group**:\n\n1. Go to **Find Group**\n2. Find a group with available spots\n3. Click **Request to Join**\n4. The group leader is notified\n5. Once approved, you're added to the group\n\n⚠️ You cannot join if:\n• The group is full\n• You're already a member\n• You have a pending request for that group\n\nCheck **My Groups** (📁 icon) to view joined groups. 📨";
  }

  if (/\b(my groups|joined groups|view my group|group i joined|folder icon)\b/.test(msg)) {
    return "To view your **joined groups**:\n\n1. Go to **Find Group**\n2. Click the **📁 folder icon** next to the search bar\n3. A dropdown shows all your joined groups\n4. Click any group to see **full details** — leader, members, module info, project title\n\nThe group details panel slides in from the right. 📁";
  }

  if (/\b(view group|group details|group panel|group info|see group|open group)\b/.test(msg)) {
    return "Click any group in the **My Groups dropdown** to open a slide-in details panel showing:\n\n• Module name & code\n• Project title\n• Group leader's profile card\n• All members' profile cards\n• Your membership confirmation badge\n\nClick any member's name to open their **profile preview**. ℹ️";
  }

  if (/\b(view member|member profile|member card|click member|mini profile)\b/.test(msg)) {
    return "In **Find Group**, click any **member or leader name** to open their profile preview panel.\n\nThe panel shows:\n• Name, Student ID, and photo\n• Academic Year, Semester, and GPA\n• Skills & Expertise tags\n\nClose it with the **X** button or by clicking outside. 👤";
  }

  if (/\b(group leader|leader role|who is leader|leader badge)\b/.test(msg)) {
    return "The **Group Leader** is the student who created the group. They appear with a green leader badge on group cards.\n\nLeader responsibilities:\n• Approving or rejecting join requests\n\nYou automatically become leader when you create a group. 👑";
  }

  if (/\b(approve request|reject request|incoming request|pending request|group request)\b/.test(msg)) {
    return "As a **Group Leader**, you receive join requests when students click 'Request to Join'.\n\n• You'll receive a 🔔 notification for each new request\n• Approved students are automatically added to your group\n• Rejected students are notified\n\nStudents can check their request status under **My Groups** (📁 icon). ✅";
  }

  if (/\b(group full|no spots|cannot join|capacity full)\b/.test(msg)) {
    return "If a group is **Full**:\n\n• Search for other available groups with open spots\n• **Create your own group** and be the leader\n• The group's capacity bar shows how full it is\n\nYou can't request to join a full group. 📊";
  }

  if (/\b(find members|available students|browse students|member search)\b/.test(msg)) {
    return "The **Find Members** section is at the bottom of the **Find Group** page.\n\nIt shows all registered students and seniors. You can:\n• Browse student cards with skills and academic info\n• Click **Invite to Group** to send an invitation (if you're a leader)\n• Click any student's name to view their full profile\n\nUse the search bar to filter by name or ID. 👥";
  }

  if (/\b(already member|already in group|duplicate request|already pending)\b/.test(msg)) {
    return "Common join errors:\n\n• **'Already a member'** — you're already in this group\n• **'Already have a pending request'** — your previous request is waiting for the leader's decision\n\nCheck **My Groups** (📁 icon) to see your memberships, or wait for the leader's response. ⏳";
  }

  if (/\b(no groups|no results|empty|nothing found|group not showing)\b/.test(msg)) {
    return "If no groups appear:\n\n• Clear the search bar — a filter may be active\n• No groups have been created yet — **create one** yourself!\n• Backend may be unavailable — try refreshing\n\nIf the page stays blank, check your internet connection. 🔄";
  }

  // ── MENTORSHIP ────────────────────────────────────────────────────────────
  if (/\b(mentor|senior|mentorship|guidance|find mentor|request mentor|get mentor)\b/.test(msg)) {
    return "To request a **Mentor**:\n\n1. Go to **Request Mentor** in the navigation\n2. Browse verified seniors and their skills\n3. Click **Send Request** with a message\n4. Wait for the senior to accept or reject\n\nOnce accepted, a **private chat room** opens automatically! 🎓";
  }

  if (/\b(mentor request sent|mentorship pending|request status)\b/.test(msg)) {
    return "After sending a **mentor request**:\n\n• Status shows as **Pending**\n• The senior is notified\n• You get a 🔔 notification when they respond\n• **Accepted** → chat room opens\n• **Rejected** → send a request to a different senior\n\nView all sent requests under **My Requests** in the navigation. 📨";
  }

  if (/\b(become mentor|apply mentor|senior role|mentor application|want to mentor)\b/.test(msg)) {
    return "To **become a mentor**:\n\n1. Go to **Edit Profile**\n2. Toggle **Mentorship ON**\n3. Admin reviews your application\n4. Status shows ⏳ **Pending** until reviewed\n5. Once ✅ **Approved**, you receive mentorship requests\n\nMake sure your skills are filled in — students use these to choose mentors! 🎓";
  }

  // ── SESSIONS ──────────────────────────────────────────────────────────────
  if (/\b(session|sessions|meeting|schedule|book|booking|upcoming)\b/.test(msg)) {
    return "**Sessions** are scheduled meetings between a mentor and student.\n\n• Mentors schedule sessions after a request is accepted\n• View all sessions in the **Sessions** page\n• Each session shows: date, time, topic, and meeting link\n• You'll get a 🔔 notification when a session is booked\n\nSessions are managed by your mentor. 📅";
  }

  // ── CHAT ──────────────────────────────────────────────────────────────────
  if (/\b(chat|message|talk|communicate|inbox|dm|private chat)\b/.test(msg)) {
    return "**Chat** becomes available once your mentorship request is **accepted**.\n\n• Go to **Chat** in the navigation\n• Messages are sent in **real time**\n• Each accepted mentorship creates its own private chat room\n\nIf you don't see a chat, your request may still be pending. 💬";
  }

  // ── NOTIFICATIONS ─────────────────────────────────────────────────────────
  if (/\b(notification|notifications|alert|bell|not getting notified)\b/.test(msg)) {
    return "Notifications appear in the 🔔 **bell icon** in the top nav.\n\nYou'll be notified when:\n• A mentor **accepts or rejects** your request\n• A **join request** is approved or rejected\n• A new **session** is scheduled\n• You receive a **chat message**\n\nClick the bell to view all. Click each one to mark as read. 🔔";
  }

  // ── AUTH ──────────────────────────────────────────────────────────────────
  if (/\b(login|log in|sign in|cannot login|login error|wrong password|forgot password)\b/.test(msg)) {
    return "To **log in**:\n\n1. Go to the **Login** page\n2. Enter your university email and password\n3. Click **Login**\n\nCommon errors:\n• **'Invalid credentials'** — check email and password\n• **'User not found'** — you may not be registered\n• Forgot password? Contact your **platform administrator**\n\nCheck your Caps Lock is off! 🔐";
  }

  if (/\b(register|sign up|create account|new account|registration)\b/.test(msg)) {
    return "To **register**:\n\n1. Go to the **Register** page\n2. Enter your name, email, and password\n3. Select your role: **Student** or **Senior**\n4. Optionally upload a profile photo\n5. Click **Register**\n\nAfter registering, **complete your profile** immediately — add your Student ID, GPA, year, and skills! 📝";
  }

  if (/\b(logout|log out|sign out|exit account)\b/.test(msg)) {
    return "To **log out**, click your profile icon or name in the top navigation, then select **Logout**.\n\nYour session ends and you'll be redirected to the login page. All data is saved — log back in anytime! 👋";
  }

  // ── ERRORS & TROUBLESHOOTING ──────────────────────────────────────────────
  if (/\b(error|something went wrong|page not loading|blank page|refresh|bug|broken|not working)\b/.test(msg)) {
    return "If you're experiencing an error, try these steps:\n\n1. **Refresh the page** (Ctrl+R)\n2. **Log out and back in** — session may have expired\n3. **Clear browser cache** (Ctrl+Shift+Delete)\n4. Check your **internet connection**\n5. Make sure the **backend server** is running (port 5000)\n\nIf the problem persists, contact your platform administrator. 🔧";
  }

  if (/\b(server error|500|backend down|api error|connection error|cannot connect)\b/.test(msg)) {
    return "A **server error** means the backend can't respond.\n\nPossible causes:\n• Backend server not running (port 5000)\n• MongoDB database connection down\n• Network firewall blocking the connection\n\nSolutions:\n• Ask your admin to check if `npm start` is running in the backend folder\n• Check MongoDB Atlas connection\n• Try again in a few minutes 🛠️";
  }

  if (/\b(not authorized|unauthorized|401|403|token|session expired)\b/.test(msg)) {
    return "A **401/403 error** means your session has expired or is invalid.\n\nFix:\n1. **Log out** from the platform\n2. **Log back in** with your credentials\n3. If it keeps happening, clear browser cookies\n\nJWT tokens expire after a period for security. 🔐";
  }

  // ── ADMIN ─────────────────────────────────────────────────────────────────
  if (/\b(admin|admin panel|admin dashboard|manage users|platform admin)\b/.test(msg)) {
    return "The **Admin Panel** is only for platform administrators.\n\nAdmins can:\n• Approve or reject **mentor applications**\n• Manage all **registered users**\n• Monitor **platform statistics**\n\nContact your designated admin for escalated issues. 🛡️";
  }

  // ── AVAILABILITY ──────────────────────────────────────────────────────────
  if (/\b(availability|available|time slot|slot|free time)\b/.test(msg)) {
    return "**Seniors/Mentors** set availability slots so students know when they're free.\n\nAs a **student**, view a mentor's availability on their profile in the **Request Mentor** page.\n\nAs a **senior**, manage your availability from the **Availability** section in your dashboard. 🕐";
  }

  // ── HELP OVERVIEW ─────────────────────────────────────────────────────────
  if (/\b(help|what can you do|features|options|how does this work|overview)\b/.test(msg)) {
    return `Here's everything I can help with:\n\n🏠 **Home** — navigate the dashboard\n📝 **Profile** — update details, photo, skills, GPA\n📚 **Create Group** — form a study team\n🔍 **Find Group** — browse, join, and view groups\n👤 **View Members** — click any member for their profile\n🎓 **Mentorship** — find mentors, send requests, become a mentor\n📅 **Sessions** — scheduled mentor meetings\n💬 **Chat** — real-time messaging\n🔔 **Notifications** — stay updated on requests\n🔐 **Auth** — login, register, logout\n🔧 **Errors** — troubleshoot common problems\n\nJust type your question! 😊`;
  }

  // ── THANKS ────────────────────────────────────────────────────────────────
  if (/\b(thank|thanks|thank you|appreciate|great|awesome|perfect|helpful|nice|good job)\b/.test(msg)) {
    return "You're welcome! 😊 Feel free to ask me anything else about the platform anytime!";
  }

  // ── BYE ───────────────────────────────────────────────────────────────────
  if (/\b(bye|goodbye|see you|later|exit|close|done|cya)\b/.test(msg)) {
    return "Goodbye! 👋 Come back anytime. Good luck with your studies and group projects! 🎓";
  }

  // ── FALLBACK ──────────────────────────────────────────────────────────────
  return `I'm not sure I understand that. Try asking about:\n\n• **Profile** — editing details, GPA, photo, skills\n• **Create Group** — forming a study team\n• **Find Group** — joining groups, viewing members\n• **Mentorship** — finding or becoming a mentor\n• **Sessions, Chat, Notifications**\n• **Errors & Troubleshooting**\n\nOr type **help** to see all topics. 😊`;
};


// ── Component ──────────────────────────────────────────────────────────────
const ChatbotToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "👋 Hi! I'm your Platform Assistant. I can help you find study groups, connect with mentors, troubleshoot issues, or answer any questions about TeamUp." },
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
    'How do I edit my profile?',
    'How to create a group?',
    'How to join a group?',
    'How do I request a mentor?',
  ];

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

          {/* Suggestion chips */}
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

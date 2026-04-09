import React, { useState, useEffect, useContext } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, parseISO, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Search, Filter, User, Video, Calendar as CalendarIcon, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import { Card } from '../../components/Card';
import { Modal } from '../../components/Modal';
import { Button } from '../../components/Button';

export default function SessionManager() {
  const { user } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('scheduled'); // 'scheduled' or 'completed'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' or 'oldest'
  
  // Meeting Modal State
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);
  const [sessionToJoin, setSessionToJoin] = useState(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const { data } = await api.get('/sessions');
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions', error);
    } finally {
      setLoading(false);
    }
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Visual Status Helper
  const getStatusDot = (status) => {
    if (status === 'scheduled') return <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block mr-1.5 shadow-sm"></span>;
    if (status === 'completed') return <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block mr-1.5 shadow-sm"></span>;
    return <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block mr-1.5 shadow-sm"></span>;
  };

  // Calculate mapping
  const getDailySessions = (day) => {
    return sessions.filter(session => {
       if(!session.availability?.date) return false;
       return isSameDay(parseISO(session.availability.date), day);
    });
  };
  // ── Send meeting link email to student (non-blocking) ────────────────────
  const sendMeetingEmailToStudent = async (session, teamsUrl) => {
    if (!session?.student?.email) {
      toast('No student email found — link not sent.', { icon: '⚠️' });
      return;
    }
    setIsSendingEmail(true);
    try {
      const sessionTime = session.availability
        ? `${session.availability.date ? new Date(session.availability.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : ''} · ${session.availability.startTime || ''} – ${session.availability.endTime || ''}`
        : 'Session time not specified';

      await api.post('/email/send-meeting-link', {
        studentEmail: session.student.email,
        studentName: session.student.name || 'Student',
        meetingLink: teamsUrl,
        sessionTime,
      });
      toast.success('Meeting link sent to ' + (session.student.name || 'student') + '!');
    } catch (err) {
      console.error('Email send failed:', err);
      toast.error('Failed to email the student. The meeting is still open.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Filtering & Sorting logic
  const filterSessions = (data) => {
    return data
      .filter(s => {
        const matchesStatus = s.status === filterStatus;
        const matchesSearch = searchQuery === '' || 
          s.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.senior?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.student?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        const dateA = new Date(a.availability.date + 'T' + a.availability.startTime);
        const dateB = new Date(b.availability.date + 'T' + b.availability.startTime);
        return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
      });
  };

  const displayUpcoming = filterSessions(sessions);
  const displayCompleted = filterSessions(sessions);

  return (
    <div className="max-w-[1600px] mx-auto animate-fade-in relative z-10 pb-12 transition-colors duration-300">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight font-heading">Session Management Calendar</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">Manage your interactive mentorship calendar and track your impact.</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* Left Pane: Interactive Monthly Calendar */}
        <div className="w-full xl:w-7/12">
          <Card className="p-6 bg-white shadow-xl shadow-slate-200/50 border border-slate-200 rounded-2xl overflow-hidden">
            
            {/* Calendar Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <div className="flex items-center gap-4">
                <button onClick={prevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 w-40 text-center">
                  {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <button onClick={nextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
 
              {/* Legend matching image exactly */}
              <div className="flex items-center gap-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <div className="flex items-center">{getStatusDot('scheduled')} Upcoming</div>
                <div className="flex items-center">{getStatusDot('completed')} Completed</div>
                <div className="flex items-center">{getStatusDot('pending')} Pending</div>
              </div>
            </div>

            {/* Calendar Grid Container */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              {/* Day Headers */}
              <div className="grid grid-cols-7 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                {weekDays.map(day => (
                  <div key={day} className="py-3 text-center text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-widest">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days Matrix */}
              <div className="grid grid-cols-7 bg-slate-200 dark:bg-slate-700 gap-[1px]">
                {calendarDays.map((day, i) => {
                  const daySessions = getDailySessions(day);
                  const isSelected = isSameDay(day, selectedDate);
                  
                  return (
                    <div 
                      key={day.toString()}
                      onClick={() => setSelectedDate(day)}
                      className={`min-h-[110px] bg-white dark:bg-slate-800 p-2 cursor-pointer transition-all duration-200 relative group
                        ${!isSameMonth(day, monthStart) ? 'text-slate-400 bg-slate-50/50 dark:bg-slate-900/50' : 'text-slate-700 dark:text-slate-300'}
                        ${isSelected ? 'bg-emerald-100/40 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20 shadow-inner z-10' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'}
                      `}
                    >
                      <span className={`text-sm font-semibold p-1 inline-flex items-center justify-center rounded-full
                         ${isToday(day) && !isSelected ? 'bg-slate-800 text-white w-7 h-7' : ''}
                      `}>
                         {format(day, 'd')}
                      </span>
                      
                      {/* Session Indicators rendering */}
                      <div className="mt-2 space-y-1">
                        {daySessions.map(ds => (
                          <div key={ds._id} className="flex items-center text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                            {getStatusDot(ds.status)} {ds.status.charAt(0).toUpperCase() + ds.status.slice(1)}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Pane: Session Lists */}
        <div className="w-full xl:w-5/12 space-y-6">
          
          {/* Controls Bar */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-slate-800 shadow-sm font-medium text-slate-700 dark:text-slate-200 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select 
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer transition-colors"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="scheduled">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
            <select 
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer transition-colors"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          <div className="space-y-8 min-h-[400px]">
            {/* Upcoming Sessions Section */}
            {filterStatus === 'scheduled' && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight font-heading">Upcoming Sessions</h3>
                {displayUpcoming.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                    <p className="text-slate-500 font-medium">No upcoming sessions found.</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-4">
                    {displayUpcoming.map(session => (
                      <Card key={session._id} className="flex-1 min-w-[300px] border-l-4 border-l-indigo-500 border-t border-r border-b border-slate-200 dark:border-slate-800 shadow-md p-5 rounded-xl bg-white dark:bg-slate-900/50 hover:shadow-lg transition-all">
                        <div className="space-y-2 mb-4 text-sm">
                          <p className="font-extrabold text-slate-800 dark:text-slate-200">Date: <span className="font-semibold">{format(parseISO(session.availability.date), 'MMM dd, yyyy')}</span> | Time: <span className="font-semibold">{session.availability.startTime} - {session.availability.endTime}</span></p>
                          <p className="font-extrabold text-slate-800 dark:text-slate-200">Mentor: <span className="font-semibold">{session.senior.name} (Senior)</span></p>
                          <p className="font-extrabold text-slate-800 dark:text-slate-200">Student: <span className="font-semibold">{session.student?.name || 'Awaiting'}</span></p>
                          <p className="font-extrabold text-slate-800 dark:text-slate-200">Topic: <span className="font-semibold">{session.topic || 'General Guidance'}</span></p>
                          <p className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center">Status: <span className="font-semibold ml-1">{getStatusDot('scheduled')} Upcoming</span></p>
                        </div>
                        {/* Embedded User Avatars & Button */}
                        <div className="flex justify-between items-center mt-6">
                          <div className="flex -space-x-3">
                             <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-slate-600 font-bold text-xs"><User size={14} /></div>
                             <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-blue-600 font-bold text-xs"><User size={14} /></div>
                          </div>
                          <Button 
                            variant="primary"
                            onClick={() => {
                              setSessionToJoin(session);
                              setIsMeetingModalOpen(true);
                            }}
                            className="w-full ml-6 shadow-md shadow-primary-500/20 flex justify-center items-center gap-2 group"
                          >
                            <Video size={18} className="group-hover:scale-110 transition-transform" />
                            Join Meeting
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Completed Sessions Section */}
            {filterStatus === 'completed' && (
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight font-heading">Completed Sessions</h3>
                {displayCompleted.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                    <p className="text-slate-500 font-medium">No completed sessions found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayCompleted.map(session => (
                      <Card key={session._id} className="border-t-4 border-t-indigo-500 border-l border-r border-b border-slate-200 dark:border-slate-800 shadow-md p-5 rounded-xl bg-white dark:bg-slate-900/50 hover:shadow-lg transition-all">
                         <div className="space-y-1.5 mb-4 text-xs">
                          <p className="font-extrabold text-slate-800 dark:text-slate-200">Date: <span className="font-semibold">{format(parseISO(session.availability.date), 'MMM d, yyyy')}</span></p>
                          <p className="font-extrabold text-slate-800 dark:text-slate-200">Time: <span className="font-semibold">{session.availability.startTime} - {session.availability.endTime}</span></p>
                          <p className="font-extrabold text-slate-800 dark:text-slate-200 truncate">Mentor: <span className="font-semibold">{session.senior.name}</span></p>
                          <p className="font-extrabold text-slate-800 dark:text-slate-200 truncate">Student: <span className="font-semibold">{session.student?.name || 'Unknown'}</span></p>
                          <p className="font-extrabold text-slate-800 dark:text-slate-200 truncate">Topic: <span className="font-semibold">{session.topic || 'Guidance Session'}</span></p>
                          <p className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center">Status: <span className="font-semibold ml-1 text-blue-600">Completed</span></p>
                          {session.feedback && <p className="font-extrabold text-slate-800 dark:text-slate-200">Feedback: <span className="font-semibold">{session.feedback}</span></p>}
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <div className="flex -space-x-2">
                             <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-slate-600 font-bold text-[10px]"><User size={12} /></div>
                             <div className="w-7 h-7 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-blue-600 font-bold text-[10px]"><User size={12} /></div>
                          </div>
                          <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                            <Video size={16} />
                          </button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
        
      </div>

      {/* Meeting Join Confirmation Modal */}
      <Modal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
        title="Join Mentorship Meeting"
        footer={(
          <>
            <Button variant="ghost" onClick={() => setIsMeetingModalOpen(false)}>Cancel</Button>
            <Button 
              variant="primary"
              className="shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 group"
              disabled={isSendingEmail}
              onClick={() => {
                const teamsUrl = sessionToJoin?.meetingLink || 'https://teams.microsoft.com/l/meetup-join/...';
                // 1. Open Teams immediately — never block this
                window.open(teamsUrl, '_blank');
                // 2. Close modal
                setIsMeetingModalOpen(false);
                // 3. Send email to student asynchronously (non-blocking)
                sendMeetingEmailToStudent(sessionToJoin, teamsUrl);
              }}
            >
              <ExternalLink size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              {isSendingEmail ? 'Sending...' : 'Open Teams'}
            </Button>
          </>
        )}
      >
        <div className="flex flex-col items-center text-center space-y-4 py-2">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center animate-bounce-slow">
            <Video size={40} />
          </div>
          <div>
            <p className="text-slate-800 font-bold text-lg">Ready to start the session?</p>
            <p className="text-slate-500 text-sm mt-1 leading-relaxed">
              This will open the Microsoft Teams meeting with <span className="text-slate-900 font-bold">{sessionToJoin?.student?.name}</span> for your session on <span className="font-bold">{sessionToJoin?.availability?.date && format(parseISO(sessionToJoin.availability.date), 'MMM dd')}</span>.
            </p>
          </div>
        </div>
      </Modal>

    </div>
  );
}

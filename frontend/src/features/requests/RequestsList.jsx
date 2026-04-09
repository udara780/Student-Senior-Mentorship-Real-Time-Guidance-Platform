import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { User, UserSearch, AlertCircle, MessageSquare, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function RequestsList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const isManageMode = location.pathname === '/requests';

  // Modal States (only used in manage mode)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [requestToReject, setRequestToReject] = useState(null);
  const [requestToAccept, setRequestToAccept] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/requests/incoming');
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch requests', error);
      toast.error('Failed to load incoming requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    if (status === 'rejected' && !isConfirmModalOpen) {
      const target = requests.find(r => r._id === id);
      setRequestToReject(target);
      setIsConfirmModalOpen(true);
      return;
    }
    if (status === 'accepted' && !isAcceptModalOpen) {
      const target = requests.find(r => r._id === id);
      setRequestToAccept(target);
      setIsAcceptModalOpen(true);
      return;
    }
    setIsConfirmModalOpen(false);
    setIsAcceptModalOpen(false);
    try {
      await api.put(`/requests/${id}`, { status });
      setRequests(prev => prev.map(req =>
        req._id === id ? { ...req, status, updatedAt: new Date() } : req
      ));
      toast.success(status === 'accepted' ? 'Request Approved! Starting chat...' : 'Request Rejected');
      if (status === 'accepted') {
        setTimeout(() => navigate('/chat'), 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process request');
      fetchRequests();
    }
  };

  const displayPending = requests.filter(req => req.status === 'pending');
  // Sort history to show most recently updated first
  const displayHistory = requests
    .filter(req => req.status !== 'pending')
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent flex rounded-full animate-spin shadow-lg"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fade-in space-y-12 pb-16 transition-colors duration-300">

      {/* ── Page Header ───────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200/60 dark:border-slate-800 shadow-sm">
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-indigo-500/10 rounded-full blur-[60px] -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <MessageSquare size={22} />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
                Mentorship Inbox
              </h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm ml-14">
              Review, approve or decline incoming student mentorship requests.
            </p>
          </div>
          {displayPending.length > 0 && (
            <div className="flex-shrink-0 flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-2 rounded-2xl text-sm font-bold ml-14 sm:ml-0">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {displayPending.length} pending review
            </div>
          )}
        </div>
      </div>

      {/* Pending Section */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight font-heading">Pending Requests</h2>
          <span className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 px-2.5 py-0.5 rounded-full text-sm font-bold">{displayPending.length}</span>
        </div>
        
        <div className="space-y-4">
          {displayPending.length === 0 ? (
            <div className="py-12 text-center text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
               <UserSearch size={32} className="mx-auto mb-2 text-slate-400 dark:text-slate-600 opacity-50" />
               <p className="font-semibold">No pending requests yet.</p>
               <p className="text-sm mt-1">Students who request your mentorship will appear here.</p>
            </div>
          ) : (
            displayPending.map((req) => (
              <Card key={req._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl bg-white dark:bg-slate-800 hover:shadow-md transition-all">
                <div className="flex items-start sm:items-center gap-5 w-full">
                  <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-900 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                    {req.student?.profilePhoto ? (
                      <img src={req.student.profilePhoto} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User size={28} className="text-slate-400 dark:text-slate-600" />
                    )}
                  </div>
                  <div className="flex flex-col justify-center flex-1">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 leading-tight">
                      {req.student?.name || 'Unknown Student'}
                    </h3>
                    <p className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                      {req.student?.email}
                    </p>
                    <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-1">
                      <Clock size={11} /> Requested: {format(new Date(req.createdAt), 'EEE, MMM d, h:mm a')}
                    </p>
                  </div>

                  {isManageMode ? (
                    /* ── Manage mode: Accept / Reject buttons ── */
                    <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
                      <Button
                        variant="primary"
                        onClick={() => handleAction(req._id, 'accepted')}
                        className="shadow-none hover:shadow-lg hover:-translate-y-0.5"
                      >
                        Accept
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleAction(req._id, 'rejected')}
                        className="text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 shadow-none border border-transparent"
                      >
                        Reject
                      </Button>
                    </div>
                  ) : (
                    /* ── View-only mode: status badge ── */
                    <div className="flex-shrink-0 ml-auto">
                      <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Awaiting Review
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* History Section exactly mapping the layout sub-container */}
      <section>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6 tracking-tight font-heading">Recent History</h2>
        
        <div className="space-y-4">
           {displayHistory.length === 0 ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-medium">No history logged yet.</div>
          ) : (
             displayHistory.map((req) => {
               const isApproved = req.status === 'accepted';
               return (
                  <Card key={req._id} className="flex items-center justify-between p-4 px-5 border border-slate-200 dark:border-slate-800 shadow-sm rounded-xl bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors cursor-default even:bg-slate-50/50 dark:even:bg-slate-800/30">
                    
                    <div className="flex items-center gap-4 truncate">
                      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                        {req.student?.profilePhoto ? (
                          <img src={req.student.profilePhoto} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User size={20} className="text-slate-400 dark:text-slate-600" />
                        )}
                      </div>
                      <p className="font-semibold text-slate-800 dark:text-slate-200 text-[15px] truncate">
                        {req.student?.name || 'Unknown User'} - <span className="text-slate-500 dark:text-slate-400 font-medium">{format(new Date(req.updatedAt || req.createdAt), 'EEE, MMM d, h:mm a')}</span>
                      </p>
                    </div>

                    <div className="ml-4 flex-shrink-0">
                       <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow-sm
                         ${isApproved ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                          {isApproved ? 'Approved' : 'Rejected'}
                       </span>
                    </div>

                  </Card>
               );
             })
          )}
        </div>
      </section>

      {/* ── Modals (manage mode only) ───────────────────────── */}
      {isManageMode && (
        <>
          <Modal
            isOpen={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
            title="Confirm Rejection"
            footer={(
              <>
                <Button variant="ghost" onClick={() => setIsConfirmModalOpen(false)}>Cancel</Button>
                <Button variant="danger" className="bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20"
                  onClick={() => handleAction(requestToReject?._id, 'rejected')}>
                  Confirm Rejection
                </Button>
              </>
            )}
          >
            <div className="flex flex-col items-center text-center space-y-4 py-2">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center">
                <AlertCircle size={40} />
              </div>
              <div>
                <p className="text-slate-800 dark:text-slate-100 font-bold text-lg">Are you absolutely sure?</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  You're about to reject <span className="font-bold text-slate-900 dark:text-slate-100">{requestToReject?.student?.name}</span>'s request.
                </p>
              </div>
            </div>
          </Modal>

          <Modal
            isOpen={isAcceptModalOpen}
            onClose={() => setIsAcceptModalOpen(false)}
            title="Approve Request"
            footer={(
              <>
                <Button variant="ghost" onClick={() => setIsAcceptModalOpen(false)}>Cancel</Button>
                <Button variant="primary" className="shadow-lg shadow-primary-500/20"
                  onClick={() => handleAction(requestToAccept?._id, 'accepted')}>
                  Accept & Start Chat
                </Button>
              </>
            )}
          >
            <div className="flex flex-col items-center text-center space-y-4 py-2">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center">
                <MessageSquare size={40} />
              </div>
              <div>
                <p className="text-slate-800 dark:text-slate-100 font-bold text-lg">Start a new journey?</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Accept <span className="font-bold text-slate-900 dark:text-slate-100">{requestToAccept?.student?.name}</span>'s request and open chat.
                </p>
              </div>
            </div>
          </Modal>
        </>
      )}

    </div>
  );
}

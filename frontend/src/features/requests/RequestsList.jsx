import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Modal } from '../../components/Modal';
import { User, UserSearch, AlertCircle, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

export default function RequestsList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Modal States
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
    // If rejecting, trigger confirmation first
    if (status === 'rejected' && !isConfirmModalOpen) {
      const target = requests.find(r => r._id === id) || (displayPending.find(p => p._id === id));
      setRequestToReject(target);
      setIsConfirmModalOpen(true);
      return;
    }

    // If accepting, trigger confirmation first
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
      
      // Optimistic real-time UI update
      setRequests(prev => prev.map(req => 
         req._id === id ? { ...req, status, updatedAt: new Date() } : req
      ));
      
      toast.success(status === 'accepted' ? 'Request Approved! Starting chat...' : 'Request Rejected');
      
      if (status === 'accepted') {
        // Short delay to let the toast be seen before navigating
        setTimeout(() => {
          navigate('/chat');
        }, 1500);
      }
    } catch (error) {
      console.error(`Failed to ${status} request`, error);
      toast.error(error.response?.data?.message || `Failed to process request`);
      // Revert optimism if failed
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
               <p className="font-semibold">You have no pending requests to review.</p>
            </div>
          ) : (
            displayPending.map((req) => (
              <Card key={req._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 border border-slate-200 dark:border-slate-700 shadow-sm rounded-xl bg-white dark:bg-slate-800 hover:shadow-md transition-all">
                
                {/* User identification block */}
                <div className="flex items-start sm:items-center gap-5 w-full sm:w-auto">
                  <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-900 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700">
                    {req.student?.profilePhoto ? (
                      <img src={req.student.profilePhoto} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <User size={28} className="text-slate-400 dark:text-slate-600" />
                    )}
                  </div>
                  
                  <div className="flex flex-col justify-center">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 leading-tight">
                      {req.student?.name || 'Unknown Student'}
                    </h3>
                    <p className="text-[13px] font-semibold text-slate-600 dark:text-slate-400 mt-1">
                      Requested: {format(new Date(req.createdAt), 'EEE, MMM d, h:mm a')}
                    </p>
                    <div className="mt-3">
                      <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
                        Pending Review
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Interaction Buttons */}
                <div className="flex items-center gap-3 mt-5 sm:mt-0 w-full sm:w-auto">
                  <Button 
                    variant="primary"
                    onClick={() => handleAction(req._id, 'accepted')}
                    className="flex-1 sm:flex-none shadow-none hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Accept
                  </Button>
                  <Button 
                    variant="ghost"
                    onClick={() => handleAction(req._id, 'rejected')}
                    className="flex-1 sm:flex-none text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 shadow-none border border-transparent"
                  >
                    Reject
                  </Button>
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

      {/* Rejection Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Rejection"
        footer={(
          <>
            <Button variant="ghost" onClick={() => setIsConfirmModalOpen(false)}>Cancel</Button>
            <Button 
              variant="danger" 
              className="bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20"
              onClick={() => handleAction(requestToReject?._id, 'rejected')}
            >
              Confirm Rejection
            </Button>
          </>
        )}
      >
        <div className="flex flex-col items-center text-center space-y-4 py-2">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center animate-bounce-slow">
            <AlertCircle size={40} />
          </div>
          <div>
            <p className="text-slate-800 dark:text-slate-100 font-bold text-lg">Are you absolutely sure?</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-relaxed">
              You're about to reject <span className="text-slate-900 dark:text-slate-100 font-bold">{requestToReject?.student?.name}</span>'s request. 
              This will remove the request from your active list.
            </p>
          </div>
        </div>
      </Modal>

      {/* Acceptance Confirmation Modal */}
      <Modal
        isOpen={isAcceptModalOpen}
        onClose={() => setIsAcceptModalOpen(false)}
        title="Approve Request"
        footer={(
          <>
            <Button variant="ghost" onClick={() => setIsAcceptModalOpen(false)}>Cancel</Button>
            <Button 
              variant="primary"
              className="shadow-lg shadow-primary-500/20"
              onClick={() => handleAction(requestToAccept?._id, 'accepted')}
            >
              Accept & Start Chat
            </Button>
          </>
        )}
      >
        <div className="flex flex-col items-center text-center space-y-4 py-2">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center animate-bounce-slow">
            <MessageSquare size={40} />
          </div>
          <div>
            <p className="text-slate-800 dark:text-slate-100 font-bold text-lg">Start a new journey?</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-relaxed">
              Do you want to chat with <span className="text-slate-900 dark:text-slate-100 font-bold">{requestToAccept?.student?.name}</span>? 
              This will approve their request and open your active workspace.
            </p>
          </div>
        </div>
      </Modal>

    </div>
  );
}

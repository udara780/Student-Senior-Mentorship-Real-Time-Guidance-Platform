import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ChevronLeft, ChevronRight, Edit2, Trash2, X } from 'lucide-react';
import { format, parseISO, startOfWeek, addDays, subWeeks, addWeeks, isToday } from 'date-fns';

export default function AvailabilityManager() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calendar View State
  const [currentDate, setCurrentDate] = useState(new Date());

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [activeSlot, setActiveSlot] = useState(null);

  const [formData, setFormData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
    status: '',
    assignedStudentId: '',
  });

  const [sendingLink, setSendingLink] = useState(false);

  // Calculate calendar properties
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
  const weekDays = [...Array(7)].map((_, i) => addDays(startDate, i));
  const hours = ['8 AM', '9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM', '7 PM', '8 PM', '9 PM', '10 PM', '11 PM', '12 AM'];

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/availability/my');
      setSlots(data);
    } catch (error) {
      console.error('Failed to fetch availability', error);
      toast.error('Failed to fetch availability data');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setActiveSlot(null);
    setFormData({ date: format(new Date(), 'yyyy-MM-dd'), startTime: '09:00', endTime: '10:00', status: '', assignedStudentId: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (slot) => {
    setModalMode('edit');
    setActiveSlot(slot);
    setFormData({
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      status: slot.isBooked ? 'Booked' : 'Available',
      assignedStudentId: slot.assignedStudentId || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.status) {
      return toast.error('Please choose a Status (Available or Booked)');
    }
    if (!formData.assignedStudentId.trim()) {
      return toast.error('Student IT number is required');
    }

    setLoading(true);
    try {
      if (modalMode === 'edit' && activeSlot) {
        await api.put(`/availability/${activeSlot._id}`, {
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          isBooked: formData.status === 'Booked',
          assignedStudentId: formData.assignedStudentId.trim(),
        });
      } else {
        await api.post('/availability', {
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          isBooked: formData.status === 'Booked',
          assignedStudentId: formData.assignedStudentId.trim(),
        });
      }

      toast.success(modalMode === 'edit' ? 'Time slot updated' : 'Time slot added');
      setIsModalOpen(false);
      fetchSlots();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save slot');
      fetchSlots();
    } finally {
      setLoading(false);
    }
  };

  const handleSendLink = async () => {
    if (!activeSlot) return;
    setSendingLink(true);
    try {
      await api.post(`/availability/${activeSlot._id}/send-link`);
      toast.success('Meeting link sent via notification and email! 🎉');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send meeting link');
    } finally {
      setSendingLink(false);
    }
  };

  const handleDelete = async () => {
    if (!activeSlot) return;
    try {
      await api.delete(`/availability/${activeSlot._id}`);
      toast.success('Time slot removed');
      setIsModalOpen(false);
      fetchSlots();
    } catch (error) {
      toast.error('Failed to delete slot');
    }
  };

  // Utility to convert 24hr string ("14:30") to 12hr string ("2:30 PM") for rendering
  const formatTimeRender = (time24) => {
    if (!time24) return '';
    const [h, m] = time24.split(':');
    const d = new Date(); d.setHours(h, m);
    return format(d, 'h:mm a');
  };

  return (
    <div className="max-w-[1400px] mx-auto animate-fade-in relative z-10 pb-12">

      {/* Header matching provided image */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-6 gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight transition-colors duration-300 font-heading">Availability Management</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 text-lg transition-colors duration-300">Set and manage your mentorship time slots.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
          <Button variant="ghost" onClick={() => setCurrentDate(new Date())} className="px-5 py-2 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-sm font-semibold shadow-none">Today</Button>
          <Button variant="ghost" onClick={() => setCurrentDate(subWeeks(currentDate, 1))} className="px-5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-sm font-semibold hidden sm:block shadow-none">Previous Week</Button>
          <Button variant="ghost" onClick={() => setCurrentDate(addWeeks(currentDate, 1))} className="px-5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-sm font-semibold hidden sm:block shadow-none">Next Week</Button>
          <Button variant="primary" onClick={openAddModal} className="px-6 py-2 shadow-md shadow-primary-500/20 text-sm font-semibold">Add New Slot</Button>
        </div>
      </div>

      {/* Week Navigator */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <button onClick={() => setCurrentDate(subWeeks(currentDate, 1))} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 border-r border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 transition-colors"><ChevronLeft size={20} /></button>
          <button onClick={() => setCurrentDate(addWeeks(currentDate, 1))} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors"><ChevronRight size={20} /></button>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight font-heading">
          {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
        </h2>
      </div>

      {/* CSS Grid Calendar Wrapper */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="min-w-[800px] flex overflow-x-auto">

          {/* Time Labels Column */}
          <div className="w-20 sm:w-24 flex-shrink-0 border-r border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-900/30">
            <div className="h-14 border-b border-slate-200 dark:border-slate-700"></div> {/* Empty top-left header */}
            {hours.map(hour => (
              <div key={hour} className="h-[70px] border-b border-slate-100 dark:border-slate-700/50 flex items-start justify-center pt-2 text-xs font-bold text-slate-400">
                {hour}
              </div>
            ))}
          </div>

          {/* 7 Days Columns */}
          <div className="flex-1 flex border-t-0">
            {weekDays.map(day => (
              <div key={day.toString()} className="flex-1 border-r border-slate-100 relative min-w-[120px]">

                {/* Day Header */}
                <div className="h-14 border-b border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center bg-white dark:bg-slate-800 sticky top-0 z-20 transition-colors">
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">{format(day, 'EEE')}</span>
                  <div className={`text-sm font-bold mt-0.5 w-7 h-7 flex items-center justify-center rounded-full
                    ${isToday(day) ? 'bg-primary-500 text-white shadow-md' : 'text-slate-800 dark:text-slate-100'}`}>
                    {format(day, 'd')}
                  </div>
                </div>

                {/* Day Hours Grid */}
                <div className="relative h-[770px] bg-white dark:bg-slate-800/50 group transition-colors">
                  {/* Visual hour dividers */}
                  {hours.map((_, i) => (
                    <div key={i} className="h-[70px] border-b border-slate-100 dark:border-slate-700/50 w-full" />
                  ))}

                  {/* Slots Mapping */}
                  {slots
                    .filter(s => s.date === format(day, 'yyyy-MM-dd'))
                    .map(slot => {
                      const startH = parseInt(slot.startTime.split(':')[0]);
                      const startM = parseInt(slot.startTime.split(':')[1]);
                      const endH = parseInt(slot.endTime.split(':')[0]);
                      const endM = parseInt(slot.endTime.split(':')[1]);

                      const heightFactor = 70 / 60; // 70px per 60 mins
                      const topRaw = ((startH - 8) * 60) + startM;
                      const heightRaw = ((endH - startH) * 60) + (endM - startM);

                      // Bound constraints so slots don't bleed visually outside 8-6 boundaries
                      if (startH < 8 || startH >= 19) return null;

                      const top = topRaw * heightFactor;
                      const height = heightRaw * heightFactor;

                      return (
                        <div
                          key={slot._id}
                          onClick={() => openEditModal(slot)}
                          className={`absolute left-1.5 right-1.5 rounded-md p-2 text-xs border cursor-pointer hover:shadow-lg transition-all duration-200 z-10 hover:z-30 overflow-hidden group/slot
                            ${slot.isBooked
                              ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 hover:border-rose-300 dark:hover:border-rose-700'
                              : 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-900/50 text-indigo-800 dark:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-700'}`}
                          style={{ top: `${top}px`, height: `${height}px` }}
                        >
                          <div className="font-bold tracking-tight">{format(parseISO(slot.date), 'EEE d')}</div>
                          <div className="font-medium opacity-90">{formatTimeRender(slot.startTime)} - {formatTimeRender(slot.endTime)}</div>
                          <div className="mt-1 font-semibold opacity-90">{slot.isBooked ? 'Booked' : 'Available'}</div>
                          {slot.assignedStudentId && (
                            <div className="mt-0.5 opacity-80 truncate">👤 {slot.assignedStudentId}</div>
                          )}
                          {slot.meetingLink && (
                            <div className="mt-0.5 opacity-70 text-[10px] truncate">🔗 Link ready</div>
                          )}

                          {/* Hover Actions Preview */}
                          <div className="absolute bottom-1 right-1 flex gap-1 opacity-0 group-hover/slot:opacity-100 transition-opacity bg-white/80 p-0.5 rounded backdrop-blur shadow-sm">
                            <Edit2 size={12} className="text-slate-600" />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Editing/Adding Modal Overlays */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in transition-all">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200 dark:border-slate-700 overflow-hidden animate-slide-up relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-900 rounded-full p-1.5 transition-colors">
              <X size={18} />
            </button>

            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 font-heading">
                {modalMode === 'add' ? 'Add New Slot' : `Edit Time Slot`}
              </h3>

              <form onSubmit={handleSave} className="space-y-4">
                {modalMode === 'add' && (
                  <Input
                    label="Date" type="date" name="date"
                    value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required
                  />
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Start Time" type="time" name="startTime"
                    value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} required
                  />
                  <Input
                    label="End Time" type="time" name="endTime"
                    value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} required
                  />
                </div>

                <Input
                  label="Student IT Number *"
                  type="text"
                  name="assignedStudentId"
                  placeholder="e.g. IT23888888"
                  value={formData.assignedStudentId}
                  onChange={(e) => setFormData({ ...formData, assignedStudentId: e.target.value })}
                  required
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Status</label>
                  <select
                    className={`w-full px-4 py-2.5 rounded-xl border ${!formData.status ? 'text-slate-400 border-red-300 ring-1 ring-red-100 dark:border-red-900 dark:ring-red-950/30' : 'text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700'} bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-100 dark:focus:ring-primary-950/30`}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="" disabled hidden>Choose Status...</option>
                    <option value="Available" className="text-slate-800 dark:text-slate-100">Available</option>
                    <option value="Booked" className="text-slate-800 dark:text-slate-100">Booked</option>
                  </select>
                </div>

                {/* Show auto-generated meeting link in edit mode */}
                {modalMode === 'edit' && activeSlot?.meetingLink && (
                  <div className="mt-1 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                    <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1">🔗 Auto-Generated Meeting Link</p>
                    <a
                      href={activeSlot.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-500 dark:text-indigo-300 break-all hover:underline"
                    >
                      {activeSlot.meetingLink}
                    </a>
                  </div>
                )}

                <div className="mt-8 flex gap-3 justify-end border-t border-slate-100 dark:border-slate-700 pt-5 flex-wrap">
                  {modalMode === 'edit' && (
                    <Button type="button" variant="danger" onClick={handleDelete} className="mr-auto px-4 !py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 border-none shadow-none">
                      <Trash2 size={16} className="inline mr-1" /> Delete
                    </Button>
                  )}
                  {modalMode === 'edit' && activeSlot?.meetingLink && (
                    <Button
                      type="button"
                      onClick={handleSendLink}
                      disabled={sendingLink}
                      className="px-4 !py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 border-none shadow-none font-semibold text-sm"
                    >
                      {sendingLink ? 'Sending...' : '📨 Send Link'}
                    </Button>
                  )}
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="px-5 py-2 font-semibold dark:text-slate-300 dark:hover:bg-slate-700">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="px-6 py-2 shadow-md shadow-primary-500/20 font-semibold">
                    {modalMode === 'add' ? 'Add Slot' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

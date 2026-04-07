import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { Card } from '../../components/Card';
import toast from 'react-hot-toast';
import { Search, Filter, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/Button';
import { format } from 'date-fns';

const ROLE_STYLES = {
  student: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
  senior: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300',
  admin: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300',
};

const MENTOR_STATUS_STYLES = {
  none: 'text-slate-400',
  pending: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300',
  approved: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300',
  rejected: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400',
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [mentorStatusFilter, setMentorStatusFilter] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (search) params.append('search', search);
      if (roleFilter) params.append('role', roleFilter);
      if (mentorStatusFilter) params.append('mentorStatus', mentorStatusFilter);

      const { data } = await api.get(`/admin/users?${params}`);
      setUsers(data.users);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter, mentorStatusFilter]);

  useEffect(() => {
    const debounce = setTimeout(() => fetchUsers(), 350);
    return () => clearTimeout(debounce);
  }, [fetchUsers]);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight font-heading">User Management</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
          {total} total users registered on the platform.
        </p>
      </div>

      {/* Filters Bar */}
      <Card className="flex flex-col sm:flex-row gap-3 p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={roleFilter}
            onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
          >
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="senior">Mentors</option>
          </select>

          <select
            value={mentorStatusFilter}
            onChange={e => { setMentorStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
          >
            <option value="">Mentor Status: All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="none">N/A</option>
          </select>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden p-0 border border-slate-200 dark:border-slate-700">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_2fr_1fr_1.2fr_1.2fr] gap-4 px-6 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <span>User</span>
          <span>Email</span>
          <span>Role</span>
          <span>Mentor Status</span>
          <span>Joined</span>
        </div>

        {loading ? (
          <div className="p-8 space-y-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center text-slate-400 dark:text-slate-500">
            <User size={36} className="mx-auto mb-3 opacity-40" />
            <p className="font-semibold">No users match your filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map(u => (
              <div
                key={u._id}
                className="grid grid-cols-[2fr_2fr_1fr_1.2fr_1.2fr] gap-4 px-6 py-4 items-center hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
              >
                {/* Name + Avatar */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center flex-shrink-0 overflow-hidden border border-indigo-100 dark:border-indigo-900">
                    {u.profilePhoto
                      ? <img src={u.profilePhoto} alt={u.name} className="w-full h-full object-cover" />
                      : <User size={18} className="text-indigo-400" />
                    }
                  </div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 truncate text-sm">{u.name}</span>
                </div>

                {/* Email */}
                <span className="text-sm text-slate-500 dark:text-slate-400 truncate">{u.email}</span>

                {/* Role Badge */}
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize inline-block w-fit ${ROLE_STYLES[u.role] || 'text-slate-400'}`}>
                  {u.role}
                </span>

                {/* Mentor Status Badge */}
                {u.mentorStatus === 'none' ? (
                  <span className="text-xs text-slate-400">—</span>
                ) : (
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full capitalize inline-block w-fit ${MENTOR_STATUS_STYLES[u.mentorStatus]}`}>
                    {u.mentorStatus}
                  </span>
                )}

                {/* Joined Date */}
                <span className="text-xs text-slate-400 font-medium">
                  {format(new Date(u.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-500 font-medium">
              Page {page} of {pages} · {total} users
            </p>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-slate-200 dark:border-slate-700"
              >
                <ChevronLeft size={18} />
              </Button>
              <Button
                variant="ghost"
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="p-2 border border-slate-200 dark:border-slate-700"
              >
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

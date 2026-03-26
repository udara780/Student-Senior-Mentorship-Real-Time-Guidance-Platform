import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { User, Mail, Award, BookOpen, CheckCircle, Clock, Save, X, Edit2, ShieldCheck } from 'lucide-react';

export default function UserProfile() {
  const { user, updateProfile } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    skills: user?.skills ? user.skills.join(', ') : '',
  });

  if (!user) return null;

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'name') {
      value = value.replace(/[0-9]/g, '');
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Process skills input correctly
    const payload = {
      name: formData.name,
      bio: formData.bio,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
    };

    const result = await updateProfile(payload);
    if (result.success) {
      setIsEditing(false);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    // Revert form state back to current user context
    setFormData({
      name: user.name || '',
      bio: user.bio || '',
      skills: user.skills ? user.skills.join(', ') : '',
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in relative z-10 my-4 pb-12">
      
      {/* PROFESSIONAL HEADER CARD */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Banner */}
        <div className="h-40 md:h-48 w-full bg-slate-800 relative flex overflow-hidden">
          <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
        </div>

        {/* Profile Info Container */}
        <div className="px-6 md:px-10 pb-8 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-16 md:-mt-20 mb-4">
            {/* Avatar & Name */}
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 z-10 w-full md:w-auto">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white p-1.5 shadow-md mx-auto md:mx-0 group relative overflow-hidden">
                <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 overflow-hidden relative">
                  {user.profilePhoto ? (
                    <img 
                      src={`/${user.profilePhoto}`} 
                      alt={user.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <User size={64} className="mt-4 text-slate-300" />
                  )}
                </div>
              </div>
              
              <div className="text-center md:text-left pb-2 w-full md:w-auto">
                {isEditing ? (
                  <div className="mb-3 w-full max-w-xs mx-auto md:mx-0">
                    <Input 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Full Name"
                      className="text-lg font-bold"
                    />
                  </div>
                ) : (
                  <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center md:justify-start">
                    {user.name}
                    {user.isVerified && (
                      <ShieldCheck className="ml-2.5 text-emerald-500" size={26} title="Verified Senior" />
                    )}
                  </h1>
                )}
                
                <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-slate-500 font-medium">
                  <Mail size={16} />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons & Status */}
            <div className="flex flex-col items-center md:items-end md:pb-2 gap-3 shrink-0">
              <span className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase
                ${user.isVerified 
                  ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60' 
                  : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200/60'}`}>
                {user.isVerified ? 'Verified Mentor' : 'Pending Verification'}
              </span>
              
              {!isEditing && (
                <Button variant="outline" className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm transition-all" onClick={() => setIsEditing(true)}>
                  <Edit2 size={16} className="mr-2" /> Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* ABOUT ME SECTION - Takes 2 columns */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center tracking-tight">
              <BookOpen size={20} className="mr-2.5 text-primary-600" />
              About
            </h2>
          </div>
          
          {isEditing ? (
            <div className="space-y-4">
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell students about your experience..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:border-primary-500 focus:ring-primary-100 transition-all resize-none min-h-[160px] font-medium text-slate-700 leading-relaxed"
              />
            </div>
          ) : (
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-[15px]">
              {user.bio || (
                <span className="text-slate-400 italic">No biography provided yet. Add one to help students know you.</span>
              )}
            </p>
          )}
        </div>

        {/* EXPERTISE SECTION - Takes 1 column */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 h-fit">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center tracking-tight">
              <Award size={20} className="mr-2.5 text-primary-600" />
              Expertise
            </h2>
          </div>

          {isEditing ? (
             <div className="space-y-3">
               <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Add Skills (Comma Separated)</label>
               <Input 
                 name="skills"
                 value={formData.skills}
                 onChange={handleChange}
                 placeholder="e.g. React, Node.js, Python"
                 className="w-full"
               />
             </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {user.skills && user.skills.length > 0 ? (
                user.skills.map((skill, idx) => (
                  <span key={idx} className="px-3.5 py-1.5 bg-slate-100/80 text-slate-700 text-sm font-semibold rounded-md border border-slate-200/60 transition-all cursor-default hover:bg-slate-200/80">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-slate-400 text-sm italic">No skills listed.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* STICKY EDITING ACTION BAR */}
      {isEditing && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md px-6 py-4 rounded-2xl shadow-2xl border border-slate-200 flex gap-4 items-center w-[90%] max-w-2xl animate-slide-up">
          <span className="mr-auto text-sm text-slate-500 font-semibold px-2 hidden sm:block flex-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 mr-2 animate-pulse"></span>
            You have unsaved changes
          </span>
          <Button variant="ghost" className="px-5 py-2 font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 bg-white shadow-sm" onClick={handleCancel} disabled={loading}>
            <X size={18} className="mr-1.5 hidden sm:inline" /> Cancel
          </Button>
          <Button variant="primary" className="px-8 py-2 font-semibold shadow-md shadow-primary-500/20" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : <><Save size={18} className="mr-1.5 hidden sm:inline" /> Save Profile</>}
          </Button>
        </div>
      )}
    </div>
  );
}

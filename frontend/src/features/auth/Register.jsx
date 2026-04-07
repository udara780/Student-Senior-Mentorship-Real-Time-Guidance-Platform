import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { UserPlus, Camera, X } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    skills: '',
    bio: ''
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    // Auto-remove any numbers typed or pasted into the name field
    if (name === 'name') {
      value = value.replace(/[0-9]/g, '');
    }

    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setProfilePhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removePhoto = () => {
    setProfilePhoto(null);
    setPreviewUrl(null);
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Full Name is required';
    } else if (/[0-9]/.test(formData.name)) {
      errors.name = 'Full Name cannot contain numbers';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^it(2[2-9]|[3-9]\d)\d+@my\.sliit\.lk$/i.test(formData.email)) {
      errors.email = 'Email must be a SLIIT ID from year 22 or newer (e.g. it22xxxx@my.sliit.lk)';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    
    if (!formData.skills.trim()) {
      errors.skills = 'At least one skill is required';
    }
    
    if (formData.bio.length > 500) {
      errors.bio = 'Bio cannot exceed 500 characters';
    } else if (!formData.bio.trim()) {
      errors.bio = 'A short bio is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setError('');
    setLoading(true);
    
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('email', formData.email);
    payload.append('password', formData.password);
    payload.append('role', 'senior');
    payload.append('bio', formData.bio);
    payload.append('skills', JSON.stringify(formData.skills.split(',').map(s => s.trim()).filter(Boolean)));
    
    if (profilePhoto) {
      payload.append('profilePhoto', profilePhoto);
    }

    const result = await register(payload);
    if (result.success) {
      toast.success('Account created successfully! Please log in.');
      navigate('/login');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <Card className="shadow-2xl border-white/20 my-8 bg-white/10 backdrop-blur-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 shadow-sm">Join as a Senior</h1>
        <p className="text-slate-200 font-medium">Guide students and share your expertise</p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm font-medium animate-fade-in shadow-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {/* Profile Photo Upload */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative group">
            <div className={`w-28 h-28 rounded-full border-2 border-dashed flex items-center justify-center overflow-hidden transition-all duration-300 ${
              previewUrl ? 'border-primary-400' : 'border-slate-400 group-hover:border-primary-400 bg-white/5'
            }`}>
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-2">
                  <Camera className="mx-auto text-slate-400 group-hover:text-primary-400 transition-colors" size={32} />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Photo (Optional)</span>
                </div>
              )}
            </div>
            
            <input 
              type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleFileChange} 
            />
            
            {previewUrl && (
              <button 
                type="button" onClick={removePhoto}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-medium">JPG, PNG or GIF. Max 5MB.</p>
        </div>
        <Input 
          label="Full Name" name="name" type="text" placeholder="John Doe" 
          value={formData.name} onChange={handleChange} error={formErrors.name} required 
        />
        <Input 
          label="Email Address" name="email" type="email" placeholder="john@example.com" 
          value={formData.email} onChange={handleChange} error={formErrors.email} required 
        />
        <Input 
          label="Password" name="password" type="password" placeholder="••••••••" 
          value={formData.password} onChange={handleChange} error={formErrors.password} required 
        />
        <Input 
          label="Skills (comma separated)" name="skills" type="text" placeholder="React, Node.js, Python" 
          value={formData.skills} onChange={handleChange} error={formErrors.skills} required 
        />
        
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-semibold text-slate-200">Short Bio</label>
          <textarea
            name="bio" placeholder="Tell students about your experience..."
            value={formData.bio} onChange={handleChange} required
            className={`w-full px-4 py-2.5 rounded-xl border bg-white/10 backdrop-blur-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 shadow-sm transition-all resize-none h-24 ${
              formErrors.bio ? 'border-red-400/50 focus:ring-red-200/20 focus:border-red-500' : 'border-white/20 hover:border-white/40 focus:border-primary-400 focus:ring-primary-500/20'
            }`}
          />
          {formErrors.bio && <span className="text-xs font-medium text-red-400 mt-0.5">{formErrors.bio}</span>}
        </div>
        
        <Button type="submit" className="w-full mt-4 py-3 text-lg font-semibold" disabled={loading}>
          {loading ? 'Creating account...' : (
            <>
              Create Account <UserPlus className="ml-2" size={20} />
            </>
          )}
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm text-slate-300 font-medium">
        Already have an account? <Link to="/login" className="text-primary-400 hover:text-primary-300 hover:underline">Log in</Link>
      </div>
    </Card>
  );
}

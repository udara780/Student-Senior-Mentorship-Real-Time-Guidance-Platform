import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, isProfileComplete } = useContext(AuthContext);
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setError('');
    setLoading(true);
    
    const result = await login(email, password);
    if (result.success) {
      // If the user hasn't filled bio/skills yet, guide them to set up their profile first
      if (!isProfileComplete) {
        navigate('/profile/setup');
      } else {
        navigate('/home');
      }
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <Card className="shadow-2xl border-white/20 bg-white/10 backdrop-blur-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 shadow-sm">Welcome Back</h1>
        <p className="text-slate-200 font-medium">Sign in to continue to your dashboard</p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm font-medium animate-fade-in shadow-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <Input 
          label="Email Address" 
          type="email" 
          placeholder="Enter your email" 
          value={email} 
          onChange={(e) => {
            setEmail(e.target.value);
            if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
          }} 
          error={formErrors.email}
          required 
        />
        <Input 
          label="Password" 
          type="password" 
          placeholder="••••••••" 
          value={password} 
          onChange={(e) => {
            setPassword(e.target.value);
            if (formErrors.password) setFormErrors({ ...formErrors, password: '' });
          }} 
          error={formErrors.password}
          required 
        />
        
        <Button 
          type="submit" 
          className="w-full mt-2 py-3 text-lg font-semibold" 
          disabled={loading}
        >
          {loading ? 'Signing in...' : (
            <>
              Sign In <LogIn className="ml-2" size={20} />
            </>
          )}
        </Button>
      </form>
      
      <div className="mt-6 text-center text-sm text-slate-300 font-medium">
        Don't have an account? <Link to="/register" className="text-primary-400 hover:text-primary-300 hover:underline">Register here</Link>
      </div>
    </Card>
  );
}

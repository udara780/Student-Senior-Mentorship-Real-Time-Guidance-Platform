import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { UserPlus } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) setFormErrors({ ...formErrors, [name]: '' });
  };

  const validate = () => {
    const errors = {};

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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setError('');
    setLoading(true);

    // Derive a display name from the email prefix (e.g. "it22001234" → "it22001234")
    // The user will set their real name on the Profile setup page
    const derivedName = formData.email.split('@')[0];

    const payload = new FormData();
    payload.append('name', derivedName);
    payload.append('email', formData.email);
    payload.append('password', formData.password);
    payload.append('role', 'student');

    const result = await register(payload);
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <Card className="shadow-2xl border-white/20 my-8 bg-white/10 backdrop-blur-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 shadow-sm">Create Account</h1>
        <p className="text-slate-200 font-medium">Join the mentorship platform with your SLIIT email</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg text-sm font-medium animate-fade-in shadow-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <Input
          label="SLIIT Email Address"
          name="email"
          type="email"
          placeholder="e.g. it22001234@my.sliit.lk"
          value={formData.email}
          onChange={handleChange}
          error={formErrors.email}
          required
        />
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={formErrors.password}
          required
        />

        <Button type="submit" className="w-full mt-2 py-3 text-lg font-semibold" disabled={loading}>
          {loading ? 'Creating account...' : (
            <>
              Create Account <UserPlus className="ml-2" size={20} />
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-slate-300 font-medium">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-400 hover:text-primary-300 hover:underline">
          Log in
        </Link>
      </div>
    </Card>
  );
}

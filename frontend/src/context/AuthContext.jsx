import React, { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = sessionStorage.getItem('token');
      if (token) {
        try {
          const { data } = await api.get('/users/profile');
          setUser(data);
        } catch (error) {
          console.error('Failed to verify token', error);
          sessionStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      sessionStorage.setItem('token', data.token);
      setUser(data.user);
      toast.success('Welcome back!');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      sessionStorage.setItem('token', data.token);
      setUser(data.user);
      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateProfile = async (profileData) => {
    try {
      const { data } = await api.put('/users/profile', profileData);
      setUser((prev) => ({ ...prev, ...data.user }));
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update profile';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // True only when the user has filled in bio AND at least one skill
  const isProfileComplete = !!(user && user.bio && user.bio.trim() && user.skills && user.skills.length > 0);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, isProfileComplete }}>
      {children}
    </AuthContext.Provider>
  );
};

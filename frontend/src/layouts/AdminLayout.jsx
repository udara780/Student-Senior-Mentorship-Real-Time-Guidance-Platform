import React from 'react';
import { Outlet } from 'react-router-dom';

export const AdminLayout = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0b0f1a 0%,#111827 60%,#0f172a 100%)' }}>
      <Outlet />
    </div>
  );
};

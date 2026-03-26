import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`glass dark:bg-slate-800/50 dark:border-slate-700/50 dark:shadow-slate-950/40 rounded-2xl p-6 transition-all duration-300 ${className}`} {...props}>
      {children}
    </div>
  );
};

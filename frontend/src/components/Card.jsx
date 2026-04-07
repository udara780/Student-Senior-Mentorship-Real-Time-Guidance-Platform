import React from 'react';

export const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white dark:bg-slate-900 shadow-[0_2px_16px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-8px_rgba(0,0,0,0.5)] border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(79,70,229,0.06)] ${className}`} {...props}>
      {children}
    </div>
  );
};


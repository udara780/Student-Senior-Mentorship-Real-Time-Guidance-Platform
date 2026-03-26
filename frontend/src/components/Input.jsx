import React, { forwardRef } from 'react';

export const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</label>}
      <input
        ref={ref}
        className={`w-full px-4 py-2.5 rounded-xl border bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all duration-200 
          dark:bg-white/10 dark:text-white dark:placeholder:text-slate-400
          ${error 
            ? 'border-red-400 dark:border-red-400/50 focus:ring-red-200/20 focus:border-red-500' 
            : 'border-slate-200 dark:border-white/20 hover:border-slate-300 dark:hover:border-white/40 focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-100 dark:focus:ring-primary-500/10 shadow-sm'}`}
        {...props}
      />
      {error && <span className="text-xs font-medium text-red-500 dark:text-red-400 mt-0.5">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

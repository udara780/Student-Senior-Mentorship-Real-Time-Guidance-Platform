import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const base = "px-4 py-2 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600 shadow-md shadow-primary-500/20 focus:ring-primary-500",
    secondary: "bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 hover:text-slate-900 focus:ring-slate-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100",
    outline: "border border-slate-200 text-slate-700 hover:bg-slate-50 focus:ring-slate-500 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800/80 shadow-sm",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-500 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20 focus:ring-red-500",
    success: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20 focus:ring-emerald-500",
  };

  return (
    <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
};


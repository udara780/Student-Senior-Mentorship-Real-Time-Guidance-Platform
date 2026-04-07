import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-[2px] transition-opacity animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] w-full max-w-md overflow-hidden animate-slide-up border border-slate-100 dark:border-slate-800">
        {/* Accent Stripe */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-500 to-indigo-500" />
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-heading tracking-tight">{title}</h3>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 pt-3">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-4 px-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 dark:bg-slate-800/40 dark:border-slate-800">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};


import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from './Button';
import { LogOut, User, Sun, Moon, AlertCircle } from 'lucide-react';
import { Modal } from './Modal';

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { isDarkMode, toggleTheme } = useTheme();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm transition-colors duration-300 dark:bg-slate-900/80 dark:border-slate-800 dark:shadow-slate-950/20">
      <Link to="/" className="text-xl font-bold bg-gradient-to-r from-primary-600 to-teal-400 bg-clip-text text-transparent transform hover:scale-105 transition-transform dark:from-primary-400 dark:to-teal-300">
        Guidance Platform
      </Link>
      
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Theme Toggle Button */}
        <Button 
          variant="ghost" 
          className="!p-2.5 bg-slate-100/50 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-all duration-300 rounded-xl" 
          onClick={toggleTheme}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? (
            <Sun size={18} className="text-amber-400 animate-pulse-slow" />
          ) : (
            <Moon size={18} className="text-slate-700" />
          )}
        </Button>

        {user ? (
          <>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400 hidden md:block">
              Welcome, {user.name}
            </span>
            <Button 
              variant="ghost" 
              className="!p-0 w-10 h-10 rounded-xl overflow-hidden bg-slate-100/50 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-transparent hover:border-primary-400/30 transition-all duration-300 shadow-sm" 
              onClick={() => navigate('/profile')}
              title="View Profile"
            >
              {user.profilePhoto ? (
                <img 
                  src={`/${user.profilePhoto}`} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={20} className="text-slate-700 dark:text-slate-300 mx-auto" />
              )}
            </Button>
            <Button variant="danger" className="!p-2.5 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 dark:border-red-500/20 shadow-none border border-red-100" onClick={handleLogoutClick}>
              <LogOut size={18} />
            </Button>
          </>
        ) : (
          <div className="flex gap-2">
            <Link to="/login"><Button variant="ghost" className="dark:text-slate-300 dark:hover:bg-slate-800">Log In</Button></Link>
            <Link to="/register"><Button variant="primary">Register</Button></Link>
          </div>
        )}
      </div>

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Confirm Logout"
        footer={(
          <>
            <Button variant="ghost" onClick={() => setIsLogoutModalOpen(false)} className="dark:text-slate-300">Stay</Button>
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 font-bold"
              onClick={confirmLogout}
            >
              Logout
            </Button>
          </>
        )}
      >
        <div className="flex flex-col items-center text-center space-y-4 py-2">
          <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center animate-bounce-slow">
            <AlertCircle size={40} />
          </div>
          <div>
            <p className="text-slate-800 dark:text-slate-100 font-bold text-lg">Are you leaving already?</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-relaxed">
              Confirm if you want to sign out. Your session data is safely synced.
            </p>
          </div>
        </div>
      </Modal>
    </nav>
  );
};

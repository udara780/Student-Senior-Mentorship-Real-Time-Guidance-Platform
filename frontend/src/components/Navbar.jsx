import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from './Button';
import { LogOut, User, Sun, Moon, AlertCircle, ShieldCheck } from 'lucide-react';
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
    <nav className="glass sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between transition-colors duration-300 dark:bg-slate-900/80 border-b border-slate-200/60 dark:border-slate-800">
      <Link to="/" className="text-xl font-heading font-extrabold tracking-tight bg-gradient-to-r from-primary-600 to-indigo-400 bg-clip-text text-transparent transform hover:scale-[1.02] transition-transform dark:from-primary-400 dark:to-indigo-300">
        Guidance Platform
      </Link>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          className="!p-2 shadow-none border border-transparent hover:border-slate-200 hover:bg-white dark:hover:border-slate-700 dark:hover:bg-slate-800 transition-all duration-300 rounded-lg text-slate-500"
          onClick={toggleTheme}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? (
            <Sun size={18} className="text-amber-400" />
          ) : (
            <Moon size={18} className="text-slate-600" />
          )}
        </Button>

        {user ? (
          <>
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300 hidden md:flex items-center">
              Welcome, {user.name.split(' ')[0]}
            </span>
            <span className="h-5 w-px bg-slate-200 dark:bg-slate-700 hidden md:block mx-1"></span>

            {/* Admin users: show distinct badge instead of profile/notification */}
            {user.role === 'admin' ? (
              <Link
                to="/admin"
                className="flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl font-semibold text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              >
                <ShieldCheck size={16} />
                Admin Panel
              </Link>
            ) : (
              <>
                {/* Notification Bell */}
                <Button
                  variant="ghost"
                  className="relative !p-2 shadow-none border border-transparent hover:border-slate-200 hover:bg-white dark:hover:border-slate-700 dark:hover:bg-slate-800 transition-all duration-300 rounded-lg text-slate-500"
                  title="Notifications"
                >
                  <AlertCircle size={18} className="text-slate-600 dark:text-slate-400" />
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white dark:border-slate-900 pointer-events-none"></div>
                </Button>
                <Button
                  variant="ghost"
                  className="!p-0 w-9 h-9 rounded-full overflow-hidden bg-slate-100 hover:ring-2 hover:ring-primary-500/50 hover:ring-offset-2 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:hover:ring-offset-slate-900 transition-all duration-200 shadow-sm"
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
                    <User size={18} className="text-slate-500 dark:text-slate-400 mx-auto" />
                  )}
                </Button>
              </>
            )}
            <Button variant="ghost" className="!p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 shadow-none" onClick={handleLogoutClick} title="Log Out">
              <LogOut size={18} />
            </Button>
          </>
        ) : (
          <div className="flex gap-2">
            <Link to="/login"><Button variant="ghost" className="font-semibold text-slate-600 dark:text-slate-300 shadow-none">Log In</Button></Link>
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
            <Button variant="ghost" onClick={() => setIsLogoutModalOpen(false)} className="dark:text-slate-300 shadow-none border border-transparent">Cancel</Button>
            <Button
              variant="danger"
              className="bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/20 font-semibold"
              onClick={confirmLogout}
            >
              Logout
            </Button>
          </>
        )}
      >
        <div className="flex flex-col items-center text-center space-y-4 py-2">
          <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 rounded-full flex items-center justify-center">
            <AlertCircle size={32} />
          </div>
          <div>
            <p className="text-slate-800 dark:text-slate-100 font-bold text-lg font-heading">Sign out already?</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 leading-relaxed">
              Are you sure you want to log out of your session?
            </p>
          </div>
        </div>
      </Modal>
    </nav>
  );
};

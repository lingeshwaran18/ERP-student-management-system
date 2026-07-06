'use client';

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, Sun, Moon, LogOut, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  onSearch?: (query: string) => void;
  title: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch, title }) => {
  const { user, logout } = useAuth();
  const [searchVal, setSearchVal] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(searchVal);
  };

  const mockNotifications = [
    { id: 1, title: 'Exam Timetable Out', msg: 'Semester final exams registration started.' },
    { id: 2, title: 'Fee Due Reminder', msg: 'Tuition fees payment deadline is approaching.' },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full h-16 px-6 bg-white border-b border-gray-200 dark:bg-slate-900 dark:border-slate-800 transition-colors duration-150">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Global Search Bar */}
        {onSearch && (
          <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-72">
            <input
              type="text"
              placeholder="Search students, books, courses..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full h-9 pl-9 pr-4 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-primary dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          </form>
        )}

        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-1.5 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800"
          title="Toggle Dark Mode"
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 w-80 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-slate-900 dark:border-slate-800 overflow-hidden">
              <div className="px-4 py-3 text-xs font-semibold text-gray-500 border-b border-gray-100 dark:border-slate-800">
                Recent Notifications
              </div>
              <div className="divide-y divide-gray-100 dark:divide-slate-800">
                {mockNotifications.map(n => (
                  <div key={n.id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">{n.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.msg}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile info */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-200 dark:border-slate-800">
          <div className="hidden lg:block text-right">
            <p className="text-sm font-medium text-gray-700 dark:text-slate-200">
              {user?.profile?.firstName || 'User'} {user?.profile?.lastName || ''}
            </p>
            <p className="text-xs text-gray-400 dark:text-slate-400 font-medium capitalize">{user?.role?.toLowerCase()}</p>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-gray-500 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 hover:text-danger dark:hover:text-danger"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

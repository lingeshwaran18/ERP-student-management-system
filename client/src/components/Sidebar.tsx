'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Home, Users, GraduationCap, BookOpen, CheckSquare, 
  PenTool, CreditCard, AlertCircle, Book, Megaphone, 
  Calendar, Award, Library, ShieldAlert
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const { user } = useAuth();

  const getNavItems = () => {
    const role = user?.role;
    if (role === 'ADMIN') {
      return [
        { id: 'dashboard', label: 'Dashboard Overview', icon: Home },
        { id: 'students', label: 'Student Directory', icon: Users },
        { id: 'faculty', label: 'Faculty Roster', icon: GraduationCap },
        { id: 'departments', label: 'Departments', icon: BookOpen },
        { id: 'courses', label: 'Course Catalog', icon: Award },
        { id: 'fees', label: 'Finance & Fees', icon: CreditCard },
        { id: 'complaints', label: 'Support Tickets', icon: AlertCircle },
      ];
    }
    if (role === 'FACULTY') {
      return [
        { id: 'dashboard', label: 'Faculty Dashboard', icon: Home },
        { id: 'attendance', label: 'Record Attendance', icon: CheckSquare },
        { id: 'marks', label: 'Enter Exam Marks', icon: PenTool },
        { id: 'assignments', label: 'Class Tasks', icon: BookOpen },
        { id: 'announcements', label: 'Notices', icon: Megaphone },
      ];
    }
    if (role === 'STUDENT') {
      return [
        { id: 'dashboard', label: 'Student Dashboard', icon: Home },
        { id: 'attendance', label: 'Attendance', icon: CheckSquare },
        { id: 'marks', label: 'Grades & Marks', icon: Award },
        { id: 'assignments', label: 'My Assignments', icon: BookOpen },
        { id: 'fees', label: 'Pay Fees', icon: CreditCard },
        { id: 'library', label: 'Library Catalog', icon: Library },
        { id: 'complaints', label: 'Submit Complaint', icon: ShieldAlert },
      ];
    }
    if (role === 'PARENT') {
      return [
        { id: 'dashboard', label: 'Parent Dashboard', icon: Home },
        { id: 'attendance', label: 'Attendance Log', icon: CheckSquare },
        { id: 'marks', label: 'Report Cards', icon: Award },
        { id: 'fees', label: 'Invoices & Ledger', icon: CreditCard },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 h-screen flex flex-col bg-white border-r border-gray-200 dark:bg-slate-900 dark:border-slate-800 transition-colors duration-150">
      {/* Brand Header */}
      <div className="flex items-center gap-2 h-16 px-6 border-b border-gray-200 dark:bg-slate-900 dark:border-slate-800">
        <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-base">E</span>
        <div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-white leading-none">ERP Portal</h2>
          <span className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Institutional</span>
        </div>
      </div>

      {/* Nav Link Items */}
      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-3 h-10 px-3 rounded-md text-sm font-medium transition-colors duration-150 ${
                isActive 
                  ? 'bg-primary text-white dark:bg-primary' 
                  : 'text-gray-600 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      {/* Footer Details */}
      <div className="p-4 border-t border-gray-200 dark:border-slate-800 text-[10px] text-center text-gray-400">
        Enterprise System v4.1.0
      </div>
    </aside>
  );
};

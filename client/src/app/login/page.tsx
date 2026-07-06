'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, Lock, AlertCircle, Eye, EyeOff, 
  User, Key, ChevronDown, UserPlus, Users, LayoutDashboard, Bell
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    if (!loading && user) {
      redirectUser(user.role);
    }
  }, [user, loading]);

  const redirectUser = (role: string) => {
    if (role === 'ADMIN') router.push('/admin');
    else if (role === 'STUDENT') router.push('/student');
    else if (role === 'FACULTY') router.push('/faculty');
    else if (role === 'PARENT') router.push('/parent');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter email and password.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Incorrect email or password.');
      setIsSubmitting(false);
    }
  };

  const fillQuickCredentials = (roleEmail: string, rolePass: string, roleValue: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setRole(roleValue);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative font-sans">
      
      {/* Retractable Demo Credentials Drawer */}
      <div className="fixed right-0 top-1/4 bg-white border border-gray-200 rounded-l-xl shadow-lg p-4 z-50 transition-all duration-300 transform translate-x-[82%] hover:translate-x-0 w-64 flex gap-3">
        <div className="flex flex-col items-center justify-center text-primary cursor-pointer w-6 flex-shrink-0">
          <Key className="w-4 h-4 animate-bounce" />
          <span className="text-[9px] font-bold uppercase tracking-widest [writing-mode:vertical-lr] mt-2 text-gray-500">DEMO LOGINS</span>
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Click to auto-fill</p>
          <button
            onClick={() => fillQuickCredentials('admin@erp.com', 'admin123', 'ADMIN')}
            className="w-full text-left p-1.5 text-[11px] bg-slate-50 hover:bg-slate-100 rounded border border-gray-100 dark:text-gray-750"
          >
            <strong>💼 Admin</strong>
            <div className="text-[9px] text-gray-400">admin@erp.com</div>
          </button>
          <button
            onClick={() => fillQuickCredentials('faculty1@erp.com', 'faculty123', 'FACULTY')}
            className="w-full text-left p-1.5 text-[11px] bg-slate-50 hover:bg-slate-100 rounded border border-gray-100 dark:text-gray-755"
          >
            <strong>🎓 Faculty</strong>
            <div className="text-[9px] text-gray-400">faculty1@erp.com</div>
          </button>
          <button
            onClick={() => fillQuickCredentials('student1@erp.com', 'student123', 'STUDENT')}
            className="w-full text-left p-1.5 text-[11px] bg-slate-50 hover:bg-slate-100 rounded border border-gray-100 dark:text-gray-760"
          >
            <strong>📖 Student</strong>
            <div class="text-[9px] text-gray-400">student1@erp.com</div>
          </button>
          <button
            onClick={() => fillQuickCredentials('parent1@erp.com', 'parent123', 'PARENT')}
            className="w-full text-left p-1.5 text-[11px] bg-slate-50 hover:bg-slate-100 rounded border border-gray-100 dark:text-gray-765"
          >
            <strong>👪 Parent</strong>
            <div className="text-[9px] text-gray-400">parent1@erp.com</div>
          </button>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="max-w-4xl w-full bg-[#f8fafc] border border-gray-200 rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side (Visual Panel) */}
        <div className="relative md:w-5/12 bg-gradient-to-br from-[#0F4C81] to-[#0A3356] text-white flex flex-col justify-between p-8 overflow-hidden hidden md:flex">
          {/* Campus image overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop')` }}
          ></div>
          
          {/* Diagonal Shape Wedges */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-700/30 rotate-45 rounded-3xl pointer-events-none"></div>
          <div className="absolute -bottom-4 w-full h-1/2 bg-sky-500/20 -skew-y-12 pointer-events-none"></div>

          {/* Upper Content */}
          <div className="relative z-10 space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight font-poppins text-white">ERP</h2>
            <p className="text-[9px] font-semibold text-blue-200 uppercase tracking-widest">STUDENT MANAGEMENT SYSTEM</p>
            <div className="w-12 h-1 bg-white rounded my-3"></div>
            <p className="text-xs font-semibold text-slate-100 leading-relaxed max-w-[200px]">
              One Platform, All Academy Operations Simplified.
            </p>
          </div>

          {/* Features Check Items */}
          <div className="relative z-10 space-y-3 pt-12">
            <div className="flex items-center gap-3 text-xs font-medium text-slate-200">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white"><ShieldCheck className="w-3.5 h-3.5" /></span>
              <span>Secure Login</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-slate-200">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white"><Users className="w-3.5 h-3.5" /></span>
              <span>Role Based Access</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-slate-200">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white"><LayoutDashboard className="w-3.5 h-3.5" /></span>
              <span>Smart Dashboard</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-slate-200">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-white"><Bell className="w-3.5 h-3.5" /></span>
              <span>Real-time Updates</span>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="relative z-10 text-[9px] text-blue-200/80">
            © 2026 ERP Student Management System. All Rights Reserved.
          </div>
        </div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-7/12 bg-white flex flex-col justify-between p-8 md:p-12 relative overflow-hidden">
          
          {/* Crest Logo & Headers */}
          <div className="flex flex-col items-center text-center mt-2">
            {/* Custom Wreath Graduation SVG Crest */}
            <svg className="w-16 h-16 text-[#0F4C81]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 25L80 37L50 49L20 37L50 25Z" fill="#0F4C81"/>
              <path d="M32 41V55C32 60 40 64 50 64C60 64 68 60 68 55V41" stroke="#0F4C81" strokeWidth="2.5" fill="none"/>
              <path d="M76 38.5V55" stroke="#0F4C81" strokeWidth="2"/>
              <circle cx="76" cy="55" r="2" fill="#0F4C81"/>
              <path d="M22 68C16 60 14 50 18 40C20 34 25 30 30 27" stroke="#0F4C81" strokeWidth="2" strokeDasharray="1 3"/>
              <path d="M20 62C18 60 16 60 15 62C14 64 15 66 18 66C20 66 21 64 20 62Z" fill="#0F4C81"/>
              <path d="M17 52C15 50 13 50 12 52C11 54 12 56 15 56C17 56 18 54 17 52Z" fill="#0F4C81"/>
              <path d="M17 42C15 40 13 40 12 42C11 44 12 46 15 46C17 46 18 44 17 42Z" fill="#0F4C81"/>
              <path d="M78 68C84 60 86 50 82 40C80 34 75 30 70 27" stroke="#0F4C81" strokeWidth="2" stroke-dasharray="1 3"/>
              <path d="M80 62C82 60 84 60 85 62C86 64 85 66 82 66C80 66 79 64 80 62Z" fill="#0F4C81"/>
              <path d="M83 52C85 50 87 50 88 52C89 54 88 56 85 56C83 56 82 54 83 52Z" fill="#0F4C81"/>
              <path d="M83 42C85 40 87 40 88 42C89 44 88 46 85 46C83 46 82 44 83 42Z" fill="#0F4C81"/>
            </svg>

            <h1 class="text-3xl font-extrabold text-[#0F4C81] tracking-wide mt-1 font-poppins">ERP</h1>
            <p className="text-[12px] font-bold text-gray-800 leading-tight">ERP-Based Integrated</p>
            <p className="text-[12px] font-bold text-gray-800 leading-tight">Student Management System</p>
            
            <div className="mt-3 flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-gray-500">
              <User className="w-4 h-4" />
            </div>

            <h3 className="text-xs font-bold text-gray-800 mt-2">Welcome Back!</h3>
            <p className="text-[10px] text-gray-400 font-medium">Login to access your account</p>
          </div>

          {/* Errors */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-2.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded-md mt-4 w-full">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 mt-5 w-full">
            
            {/* Select Role */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Select Role</label>
              <div className="relative">
                <select 
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required 
                  className="w-full h-10 pl-9 pr-8 text-xs bg-slate-50 border border-gray-200 rounded-md focus:outline-none focus:border-primary appearance-none font-medium text-gray-700"
                >
                  <option value="STUDENT">Student</option>
                  <option value="FACULTY">Faculty</option>
                  <option value="ADMIN">Administrator</option>
                  <option value="PARENT">Parent</option>
                </select>
                <User className="absolute left-3 top-3.5 w-3.5 h-3.5 text-gray-400" />
                <ChevronDown className="absolute right-3 top-3.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Username/Email */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Username</label>
              <div className="relative">
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter username" 
                  className="w-full h-10 pl-9 pr-4 text-xs bg-slate-50 border border-gray-200 rounded-md focus:outline-none focus:border-primary font-medium text-gray-700"
                />
                <User className="absolute left-3 top-3.5 w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password" 
                  className="w-full h-10 pl-9 pr-10 text-xs bg-slate-50 border border-gray-200 rounded-md focus:outline-none focus:border-primary font-medium text-gray-700"
                />
                <Lock className="absolute left-3 top-3.5 w-3.5 h-3.5 text-gray-400" />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Remember Me / Forgot Password */}
            <div className="flex justify-between items-center text-[10px] pt-1">
              <label className="flex items-center gap-1.5 font-semibold text-gray-400 cursor-pointer select-none">
                <input type="checkbox" className="w-3.5 h-3.5 border-gray-300 rounded text-primary focus:ring-primary"/>
                <span>Remember Me</span>
              </label>
              <button 
                type="button" 
                onClick={() => alert('Please contact the central institution IT desk to request password resets.')}
                className="font-semibold text-primary hover:underline bg-transparent border-none p-0 cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full h-10 mt-2 bg-[#0F4C81] hover:bg-[#0C3F6B] text-white font-semibold text-xs rounded-md shadow flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Authenticating...' : 'Login'}</span>
            </button>
          </form>

          {/* Divider and New User Button */}
          <div className="mt-4 space-y-3 w-full">
            <div className="flex items-center justify-center gap-2">
              <div className="h-[1px] bg-gray-100 flex-1"></div>
              <span className="text-[9px] font-bold text-gray-400 uppercase">OR</span>
              <div className="h-[1px] bg-gray-100 flex-1"></div>
            </div>

            <button 
              type="button"
              onClick={() => alert('Please contact the central institution IT desk to register a new user ID.')}
              className="w-full h-10 border border-gray-200 hover:bg-slate-50 text-gray-600 font-semibold text-xs rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>New User? Contact Admin</span>
            </button>
          </div>

          {/* Footer for Mobile */}
          <div className="text-center text-[8px] text-gray-400 mt-6 md:hidden">
            © 2026 ERP Student Management System.
          </div>
        </div>
      </div>
    </div>
  );
}

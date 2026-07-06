'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { 
  Users, GraduationCap, School, BookOpen, DollarSign, 
  AlertCircle, Home, Check, Plus, Search, HelpCircle, Loader2
} from 'lucide-react';

interface Stats {
  totalStudents: number;
  totalFaculty: number;
  totalDepartments: number;
  totalCourses: number;
  revenue: number;
  pendingFees: number;
  hostel: { occupancy: number; capacity: number };
  library: { totalBooks: number; borrowedBooks: number };
  transportUsage: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, token, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [stats, setStats] = useState<Stats | null>(null);
  const [dataList, setDataList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  // Forms
  const [showAddDept, setShowAddDept] = useState(false);
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');

  const [showAddCourse, setShowAddCourse] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseDept, setCourseDept] = useState('');

  const [showAddStudent, setShowAddStudent] = useState(false);
  const [studEmail, setStudEmail] = useState('');
  const [studPass, setStudPass] = useState('');
  const [studFN, setStudFN] = useState('');
  const [studLN, setStudLN] = useState('');
  const [studRoll, setStudRoll] = useState('');
  const [studPhone, setStudPhone] = useState('');
  const [studDeptId, setStudDeptId] = useState('');
  const [studCourseId, setStudCourseId] = useState('');

  // Protect Route
  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'ADMIN') {
        router.push('/login');
      } else {
        fetchStats();
      }
    }
  }, [user, loading]);

  // Fetch Stats
  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const d = await res.json();
        setStats(d);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch Tab List Data
  useEffect(() => {
    if (!token || currentTab === 'dashboard') return;
    
    const fetchData = async () => {
      setIsFetching(true);
      let url = `http://localhost:5000/api/${currentTab}`;
      if (currentTab === 'students') {
        url = `http://localhost:5000/api/students?search=${searchTerm}`;
      } else if (currentTab === 'fees') {
        url = 'http://localhost:5000/api/payments';
      }
      
      try {
        const res = await fetch(url, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const d = await res.json();
          if (currentTab === 'students') {
            setDataList(d.students || []);
          } else {
            setDataList(d || []);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [currentTab, token, searchTerm]);

  // Form Submissions
  const handleAddDept = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/departments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: deptName, code: deptCode })
      });
      if (res.ok) {
        setShowAddDept(false);
        setDeptName('');
        setDeptCode('');
        fetchStats();
        if (currentTab === 'departments') {
          // Trigger refresh
          setCurrentTab('dashboard');
          setTimeout(() => setCurrentTab('departments'), 50);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: courseName, code: courseCode, departmentId: courseDept })
      });
      if (res.ok) {
        setShowAddCourse(false);
        setCourseName('');
        setCourseCode('');
        setCourseDept('');
        fetchStats();
        if (currentTab === 'courses') {
          setCurrentTab('dashboard');
          setTimeout(() => setCurrentTab('courses'), 50);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: studEmail,
          password: studPass,
          firstName: studFN,
          lastName: studLN,
          rollNumber: studRoll,
          phone: studPhone,
          departmentId: studDeptId,
          courseId: studCourseId,
        })
      });
      if (res.ok) {
        setShowAddStudent(false);
        setStudEmail('');
        setStudPass('');
        setStudFN('');
        setStudLN('');
        setStudRoll('');
        setStudPhone('');
        fetchStats();
        if (currentTab === 'students') {
          setCurrentTab('dashboard');
          setTimeout(() => setCurrentTab('students'), 50);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveComplaint = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/complaints/${id}/resolve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ resolution: 'Addressed and corrected by Administration.', status: 'RESOLVED' })
      });
      if (res.ok) {
        // Refresh list
        setDataList(prev => prev.map(c => c.id === id ? { ...c, status: 'RESOLVED', resolution: 'Addressed and corrected by Administration.' } : c));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !user || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar title="Administrator Dashboard" />

        <main className="flex-1 overflow-y-auto p-6">
          {/* DASHBOARD SUMMARY TAB */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Analytics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Students</span>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalStudents}</p>
                  </div>
                  <div className="w-10 h-10 rounded-md bg-blue-50 text-primary flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Faculty Roster</span>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalFaculty}</p>
                  </div>
                  <div className="w-10 h-10 rounded-md bg-emerald-50 text-secondary flex items-center justify-center">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Departments</span>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalDepartments}</p>
                  </div>
                  <div className="w-10 h-10 rounded-md bg-indigo-50 text-indigo-500 flex items-center justify-center">
                    <School className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Revenue</span>
                    <p className="text-2xl font-bold text-gray-900 mt-1">${stats.revenue.toLocaleString()}</p>
                  </div>
                  <div className="w-10 h-10 rounded-md bg-yellow-50 text-warning flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Extra Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900">Hostel Allocation</h3>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-gray-400 font-medium">Occupancy status:</span>
                    <span className="text-sm font-bold text-gray-700">{stats.hostel.occupancy} / {stats.hostel.capacity} beds</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full mt-2">
                    <div 
                      className="h-2 bg-primary rounded-full" 
                      style={{ width: `${(stats.hostel.occupancy / stats.hostel.capacity) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900">Library Volumes</h3>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-gray-400 font-medium">Books borrowed:</span>
                    <span className="text-sm font-bold text-gray-700">{stats.library.borrowedBooks} / {stats.library.totalBooks} available</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full mt-2">
                    <div 
                      className="h-2 bg-secondary rounded-full" 
                      style={{ width: `${(stats.library.borrowedBooks / stats.library.totalBooks) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <h3 className="text-sm font-semibold text-gray-900">Transport Registrants</h3>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-gray-400 font-medium">Busing active routes:</span>
                    <span className="text-sm font-bold text-gray-700">{stats.transportUsage} students</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full mt-2">
                    <div className="h-2 bg-indigo-500 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">Quick Administrative Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <button 
                    onClick={() => setShowAddDept(true)}
                    className="flex items-center justify-center gap-2 h-11 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" /> Add Department
                  </button>
                  <button 
                    onClick={() => setShowAddCourse(true)}
                    className="flex items-center justify-center gap-2 h-11 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100"
                  >
                    <Plus className="w-4 h-4" /> Add Course
                  </button>
                  <button 
                    onClick={() => setShowAddStudent(true)}
                    className="flex items-center justify-center gap-2 h-11 text-xs font-semibold text-white bg-primary rounded-md hover:bg-primary-dark"
                  >
                    <Plus className="w-4 h-4" /> Register Student
                  </button>
                </div>
              </div>

              {/* Add Dept Modal */}
              {showAddDept && (
                <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
                  <form onSubmit={handleAddDept} className="bg-white border border-gray-200 rounded-lg max-w-sm w-full p-6 space-y-4">
                    <h4 className="text-base font-bold text-gray-900">Create New Department</h4>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Department Name</label>
                      <input 
                        type="text" required value={deptName} onChange={e => setDeptName(e.target.value)} placeholder="e.g. Civil Engineering"
                        className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Short Code</label>
                      <input 
                        type="text" required value={deptCode} onChange={e => setDeptCode(e.target.value)} placeholder="e.g. CE"
                        className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button type="button" onClick={() => setShowAddDept(false)} className="px-4 h-9 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-md">Cancel</button>
                      <button type="submit" className="px-4 h-9 text-xs font-semibold text-white bg-primary rounded-md">Save</button>
                    </div>
                  </form>
                </div>
              )}

              {/* Add Course Modal */}
              {showAddCourse && (
                <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
                  <form onSubmit={handleAddCourse} className="bg-white border border-gray-200 rounded-lg max-w-sm w-full p-6 space-y-4">
                    <h4 className="text-base font-bold text-gray-900">Create New Course</h4>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Course Name</label>
                      <input 
                        type="text" required value={courseName} onChange={e => setCourseName(e.target.value)} placeholder="e.g. B.Tech Civil Engineering"
                        className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Short Code</label>
                      <input 
                        type="text" required value={courseCode} onChange={e => setCourseCode(e.target.value)} placeholder="e.g. BTECH-CE"
                        className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1">Department Database ID</label>
                      <input 
                        type="text" required value={courseDept} onChange={e => setCourseDept(e.target.value)} placeholder="Department UUID"
                        className="w-full h-10 px-3 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button type="button" onClick={() => setShowAddCourse(false)} className="px-4 h-9 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-md">Cancel</button>
                      <button type="submit" className="px-4 h-9 text-xs font-semibold text-white bg-primary rounded-md">Save</button>
                    </div>
                  </form>
                </div>
              )}

              {/* Add Student Modal */}
              {showAddStudent && (
                <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 p-4">
                  <form onSubmit={handleAddStudent} className="bg-white border border-gray-200 rounded-lg max-w-md w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
                    <h4 className="text-base font-bold text-gray-900">Register New Student</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-500 mb-1">First Name</label>
                        <input type="text" required value={studFN} onChange={e => setStudFN(e.target.value)} className="w-full h-9 px-3 text-xs bg-gray-50 border border-gray-200 rounded-md"/>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-500 mb-1">Last Name</label>
                        <input type="text" required value={studLN} onChange={e => setStudLN(e.target.value)} className="w-full h-9 px-3 text-xs bg-gray-50 border border-gray-200 rounded-md"/>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 mb-1">Roll Number</label>
                      <input type="text" required value={studRoll} onChange={e => setStudRoll(e.target.value)} placeholder="e.g. ROLL2026101" className="w-full h-9 px-3 text-xs bg-gray-50 border border-gray-200 rounded-md"/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 mb-1">Institutional Email</label>
                      <input type="email" required value={studEmail} onChange={e => setStudEmail(e.target.value)} placeholder="you@institution.edu" className="w-full h-9 px-3 text-xs bg-gray-50 border border-gray-200 rounded-md"/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 mb-1">Account Password</label>
                      <input type="password" required value={studPass} onChange={e => setStudPass(e.target.value)} className="w-full h-9 px-3 text-xs bg-gray-50 border border-gray-200 rounded-md"/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 mb-1">Contact Phone</label>
                      <input type="text" value={studPhone} onChange={e => setStudPhone(e.target.value)} className="w-full h-9 px-3 text-xs bg-gray-50 border border-gray-200 rounded-md"/>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-500 mb-1">Dept UUID</label>
                        <input type="text" required value={studDeptId} onChange={e => setStudDeptId(e.target.value)} className="w-full h-9 px-3 text-xs bg-gray-50 border border-gray-200 rounded-md"/>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-gray-500 mb-1">Course UUID</label>
                        <input type="text" required value={studCourseId} onChange={e => setStudCourseId(e.target.value)} className="w-full h-9 px-3 text-xs bg-gray-50 border border-gray-200 rounded-md"/>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button type="button" onClick={() => setShowAddStudent(false)} className="px-4 h-9 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-md">Cancel</button>
                      <button type="submit" className="px-4 h-9 text-xs font-semibold text-white bg-primary rounded-md">Register</button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* LIST VIEWS TABS */}
          {currentTab !== 'dashboard' && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <span className="text-sm font-bold text-gray-900 capitalize">{currentTab} Directory</span>
                
                {currentTab === 'students' && (
                  <div className="relative w-64">
                    <input
                      type="text"
                      placeholder="Search roll number..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full h-9 pl-9 pr-4 text-xs bg-white border border-gray-200 rounded-md focus:outline-none"
                    />
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                  </div>
                )}
              </div>

              {isFetching ? (
                <div className="flex items-center justify-center p-12">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : dataList.length === 0 ? (
                <div className="p-12 text-center text-xs text-gray-400">No records found.</div>
              ) : (
                <div className="overflow-x-auto">
                  {/* STUDENTS TAB TABLE */}
                  {currentTab === 'students' && (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-500">
                          <th className="p-4 font-semibold">Roll No</th>
                          <th className="p-4 font-semibold">Name</th>
                          <th className="p-4 font-semibold">Department</th>
                          <th className="p-4 font-semibold">Course</th>
                          <th className="p-4 font-semibold">Phone</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {dataList.map(s => (
                          <tr key={s.id} className="hover:bg-gray-50">
                            <td className="p-4 font-mono font-semibold text-primary">{s.rollNumber}</td>
                            <td className="p-4 font-medium">{s.firstName} {s.lastName}</td>
                            <td className="p-4 text-gray-500">{s.department?.name}</td>
                            <td className="p-4 text-gray-400">{s.course?.name}</td>
                            <td className="p-4 text-gray-500">{s.phone || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* FACULTY TAB TABLE */}
                  {currentTab === 'faculty' && (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-500">
                          <th className="p-4 font-semibold">Emp ID</th>
                          <th className="p-4 font-semibold">Name</th>
                          <th className="p-4 font-semibold">Designation</th>
                          <th className="p-4 font-semibold">Department</th>
                          <th className="p-4 font-semibold">Phone</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {dataList.map(f => (
                          <tr key={f.id} className="hover:bg-gray-50">
                            <td className="p-4 font-mono font-semibold text-primary">{f.employeeId}</td>
                            <td className="p-4 font-medium">{f.firstName} {f.lastName}</td>
                            <td className="p-4 text-gray-500">{f.designation}</td>
                            <td className="p-4 text-gray-400">{f.department?.name}</td>
                            <td className="p-4 text-gray-500">{f.phone || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* DEPARTMENTS TAB TABLE */}
                  {currentTab === 'departments' && (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-500">
                          <th className="p-4 font-semibold">Code</th>
                          <th className="p-4 font-semibold">Name</th>
                          <th className="p-4 font-semibold">UUID</th>
                          <th className="p-4 font-semibold">Enrolled Stats</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {dataList.map(d => (
                          <tr key={d.id} className="hover:bg-gray-50">
                            <td className="p-4 font-bold text-gray-800">{d.code}</td>
                            <td className="p-4 font-medium">{d.name}</td>
                            <td className="p-4 text-gray-400 font-mono text-[10px]">{d.id}</td>
                            <td className="p-4 text-gray-500">
                              {d._count?.students} stds / {d._count?.faculty} fac
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* COURSES TAB TABLE */}
                  {currentTab === 'courses' && (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-500">
                          <th className="p-4 font-semibold">Code</th>
                          <th className="p-4 font-semibold">Course Name</th>
                          <th className="p-4 font-semibold">Department</th>
                          <th className="p-4 font-semibold">UUID</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {dataList.map(c => (
                          <tr key={c.id} className="hover:bg-gray-50">
                            <td className="p-4 font-bold text-gray-800">{c.code}</td>
                            <td className="p-4 font-medium">{c.name}</td>
                            <td className="p-4 text-gray-500">{c.department?.name}</td>
                            <td className="p-4 text-gray-400 font-mono text-[10px]">{c.id}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* FINANCE / FEES TAB TABLE */}
                  {currentTab === 'fees' && (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-500">
                          <th className="p-4 font-semibold">Invoice No</th>
                          <th className="p-4 font-semibold">Student</th>
                          <th className="p-4 font-semibold">Amount</th>
                          <th className="p-4 font-semibold">Category</th>
                          <th className="p-4 font-semibold">Method</th>
                          <th className="p-4 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {dataList.map(p => (
                          <tr key={p.id} className="hover:bg-gray-50">
                            <td className="p-4 font-mono text-gray-700">{p.invoiceNumber}</td>
                            <td className="p-4 font-medium">{p.student?.firstName} {p.student?.lastName}</td>
                            <td className="p-4 font-bold text-gray-900">${p.amount}</td>
                            <td className="p-4 text-gray-400 uppercase">{p.category}</td>
                            <td className="p-4 text-gray-500">{p.paymentMethod}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.status === 'SUCCESS' ? 'bg-green-50 text-success' : 'bg-yellow-50 text-warning'}`}>
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* COMPLAINTS TAB TABLE */}
                  {currentTab === 'complaints' && (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-500">
                          <th className="p-4 font-semibold">Ticket</th>
                          <th className="p-4 font-semibold">Submitted By</th>
                          <th className="p-4 font-semibold">Resolution</th>
                          <th className="p-4 font-semibold">Status</th>
                          <th className="p-4 font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {dataList.map(c => (
                          <tr key={c.id} className="hover:bg-gray-50">
                            <td className="p-4">
                              <p className="font-semibold text-gray-900">{c.title}</p>
                              <p className="text-gray-400 text-[11px] mt-0.5">{c.description}</p>
                            </td>
                            <td className="p-4 text-gray-500 font-mono">{c.submittedBy}</td>
                            <td className="p-4 text-gray-500">{c.resolution || 'No resolution logged.'}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${c.status === 'RESOLVED' ? 'bg-green-50 text-success' : 'bg-red-50 text-danger'}`}>
                                {c.status}
                              </span>
                            </td>
                            <td className="p-4">
                              {c.status !== 'RESOLVED' && (
                                <button
                                  onClick={() => handleResolveComplaint(c.id)}
                                  className="flex items-center gap-1 px-3 py-1 bg-green-50 text-success hover:bg-green-100 rounded border border-green-200 font-semibold"
                                >
                                  <Check className="w-3.5 h-3.5" /> Resolve
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

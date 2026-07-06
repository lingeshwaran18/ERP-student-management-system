'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { 
  Users, BookOpen, CheckSquare, Calendar, Award, 
  Megaphone, Plus, Check, Loader2, Save
} from 'lucide-react';

export default function FacultyDashboard() {
  const router = useRouter();
  const { user, token, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [students, setStudents] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  // Attendance Form
  const [attDate, setAttDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceMap, setAttendanceMap] = useState<{ [studentId: string]: 'PRESENT' | 'ABSENT' }>({});

  // Marks Form
  const [markStudent, setMarkStudent] = useState('');
  const [markSubject, setMarkSubject] = useState('');
  const [markExam, setMarkExam] = useState('');
  const [markObtained, setMarkObtained] = useState('');
  const [markMax, setMarkMax] = useState('100');

  // Assignment Form
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDesc, setAssignDesc] = useState('');
  const [assignDueDate, setAssignDueDate] = useState('');
  const [assignSub, setAssignSub] = useState('');
  const [assignments, setAssignments] = useState<any[]>([]);

  // Announcement Form
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');

  // Route protection & basic fetch
  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'FACULTY') {
        router.push('/login');
      } else {
        fetchInitialData();
      }
    }
  }, [user, loading]);

  const fetchInitialData = async () => {
    setIsFetching(true);
    try {
      // Get students in faculty department
      const resStud = await fetch(`http://localhost:5000/api/students?limit=100`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resStud.ok) {
        const data = await resStud.json();
        setStudents(data.students || []);
        // Initialize attendance map
        const initialMap: any = {};
        data.students?.forEach((s: any) => {
          initialMap[s.id] = 'PRESENT';
        });
        setAttendanceMap(initialMap);
      }

      // Get exams
      const resEx = await fetch('http://localhost:5000/api/exams', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resEx.ok) {
        const data = await resEx.json();
        setExams(data);
      }

      // Get subjects for drop down selection
      const resSub = await fetch('http://localhost:5000/api/courses', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resSub.ok) {
        // Find courses of faculty department and gather subjects (simulated here)
        const coursesList = await resSub.json();
        const deptCourses = coursesList.filter((c: any) => c.departmentId === user?.profile?.departmentId);
        // Load mock subject templates based on department
        setSubjects([
          { id: 'sub-1', name: 'Software Architecture & Design' },
          { id: 'sub-2', name: 'Applied Advanced Statistics' },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetching(false);
    }
  };

  // Fetch assignments when clicking tab
  useEffect(() => {
    if (currentTab === 'assignments' && token) {
      fetch('http://localhost:5000/api/assignments', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setAssignments(data))
      .catch(err => console.error(err));
    }
  }, [currentTab, token]);

  // Operations
  const handleAttendanceChange = (studentId: string, status: 'PRESENT' | 'ABSENT') => {
    setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
  };

  const submitAttendanceLog = async (e: React.FormEvent) => {
    e.preventDefault();
    const records = Object.keys(attendanceMap).map(id => ({
      studentId: id,
      status: attendanceMap[id]
    }));

    try {
      const res = await fetch('http://localhost:5000/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ date: attDate, records })
      });
      if (res.ok) {
        alert('Attendance recorded successfully for ' + attDate);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitMark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!markStudent || !markExam || !markObtained) return;

    try {
      const res = await fetch('http://localhost:5000/api/marks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId: markStudent,
          subjectId: markSubject || 'sub-1',
          examinationId: markExam,
          marksObtained: parseFloat(markObtained),
          maxMarks: parseFloat(markMax)
        })
      });
      if (res.ok) {
        alert('Examination mark recorded successfully.');
        setMarkStudent('');
        setMarkObtained('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/assignments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: assignTitle,
          description: assignDesc,
          dueDate: assignDueDate,
          subjectId: assignSub || 'sub-1'
        })
      });
      if (res.ok) {
        const created = await res.json();
        setAssignments(prev => [created, ...prev]);
        setAssignTitle('');
        setAssignDesc('');
        setAssignDueDate('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePublishNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: annTitle, content: annContent })
      });
      if (res.ok) {
        alert('Notice published on Institution Notice Board.');
        setAnnTitle('');
        setAnnContent('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !user || isFetching) {
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
        <Navbar title="Faculty portal" />

        <main className="flex-1 overflow-y-auto p-6">
          {/* DASHBOARD TAB */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Profile card */}
              <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-primary flex items-center justify-center rounded-lg font-bold text-lg">
                    {user.profile?.firstName[0]}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-gray-900">{user.profile?.firstName} {user.profile?.lastName}</h2>
                    <p className="text-xs text-gray-400 font-medium">Designation: {user.profile?.designation} | Emp ID: {user.profile?.employeeId}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Academic Dept: {user.profile?.department?.name}</p>
                  </div>
                </div>
              </div>

              {/* Class Rosters overview */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="text-sm font-bold text-gray-900">Enrolled Student Cohort</h3>
                </div>
                <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                  {students.map(s => (
                    <div key={s.id} className="p-4 flex items-center justify-between text-xs hover:bg-gray-50">
                      <div>
                        <p className="font-semibold text-gray-900">{s.firstName} {s.lastName}</p>
                        <p className="text-gray-400 mt-0.5">Roll No: {s.rollNumber} | Course: {s.course?.name}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-blue-50 text-primary font-bold rounded">
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ATTENDANCE TAB */}
          {currentTab === 'attendance' && (
            <form onSubmit={submitAttendanceLog} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Daily Attendance Registry</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Record attendance logs of enrolled students.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500 uppercase">Target Date:</span>
                  <input
                    type="date"
                    required
                    value={attDate}
                    onChange={e => setAttDate(e.target.value)}
                    className="h-9 px-3 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="divide-y divide-gray-100 max-h-[50vh] overflow-y-auto">
                {students.map(s => (
                  <div key={s.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-gray-900">{s.firstName} {s.lastName}</p>
                      <p className="text-gray-400 mt-0.5">Roll No: {s.rollNumber}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleAttendanceChange(s.id, 'PRESENT')}
                        className={`px-3 py-1.5 rounded font-semibold text-[11px] ${
                          attendanceMap[s.id] === 'PRESENT' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAttendanceChange(s.id, 'ABSENT')}
                        className={`px-3 py-1.5 rounded font-semibold text-[11px] ${
                          attendanceMap[s.id] === 'ABSENT' 
                            ? 'bg-red-500 text-white' 
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-5 h-10 text-xs font-semibold text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
                >
                  <Save className="w-4 h-4" /> Save Logs
                </button>
              </div>
            </form>
          )}

          {/* MARKS ENTRY TAB */}
          {currentTab === 'marks' && (
            <form onSubmit={handleSubmitMark} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4 max-w-lg">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">Student Grades Entry</h3>
              
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Select Student</label>
                <select
                  required
                  value={markStudent}
                  onChange={e => setMarkStudent(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none"
                >
                  <option value="">-- Choose student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.rollNumber})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Target Subject</label>
                  <select
                    value={markSubject}
                    onChange={e => setMarkSubject(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none"
                  >
                    {subjects.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Examination Category</label>
                  <select
                    required
                    value={markExam}
                    onChange={e => setMarkExam(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none"
                  >
                    <option value="">-- Select Exam --</option>
                    {exams.map(ex => (
                      <option key={ex.id} value={ex.id}>{ex.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Score Obtained</label>
                  <input
                    type="number"
                    required
                    step="0.5"
                    value={markObtained}
                    onChange={e => setMarkObtained(e.target.value)}
                    placeholder="e.g. 85"
                    className="w-full h-10 px-3 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Maximum Scale Marks</label>
                  <input
                    type="number"
                    required
                    value={markMax}
                    onChange={e => setMarkMax(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-5 h-10 text-xs font-semibold text-white bg-primary rounded-md hover:bg-primary-dark"
                >
                  <Plus className="w-4 h-4" /> Save Score Card
                </button>
              </div>
            </form>
          )}

          {/* ASSIGNMENTS TAB */}
          {currentTab === 'assignments' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Add form */}
              <form onSubmit={handleCreateAssignment} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4 h-fit">
                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">Publish Assignment Task</h3>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Task Title</label>
                  <input
                    type="text"
                    required
                    value={assignTitle}
                    onChange={e => setAssignTitle(e.target.value)}
                    placeholder="e.g. Term Project Research Draft"
                    className="w-full h-10 px-3 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Description / Instructions</label>
                  <textarea
                    required
                    rows={4}
                    value={assignDesc}
                    onChange={e => setAssignDesc(e.target.value)}
                    placeholder="Explain expectations, file formatting guidelines, topics to cover..."
                    className="w-full p-3 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={assignDueDate}
                    onChange={e => setAssignDueDate(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Subject</label>
                  <select
                    value={assignSub}
                    onChange={e => setAssignSub(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none"
                  >
                    {subjects.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full h-10 text-xs font-semibold text-white bg-primary rounded-md hover:bg-primary-dark"
                >
                  Publish Task
                </button>
              </form>

              {/* List */}
              <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden h-fit">
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="text-sm font-bold text-gray-900">Active Published Tasks</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {assignments.map(a => (
                    <div key={a.id} className="p-4 space-y-1 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-gray-900">{a.title}</span>
                        <span className="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded">
                          Due: {new Date(a.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">{a.description}</p>
                      <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mt-1">Course: {a.subject?.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ANNOUNCEMENTS TAB */}
          {currentTab === 'announcements' && (
            <form onSubmit={handlePublishNotice} className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-4 max-w-lg">
              <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">Publish Notice on Board</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Notice Header</label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={e => setAnnTitle(e.target.value)}
                  placeholder="e.g. Schedule for Remedial Architecture classes"
                  className="w-full h-10 px-3 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Notice Body Content</label>
                <textarea
                  required
                  rows={6}
                  value={annContent}
                  onChange={e => setAnnContent(e.target.value)}
                  placeholder="Detail the announcement for students..."
                  className="w-full p-3 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none"
                ></textarea>
              </div>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 h-10 text-xs font-semibold text-white bg-primary rounded-md hover:bg-primary-dark"
              >
                <Megaphone className="w-4 h-4" /> Publish Announcement
              </button>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}

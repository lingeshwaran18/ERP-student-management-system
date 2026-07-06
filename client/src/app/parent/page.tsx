'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { 
  Users, CheckSquare, Award, CreditCard, Loader2
} from 'lucide-react';

export default function ParentDashboard() {
  const router = useRouter();
  const { user, token, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [studentData, setStudentData] = useState<any>(null);
  const [dataList, setDataList] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  // Guard & Initial resolve
  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'PARENT') {
        router.push('/login');
      } else {
        // Parent has a list of linked students
        const linkedStudents = (user.profile as any)?.students;
        if (linkedStudents && linkedStudents.length > 0) {
          setStudentData(linkedStudents[0]); // Default to first student
        }
      }
    }
  }, [user, loading]);

  // Tab fetch based on studentData.id
  useEffect(() => {
    if (!token || !studentData || currentTab === 'dashboard') return;

    const fetchData = async () => {
      setIsFetching(true);
      let url = `http://localhost:5000/api/${currentTab}?studentId=${studentData.id}`;
      
      if (currentTab === 'marks') {
        url = `http://localhost:5000/api/marks?studentId=${studentData.id}`;
      } else if (currentTab === 'fees') {
        url = `http://localhost:5000/api/payments?studentId=${studentData.id}`;
      }

      try {
        const res = await fetch(url, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const d = await res.json();
          setDataList(d || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [currentTab, token, studentData]);

  if (loading || !user) {
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
        <Navbar title="Parent Portal" />

        <main className="flex-1 overflow-y-auto p-6">
          {!studentData ? (
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm text-center text-xs text-gray-400">
              No students are currently linked to this parent profile registry.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Welcome/Summary tab */}
              {currentTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Linked Student header */}
                  <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Linked Student Profile</h2>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="w-12 h-12 bg-emerald-50 text-secondary flex items-center justify-center rounded-lg font-bold text-lg">
                        {studentData.firstName[0]}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900">{studentData.firstName} {studentData.lastName}</h3>
                        <p className="text-xs text-gray-400 font-medium">Roll Number: {studentData.rollNumber}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Course: {studentData.course?.name} | Department: {studentData.department?.name}</p>
                      </div>
                    </div>
                  </div>

                  {/* Summary grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Attendance Activity</span>
                        <p className="text-sm font-bold text-gray-700 mt-1">Checked Log: Active</p>
                      </div>
                      <div className="w-10 h-10 rounded-md bg-green-50 text-success flex items-center justify-center">
                        <CheckSquare className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="p-5 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Grades & Performance</span>
                        <p className="text-sm font-bold text-gray-700 mt-1">Results published: Checked</p>
                      </div>
                      <div className="w-10 h-10 rounded-md bg-yellow-50 text-warning flex items-center justify-center">
                        <Award className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LIST DETAILS TABS */}
              {currentTab !== 'dashboard' && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <span className="text-sm font-bold text-gray-900 capitalize">{studentData.firstName}&apos;s {currentTab}</span>
                  </div>

                  {isFetching ? (
                    <div className="flex items-center justify-center p-12">
                      <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    </div>
                  ) : dataList.length === 0 ? (
                    <div className="p-12 text-center text-xs text-gray-400">No records found.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      {/* ATTENDANCE TABLE */}
                      {currentTab === 'attendance' && (
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500">
                              <th className="p-4 font-semibold">Date</th>
                              <th className="p-4 font-semibold">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {dataList.map(a => (
                              <tr key={a.id} className="hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-700">{new Date(a.date).toLocaleDateString()}</td>
                                <td className="p-4">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${a.status === 'PRESENT' ? 'bg-green-50 text-success' : 'bg-red-50 text-danger'}`}>
                                    {a.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                      {/* MARKS TABLE */}
                      {currentTab === 'marks' && (
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500">
                              <th className="p-4 font-semibold">Subject</th>
                              <th className="p-4 font-semibold">Exam</th>
                              <th className="p-4 font-semibold">Score Obtained</th>
                              <th className="p-4 font-semibold">Max Score</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {dataList.map(m => (
                              <tr key={m.id} className="hover:bg-gray-50">
                                <td className="p-4 font-semibold text-gray-700">{m.subject?.name}</td>
                                <td className="p-4 text-gray-500">{m.examination?.name}</td>
                                <td className="p-4 font-bold text-gray-900">{m.marksObtained}</td>
                                <td className="p-4 text-gray-400 font-medium">{m.maxMarks}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}

                      {/* FEES LEDGER TABLE */}
                      {currentTab === 'fees' && (
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-500">
                              <th className="p-4 font-semibold">Invoice No</th>
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
                    </div>
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

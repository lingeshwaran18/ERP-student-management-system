'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Sidebar } from '../../components/Sidebar';
import { Navbar } from '../../components/Navbar';
import { 
  User, CheckSquare, Award, BookOpen, CreditCard, 
  Library, AlertCircle, Bot, BrainCircuit, RefreshCw, Send, Loader2
} from 'lucide-react';

export default function StudentDashboard() {
  const router = useRouter();
  const { user, token, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [dataList, setDataList] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  // AI chat assistant
  const [chatMsg, setChatMsg] = useState('');
  const [chatReply, setChatReply] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // AI Predictor
  const [aiPred, setAiPred] = useState<any>(null);
  const [predLoading, setPredLoading] = useState(false);

  // Payments form
  const [payAmount, setPayAmount] = useState('');
  const [payCategory, setPayCategory] = useState('TUITION');
  const [payMethod, setPayMethod] = useState('UPI');

  // Support form
  const [compTitle, setCompTitle] = useState('');
  const [compDesc, setCompDesc] = useState('');

  // Library Search
  const [libSearch, setLibSearch] = useState('');

  // Protecting & Initial checks
  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'STUDENT') {
        router.push('/login');
      }
    }
  }, [user, loading]);

  // Tab change loading
  useEffect(() => {
    if (!token || currentTab === 'dashboard') return;

    const fetchData = async () => {
      setIsFetching(true);
      let url = `http://localhost:5000/api/${currentTab}`;
      
      if (currentTab === 'marks') {
        url = 'http://localhost:5000/api/marks';
      } else if (currentTab === 'fees') {
        url = 'http://localhost:5000/api/payments';
      } else if (currentTab === 'library') {
        url = `http://localhost:5000/api/library/books?search=${libSearch}`;
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
  }, [currentTab, token, libSearch]);

  // Send AI Chat
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMsg.trim()) return;

    setChatLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai/assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: chatMsg })
      });
      if (res.ok) {
        const d = await res.json();
        setChatReply(d.reply);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  // Run AI Predictor
  const handlePredictPerformance = async () => {
    if (!user?.profile?.id) return;
    setPredLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/ai/predict/${user.profile.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const d = await res.json();
        setAiPred(d);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPredLoading(false);
    }
  };

  // Pay Fee simulation
  const handlePayFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payAmount) return;

    try {
      const res = await fetch('http://localhost:5000/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(payAmount),
          category: payCategory,
          paymentMethod: payMethod
        })
      });

      if (res.ok) {
        alert('Checkout payment successful! Billing receipt has been generated.');
        setPayAmount('');
        // Trigger list refresh
        setCurrentTab('dashboard');
        setTimeout(() => setCurrentTab('fees'), 50);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit support ticket
  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compTitle || !compDesc) return;

    try {
      const res = await fetch('http://localhost:5000/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title: compTitle, description: compDesc })
      });
      if (res.ok) {
        alert('Support ticket created successfully.');
        setCompTitle('');
        setCompDesc('');
      }
    } catch (err) {
      console.error(err);
    }
  };

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
        <Navbar title="Student Portal" />

        <main className="flex-1 overflow-y-auto p-6">
          {/* DASHBOARD TAB */}
          {currentTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Profile card */}
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-primary flex items-center justify-center rounded-lg font-bold text-lg">
                      {user.profile?.firstName[0]}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-gray-900">{user.profile?.firstName} {user.profile?.lastName}</h2>
                      <p className="text-xs text-gray-400 font-medium">Roll Number: {user.profile?.rollNumber}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Course: {user.profile?.course?.name} | Dept: {user.profile?.department?.name}</p>
                    </div>
                  </div>
                </div>

                {/* AI Performance predictor card */}
                <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BrainCircuit className="w-5 h-5 text-indigo-500" />
                      <h3 className="text-sm font-bold text-gray-900">AI Performance & GPA Prediction</h3>
                    </div>
                    <button
                      onClick={handlePredictPerformance}
                      disabled={predLoading}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded text-xs font-semibold"
                    >
                      {predLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                      Predict GPA
                    </button>
                  </div>

                  {aiPred ? (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-md text-xs space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 font-semibold uppercase text-[10px]">Predicted Semester GPA</p>
                          <p className="text-xl font-bold text-indigo-600 mt-0.5">{aiPred.predictedGPA} / 4.00</p>
                        </div>
                        <div>
                          <p className="text-gray-400 font-semibold uppercase text-[10px]">Performance Status</p>
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-1 ${aiPred.performanceStatus === 'EXCELLENT' ? 'bg-green-100 text-success' : 'bg-yellow-100 text-warning'}`}>
                            {aiPred.performanceStatus}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 font-semibold uppercase text-[10px]">AI Strategic Recommendations</p>
                        <p className="text-gray-600 leading-relaxed mt-1 font-medium">{aiPred.aiRecommendations}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Click the button above to run our predictive heuristic classifier. It maps your present attendance rates and examination grade inputs to project final GPA scores and compile strategic focus directions.
                    </p>
                  )}
                </div>
              </div>

              {/* AI Chatbot Assistant */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-[75vh]">
                <div className="p-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/50">
                  <Bot className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold text-gray-900">AI ERP Assistant</span>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs leading-relaxed text-gray-600">
                    Hello! Ask me about attendance, students list, or exam grades statistics!
                  </div>
                  {chatReply && (
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs leading-relaxed text-gray-700 font-medium">
                      {chatReply}
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendChat} className="p-3 border-t border-gray-100 flex gap-2">
                  <input
                    type="text"
                    required
                    value={chatMsg}
                    onChange={e => setChatMsg(e.target.value)}
                    placeholder="Ask assistant..."
                    className="flex-1 h-9 px-3 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    disabled={chatLoading}
                    className="w-9 h-9 flex items-center justify-center bg-primary text-white hover:bg-primary-dark rounded-md"
                  >
                    {chatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* LIST VIEWS */}
          {currentTab !== 'dashboard' && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <span className="text-sm font-bold text-gray-900 capitalize">{currentTab} Details</span>
                {currentTab === 'library' && (
                  <div className="relative w-64">
                    <input
                      type="text"
                      placeholder="Search books..."
                      value={libSearch}
                      onChange={e => setLibSearch(e.target.value)}
                      className="w-full h-9 pl-9 pr-4 text-xs bg-white border border-gray-200 rounded-md focus:outline-none"
                    />
                    <Library className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
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
                <div>
                  {/* ATTENDANCE LIST TABLE */}
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
                              <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${a.status === 'PRESENT' ? 'bg-green-50 text-success' : 'bg-red-50 text-danger'}`}>
                                {a.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* MARKS LIST TABLE */}
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

                  {/* ASSIGNMENTS LIST */}
                  {currentTab === 'assignments' && (
                    <div className="divide-y divide-gray-100">
                      {dataList.map(a => (
                        <div key={a.id} className="p-4 space-y-1 hover:bg-gray-50">
                          <div className="flex justify-between items-start text-xs">
                            <span className="font-bold text-gray-900">{a.title}</span>
                            <span className="text-[10px] text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded">
                              Due: {new Date(a.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 leading-relaxed">{a.description}</p>
                          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mt-1">Course: {a.subject?.name}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* FEES & LEDGER TABLE + CHECKOUT */}
                  {currentTab === 'fees' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                      {/* Checkout */}
                      <form onSubmit={handlePayFee} className="p-5 bg-gray-50 border border-gray-200 rounded-lg space-y-4 h-fit">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Tuition Pay Gateway</h3>
                        <div>
                          <label className="block text-[10px] font-semibold text-gray-500 mb-1">Enter Amount ($)</label>
                          <input
                            type="number"
                            required
                            value={payAmount}
                            onChange={e => setPayAmount(e.target.value)}
                            placeholder="e.g. 1500"
                            className="w-full h-10 px-3 text-xs bg-white border border-gray-200 rounded-md focus:outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-semibold text-gray-500 mb-1">Category</label>
                            <select
                              value={payCategory}
                              onChange={e => setPayCategory(e.target.value)}
                              className="w-full h-9 px-2 text-[11px] bg-white border border-gray-200 rounded-md focus:outline-none"
                            >
                              <option value="TUITION">Tuition</option>
                              <option value="HOSTEL">Hostel</option>
                              <option value="TRANSPORT">Transport</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] font-semibold text-gray-500 mb-1">Payment Method</label>
                            <select
                              value={payMethod}
                              onChange={e => setPayMethod(e.target.value)}
                              className="w-full h-9 px-2 text-[11px] bg-white border border-gray-200 rounded-md focus:outline-none"
                            >
                              <option value="CARD">Credit Card</option>
                              <option value="UPI">UPI</option>
                              <option value="NET_BANKING">Net Banking</option>
                            </select>
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="w-full h-10 text-xs font-semibold text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
                        >
                          Checkout Transaction
                        </button>
                      </form>

                      {/* List */}
                      <div className="lg:col-span-2 overflow-x-auto">
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
                      </div>
                    </div>
                  )}

                  {/* LIBRARY SEARCH */}
                  {currentTab === 'library' && (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-gray-500">
                          <th className="p-4 font-semibold">Title</th>
                          <th className="p-4 font-semibold">Author</th>
                          <th className="p-4 font-semibold">ISBN</th>
                          <th className="p-4 font-semibold">Availability</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {dataList.map(b => (
                          <tr key={b.id} className="hover:bg-gray-50">
                            <td className="p-4 font-medium text-gray-900">{b.title}</td>
                            <td className="p-4 text-gray-500">{b.author}</td>
                            <td className="p-4 text-gray-400 font-mono">{b.isbn}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${b.available ? 'bg-green-50 text-success' : 'bg-red-50 text-danger'}`}>
                                {b.available ? 'Available' : 'Issued'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {/* COMPLAINTS FORM */}
                  {currentTab === 'complaints' && (
                    <form onSubmit={handleSubmitComplaint} className="p-6 max-w-lg space-y-4">
                      <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">Submit Help Complaint Ticket</h3>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Ticket Title</label>
                        <input
                          type="text"
                          required
                          value={compTitle}
                          onChange={e => setCompTitle(e.target.value)}
                          placeholder="e.g. Broken laboratory network switch"
                          className="w-full h-10 px-3 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Full Description</label>
                        <textarea
                          required
                          rows={5}
                          value={compDesc}
                          onChange={e => setCompDesc(e.target.value)}
                          placeholder="Explain technical problems or complaints in detail..."
                          className="w-full p-3 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none"
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-5 h-10 text-xs font-semibold text-white bg-primary rounded-md hover:bg-primary-dark"
                      >
                        Submit Ticket
                      </button>
                    </form>
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

'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, BookOpen, GraduationCap, Calendar, Compass, Mail, Phone, MapPin } from 'lucide-react';

export default function LandingPage() {
  const features = [
    { title: 'Academic Management', desc: 'Manage departments, course curriculum directories, and subject selections.', icon: GraduationCap },
    { title: 'Learning Management System', desc: 'Distribute study resources, file assignments, and tracking schedules.', icon: BookOpen },
    { title: 'Fee Invoicing & Payments', desc: 'Securely handle online tuition collections and download billing receipts.', icon: ShieldCheck },
    { title: 'Examinations & Grades', desc: 'Publishes seat schedules, marks entry, and calculate semester SGPA/CGPA.', icon: Calendar },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between w-full h-16 px-8 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">E</span>
          <span className="text-md font-bold text-gray-900 font-poppins">ERP Institution</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="#features" className="text-sm font-medium text-gray-500 hover:text-primary">Features</Link>
          <Link href="#contact" className="text-sm font-medium text-gray-500 hover:text-primary">Contact</Link>
          <Link href="/login" className="flex items-center justify-center h-9 px-4 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark">
            Portal Login
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20 bg-white border-b border-gray-100">
        <span className="px-3 py-1 text-xs font-semibold text-primary bg-blue-50 rounded-full mb-4">Enterprise Student Management System</span>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-poppins tracking-tight max-w-2xl leading-tight">
          Unified Educational Management for Modern Universities
        </h1>
        <p className="mt-4 text-md text-gray-500 max-w-lg">
          Integrated dashboards for administrators, faculty members, parents, and students. Experience seamless scheduling, online fee collections, and grading sheets.
        </p>
        <div className="mt-8 flex gap-4">
          <Link href="/login" className="flex items-center justify-center h-10 px-6 font-semibold text-white bg-primary rounded-md hover:bg-primary-dark transition-colors duration-150">
            Sign In to Portal
          </Link>
          <a href="#features" className="flex items-center justify-center h-10 px-6 font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors duration-150">
            Explore Features
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="px-8 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900">Comprehensive Modular Suite</h2>
          <p className="text-sm text-gray-500 mt-2">All administrative, operational, and student services in a single system.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-150">
                <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center text-primary mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-semibold text-gray-900">{f.title}</h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Statistics Banner */}
      <section className="bg-white border-y border-gray-200 py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-primary font-poppins">500+</p>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-1">Students Enrolled</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-secondary font-poppins">60+</p>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-1">Faculty Members</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900 font-poppins">25+</p>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-1">Academic Departments</p>
          </div>
        </div>
      </section>

      {/* Contact & Footer Section */}
      <footer id="contact" className="bg-slate-900 text-slate-300 px-8 py-16 mt-auto">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">E</span>
              <span className="text-md font-bold text-white">ERP Institution</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Providing enterprise grade information technology frameworks to colleges, scaling academic metrics, billing registries, and lecture halls.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contact Directory</h4>
            <div className="space-y-3 text-xs text-slate-400">
              <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> +1 (555) 123-4567</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> support@erp-institution.edu</p>
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> 100 University Ave, Campus City</p>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Access Portals</h4>
            <div className="flex flex-col gap-2 text-xs">
              <Link href="/login" className="hover:text-white">Admin Login</Link>
              <Link href="/login" className="hover:text-white">Faculty Login</Link>
              <Link href="/login" className="hover:text-white">Student Login</Link>
              <Link href="/login" className="hover:text-white">Parent Login</Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-12 pt-6 text-center text-[10px] text-slate-500">
          © {new Date().getFullYear()} ERP Institution. All rights reserved. Built for institutional deployment.
        </div>
      </footer>
    </div>
  );
}

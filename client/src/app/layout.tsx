import type { Metadata } from 'next';
import { AuthProvider } from '../context/AuthContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'Enterprise Student Management ERP',
  description: 'Production-ready institutional management system for students, faculty, and administrators.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen text-slate-900 bg-slate-50 transition-colors duration-150">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

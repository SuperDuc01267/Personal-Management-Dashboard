import type { Metadata } from 'next';
import './globals.css';
import { DashboardProvider } from '@/lib/context/DashboardContext';

export const metadata: Metadata = {
  title: 'Personal Management Dashboard | Demo Interview',
  description: 'Quản lý Công việc & Thu chi cá nhân - Next.js App Router, Clean OOP, Normalized State & Data Algorithms',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <DashboardProvider>
          {children}
        </DashboardProvider>
      </body>
    </html>
  );
}

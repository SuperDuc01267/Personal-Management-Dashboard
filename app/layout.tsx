import type { Metadata } from 'next';
import './globals.css';
import { DashboardProvider } from '@/lib/context/DashboardContext';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Personal Dashboard | Quản lý Công việc & Tài chính Cá nhân',
  description: 'Ứng dụng quản lý công việc và tài chính cá nhân đơn giản, hiện đại và hiệu quả.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className="min-h-screen antialiased">
        <DashboardProvider>
          {children}
        </DashboardProvider>
      </body>
    </html>
  );
}

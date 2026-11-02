'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/lib/context/DashboardContext';
import { Navbar } from '@/components/Navbar';
import { FinancialSection } from '@/components/FinancialSection';
import { TaskSection } from '@/components/TaskSection';
import { Wallet, CheckSquare, Layers, Code, CheckCircle, Database, Cpu } from 'lucide-react';

export default function DashboardPage() {
  const { isHydrated } = useDashboard();
  const [activeMobileTab, setActiveMobileTab] = useState<'FINANCE' | 'TASKS' | 'BOTH'>('BOTH');

  // Loading skeleton trong lúc nạp từ LocalStorage
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center space-y-3">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Đang khởi tạo Personal Management Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      {/* Header bar */}
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Banner giới thiệu ngắn gọn các điểm nổi bật kỹ thuật */}
        <section className="mb-6 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-white to-violet-50/80 p-4 sm:p-5 dark:border-indigo-950/60 dark:from-zinc-900 dark:via-zinc-900/90 dark:to-indigo-950/20 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold">
                  ★
                </span>
                <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Hệ thống Quản lý Công việc & Tài chính Cá nhân (Demo Phỏng vấn)
                </h2>
              </div>
              <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 max-w-2xl">
                Dự án áp dụng <strong>Clean OOP</strong> (Inheritance, Encapsulation, BaseEntity),{' '}
                <strong>Normalized State Pattern</strong> (Hash Map O(1)),{' '}
                <strong>Merge Sort O(N log N)</strong>, <strong>Debounce Search Hook</strong> và{' '}
                <strong>Single-pass Data Aggregation O(N)</strong>.
              </p>
            </div>

            {/* Tech Badges */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
              <span className="flex items-center gap-1 rounded-md bg-white px-2 py-1 text-zinc-700 shadow-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                <Code className="h-3 w-3 text-indigo-500" />
                OOP Models
              </span>
              <span className="flex items-center gap-1 rounded-md bg-white px-2 py-1 text-zinc-700 shadow-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                <Database className="h-3 w-3 text-emerald-500" />
                Normalized O(1)
              </span>
              <span className="flex items-center gap-1 rounded-md bg-white px-2 py-1 text-zinc-700 shadow-sm border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300">
                <Cpu className="h-3 w-3 text-violet-500" />
                MergeSort O(N log N)
              </span>
            </div>
          </div>
        </section>

        {/* Tab switchers on Mobile */}
        <div className="mb-6 flex lg:hidden items-center justify-center rounded-xl bg-zinc-200/60 p-1 dark:bg-zinc-850 text-xs font-semibold">
          <button
            onClick={() => setActiveMobileTab('BOTH')}
            className={`flex-1 rounded-lg py-1.5 transition-all cursor-pointer ${
              activeMobileTab === 'BOTH'
                ? 'bg-white text-zinc-900 shadow dark:bg-zinc-800 dark:text-zinc-100'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Tất cả (2 Cột)
          </button>
          <button
            onClick={() => setActiveMobileTab('FINANCE')}
            className={`flex-1 rounded-lg py-1.5 transition-all cursor-pointer ${
              activeMobileTab === 'FINANCE'
                ? 'bg-white text-zinc-900 shadow dark:bg-zinc-800 dark:text-zinc-100'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Thu Chi
          </button>
          <button
            onClick={() => setActiveMobileTab('TASKS')}
            className={`flex-1 rounded-lg py-1.5 transition-all cursor-pointer ${
              activeMobileTab === 'TASKS'
                ? 'bg-white text-zinc-900 shadow dark:bg-zinc-800 dark:text-zinc-100'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Công Việc
          </button>
        </div>

        {/* Layout 2 Cột chính (Desktop: 2 columns; Mobile: responsive) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-start">
          {/* Cột 1: Quản lý Thu chi & Thống kê tài chính */}
          <div
            className={`space-y-6 ${
              activeMobileTab === 'TASKS' ? 'hidden lg:block' : 'block'
            }`}
          >
            <FinancialSection />
          </div>

          {/* Cột 2: Quản lý Công việc (Tasks) */}
          <div
            className={`space-y-6 ${
              activeMobileTab === 'FINANCE' ? 'hidden lg:block' : 'block'
            }`}
          >
            <TaskSection />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-zinc-200 py-6 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        <p>Personal Management Dashboard • Thiết kế cho bài phỏng vấn Thực tập sinh Frontend / Fullstack</p>
        <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-500">
          Next.js App Router • TypeScript • Tailwind CSS • Normalized State O(1) • Merge Sort O(N log N)
        </p>
      </footer>
    </div>
  );
}

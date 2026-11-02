'use client';

import React, { useMemo, useState } from 'react';
import { useDashboard } from '@/lib/context/DashboardContext';
import { Navbar } from '@/components/Navbar';
import { FinancialSection } from '@/components/FinancialSection';
import { TaskSection } from '@/components/TaskSection';
import { calculateFinancialSummary, calculateTaskSummary, formatVND } from '@/lib/utils/aggregation';
import { TrendingUp, TrendingDown, Wallet, CheckCircle2 } from 'lucide-react';

export default function DashboardPage() {
  const { isHydrated, transactions, tasks } = useDashboard();
  const [activeMobileTab, setActiveMobileTab] = useState<'FINANCE' | 'TASKS' | 'BOTH'>('BOTH');

  // Tính toán số liệu thống kê nghiệp vụ
  const financialSummary = useMemo(() => calculateFinancialSummary(transactions), [transactions]);
  const taskSummary = useMemo(() => calculateTaskSummary(tasks), [tasks]);

  // Loading skeleton trong lúc nạp từ LocalStorage
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center space-y-3">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Đang tải dữ liệu bảng điều khiển...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors">
      {/* Header bar */}
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* 4 Cards Thống kê Nghiệp vụ Tổng quan */}
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Tổng thu */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Tổng Thu Nhập
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              {formatVND(financialSummary.totalIncome)}
            </div>
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
              {financialSummary.incomeCount} nguồn thu ghi nhận
            </p>
          </div>

          {/* Card 2: Tổng chi */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Tổng Chi Tiêu
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
                <TrendingDown className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
              {formatVND(financialSummary.totalExpense)}
            </div>
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
              {financialSummary.expenseCount} khoản chi tiêu
            </p>
          </div>

          {/* Card 3: Số dư khả dụng */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Số Dư Khả Dụng
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
                <Wallet className="h-4 w-4" />
              </div>
            </div>
            <div
              className={`mt-3 text-2xl font-bold tracking-tight ${
                financialSummary.netBalance >= 0
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {formatVND(financialSummary.netBalance)}
            </div>
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
              Tỷ lệ tích lũy: {financialSummary.savingsRate}%
            </p>
          </div>

          {/* Card 4: Task hoàn thành */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Công Việc Hoàn Thành
              </span>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold tracking-tight text-violet-600 dark:text-violet-400">
              {taskSummary.done} / {taskSummary.total}
            </div>
            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
              Đạt {taskSummary.completionRate}% chỉ tiêu công việc
            </p>
          </div>
        </section>

        {/* Nút chuyển đổi Tab trên thiết bị di động */}
        <div className="mb-6 flex lg:hidden items-center justify-center rounded-xl bg-zinc-200/60 p-1 dark:bg-zinc-800 text-xs font-semibold">
          <button
            onClick={() => setActiveMobileTab('BOTH')}
            className={`flex-1 rounded-lg py-1.5 transition-all cursor-pointer ${
              activeMobileTab === 'BOTH'
                ? 'bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Tất cả (2 Cột)
          </button>
          <button
            onClick={() => setActiveMobileTab('FINANCE')}
            className={`flex-1 rounded-lg py-1.5 transition-all cursor-pointer ${
              activeMobileTab === 'FINANCE'
                ? 'bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Thu Chi
          </button>
          <button
            onClick={() => setActiveMobileTab('TASKS')}
            className={`flex-1 rounded-lg py-1.5 transition-all cursor-pointer ${
              activeMobileTab === 'TASKS'
                ? 'bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Công Việc
          </button>
        </div>

        {/* Bố cục 2 Cột chính: Thu chi & Công việc */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-start">
          {/* Cột 1: Quản lý Thu chi */}
          <div
            className={`space-y-6 ${
              activeMobileTab === 'TASKS' ? 'hidden lg:block' : 'block'
            }`}
          >
            <FinancialSection showSummaryCards={false} />
          </div>

          {/* Cột 2: Quản lý Công việc */}
          <div
            className={`space-y-6 ${
              activeMobileTab === 'FINANCE' ? 'hidden lg:block' : 'block'
            }`}
          >
            <TaskSection />
          </div>
        </div>
      </main>

      {/* Footer chuẩn Production */}
      <footer className="mt-16 border-t border-zinc-200 py-6 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        <p>© 2026 Personal Dashboard. Giải pháp quản lý công việc và tài chính cá nhân hiệu quả.</p>
      </footer>
    </div>
  );
}

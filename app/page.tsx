'use client';

import React, { useMemo, useState } from 'react';
import { useDashboard } from '@/lib/context/DashboardContext';
import { Navbar } from '@/components/dashboard/navbar';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { ExpenseTracker } from '@/components/dashboard/expense-tracker';
import { TaskManager } from '@/components/dashboard/task-manager';
import { calculateFinancialSummary, calculateTaskSummary } from '@/lib/utils/aggregation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DashboardPage() {
  const { isHydrated, transactions, tasks } = useDashboard();
  const [activeMobileView, setActiveMobileView] = useState<'BOTH' | 'FINANCE' | 'TASKS'>('BOTH');

  // Thống kê nghiệp vụ
  const financialSummary = useMemo(() => calculateFinancialSummary(transactions), [transactions]);
  const taskSummary = useMemo(() => calculateTaskSummary(tasks), [tasks]);

  // Loading skeleton tối giản
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent dark:border-zinc-100" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50 antialiased selection:bg-zinc-800 selection:text-zinc-100">
      {/* Header bar */}
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-8">
        {/* 4 Stats Cards chuẩn phong cách shadcn/ui: Phẳng, nhỏ gọn, không subtext rườm rà */}
        <StatsCards
          totalIncome={financialSummary.totalIncome}
          totalExpense={financialSummary.totalExpense}
          netBalance={financialSummary.netBalance}
          completedTasks={taskSummary.done}
          totalTasks={taskSummary.total}
        />

        {/* Nút chuyển đổi giao diện trên Mobile */}
        <div className="flex lg:hidden justify-center">
          <Tabs
            value={activeMobileView}
            onValueChange={(val) => setActiveMobileView(val as 'BOTH' | 'FINANCE' | 'TASKS')}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-3 h-8">
              <TabsTrigger value="BOTH" className="text-xs">
                Tất cả (2 Cột)
              </TabsTrigger>
              <TabsTrigger value="FINANCE" className="text-xs">
                Thu chi
              </TabsTrigger>
              <TabsTrigger value="TASKS" className="text-xs">
                Công việc
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Bố cục 2 Cột chính phẳng tối giản */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-start">
          {/* Cột 1: Quản lý Thu chi (Expense Tracker) */}
          <div
            className={`space-y-6 ${
              activeMobileView === 'TASKS' ? 'hidden lg:block' : 'block'
            }`}
          >
            <ExpenseTracker />
          </div>

          {/* Cột 2: Quản lý Công việc (Task Manager) */}
          <div
            className={`space-y-6 ${
              activeMobileView === 'FINANCE' ? 'hidden lg:block' : 'block'
            }`}
          >
            <TaskManager />
          </div>
        </div>
      </main>

      {/* Footer tối giản chuẩn shadcn/ui */}
      <footer className="mt-20 border-t border-zinc-200 py-6 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
        <p>© 2026 Personal Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
}

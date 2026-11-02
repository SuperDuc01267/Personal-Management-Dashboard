'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/lib/context/DashboardContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar, DashboardView } from '@/components/dashboard/app-sidebar';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { OverviewView } from '@/components/dashboard/overview-view';
import { ExpenseTracker } from '@/components/dashboard/expense-tracker';
import { TaskTracker } from '@/components/dashboard/task-tracker';

export default function DashboardPage() {
  const { isHydrated } = useDashboard();
  const [currentView, setCurrentView] = useState<DashboardView>('overview');

  // Loading skeleton tối giản trong lúc đồng bộ LocalStorage
  if (!isHydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-zinc-950">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-900 border-t-transparent dark:border-zinc-100" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar currentView={currentView} onViewChange={setCurrentView} />
      <SidebarInset className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 flex flex-col">
        <DashboardHeader currentView={currentView} />
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">
          {currentView === 'overview' && <OverviewView onNavigate={setCurrentView} />}
          {currentView === 'expenses' && <ExpenseTracker />}
          {currentView === 'tasks' && <TaskTracker />}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

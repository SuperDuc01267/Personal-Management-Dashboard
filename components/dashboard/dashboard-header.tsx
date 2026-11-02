'use client';

import * as React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { DashboardView } from './app-sidebar';

interface DashboardHeaderProps {
  currentView: DashboardView;
}

const VIEW_TITLES: Record<DashboardView, { title: string; subtitle: string }> = {
  overview: {
    title: 'Tổng quan Bảng điều khiển',
    subtitle: 'Tóm tắt chỉ số tài chính và tiến độ công việc',
  },
  expenses: {
    title: 'Quản lý Thu Chi & Giao Dịch',
    subtitle: 'Theo dõi chi tiết nguồn thu, khoản chi và cơ cấu danh mục',
  },
  tasks: {
    title: 'Quản lý Công Việc Cá Nhân',
    subtitle: 'Danh sách nhiệm vụ, mức độ ưu tiên và thời hạn hoàn thành',
  },
};

export function DashboardHeader({ currentView }: DashboardHeaderProps) {
  const info = VIEW_TITLES[currentView];

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b border-slate-300 bg-white/95 px-4 backdrop-blur dark:border-slate-800 dark:bg-zinc-950/95">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4 bg-slate-300 dark:bg-slate-700" />

      <div className="flex flex-col">
        <h1 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {info.title}
        </h1>
        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 hidden sm:inline">
          {info.subtitle}
        </span>
      </div>
    </header>
  );
}

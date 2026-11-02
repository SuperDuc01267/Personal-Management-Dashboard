'use client';

import * as React from 'react';
import { useDashboard } from '@/lib/context/DashboardContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Receipt,
  CheckSquare,
  Sun,
  Moon,
  RotateCcw,
  Sparkles,
  Check,
} from 'lucide-react';

export type DashboardView = 'overview' | 'expenses' | 'tasks';

interface AppSidebarProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

export function AppSidebar({ currentView, onViewChange }: AppSidebarProps) {
  const { isDarkMode, toggleDarkMode, resetToMockData } = useDashboard();
  const [resetDone, setResetDone] = React.useState<boolean>(false);

  const handleReset = () => {
    resetToMockData();
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2000);
  };

  const navItems = [
    {
      id: 'overview' as const,
      title: 'Tổng quan',
      icon: LayoutDashboard,
      description: 'Chỉ số & tóm tắt',
    },
    {
      id: 'expenses' as const,
      title: 'Quản lý Thu Chi',
      icon: Receipt,
      description: 'Giao dịch & chi tiêu',
    },
    {
      id: 'tasks' as const,
      title: 'Quản lý Công việc',
      icon: CheckSquare,
      description: 'Nhiệm vụ & tiến độ',
    },
  ];

  return (
    <Sidebar className="border-r border-slate-300 dark:border-slate-800">
      {/* Header Logo */}
      <SidebarHeader className="border-b border-slate-300 dark:border-slate-800 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900 shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Personal Dashboard
            </span>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Quản lý Cá nhân
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation Menu */}
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 px-2 mb-1">
            Menu Chính
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;

                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => onViewChange(item.id)}
                      className={`w-full justify-start gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
                          : 'text-zinc-600 hover:bg-slate-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer Actions: Dark mode + Reset data */}
      <SidebarFooter className="border-t border-slate-300 dark:border-slate-800 p-3 space-y-2">
        {/* Reset Data Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="w-full justify-start gap-2 h-8 text-xs font-normal border-slate-300 dark:border-slate-700 text-zinc-700 dark:text-zinc-300"
        >
          {resetDone ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Đã đặt lại dữ liệu</span>
            </>
          ) : (
            <>
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Đặt lại dữ liệu mẫu</span>
            </>
          )}
        </Button>

        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleDarkMode}
          className="w-full justify-start gap-2 h-8 text-xs font-normal text-zinc-700 dark:text-zinc-300"
        >
          {isDarkMode ? (
            <>
              <Sun className="h-3.5 w-3.5 text-amber-500" />
              <span>Chế độ Sáng (Light)</span>
            </>
          ) : (
            <>
              <Moon className="h-3.5 w-3.5 text-zinc-600" />
              <span>Chế độ Tối (Dark)</span>
            </>
          )}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}


'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/lib/context/DashboardContext';
import { Sun, Moon, RotateCcw, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import { InterviewGuideModal } from './InterviewGuideModal';

export const Navbar: React.FC = () => {
  const { isDarkMode, toggleDarkMode, resetToMockData } = useDashboard();
  const [showGuide, setShowGuide] = useState<boolean>(false);
  const [showResetNotice, setShowResetNotice] = useState<boolean>(false);

  const handleReset = () => {
    resetToMockData();
    setShowResetNotice(true);
    setTimeout(() => setShowResetNotice(false), 2500);
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80 transition-colors">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  Personal Dashboard
                </h1>
                <span className="hidden sm:inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Intern Demo
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Quản lý Công việc & Thu chi • OOP & Normalized State
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Reset mock data button */}
            <button
              onClick={handleReset}
              title="Khôi phục dữ liệu mẫu ban đầu để demo lại"
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-800/60 dark:text-zinc-300 dark:hover:bg-zinc-700/60 transition-all cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Reset Dữ liệu Mẫu</span>
            </button>

            {/* Interview Guide Button */}
            <button
              onClick={() => setShowGuide(true)}
              className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 transition-all cursor-pointer"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Gợi ý Phỏng vấn</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label="Chuyển đổi giao diện Sáng / Tối"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-all cursor-pointer"
            >
              {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-zinc-700" />}
            </button>
          </div>
        </div>

        {/* Reset alert banner */}
        {showResetNotice && (
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-4 py-1.5 text-center text-xs font-medium text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-1.5 animate-fadeIn">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Đã khôi phục toàn bộ danh sách Task và Giao dịch mẫu!
          </div>
        )}
      </header>

      {/* Guide Modal */}
      <InterviewGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </>
  );
};

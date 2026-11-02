'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/lib/context/DashboardContext';
import { Button } from '@/components/ui/button';
import { Sun, Moon, RotateCcw, Check, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { isDarkMode, toggleDarkMode, resetToMockData } = useDashboard();
  const [resetDone, setResetDone] = useState<boolean>(false);

  const handleReset = () => {
    resetToMockData();
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Personal Dashboard
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="h-8 gap-1.5 text-xs font-normal text-zinc-600 dark:text-zinc-400"
          >
            {resetDone ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span>Đã đặt lại</span>
              </>
            ) : (
              <>
                <RotateCcw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Đặt lại dữ liệu</span>
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="iconSm"
            onClick={toggleDarkMode}
            aria-label="Chuyển đổi giao diện"
            className="text-zinc-600 dark:text-zinc-400"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </header>
  );
};

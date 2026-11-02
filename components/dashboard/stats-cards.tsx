'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { formatVND } from '@/lib/utils/aggregation';
import { TrendingUp, TrendingDown, Wallet, CheckCircle2 } from 'lucide-react';

interface StatsCardsProps {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  completedTasks: number;
  totalTasks: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalIncome,
  totalExpense,
  netBalance,
  completedTasks,
  totalTasks,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* 1. Tổng thu nhập */}
      <Card className="p-5">
        <div className="flex items-center justify-between pb-2">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Tổng thu nhập
          </span>
          <TrendingUp className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {formatVND(totalIncome)}
        </div>
      </Card>

      {/* 2. Tổng chi tiêu */}
      <Card className="p-5">
        <div className="flex items-center justify-between pb-2">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Tổng chi tiêu
          </span>
          <TrendingDown className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {formatVND(totalExpense)}
        </div>
      </Card>

      {/* 3. Số dư khả dụng */}
      <Card className="p-5">
        <div className="flex items-center justify-between pb-2">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Số dư khả dụng
          </span>
          <Wallet className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {formatVND(netBalance)}
        </div>
      </Card>

      {/* 4. Công việc hoàn thành */}
      <Card className="p-5">
        <div className="flex items-center justify-between pb-2">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Công việc hoàn thành
          </span>
          <CheckCircle2 className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
        </div>
        <div className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {completedTasks} / {totalTasks}
        </div>
      </Card>
    </div>
  );
};


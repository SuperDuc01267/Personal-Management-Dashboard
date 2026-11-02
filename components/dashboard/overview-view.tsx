'use client';

import React, { useMemo } from 'react';
import { useDashboard } from '@/lib/context/DashboardContext';
import { StatsCards } from './stats-cards';
import { calculateFinancialSummary, calculateTaskSummary, groupExpensesByCategory, formatVND } from '@/lib/utils/aggregation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, ArrowUpRight, ArrowDownRight, Calendar, AlertTriangle } from 'lucide-react';
import { DashboardView } from './app-sidebar';

interface OverviewViewProps {
  onNavigate: (view: DashboardView) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate }) => {
  const { transactions, tasks, toggleTaskComplete } = useDashboard();

  const financialSummary = useMemo(() => calculateFinancialSummary(transactions), [transactions]);
  const taskSummary = useMemo(() => calculateTaskSummary(tasks), [tasks]);
  const categoryBreakdown = useMemo(() => groupExpensesByCategory(transactions), [transactions]);

  // Lấy 4 giao dịch gần nhất
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 4);
  }, [transactions]);

  // Lấy các task cần chú ý (chưa xong, ưu tiên cao hoặc sắp hết hạn)
  const urgentTasks = useMemo(() => {
    return tasks
      .filter((t) => t.status !== 'DONE')
      .slice(0, 4);
  }, [tasks]);

  return (
    <div className="space-y-6">
      {/* 4 Stats Cards */}
      <StatsCards
        totalIncome={financialSummary.totalIncome}
        totalExpense={financialSummary.totalExpense}
        netBalance={financialSummary.netBalance}
        completedTasks={taskSummary.done}
        totalTasks={taskSummary.total}
      />

      {/* Grid 2 Cột Tóm Tắt Tổng Quan */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
        {/* Cột Trái: Tài chính & Chi tiêu */}
        <div className="space-y-6">
          {/* Card Cơ cấu chi tiêu */}
          <Card className="border-slate-300 dark:border-slate-700/80 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-slate-300 dark:border-slate-800">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Cơ cấu chi tiêu hàng đầu
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('expenses')}
                className="h-7 text-xs text-zinc-600 dark:text-zinc-400"
              >
                Xem tất cả
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {categoryBreakdown.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-400">
                  Chưa có dữ liệu chi tiêu.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-zinc-900/60">
                      <TableHead className="w-[120px]">Danh mục</TableHead>
                      <TableHead>Tỷ trọng</TableHead>
                      <TableHead className="text-right w-[120px]">Số tiền</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryBreakdown.slice(0, 4).map((item) => (
                      <TableRow key={item.category} className="border-b border-slate-200 dark:border-slate-800/80">
                        <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">
                          {item.category}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={item.percentage}
                              className="h-1.5 w-full bg-slate-200 dark:bg-slate-800"
                              indicatorClassName="bg-slate-800 dark:bg-slate-200"
                            />
                            <span className="w-8 text-right font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                              {item.percentage}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono text-zinc-800 dark:text-zinc-200">
                          {formatVND(item.totalAmount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Card Giao dịch gần đây */}
          <Card className="border-slate-300 dark:border-slate-700/80 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-slate-300 dark:border-slate-800">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Giao dịch gần đây
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('expenses')}
                className="h-7 text-xs text-zinc-600 dark:text-zinc-400"
              >
                Quản lý thu chi
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {recentTransactions.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-400">
                  Chưa có giao dịch nào.
                </div>
              ) : (
                <Table>
                  <TableBody>
                    {recentTransactions.map((tx) => (
                      <TableRow key={tx.id} className="border-b border-slate-200 dark:border-slate-800/80">
                        <TableCell>
                          <div className="font-medium text-xs text-zinc-900 dark:text-zinc-100">
                            {tx.title}
                          </div>
                          <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                            {new Date(tx.createdAt).toLocaleDateString('vi-VN')}
                          </div>
                        </TableCell>
                        <TableCell className="w-[100px]">
                          <Badge variant="outline" className="text-[10px] border-slate-300 dark:border-slate-700">
                            {tx.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono text-xs font-semibold">
                          <span
                            className={
                              tx.type === 'INCOME'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-zinc-900 dark:text-zinc-100'
                            }
                          >
                            {tx.getFormattedAmount(true)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cột Phải: Nhiệm vụ & Kế hoạch */}
        <div className="space-y-6">
          {/* Card Nhiệm vụ cần thực hiện */}
          <Card className="border-slate-300 dark:border-slate-700/80 shadow-sm overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-slate-300 dark:border-slate-800">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                Nhiệm vụ cần thực hiện
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('tasks')}
                className="h-7 text-xs text-zinc-600 dark:text-zinc-400"
              >
                Xem tất cả task
              </Button>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {urgentTasks.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-400">
                  Tất cả công việc đã được hoàn thành xuất sắc!
                </div>
              ) : (
                urgentTasks.map((task) => {
                  const overdue = task.isOverdue();
                  return (
                    <div
                      key={task.id}
                      className="flex items-start justify-between gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-zinc-900/50"
                    >
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        <button
                          onClick={() => toggleTaskComplete(task.id)}
                          className="mt-0.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer"
                          title="Hoàn thành công việc"
                        >
                          <Circle className="h-4 w-4" />
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">
                            {task.title}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400">
                            <span className="flex items-center gap-1 font-mono">
                              <Calendar className="h-3 w-3" />
                              {new Date(task.dueDate).toLocaleDateString('vi-VN')}
                            </span>
                            {overdue && (
                              <Badge variant="destructive" className="text-[10px] px-1 py-0">
                                Quá hạn
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <Badge
                        variant={task.priority === 'HIGH' ? 'destructive' : 'secondary'}
                        className="text-[10px] shrink-0 border-slate-300 dark:border-slate-700"
                      >
                        {task.priority === 'HIGH' ? 'Ưu tiên Cao' : 'Bình thường'}
                      </Badge>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>

          {/* Card Tỷ lệ hoàn thành công việc */}
          <Card className="border-slate-300 dark:border-slate-700/80 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Tiến độ hoàn thành nhiệm vụ
                </span>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Đã giải quyết {taskSummary.done} trên tổng {taskSummary.total} công việc
                </p>
              </div>
              <span className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100">
                {taskSummary.completionRate}%
              </span>
            </div>

            <Progress
              value={taskSummary.completionRate}
              className="h-2 w-full bg-slate-200 dark:bg-slate-800"
              indicatorClassName="bg-slate-800 dark:bg-slate-200"
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

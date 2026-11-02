import { Task } from '../models/Task';
import { Transaction } from '../models/Transaction';

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  savingsRate: number;
  transactionCount: number;
  incomeCount: number;
  expenseCount: number;
}

export interface CategoryExpenseBreakdown {
  category: string;
  totalAmount: number;
  percentage: number;
  count: number;
}

export interface TaskSummary {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  overdue: number;
  completionRate: number;
}

/**
 * Tính toán tổng quan tài chính bằng một lần duyệt mảng duy nhất với reduce - O(N)
 * @param transactions Danh sách giao dịch
 */
export function calculateFinancialSummary(transactions: Transaction[]): FinancialSummary {
  const summary = transactions.reduce(
    (acc, curr) => {
      acc.transactionCount += 1;
      if (curr.type === 'INCOME') {
        acc.totalIncome += curr.amount;
        acc.incomeCount += 1;
      } else {
        acc.totalExpense += curr.amount;
        acc.expenseCount += 1;
      }
      return acc;
    },
    {
      totalIncome: 0,
      totalExpense: 0,
      transactionCount: 0,
      incomeCount: 0,
      expenseCount: 0,
    }
  );

  const netBalance = summary.totalIncome - summary.totalExpense;
  const savingsRate =
    summary.totalIncome > 0
      ? Math.max(0, Math.round((netBalance / summary.totalIncome) * 100))
      : 0;

  return {
    ...summary,
    netBalance,
    savingsRate,
  };
}

/**
 * Nhóm và tính tổng chi tiêu theo Category bằng reduce và map - O(N)
 * Giúp hiển thị tỷ lệ % cơ cấu chi tiêu trực quan trên Dashboard
 * @param transactions Danh sách giao dịch
 */
export function groupExpensesByCategory(transactions: Transaction[]): CategoryExpenseBreakdown[] {
  // Bước 1: Lọc ra các khoản chi tiêu và nhóm theo Category (reduce) - O(N)
  const categoryMap = transactions.reduce<Record<string, { totalAmount: number; count: number }>>(
    (acc, item) => {
      if (item.type === 'EXPENSE') {
        const cat = item.category || 'Khác';
        if (!acc[cat]) {
          acc[cat] = { totalAmount: 0, count: 0 };
        }
        acc[cat].totalAmount += item.amount;
        acc[cat].count += 1;
      }
      return acc;
    },
    {}
  );

  // Tính tổng chi tiêu để tính phần trăm
  const totalExpense = Object.values(categoryMap).reduce((sum, item) => sum + item.totalAmount, 0);

  // Bước 2: Chuyển đổi Record sang Array và tính tỷ lệ phần trăm (map)
  const breakdown: CategoryExpenseBreakdown[] = Object.entries(categoryMap).map(
    ([category, data]) => ({
      category,
      totalAmount: data.totalAmount,
      count: data.count,
      percentage: totalExpense > 0 ? Math.round((data.totalAmount / totalExpense) * 100) : 0,
    })
  );

  // Bước 3: Sắp xếp danh mục chiếm nhiều chi phí nhất lên đầu (O(K log K) với K là số category)
  return breakdown.sort((a, b) => b.totalAmount - a.totalAmount);
}

/**
 * Thống kê các chỉ số công việc (Task Metrics) bằng reduce - O(N)
 * @param tasks Danh sách công việc
 */
export function calculateTaskSummary(tasks: Task[]): TaskSummary {
  const initial = {
    total: tasks.length,
    todo: 0,
    inProgress: 0,
    done: 0,
    overdue: 0,
  };

  const counts = tasks.reduce((acc, task) => {
    if (task.status === 'DONE') {
      acc.done += 1;
    } else if (task.status === 'IN_PROGRESS') {
      acc.inProgress += 1;
    } else {
      acc.todo += 1;
    }

    if (task.isOverdue()) {
      acc.overdue += 1;
    }

    return acc;
  }, initial);

  const completionRate =
    counts.total > 0 ? Math.round((counts.done / counts.total) * 100) : 0;

  return {
    ...counts,
    completionRate,
  };
}

/**
 * Format tiền tệ VND tiện ích
 */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
}

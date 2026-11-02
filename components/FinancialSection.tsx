'use client';

import React, { useState, useMemo } from 'react';
import { useDashboard } from '@/lib/context/DashboardContext';
import { TransactionType } from '@/lib/models/Transaction';
import {
  calculateFinancialSummary,
  groupExpensesByCategory,
  formatVND,
} from '@/lib/utils/aggregation';
import { sortTransactions, TransactionSortCriteria } from '@/lib/utils/sorting';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  Trash2,
  Filter,
  ArrowUpDown,
  ShoppingBag,
  Home,
  Coffee,
  GraduationCap,
  Car,
  DollarSign,
  Gift,
  HelpCircle,
  Tag,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const CATEGORIES = [
  'Lương',
  'Thưởng',
  'Freelance',
  'Ăn uống',
  'Nhà ở',
  'Học tập',
  'Di chuyển',
  'Giải trí',
  'Mua sắm',
  'Khác',
];

export const FinancialSection: React.FC = () => {
  const { transactions, addTransaction, deleteTransaction } = useDashboard();

  // State cục bộ cho Form thêm giao dịch
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [category, setCategory] = useState<string>('Ăn uống');
  const [formError, setFormError] = useState<string>('');

  // State cho Lọc & Sắp xếp
  const [typeFilter, setTypeFilter] = useState<'ALL' | TransactionType>('ALL');
  const [sortBy, setSortBy] = useState<TransactionSortCriteria>('DATE_DESC');

  // 1. Thống kê tài chính bằng reduce - O(N)
  const summary = useMemo(() => calculateFinancialSummary(transactions), [transactions]);

  // 2. Nhóm chi tiêu theo danh mục
  const categoryBreakdown = useMemo(
    () => groupExpensesByCategory(transactions),
    [transactions]
  );

  // 3. Lọc danh sách giao dịch
  const filteredTransactions = useMemo(() => {
    if (typeFilter === 'ALL') return transactions;
    return transactions.filter((tx) => tx.type === typeFilter);
  }, [transactions, typeFilter]);

  // 4. Sắp xếp danh sách sử dụng thuật toán Merge Sort O(N log N)
  const sortedTransactions = useMemo(() => {
    return sortTransactions(filteredTransactions, sortBy);
  }, [filteredTransactions, sortBy]);

  // Xử lý gửi Form thêm giao dịch mới
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const numAmount = parseFloat(amount);
    if (!title.trim()) {
      setFormError('Vui lòng nhập tên giao dịch.');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setFormError('Số tiền phải là số hợp lệ và lớn hơn 0 (Kiểm tra Encapsulation).');
      return;
    }

    try {
      addTransaction({
        title: title.trim(),
        amount: numAmount,
        type,
        category,
      });

      // Reset form
      setTitle('');
      setAmount('');
      setIsFormOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('Có lỗi xảy ra khi tạo giao dịch.');
      }
    }
  };

  // Helper hiển thị icon phù hợp với Category
  const getCategoryIcon = (catName: string) => {
    switch (catName) {
      case 'Lương':
      case 'Thưởng':
      case 'Freelance':
        return <DollarSign className="h-4 w-4 text-emerald-500" />;
      case 'Ăn uống':
        return <Coffee className="h-4 w-4 text-amber-500" />;
      case 'Nhà ở':
        return <Home className="h-4 w-4 text-blue-500" />;
      case 'Học tập':
        return <GraduationCap className="h-4 w-4 text-violet-500" />;
      case 'Di chuyển':
        return <Car className="h-4 w-4 text-sky-500" />;
      case 'Mua sắm':
        return <ShoppingBag className="h-4 w-4 text-rose-500" />;
      case 'Giải trí':
        return <Gift className="h-4 w-4 text-pink-500" />;
      default:
        return <Tag className="h-4 w-4 text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Tiêu đề mục */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-indigo-500" />
            Tài chính & Thu chi
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Duyệt Single-pass O(N) với <code className="font-mono text-indigo-600 dark:text-indigo-400">reduce</code> & phân tích danh mục
          </p>
        </div>

        {/* Nút bật/tắt form thêm giao dịch */}
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors cursor-pointer"
        >
          {isFormOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          <span>{isFormOpen ? 'Đóng Form' : 'Thêm Giao dịch'}</span>
        </button>
      </div>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {/* Tổng Thu */}
        <div className="rounded-xl border border-emerald-200/60 bg-gradient-to-br from-emerald-500/10 to-transparent p-4 dark:border-emerald-900/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              Tổng Thu nhập
            </span>
            <div className="rounded-lg bg-emerald-500/20 p-1.5 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-bold tracking-tight text-emerald-700 dark:text-emerald-300">
            {formatVND(summary.totalIncome)}
          </div>
          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            {summary.incomeCount} nguồn thu
          </p>
        </div>

        {/* Tổng Chi */}
        <div className="rounded-xl border border-rose-200/60 bg-gradient-to-br from-rose-500/10 to-transparent p-4 dark:border-rose-900/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rose-700 dark:text-rose-400">
              Tổng Chi tiêu
            </span>
            <div className="rounded-lg bg-rose-500/20 p-1.5 text-rose-600 dark:text-rose-400">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-xl font-bold tracking-tight text-rose-700 dark:text-rose-300">
            {formatVND(summary.totalExpense)}
          </div>
          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            {summary.expenseCount} khoản chi
          </p>
        </div>

        {/* Số dư còn lại */}
        <div className="rounded-xl border border-indigo-200/60 bg-gradient-to-br from-indigo-500/10 to-transparent p-4 dark:border-indigo-900/50">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-indigo-700 dark:text-indigo-400">
              Số dư Hiện có
            </span>
            <div className="rounded-lg bg-indigo-500/20 p-1.5 text-indigo-600 dark:text-indigo-400">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div
            className={`mt-2 text-xl font-bold tracking-tight ${
              summary.netBalance >= 0
                ? 'text-indigo-700 dark:text-indigo-300'
                : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            {formatVND(summary.netBalance)}
          </div>
          <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            Tỷ lệ tích lũy: <strong className="text-indigo-600 dark:text-indigo-300">{summary.savingsRate}%</strong>
          </p>
        </div>
      </div>

      {/* Phân tích cơ cấu chi tiêu theo Category (Thống kê trực quan) */}
      {categoryBreakdown.length > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Cơ cấu Chi tiêu theo Danh mục
            </h3>
            <span className="text-[11px] text-zinc-400">
              Tổng chi: {formatVND(summary.totalExpense)}
            </span>
          </div>
          <div className="space-y-2.5">
            {categoryBreakdown.slice(0, 4).map((item) => (
              <div key={item.category}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-1.5 font-medium text-zinc-700 dark:text-zinc-300">
                    {getCategoryIcon(item.category)}
                    <span>{item.category}</span>
                  </div>
                  <div className="text-zinc-500 dark:text-zinc-400 font-mono text-[11px]">
                    {formatVND(item.totalAmount)}{' '}
                    <span className="text-zinc-400 font-sans">({item.percentage}%)</span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all duration-500"
                    style={{ width: `${Math.min(100, item.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form thêm giao dịch (Ẩn/Hiện) */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/90 animate-fadeIn"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Thêm Giao dịch Mới (Encapsulated Model)
            </h3>
            <span className="text-[11px] text-zinc-400">Kiểm tra validation amount &gt; 0</span>
          </div>

          {formError && (
            <div className="mb-3 rounded-lg bg-rose-500/10 border border-rose-500/20 p-2.5 text-xs text-rose-600 dark:text-rose-400">
              {formError}
            </div>
          )}

          <div className="space-y-3 text-xs">
            {/* Loại giao dịch */}
            <div>
              <label className="block mb-1 font-medium text-zinc-600 dark:text-zinc-400">
                Loại Giao Dịch
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setType('INCOME');
                    setCategory('Lương');
                  }}
                  className={`flex items-center justify-center gap-1.5 rounded-lg py-2 font-medium transition-all cursor-pointer ${
                    type === 'INCOME'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                  }`}
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  Thu nhập (Income)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setType('EXPENSE');
                    setCategory('Ăn uống');
                  }}
                  className={`flex items-center justify-center gap-1.5 rounded-lg py-2 font-medium transition-all cursor-pointer ${
                    type === 'EXPENSE'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                  }`}
                >
                  <TrendingDown className="h-3.5 w-3.5" />
                  Chi tiêu (Expense)
                </button>
              </div>
            </div>

            {/* Tên giao dịch */}
            <div>
              <label className="block mb-1 font-medium text-zinc-600 dark:text-zinc-400">
                Tên Giao Dịch
              </label>
              <input
                type="text"
                placeholder="VD: Mua sách giải thuật, Đi chợ, ..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            {/* Số tiền & Danh mục */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <label className="block mb-1 font-medium text-zinc-600 dark:text-zinc-400">
                  Số Tiền (VND)
                </label>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  placeholder="VD: 150000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 font-mono"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium text-zinc-600 dark:text-zinc-400">
                  Danh Mục
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit button */}
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="rounded-lg px-3 py-1.5 text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-1.5 font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Lưu Giao Dịch
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Thanh Lọc & Sắp xếp */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-800">
        {/* Filter buttons */}
        <div className="flex items-center gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800 text-xs font-medium">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`rounded-md px-2.5 py-1 transition-colors cursor-pointer ${
              typeFilter === 'ALL'
                ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            Tất cả ({transactions.length})
          </button>
          <button
            onClick={() => setTypeFilter('INCOME')}
            className={`rounded-md px-2.5 py-1 transition-colors cursor-pointer ${
              typeFilter === 'INCOME'
                ? 'bg-white text-emerald-700 shadow-sm dark:bg-zinc-700 dark:text-emerald-400'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            Thu ({summary.incomeCount})
          </button>
          <button
            onClick={() => setTypeFilter('EXPENSE')}
            className={`rounded-md px-2.5 py-1 transition-colors cursor-pointer ${
              typeFilter === 'EXPENSE'
                ? 'bg-white text-rose-700 shadow-sm dark:bg-zinc-700 dark:text-rose-400'
                : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            Chi ({summary.expenseCount})
          </button>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <ArrowUpDown className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Sắp xếp:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as TransactionSortCriteria)}
            className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer"
          >
            <option value="DATE_DESC">Mới nhất trước</option>
            <option value="DATE_ASC">Cũ nhất trước</option>
            <option value="AMOUNT_DESC">Số tiền (Cao → Thấp)</option>
            <option value="AMOUNT_ASC">Số tiền (Thấp → Cao)</option>
          </select>
        </div>
      </div>

      {/* Danh sách Giao dịch */}
      <div className="space-y-2">
        {sortedTransactions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 p-8 text-center text-xs text-zinc-400 dark:border-zinc-800">
            Không có giao dịch nào phù hợp bộ lọc.
          </div>
        ) : (
          sortedTransactions.map((tx) => (
            <div
              key={tx.id}
              className="group flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-3 shadow-sm hover:border-zinc-300 hover:shadow transition-all dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              {/* Bên trái: Icon danh mục & Chi tiết */}
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${
                    tx.type === 'INCOME'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                      : 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
                  }`}
                >
                  {getCategoryIcon(tx.category)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {tx.title}
                    </p>
                    <span className="rounded-md bg-zinc-100 px-1.5 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      {tx.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    {new Date(tx.createdAt).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Bên phải: Số tiền formatted bằng OOP method + Nút Xóa */}
              <div className="flex items-center gap-3">
                <span
                  className={`font-mono text-sm font-bold ${
                    tx.type === 'INCOME'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {tx.getFormattedAmount(true)}
                </span>

                <button
                  onClick={() => deleteTransaction(tx.id)}
                  title="Xóa giao dịch"
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-all cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

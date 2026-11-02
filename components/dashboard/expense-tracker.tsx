'use client';

import React, { useState, useMemo } from 'react';
import { useDashboard } from '@/lib/context/DashboardContext';
import { TransactionType } from '@/lib/models/Transaction';
import { groupExpensesByCategory, formatVND } from '@/lib/utils/aggregation';
import { sortTransactions, TransactionSortCriteria } from '@/lib/utils/sorting';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Plus, Trash2, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';

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

export const ExpenseTracker: React.FC = () => {
  const { transactions, addTransaction, deleteTransaction } = useDashboard();

  // State cục bộ cho Form
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [category, setCategory] = useState<string>('Ăn uống');
  const [formError, setFormError] = useState<string>('');

  // Lọc & Sắp xếp
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<TransactionSortCriteria>('DATE_DESC');

  // Phân tích cơ cấu chi tiêu
  const categoryBreakdown = useMemo(
    () => groupExpensesByCategory(transactions),
    [transactions]
  );

  // Lọc danh sách giao dịch
  const filteredTransactions = useMemo(() => {
    if (activeTab === 'ALL') return transactions;
    return transactions.filter((tx) => tx.type === activeTab);
  }, [transactions, activeTab]);

  // Sắp xếp danh sách
  const sortedTransactions = useMemo(() => {
    return sortTransactions(filteredTransactions, sortBy);
  }, [filteredTransactions, sortBy]);

  // Submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const numAmount = parseFloat(amount);
    if (!title.trim()) {
      setFormError('Vui lòng nhập tên giao dịch.');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      setFormError('Số tiền phải lớn hơn 0.');
      return;
    }

    try {
      addTransaction({
        title: title.trim(),
        amount: numAmount,
        type,
        category,
      });

      setTitle('');
      setAmount('');
      setIsFormOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('Không thể tạo giao dịch.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Quản lý thu chi
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Lịch sử giao dịch và phân bổ chi tiêu
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="h-8 gap-1 text-xs"
        >
          {isFormOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          <span>{isFormOpen ? 'Đóng' : 'Thêm giao dịch'}</span>
        </Button>
      </div>

      {/* Form thêm giao dịch (shadcn Card) */}
      {isFormOpen && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Thêm giao dịch mới</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              {formError && (
                <div className="rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
                  {formError}
                </div>
              )}

              {/* Type toggle */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={type === 'INCOME' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setType('INCOME');
                    setCategory('Lương');
                  }}
                  className="h-8 text-xs"
                >
                  Thu nhập
                </Button>
                <Button
                  type="button"
                  variant={type === 'EXPENSE' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setType('EXPENSE');
                    setCategory('Ăn uống');
                  }}
                  className="h-8 text-xs"
                >
                  Chi tiêu
                </Button>
              </div>

              {/* Title */}
              <div>
                <Input
                  type="text"
                  placeholder="Tên giao dịch (VD: Lương, Tiền phòng, Ăn uống...)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              {/* Amount & Category */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <Input
                    type="number"
                    min="1000"
                    step="1000"
                    placeholder="Số tiền (VND)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-8 font-mono text-xs"
                  />
                </div>
                <div>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-8 text-xs"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFormOpen(false)}
                  className="h-8 text-xs"
                >
                  Hủy
                </Button>
                <Button type="submit" size="sm" className="h-8 text-xs">
                  Lưu giao dịch
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Bảng Cơ cấu chi tiêu (Table phẳng shadcn với thanh progress bg-zinc-800) */}
      {categoryBreakdown.length > 0 && (
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Cơ cấu chi tiêu
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Danh mục</TableHead>
                  <TableHead>Tỷ trọng</TableHead>
                  <TableHead className="text-right">Số tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryBreakdown.slice(0, 5).map((item) => (
                  <TableRow key={item.category}>
                    <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">
                      {item.category}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress
                          value={item.percentage}
                          className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800"
                          indicatorClassName="bg-zinc-700 dark:bg-zinc-300"
                        />
                        <span className="w-8 text-right font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
                          {item.percentage}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-zinc-700 dark:text-zinc-300">
                      {formatVND(item.totalAmount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Danh sách giao dịch: Tabs & Sort */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* shadcn Tabs for filter */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="h-8">
              <TabsTrigger value="ALL" className="h-6 px-2.5 text-xs">
                Tất cả ({transactions.length})
              </TabsTrigger>
              <TabsTrigger value="INCOME" className="h-6 px-2.5 text-xs">
                Thu nhập
              </TabsTrigger>
              <TabsTrigger value="EXPENSE" className="h-6 px-2.5 text-xs">
                Chi tiêu
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Sắp xếp */}
          <div className="w-[160px]">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as TransactionSortCriteria)}
              className="h-8 text-xs"
            >
              <option value="DATE_DESC">Mới nhất</option>
              <option value="DATE_ASC">Cũ nhất</option>
              <option value="AMOUNT_DESC">Số tiền giảm dần</option>
              <option value="AMOUNT_ASC">Số tiền tăng dần</option>
            </Select>
          </div>
        </div>

        {/* Transaction Table / List */}
        <Card className="p-0 overflow-hidden">
          {sortedTransactions.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-400">
              Không có giao dịch nào phù hợp.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nội dung</TableHead>
                  <TableHead className="w-[100px]">Phân loại</TableHead>
                  <TableHead className="text-right w-[140px]">Số tiền</TableHead>
                  <TableHead className="w-[40px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.map((tx) => (
                  <TableRow key={tx.id} className="group">
                    <TableCell>
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">
                        {tx.title}
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        {new Date(tx.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-normal">
                        {tx.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`font-mono text-xs font-semibold ${
                          tx.type === 'INCOME'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-zinc-900 dark:text-zinc-100'
                        }`}
                      >
                        {tx.getFormattedAmount(true)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right p-2">
                      <Button
                        variant="ghost"
                        size="iconSm"
                        onClick={() => deleteTransaction(tx.id)}
                        className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-opacity"
                        title="Xóa giao dịch"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </div>
    </div>
  );
};


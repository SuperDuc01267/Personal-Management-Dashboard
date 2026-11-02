'use client';

import React, { useState, useMemo } from 'react';
import { useDashboard } from '@/lib/context/DashboardContext';
import { TransactionType } from '@/lib/models/Transaction';
import { groupExpensesByCategory, formatVND } from '@/lib/utils/aggregation';
import { sortTransactions, TransactionSortCriteria } from '@/lib/utils/sorting';
import { useDebounce } from '@/lib/hooks/useDebounce';
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
import { Plus, Trash2, ChevronUp, Search } from 'lucide-react';

const INCOME_CATEGORIES = ['Lương', 'Thưởng', 'Freelance', 'Đầu tư', 'Khác'];
const EXPENSE_CATEGORIES = [
  'Ăn uống',
  'Nhà ở',
  'Học tập',
  'Di chuyển',
  'Giải trí',
  'Mua sắm',
  'Hóa đơn',
  'Khác',
];

export const ExpenseTracker: React.FC = () => {
  const { transactions, addTransaction, deleteTransaction } = useDashboard();

  // Form State
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [category, setCategory] = useState<string>('Ăn uống');
  const [formError, setFormError] = useState<string>('');

  // Search State with Debounce (hỗ trợ tìm kiếm cả số tiền và nội dung)
  const [searchInput, setSearchInput] = useState<string>('');
  const debouncedSearch = useDebounce<string>(searchInput, 300);

  // Filter & Sort State
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<TransactionSortCriteria>('DATE_DESC');

  // Danh mục tương ứng theo loại giao dịch
  const currentCategories = type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(newType === 'INCOME' ? 'Lương' : 'Ăn uống');
  };

  // Phân tích cơ cấu chi tiêu
  const categoryBreakdown = useMemo(
    () => groupExpensesByCategory(transactions),
    [transactions]
  );

  // Lọc danh sách giao dịch (theo Tab + Tìm kiếm tên, danh mục hoặc số tiền)
  const filteredTransactions = useMemo(() => {
    const cleanQuery = debouncedSearch.toLowerCase().trim();
    // Tách các chữ số thuần túy nếu người dùng gõ số tiền có dấu chấm/phẩy (VD: "500.000" -> "500000")
    const numericQuery = cleanQuery.replace(/[.,\s₫đ]/g, '');

    return transactions.filter((tx) => {
      // 1. Lọc theo Tab (Tất cả / Thu nhập / Chi tiêu)
      if (activeTab !== 'ALL' && tx.type !== activeTab) {
        return false;
      }

      // 2. Tìm kiếm theo Từ khóa (Tên, Danh mục hoặc Số tiền đã thêm)
      if (cleanQuery) {
        const matchTitle = tx.title.toLowerCase().includes(cleanQuery);
        const matchCategory = tx.category.toLowerCase().includes(cleanQuery);
        // Tìm kiếm theo số tiền thô (VD: người dùng gõ "500" hoặc "1250000")
        const matchRawAmount = numericQuery.length > 0 && tx.amount.toString().includes(numericQuery);
        // Tìm kiếm theo chuỗi tiền tệ định dạng VND (VD: người dùng gõ "500.000")
        const matchFormattedAmount = tx.getFormattedAmount(false).toLowerCase().includes(cleanQuery);

        if (!matchTitle && !matchCategory && !matchRawAmount && !matchFormattedAmount) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, activeTab, debouncedSearch]);

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
      {/* Top Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Quản lý Thu Chi & Giao Dịch
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Ghi chép giao dịch tài chính và theo dõi phân bổ ngân sách
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="h-8 gap-1 text-xs"
        >
          {isFormOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          <span>{isFormOpen ? 'Đóng form' : 'Thêm giao dịch'}</span>
        </Button>
      </div>

      {/* Form thêm giao dịch mới */}
      {isFormOpen && (
        <Card className="border-slate-300 dark:border-slate-700/80 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Thêm giao dịch mới
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              {formError && (
                <div className="rounded-md border border-red-300 bg-red-50 p-2 text-xs text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
                  {formError}
                </div>
              )}

              {/* Loại giao dịch */}
              <div>
                <label className="block mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Phân loại
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={type === 'EXPENSE' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleTypeChange('EXPENSE')}
                    className="h-8 text-xs border-slate-300 dark:border-slate-700"
                  >
                    Chi tiêu
                  </Button>
                  <Button
                    type="button"
                    variant={type === 'INCOME' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleTypeChange('INCOME')}
                    className="h-8 text-xs border-slate-300 dark:border-slate-700"
                  >
                    Thu nhập
                  </Button>
                </div>
              </div>

              {/* Tên giao dịch */}
              <div>
                <label className="block mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Tên giao dịch *
                </label>
                <Input
                  type="text"
                  placeholder="VD: Tiền phòng, Đi chợ, Lương tháng..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              {/* Số tiền & Danh mục */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <label className="block mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    Số tiền (VND) *
                  </label>
                  <Input
                    type="number"
                    min="1000"
                    step="1000"
                    placeholder="VD: 500000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="h-8 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    Danh mục {type === 'INCOME' ? 'thu' : 'chi'}
                  </label>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-8 text-xs"
                  >
                    {currentCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
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

      {/* Bảng Cơ cấu chi tiêu (Table chuẩn, Progress thanh mảnh xám nhạt bg-slate-800) */}
      <Card className="border-slate-300 dark:border-slate-700/80 shadow-sm overflow-hidden">
        <CardHeader className="p-4 border-b border-slate-300 dark:border-slate-800">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            Cơ cấu chi tiêu theo danh mục
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {categoryBreakdown.length === 0 ? (
            <div className="p-6 text-center text-xs text-zinc-400">
              Chưa có dữ liệu chi tiêu để phân tích.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-zinc-900/60">
                  <TableHead className="w-[140px] font-semibold text-zinc-700 dark:text-zinc-300">Danh mục</TableHead>
                  <TableHead className="font-semibold text-zinc-700 dark:text-zinc-300">Tỷ trọng chi phí</TableHead>
                  <TableHead className="text-right w-[140px] font-semibold text-zinc-700 dark:text-zinc-300">Số tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryBreakdown.map((item) => (
                  <TableRow key={item.category} className="border-b border-slate-200 dark:border-slate-800/80">
                    <TableCell className="font-medium text-zinc-900 dark:text-zinc-100">
                      {item.category}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 max-w-md">
                        <Progress
                          value={item.percentage}
                          className="h-1.5 w-full bg-slate-200 dark:bg-slate-800"
                          indicatorClassName="bg-slate-800 dark:bg-slate-200"
                        />
                        <span className="w-9 text-right font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
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

      {/* Bảng Lịch sử Giao dịch */}
      <div className="space-y-3">
        {/* Ô Tìm Kiếm Giao Dịch (Bao gồm cả Số tiền, Tên, Danh mục) */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm giao dịch theo số tiền (VD: 500000, 1.250.000), tên hoặc danh mục..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-8 pl-8 pr-8 text-xs border-slate-300 dark:border-slate-700"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Thanh Lọc Tabs & Sắp Xếp */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Tabs Filter */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList className="h-8 border-slate-300 dark:border-slate-700">
              <TabsTrigger value="ALL" className="h-6 px-3 text-xs">
                Tất cả ({filteredTransactions.length})
              </TabsTrigger>
              <TabsTrigger value="INCOME" className="h-6 px-3 text-xs">
                Thu nhập
              </TabsTrigger>
              <TabsTrigger value="EXPENSE" className="h-6 px-3 text-xs">
                Chi tiêu
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Sắp xếp */}
          <div className="w-[170px]">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as TransactionSortCriteria)}
              className="h-8 text-xs border-slate-300 dark:border-slate-700"
            >
              <option value="DATE_DESC">Mới nhất trước</option>
              <option value="DATE_ASC">Cũ nhất trước</option>
              <option value="AMOUNT_DESC">Số tiền giảm dần</option>
              <option value="AMOUNT_ASC">Số tiền tăng dần</option>
            </Select>
          </div>
        </div>

        {/* Table danh sách giao dịch: Không có floating elements, layout bảng chuẩn */}
        <Card className="border-slate-300 dark:border-slate-700/80 shadow-sm overflow-hidden">
          {sortedTransactions.length === 0 ? (
            <div className="p-8 text-center text-xs text-zinc-400">
              Không tìm thấy giao dịch nào phù hợp với từ khóa hoặc bộ lọc.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-zinc-900/60">
                  <TableHead className="font-semibold text-zinc-700 dark:text-zinc-300">Giao dịch</TableHead>
                  <TableHead className="w-[120px] font-semibold text-zinc-700 dark:text-zinc-300">Danh mục</TableHead>
                  <TableHead className="w-[100px] font-semibold text-zinc-700 dark:text-zinc-300">Phân loại</TableHead>
                  <TableHead className="text-right w-[150px] font-semibold text-zinc-700 dark:text-zinc-300">Số tiền</TableHead>
                  <TableHead className="w-[50px] text-center font-semibold text-zinc-700 dark:text-zinc-300">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.map((tx) => (
                  <TableRow
                    key={tx.id}
                    className="border-b border-slate-200 dark:border-slate-800/80 group"
                  >
                    <TableCell>
                      <div className="font-medium text-zinc-900 dark:text-zinc-100">
                        {tx.title}
                      </div>
                      <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {new Date(tx.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[11px] font-normal border-slate-300 dark:border-slate-700">
                        {tx.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {tx.type === 'INCOME' ? (
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                          Thu nhập
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                          Chi tiêu
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`font-mono text-xs font-bold ${
                          tx.type === 'INCOME'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-zinc-900 dark:text-zinc-100'
                        }`}
                      >
                        {tx.getFormattedAmount(true)}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => deleteTransaction(tx.id)}
                        className="text-zinc-400 hover:text-red-600 dark:hover:text-red-400"
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

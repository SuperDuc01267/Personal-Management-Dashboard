'use client';

import React, { useState, useMemo } from 'react';
import { useDashboard } from '@/lib/context/DashboardContext';
import { Task, TaskPriority, TaskStatus } from '@/lib/models/Task';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { sortTasks, TaskSortCriteria } from '@/lib/utils/sorting';
import { calculateTaskSummary } from '@/lib/utils/aggregation';
import {
  CheckSquare,
  Search,
  Plus,
  Trash2,
  AlertTriangle,
  Clock,
  Calendar,
  CheckCircle2,
  Circle,
  ArrowUpDown,
  Filter,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from 'lucide-react';

export const TaskSection: React.FC = () => {
  const { tasks, addTask, updateTaskStatus, toggleTaskComplete, deleteTask } = useDashboard();

  // 1. Search with Debounce
  const [searchInput, setSearchInput] = useState<string>('');
  const debouncedSearch = useDebounce<string>(searchInput, 300);

  // 2. Filters & Sorting
  const [statusFilter, setStatusFilter] = useState<'ALL' | TaskStatus>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | TaskPriority>('ALL');
  const [sortBy, setSortBy] = useState<TaskSortCriteria>('PRIORITY_DESC');

  // 3. Form thêm Task mới
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [formError, setFormError] = useState<string>('');

  // 4. Thống kê Task metrics qua reduce - O(N)
  const metrics = useMemo(() => calculateTaskSummary(tasks), [tasks]);

  // 5. Lọc danh sách công việc (Search Debounced + Status + Priority)
  const filteredTasks = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim();

    return tasks.filter((task) => {
      // Tìm kiếm theo Title và Description
      if (query) {
        const matchTitle = task.title.toLowerCase().includes(query);
        const matchDesc = task.description.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc) return false;
      }

      // Bộ lọc Status
      if (statusFilter !== 'ALL' && task.status !== statusFilter) {
        return false;
      }

      // Bộ lọc Priority
      if (priorityFilter !== 'ALL' && task.priority !== priorityFilter) {
        return false;
      }

      return true;
    });
  }, [tasks, debouncedSearch, statusFilter, priorityFilter]);

  // 6. Sắp xếp danh sách sử dụng Merge Sort O(N log N)
  const sortedTasks = useMemo(() => {
    return sortTasks(filteredTasks, sortBy);
  }, [filteredTasks, sortBy]);

  // Xử lý tạo Task mới
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Tiêu đề công việc không được để trống (Encapsulation Validation).');
      return;
    }

    try {
      addTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate,
      });

      // Reset
      setTitle('');
      setDescription('');
      setIsFormOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('Có lỗi xảy ra khi tạo công việc.');
      }
    }
  };

  // Helper render màu badge theo độ ưu tiên
  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'HIGH':
        return (
          <span className="inline-flex items-center rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            Cao (High)
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            Vừa (Medium)
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            Thấp (Low)
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Tiêu đề & Nút Thêm */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-indigo-500" />
            Quản lý Công việc (Tasks)
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            OOP Model <code className="font-mono text-indigo-600 dark:text-indigo-400">Task</code> • Merge Sort O(N log N) & Debounced Search
          </p>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          {isFormOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          <span>{isFormOpen ? 'Đóng Form' : 'Thêm Task Mới'}</span>
        </button>
      </div>

      {/* Task Summary Badges */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Tổng công việc</span>
          <div className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">{metrics.total}</div>
        </div>

        <div className="rounded-xl border border-amber-200/50 bg-amber-500/5 p-3 dark:border-amber-900/40">
          <span className="text-[11px] text-amber-700 dark:text-amber-400">Đang thực hiện</span>
          <div className="mt-1 text-lg font-bold text-amber-700 dark:text-amber-300">
            {metrics.inProgress + metrics.todo}
          </div>
        </div>

        <div className="rounded-xl border border-emerald-200/50 bg-emerald-500/5 p-3 dark:border-emerald-900/40">
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400">Đã hoàn thành</span>
          <div className="mt-1 text-lg font-bold text-emerald-700 dark:text-emerald-300">
            {metrics.done}{' '}
            <span className="text-xs font-normal text-zinc-400">({metrics.completionRate}%)</span>
          </div>
        </div>

        <div className="rounded-xl border border-rose-200/50 bg-rose-500/5 p-3 dark:border-rose-900/40">
          <span className="text-[11px] text-rose-700 dark:text-rose-400 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Quá hạn
          </span>
          <div className="mt-1 text-lg font-bold text-rose-700 dark:text-rose-300">
            {metrics.overdue}
          </div>
        </div>
      </div>

      {/* Search Input with Debounce */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Tìm kiếm công việc (Debounce 300ms)..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full rounded-xl border border-zinc-200 bg-white py-2 pl-9 pr-24 text-xs text-zinc-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 shadow-sm"
        />
        {searchInput && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {searchInput !== debouncedSearch ? (
              <span className="text-[10px] text-indigo-500 animate-pulse">Đang tìm...</span>
            ) : (
              <span className="text-[10px] text-zinc-400">{filteredTasks.length} kết quả</span>
            )}
            <button
              onClick={() => setSearchInput('')}
              className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Form thêm Task mới */}
      {isFormOpen && (
        <form
          onSubmit={handleCreateTask}
          className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/90 animate-fadeIn"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Thêm Công Việc Mới (OOP Task Entity)
            </h3>
            <span className="text-[11px] text-zinc-400">Kiểm tra title rỗng qua Setter</span>
          </div>

          {formError && (
            <div className="mb-3 rounded-lg bg-rose-500/10 border border-rose-500/20 p-2.5 text-xs text-rose-600 dark:text-rose-400">
              {formError}
            </div>
          )}

          <div className="space-y-3 text-xs">
            <div>
              <label className="block mb-1 font-medium text-zinc-600 dark:text-zinc-400">
                Tiêu đề công việc *
              </label>
              <input
                type="text"
                placeholder="VD: Ôn tập thuật toán Divide & Conquer..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-zinc-600 dark:text-zinc-400">
                Mô tả chi tiết
              </label>
              <textarea
                rows={2}
                placeholder="Ghi chú chi tiết mục tiêu cần đạt được..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <label className="block mb-1 font-medium text-zinc-600 dark:text-zinc-400">
                  Mức độ ưu tiên
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 cursor-pointer"
                >
                  <option value="HIGH">Cao (HIGH)</option>
                  <option value="MEDIUM">Vừa (MEDIUM)</option>
                  <option value="LOW">Thấp (LOW)</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium text-zinc-600 dark:text-zinc-400">
                  Hạn chót (Due Date)
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 cursor-pointer"
                />
              </div>
            </div>

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
                Tạo Task
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Bộ Lọc & Sắp xếp */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-800">
        {/* Lọc Trạng thái */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {(['ALL', 'TODO', 'IN_PROGRESS', 'DONE'] as const).map((st) => {
            const labels = {
              ALL: 'Tất cả',
              TODO: 'Cần làm',
              IN_PROGRESS: 'Đang làm',
              DONE: 'Đã xong',
            };
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-md px-2.5 py-1 font-medium transition-colors cursor-pointer ${
                  statusFilter === st
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
              >
                {labels[st]}
              </button>
            );
          })}
        </div>

        {/* Lọc Priority & Sắp xếp */}
        <div className="flex items-center gap-2 text-xs">
          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as 'ALL' | TaskPriority)}
            className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer"
          >
            <option value="ALL">Mọi độ ưu tiên</option>
            <option value="HIGH">Ưu tiên Cao</option>
            <option value="MEDIUM">Ưu tiên Vừa</option>
            <option value="LOW">Ưu tiên Thấp</option>
          </select>

          {/* Sắp xếp */}
          <div className="flex items-center gap-1 text-zinc-500">
            <ArrowUpDown className="h-3 w-3" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as TaskSortCriteria)}
              className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer"
            >
              <option value="PRIORITY_DESC">Ưu tiên (Cao → Thấp)</option>
              <option value="DUE_DATE_ASC">Hạn chót (Gần nhất)</option>
              <option value="CREATED_DESC">Mới tạo gần đây</option>
              <option value="STATUS">Theo Trạng thái</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danh sách Task */}
      <div className="space-y-2">
        {sortedTasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-200 p-8 text-center text-xs text-zinc-400 dark:border-zinc-800">
            Không tìm thấy công việc nào phù hợp.
          </div>
        ) : (
          sortedTasks.map((task) => {
            const overdue = task.isOverdue();
            const isDone = task.status === 'DONE';

            return (
              <div
                key={task.id}
                className={`group flex items-start justify-between gap-3 rounded-xl border p-3.5 shadow-sm transition-all ${
                  isDone
                    ? 'border-zinc-200 bg-zinc-50/60 opacity-70 dark:border-zinc-800 dark:bg-zinc-900/40'
                    : overdue
                    ? 'border-rose-200 bg-rose-50/30 dark:border-rose-900/40 dark:bg-rose-950/20'
                    : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow dark:border-zinc-800/80 dark:bg-zinc-900 dark:hover:border-zinc-700'
                }`}
              >
                {/* Bên trái: Checkbox + Chi tiết Task */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  {/* Nút check toggle hoàn thành - Gọi phương thức OOP markAsCompleted() */}
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    title={isDone ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
                    className="mt-0.5 text-zinc-400 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <Circle className="h-5 w-5 hover:text-indigo-500" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4
                        className={`text-sm font-semibold ${
                          isDone
                            ? 'line-through text-zinc-400 dark:text-zinc-500'
                            : 'text-zinc-900 dark:text-zinc-100'
                        }`}
                      >
                        {task.title}
                      </h4>
                      {getPriorityBadge(task.priority)}

                      {/* Overdue alert badge */}
                      {overdue && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                          <AlertTriangle className="h-3 w-3" />
                          Quá hạn (isOverdue)
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    {/* Metadata: Hạn chót & Trạng thái selector */}
                    <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Hạn: {new Date(task.dueDate).toLocaleDateString('vi-VN')}
                      </span>

                      {/* Trạng thái Dropdown */}
                      <select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                        className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-zinc-700 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 cursor-pointer"
                      >
                        <option value="TODO">Cần làm (TODO)</option>
                        <option value="IN_PROGRESS">Đang làm (IN_PROGRESS)</option>
                        <option value="DONE">Đã xong (DONE)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Bên phải: Nút Xóa */}
                <button
                  onClick={() => deleteTask(task.id)}
                  title="Xóa công việc"
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-all cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

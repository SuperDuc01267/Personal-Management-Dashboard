'use client';

import React, { useState, useMemo } from 'react';
import { useDashboard } from '@/lib/context/DashboardContext';
import { TaskPriority, TaskStatus } from '@/lib/models/Task';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { sortTasks, TaskSortCriteria } from '@/lib/utils/sorting';
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
import {
  Search,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Circle,
  ChevronUp,
} from 'lucide-react';

export const TaskTracker: React.FC = () => {
  const { tasks, addTask, updateTaskStatus, toggleTaskComplete, deleteTask } = useDashboard();

  // Search input with debounce
  const [searchInput, setSearchInput] = useState<string>('');
  const debouncedSearch = useDebounce<string>(searchInput, 300);

  // Filters & Sắp xếp
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | TaskPriority>('ALL');
  const [sortBy, setSortBy] = useState<TaskSortCriteria>('PRIORITY_DESC');

  // Form thêm Task mới
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

  // Lọc task
  const filteredTasks = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim();

    return tasks.filter((task) => {
      if (query) {
        const matchTitle = task.title.toLowerCase().includes(query);
        const matchDesc = task.description.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc) return false;
      }

      if (statusFilter !== 'ALL' && task.status !== statusFilter) {
        return false;
      }

      if (priorityFilter !== 'ALL' && task.priority !== priorityFilter) {
        return false;
      }

      return true;
    });
  }, [tasks, debouncedSearch, statusFilter, priorityFilter]);

  // Sắp xếp
  const sortedTasks = useMemo(() => {
    return sortTasks(filteredTasks, sortBy);
  }, [filteredTasks, sortBy]);

  // Tạo task mới
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!title.trim()) {
      setFormError('Vui lòng nhập tiêu đề công việc.');
      return;
    }

    try {
      addTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate,
      });

      setTitle('');
      setDescription('');
      setIsFormOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('Không thể tạo công việc.');
      }
    }
  };

  const renderPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'HIGH':
        return (
          <Badge variant="destructive" className="text-[10px] px-1.5 py-0 font-normal">
            Ưu tiên Cao
          </Badge>
        );
      case 'MEDIUM':
        return (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal border-slate-300 dark:border-slate-700">
            Ưu tiên Vừa
          </Badge>
        );
      case 'LOW':
        return (
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal border-slate-300 dark:border-slate-700">
            Ưu tiên Thấp
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Quản lý Công Việc & Tiến Độ
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Danh sách nhiệm vụ, thời hạn và trạng thái thực hiện
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="h-8 gap-1 text-xs"
        >
          {isFormOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          <span>{isFormOpen ? 'Đóng form' : 'Thêm công việc'}</span>
        </Button>
      </div>

      {/* Form thêm công việc */}
      {isFormOpen && (
        <Card className="border-slate-300 dark:border-slate-700/80 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Thêm công việc mới
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTask} className="space-y-3">
              {formError && (
                <div className="rounded-md border border-red-300 bg-red-50 p-2 text-xs text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
                  {formError}
                </div>
              )}

              <div>
                <label className="block mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Tiêu đề công việc *
                </label>
                <Input
                  type="text"
                  placeholder="VD: Soạn tài liệu thiết kế hệ thống..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <label className="block mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Mô tả chi tiết
                </label>
                <Input
                  type="text"
                  placeholder="Ghi chú thêm nội dung cần thực hiện..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <label className="block mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    Mức độ ưu tiên
                  </label>
                  <Select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="h-8 text-xs border-slate-300 dark:border-slate-700"
                  >
                    <option value="HIGH">Ưu tiên Cao</option>
                    <option value="MEDIUM">Ưu tiên Vừa</option>
                    <option value="LOW">Ưu tiên Thấp</option>
                  </Select>
                </div>
                <div>
                  <label className="block mb-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    Thời hạn (Due Date)
                  </label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="h-8 text-xs"
                  >
                  </Input>
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
                  Tạo công việc
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Thanh tìm kiếm & Bộ lọc */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
          <Input
            type="text"
            placeholder="Tìm kiếm công việc theo tiêu đề hoặc mô tả..."
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

        {/* Tabs & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Status Tabs */}
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-auto">
            <TabsList className="h-8 border-slate-300 dark:border-slate-700">
              <TabsTrigger value="ALL" className="h-6 px-3 text-xs">
                Tất cả ({tasks.length})
              </TabsTrigger>
              <TabsTrigger value="TODO" className="h-6 px-3 text-xs">
                Cần làm
              </TabsTrigger>
              <TabsTrigger value="IN_PROGRESS" className="h-6 px-3 text-xs">
                Đang làm
              </TabsTrigger>
              <TabsTrigger value="DONE" className="h-6 px-3 text-xs">
                Đã xong
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2">
            {/* Priority filter */}
            <div className="w-[125px]">
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as 'ALL' | TaskPriority)}
                className="h-8 text-xs border-slate-300 dark:border-slate-700"
              >
                <option value="ALL">Mọi ưu tiên</option>
                <option value="HIGH">Ưu tiên Cao</option>
                <option value="MEDIUM">Ưu tiên Vừa</option>
                <option value="LOW">Ưu tiên Thấp</option>
              </Select>
            </div>

            {/* Sắp xếp */}
            <div className="w-[145px]">
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as TaskSortCriteria)}
                className="h-8 text-xs border-slate-300 dark:border-slate-700"
              >
                <option value="PRIORITY_DESC">Ưu tiên cao nhất</option>
                <option value="DUE_DATE_ASC">Hạn chót gần nhất</option>
                <option value="CREATED_DESC">Mới tạo gần đây</option>
                <option value="STATUS">Theo trạng thái</option>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Bảng Danh sách Task */}
      <Card className="border-slate-300 dark:border-slate-700/80 shadow-sm overflow-hidden">
        {sortedTasks.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-400">
            Không tìm thấy công việc nào phù hợp.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-b border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-zinc-900/60">
                <TableHead className="w-[40px] text-center"></TableHead>
                <TableHead className="font-semibold text-zinc-700 dark:text-zinc-300">Công việc</TableHead>
                <TableHead className="w-[110px] font-semibold text-zinc-700 dark:text-zinc-300">Mức ưu tiên</TableHead>
                <TableHead className="w-[120px] font-semibold text-zinc-700 dark:text-zinc-300">Thời hạn</TableHead>
                <TableHead className="w-[120px] font-semibold text-zinc-700 dark:text-zinc-300">Trạng thái</TableHead>
                <TableHead className="w-[50px] text-center font-semibold text-zinc-700 dark:text-zinc-300">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTasks.map((task) => {
                const overdue = task.isOverdue();
                const isDone = task.status === 'DONE';

                return (
                  <TableRow
                    key={task.id}
                    className={`border-b border-slate-200 dark:border-slate-800/80 ${
                      isDone ? 'opacity-60 bg-slate-50/40 dark:bg-zinc-900/30' : ''
                    }`}
                  >
                    {/* Check toggle */}
                    <TableCell className="text-center">
                      <button
                        onClick={() => toggleTaskComplete(task.id)}
                        className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                        title={isDone ? 'Đánh dấu chưa xong' : 'Đánh dấu đã xong'}
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Circle className="h-4 w-4" />
                        )}
                      </button>
                    </TableCell>

                    {/* Tiêu đề & mô tả */}
                    <TableCell>
                      <div
                        className={`text-xs font-semibold ${
                          isDone
                            ? 'line-through text-zinc-400 dark:text-zinc-500'
                            : 'text-zinc-900 dark:text-zinc-100'
                        }`}
                      >
                        {task.title}
                      </div>
                      {task.description && (
                        <p className="mt-0.5 text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                          {task.description}
                        </p>
                      )}
                    </TableCell>

                    {/* Mức ưu tiên */}
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {renderPriorityBadge(task.priority)}
                        {overdue && (
                          <Badge variant="destructive" className="text-[10px] px-1 py-0 font-normal">
                            Quá hạn
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* Due date */}
                    <TableCell className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 shrink-0 text-zinc-400" />
                        {new Date(task.dueDate).toLocaleDateString('vi-VN')}
                      </span>
                    </TableCell>

                    {/* Status dropdown */}
                    <TableCell>
                      <Select
                        value={task.status}
                        onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                        className="h-7 w-[105px] text-[11px] border-slate-300 dark:border-slate-700"
                      >
                        <option value="TODO">Cần làm</option>
                        <option value="IN_PROGRESS">Đang làm</option>
                        <option value="DONE">Đã xong</option>
                      </Select>
                    </TableCell>

                    {/* Action delete */}
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => deleteTask(task.id)}
                        className="text-zinc-400 hover:text-red-600 dark:hover:text-red-400"
                        title="Xóa công việc"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
};

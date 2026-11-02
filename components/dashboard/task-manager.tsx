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
  Search,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Circle,
  ChevronUp,
} from 'lucide-react';

export const TaskManager: React.FC = () => {
  const { tasks, addTask, updateTaskStatus, toggleTaskComplete, deleteTask } = useDashboard();

  // Search input
  const [searchInput, setSearchInput] = useState<string>('');
  const debouncedSearch = useDebounce<string>(searchInput, 300);

  // Filters & Sắp xếp
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | TaskPriority>('ALL');
  const [sortBy, setSortBy] = useState<TaskSortCriteria>('PRIORITY_DESC');

  // Form state
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

  // Tạo task
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

  // Badge priority
  const renderPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'HIGH':
        return (
          <Badge variant="destructive" className="text-[10px] px-1.5 py-0 font-normal">
            Cao
          </Badge>
        );
      case 'MEDIUM':
        return (
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
            Vừa
          </Badge>
        );
      case 'LOW':
        return (
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal">
            Thấp
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Danh sách công việc
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Theo dõi nhiệm vụ, thời hạn và độ ưu tiên
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="h-8 gap-1 text-xs"
        >
          {isFormOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          <span>{isFormOpen ? 'Đóng' : 'Thêm công việc'}</span>
        </Button>
      </div>

      {/* Form thêm Task mới (Card) */}
      {isFormOpen && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Thêm công việc mới</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateTask} className="space-y-3">
              {formError && (
                <div className="rounded-md border border-red-200 bg-red-50 p-2 text-xs text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
                  {formError}
                </div>
              )}

              <div>
                <Input
                  type="text"
                  placeholder="Tiêu đề công việc *"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div>
                <Input
                  type="text"
                  placeholder="Ghi chú mô tả chi tiết..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <Select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="h-8 text-xs"
                  >
                    <option value="HIGH">Ưu tiên Cao</option>
                    <option value="MEDIUM">Ưu tiên Vừa</option>
                    <option value="LOW">Ưu tiên Thấp</option>
                  </Select>
                </div>
                <div>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="h-8 text-xs"
                  />
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
                  Tạo công việc
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
        <Input
          type="text"
          placeholder="Tìm kiếm công việc..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="h-8 pl-8 pr-8 text-xs"
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

      {/* Tabs Filter & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-auto">
          <TabsList className="h-8">
            <TabsTrigger value="ALL" className="h-6 px-2.5 text-xs">
              Tất cả ({tasks.length})
            </TabsTrigger>
            <TabsTrigger value="TODO" className="h-6 px-2.5 text-xs">
              Cần làm
            </TabsTrigger>
            <TabsTrigger value="IN_PROGRESS" className="h-6 px-2.5 text-xs">
              Đang làm
            </TabsTrigger>
            <TabsTrigger value="DONE" className="h-6 px-2.5 text-xs">
              Đã xong
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          {/* Priority filter */}
          <div className="w-[120px]">
            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as 'ALL' | TaskPriority)}
              className="h-8 text-xs"
            >
              <option value="ALL">Mọi ưu tiên</option>
              <option value="HIGH">Ưu tiên Cao</option>
              <option value="MEDIUM">Ưu tiên Vừa</option>
              <option value="LOW">Ưu tiên Thấp</option>
            </Select>
          </div>

          {/* Sắp xếp */}
          <div className="w-[130px]">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as TaskSortCriteria)}
              className="h-8 text-xs"
            >
              <option value="PRIORITY_DESC">Ưu tiên cao nhất</option>
              <option value="DUE_DATE_ASC">Hạn chót gần nhất</option>
              <option value="CREATED_DESC">Mới tạo gần đây</option>
              <option value="STATUS">Theo trạng thái</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {sortedTasks.length === 0 ? (
          <Card className="p-8 text-center text-xs text-zinc-400">
            Không tìm thấy công việc nào phù hợp.
          </Card>
        ) : (
          sortedTasks.map((task) => {
            const overdue = task.isOverdue();
            const isDone = task.status === 'DONE';

            return (
              <Card
                key={task.id}
                className={`p-3.5 transition-colors group ${
                  isDone
                    ? 'opacity-60 bg-zinc-50/50 dark:bg-zinc-900/40'
                    : 'hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Checkbox + Content */}
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className="mt-0.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
                    >
                      {isDone ? (
                        <CheckCircle2 className="h-4 w-4 text-zinc-900 dark:text-zinc-100" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`text-xs font-medium leading-tight ${
                            isDone
                              ? 'line-through text-zinc-400 dark:text-zinc-500'
                              : 'text-zinc-900 dark:text-zinc-100'
                          }`}
                        >
                          {task.title}
                        </span>

                        {renderPriorityBadge(task.priority)}

                        {overdue && (
                          <Badge variant="destructive" className="text-[10px] px-1.5 py-0 font-normal">
                            Quá hạn
                          </Badge>
                        )}
                      </div>

                      {task.description && (
                        <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString('vi-VN')}
                        </span>

                        <Select
                          value={task.status}
                          onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                          className="h-6 w-[100px] text-[10px] px-2 py-0 border-zinc-200 dark:border-zinc-800"
                        >
                          <option value="TODO">Cần làm</option>
                          <option value="IN_PROGRESS">Đang làm</option>
                          <option value="DONE">Đã xong</option>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Right: Delete */}
                  <Button
                    variant="ghost"
                    size="iconSm"
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-opacity"
                    title="Xóa công việc"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};


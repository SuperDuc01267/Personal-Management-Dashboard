'use client';

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Task, TaskPriority, TaskStatus, TaskJSON } from '../models/Task';
import { Transaction, TransactionType, TransactionJSON } from '../models/Transaction';
import { INITIAL_TASKS, INITIAL_TRANSACTIONS } from '../data/mockData';
import {
  NormalizedState,
  normalize,
  denormalize,
  addItemToNormalized,
  updateItemInNormalized,
  removeItemFromNormalized,
} from '../utils/normalization';

interface DashboardContextType {
  // Tasks
  tasks: Task[];
  tasksNormalized: NormalizedState<Task>;
  addTask: (data: { title: string; description?: string; priority: TaskPriority; dueDate: string }) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  toggleTaskComplete: (id: string) => void;
  deleteTask: (id: string) => void;

  // Transactions
  transactions: Transaction[];
  transactionsNormalized: NormalizedState<Transaction>;
  addTransaction: (data: { title: string; amount: number; type: TransactionType; category: string }) => void;
  deleteTransaction: (id: string) => void;

  // Utilities
  resetToMockData: () => void;
  isHydrated: boolean;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const STORAGE_KEYS = {
  TASKS: 'pm_dashboard_tasks_v1',
  TRANSACTIONS: 'pm_dashboard_tx_v1',
  DARK_MODE: 'pm_dashboard_dark_mode',
};

const DashboardContext = createContext<DashboardContextType | null>(null);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State lưu trữ dạng Normalized: { byId: Record<string, T>, allIds: string[] }
  const [tasksNormalized, setTasksNormalized] = useState<NormalizedState<Task>>({ byId: {}, allIds: [] });
  const [transactionsNormalized, setTransactionsNormalized] = useState<NormalizedState<Transaction>>({ byId: {}, allIds: [] });
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // 1. Khởi tạo dữ liệu từ LocalStorage (Hydration)
  useEffect(() => {
    try {
      // Dark Mode setup
      const savedDark = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialDark = savedDark !== null ? savedDark === 'true' : prefersDark;
      setIsDarkMode(initialDark);
      if (initialDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Tasks setup
      const savedTasksStr = localStorage.getItem(STORAGE_KEYS.TASKS);
      let initialTaskInstances: Task[];
      if (savedTasksStr) {
        const parsed: TaskJSON[] = JSON.parse(savedTasksStr);
        initialTaskInstances = parsed.map((json) => Task.fromJSON(json));
      } else {
        initialTaskInstances = INITIAL_TASKS.map((json) => Task.fromJSON(json));
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
      }
      setTasksNormalized(normalize(initialTaskInstances));

      // Transactions setup
      const savedTxStr = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      let initialTxInstances: Transaction[];
      if (savedTxStr) {
        const parsed: TransactionJSON[] = JSON.parse(savedTxStr);
        initialTxInstances = parsed.map((json) => Transaction.fromJSON(json));
      } else {
        initialTxInstances = INITIAL_TRANSACTIONS.map((json) => Transaction.fromJSON(json));
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
      }
      setTransactionsNormalized(normalize(initialTxInstances));
    } catch (err) {
      console.error('Lỗi khi nạp dữ liệu LocalStorage:', err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // 2. Lưu Tasks vào LocalStorage mỗi khi state thay đổi
  const syncTasksToStorage = useCallback((normalized: NormalizedState<Task>) => {
    const jsonList = denormalize(normalized).map((task) => task.toJSON());
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(jsonList));
  }, []);

  // 3. Lưu Transactions vào LocalStorage mỗi khi state thay đổi
  const syncTransactionsToStorage = useCallback((normalized: NormalizedState<Transaction>) => {
    const jsonList = denormalize(normalized).map((tx) => tx.toJSON());
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(jsonList));
  }, []);

  // Action: Toggle Dark Mode
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem(STORAGE_KEYS.DARK_MODE, String(next));
      return next;
    });
  }, []);

  // Action: Thêm Task mới - Thao tác O(1) trên Normalized State
  const addTask = useCallback(
    ({ title, description = '', priority, dueDate }: { title: string; description?: string; priority: TaskPriority; dueDate: string }) => {
      const newTask = new Task(title, description, priority, 'TODO', new Date(dueDate));
      setTasksNormalized((prev) => {
        const next = addItemToNormalized(prev, newTask);
        syncTasksToStorage(next);
        return next;
      });
    },
    [syncTasksToStorage]
  );

  // Action: Cập nhật trạng thái Task - Thao tác O(1)
  const updateTaskStatus = useCallback(
    (id: string, status: TaskStatus) => {
      setTasksNormalized((prev) => {
        const task = prev.byId[id];
        if (!task) return prev;

        // Clone và cập nhật thông qua phương thức OOP
        const updatedTask = Task.fromJSON(task.toJSON());
        updatedTask.status = status;
        updatedTask.touch();

        const next = updateItemInNormalized(prev, updatedTask);
        syncTasksToStorage(next);
        return next;
      });
    },
    [syncTasksToStorage]
  );

  // Action: Hoàn thành nhanh Task bằng phương thức OOP markAsCompleted()
  const toggleTaskComplete = useCallback(
    (id: string) => {
      setTasksNormalized((prev) => {
        const task = prev.byId[id];
        if (!task) return prev;

        const updatedTask = Task.fromJSON(task.toJSON());
        if (updatedTask.status === 'DONE') {
          updatedTask.status = 'TODO';
          updatedTask.touch();
        } else {
          updatedTask.markAsCompleted();
        }

        const next = updateItemInNormalized(prev, updatedTask);
        syncTasksToStorage(next);
        return next;
      });
    },
    [syncTasksToStorage]
  );

  // Action: Xóa Task - O(1) hash map, O(N) array filter
  const deleteTask = useCallback(
    (id: string) => {
      setTasksNormalized((prev) => {
        const next = removeItemFromNormalized(prev, id);
        syncTasksToStorage(next);
        return next;
      });
    },
    [syncTasksToStorage]
  );

  // Action: Thêm Giao dịch mới - Thao tác O(1)
  const addTransaction = useCallback(
    ({ title, amount, type, category }: { title: string; amount: number; type: TransactionType; category: string }) => {
      const newTx = new Transaction(title, amount, type, category);
      setTransactionsNormalized((prev) => {
        const next = addItemToNormalized(prev, newTx);
        syncTransactionsToStorage(next);
        return next;
      });
    },
    [syncTransactionsToStorage]
  );

  // Action: Xóa Giao dịch
  const deleteTransaction = useCallback(
    (id: string) => {
      setTransactionsNormalized((prev) => {
        const next = removeItemFromNormalized(prev, id);
        syncTransactionsToStorage(next);
        return next;
      });
    },
    [syncTransactionsToStorage]
  );

  // Action: Khôi phục dữ liệu mẫu ban đầu (phục vụ phỏng vấn demo nhiều lần)
  const resetToMockData = useCallback(() => {
    const taskInstances = INITIAL_TASKS.map((t) => Task.fromJSON(t));
    const txInstances = INITIAL_TRANSACTIONS.map((tx) => Transaction.fromJSON(tx));

    const normTasks = normalize(taskInstances);
    const normTx = normalize(txInstances);

    setTasksNormalized(normTasks);
    setTransactionsNormalized(normTx);

    syncTasksToStorage(normTasks);
    syncTransactionsToStorage(normTx);
  }, [syncTasksToStorage, syncTransactionsToStorage]);

  // Denormalized arrays tính toán có memoization để render giao diện
  const tasks = useMemo(() => denormalize(tasksNormalized), [tasksNormalized]);
  const transactions = useMemo(() => denormalize(transactionsNormalized), [transactionsNormalized]);

  const value = useMemo(
    () => ({
      tasks,
      tasksNormalized,
      addTask,
      updateTaskStatus,
      toggleTaskComplete,
      deleteTask,
      transactions,
      transactionsNormalized,
      addTransaction,
      deleteTransaction,
      resetToMockData,
      isHydrated,
      isDarkMode,
      toggleDarkMode,
    }),
    [
      tasks,
      tasksNormalized,
      addTask,
      updateTaskStatus,
      toggleTaskComplete,
      deleteTask,
      transactions,
      transactionsNormalized,
      addTransaction,
      deleteTransaction,
      resetToMockData,
      isHydrated,
      isDarkMode,
      toggleDarkMode,
    ]
  );

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

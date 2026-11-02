'use client';

import React from 'react';
import { X, CheckCircle, Code2, Cpu, Database, Layers, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const InterviewGuideModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                Tài liệu Thuyết trình Phỏng vấn (Interview Cheat Sheet)
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Các luận điểm chính giúp bạn tự tin ghi điểm tuyệt đối với Nhà tuyển dụng
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-6 space-y-6 text-sm">
          {/* Card 1: OOP Architecture */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
            <div className="flex items-center gap-2 font-semibold text-indigo-600 dark:text-indigo-400">
              <Code2 className="h-4 w-4" />
              <span>1. Áp dụng Lập trình Hướng Đối Tượng (OOP) & Clean Code</span>
            </div>
            <ul className="mt-3 space-y-2 text-zinc-700 dark:text-zinc-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                <span>
                  <strong>Tính Kế thừa (Inheritance) & Trừu tượng (Abstraction):</strong> Class cơ sở{' '}
                  <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-xs dark:bg-zinc-700">BaseEntity</code> đóng gói các thuộc tính chung (`id`, `createdAt`, `updatedAt`, `touch()`, `generateUUID()`) và ép các lớp con triển khai phương thức trừu tượng <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-xs dark:bg-zinc-700">toJSON()</code>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                <span>
                  <strong>Tính Đóng gói (Encapsulation):</strong> Sử dụng <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-xs dark:bg-zinc-700">private _title</code> và <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-xs dark:bg-zinc-700">private _amount</code> kết hợp Getter/Setter để bảo đảm tính hợp lệ (title không rỗng, amount &gt; 0) ngay tại tầng Model.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                <span>
                  <strong>Phương thức nghiệp vụ:</strong> Hàm <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-xs dark:bg-zinc-700">task.isOverdue()</code> tự động so sánh `dueDate` với ngày hiện tại; hàm <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-xs dark:bg-zinc-700">tx.getFormattedAmount()</code> tự động định dạng tiền tệ Việt Nam Đồng (VND).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                <span>
                  <strong>Design Pattern:</strong> Sử dụng Static Factory Method <code className="rounded bg-zinc-200 px-1 py-0.5 font-mono text-xs dark:bg-zinc-700">fromJSON()</code> giúp khởi tạo instance đồng nhất từ LocalStorage/API.
                </span>
              </li>
            </ul>
          </div>

          {/* Card 2: Normalized State */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
            <div className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400">
              <Database className="h-4 w-4" />
              <span>2. Cấu trúc Dữ liệu Chuẩn hóa (Normalized State Pattern)</span>
            </div>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400">
              Thay vì lưu trữ mảng phẳng <code className="font-mono text-xs">T[]</code> khiến việc tìm kiếm, cập nhật hoặc xóa phần tử theo ID tốn <strong className="text-zinc-900 dark:text-zinc-100 font-mono">O(N)</strong>, hệ thống tổ chức state theo chuẩn Redux Normalized State:
            </p>
            <div className="mt-2 rounded-lg bg-zinc-900 p-3 font-mono text-xs text-emerald-400">
              {`{
  byId: Record<string, T>,  // Hash Map: Truy xuất, Cập nhật, Xóa theo ID chỉ mất O(1)
  allIds: string[]          // Mảng lưu danh sách ID theo thứ tự hiển thị
}`}
            </div>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              👉 Khi người dùng cập nhật trạng thái Task hoặc sửa giao dịch, React chỉ cần truy xuất trực tiếp <code className="font-mono">state.byId[id]</code> mà không cần duyệt toàn bộ danh sách.
            </p>
          </div>

          {/* Card 3: Sorting Algorithm O(N log N) */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
            <div className="flex items-center gap-2 font-semibold text-violet-600 dark:text-violet-400">
              <Cpu className="h-4 w-4" />
              <span>3. Thuật toán Sắp xếp Merge Sort O(N log N)</span>
            </div>
            <ul className="mt-2 space-y-1.5 text-zinc-700 dark:text-zinc-300">
              <li>
                • <strong>Cơ chế Chia để trị (Divide and Conquer):</strong> Tự viết triển khai hàm <code className="font-mono text-xs">mergeSort&lt;T&gt;()</code> chia mảng thành các mảng con nửa độ dài cho tới khi còn 1 phần tử rồi gộp lại theo comparator.
              </li>
              <li>
                • <strong>Độ phức tạp:</strong> Thời gian luôn đảm bảo <strong className="font-mono text-violet-600 dark:text-violet-400">O(N log N)</strong> trong mọi trường hợp (Best, Average, Worst).
              </li>
              <li>
                • <strong>Multi-criteria sorting:</strong> Hỗ trợ so sánh đa tiêu chí, ví dụ: Nếu hai công việc có cùng độ ưu tiên (Priority), tự động so sánh phụ theo Ngày hết hạn (DueDate).
              </li>
            </ul>
          </div>

          {/* Card 4: Search with Debounce & Data Aggregation */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
            <div className="flex items-center gap-2 font-semibold text-amber-600 dark:text-amber-400">
              <Layers className="h-4 w-4" />
              <span>4. Tối ưu Hiệu năng Tìm kiếm & Tổng hợp Thống kê</span>
            </div>
            <ul className="mt-2 space-y-1.5 text-zinc-700 dark:text-zinc-300">
              <li>
                • <strong>Debounce Search:</strong> Áp dụng custom hook <code className="font-mono text-xs">useDebounce(searchQuery, 350)</code> với cơ chế Closure và Cleanup Timer. Giúp ngăn chặn việc lọc lại danh sách sau mỗi ký tự gõ phím, loại bỏ re-render thừa.
              </li>
              <li>
                • <strong>Single-pass Data Aggregation:</strong> Toàn bộ Tổng thu, Tổng chi, Số dư và Tỷ lệ tiết kiệm được tính toán trong đúng 1 lần lặp duy nhất bằng <code className="font-mono text-xs">Array.prototype.reduce</code> đạt độ phức tạp <strong className="font-mono">O(N)</strong>.
              </li>
              <li>
                • <strong>Phân tích cơ cấu chi tiêu:</strong> Nhóm theo Category và tính phần trăm tỷ trọng chi phí để hiển thị thanh tiến độ trực quan.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end border-t border-zinc-200 pt-4 dark:border-zinc-800">
          <button
            onClick={onClose}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            Đã hiểu, quay lại Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

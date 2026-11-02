import { TaskJSON } from '../models/Task';
import { TransactionJSON } from '../models/Transaction';

// Tạo mốc thời gian động tương đối so với ngày hiện tại để demo luôn mới
const now = new Date();
const getRelativeDate = (offsetDays: number): string => {
  const d = new Date(now);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString();
};

export const INITIAL_TASKS: TaskJSON[] = [
  {
    id: 'task-1',
    title: 'Ôn tập kiến thức OOP, TypeScript & thuật toán Sorting',
    description: 'Nắm vững 4 tính chất OOP (Đóng gói, Kế thừa, Đa hình, Trừu tượng) và Merge Sort O(N log N).',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    dueDate: getRelativeDate(1), // Ngày mai
    createdAt: getRelativeDate(-2),
    updatedAt: getRelativeDate(-1),
  },
  {
    id: 'task-2',
    title: 'Hoàn thiện dự án Personal Management Dashboard demo',
    description: 'Xây dựng Clean Architecture với Next.js App Router, Tailwind CSS và Normalized State.',
    priority: 'HIGH',
    status: 'DONE',
    dueDate: getRelativeDate(-1),
    createdAt: getRelativeDate(-4),
    updatedAt: getRelativeDate(-1),
  },
  {
    id: 'task-3',
    title: 'Chuẩn bị CV & Portfolio xin thực tập Frontend / Fullstack',
    description: 'Cập nhật các dự án đã làm, link GitHub và kinh nghiệm công nghệ vào CV bản mới nhất.',
    priority: 'HIGH',
    status: 'TODO',
    dueDate: getRelativeDate(2),
    createdAt: getRelativeDate(-3),
    updatedAt: getRelativeDate(-3),
  },
  {
    id: 'task-4',
    title: 'Nộp bài kiểm tra tiếng Anh đầu vào doanh nghiệp',
    description: 'Thực hiện bài test TOEIC / Aptis online theo email nhà tuyển dụng gửi.',
    priority: 'LOW',
    status: 'TODO',
    dueDate: getRelativeDate(-2), // Quá hạn để kiểm tra hàm task.isOverdue()
    createdAt: getRelativeDate(-5),
    updatedAt: getRelativeDate(-5),
  },
  {
    id: 'task-5',
    title: 'Tìm hiểu Next.js 15 App Router & Server Actions nâng cao',
    description: 'Đọc kỹ tài liệu chính thức về Caching, Turbopack và cơ chế revalidateTag.',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    dueDate: getRelativeDate(4),
    createdAt: getRelativeDate(-2),
    updatedAt: getRelativeDate(-1),
  },
  {
    id: 'task-6',
    title: 'Luyện tập 5 bài LeetCode về Hash Map & Two Pointers',
    description: 'Tập giải thích cách tối ưu thời gian O(1) của Hash Table so với O(N) của mảng tuyến tính.',
    priority: 'MEDIUM',
    status: 'TODO',
    dueDate: getRelativeDate(3),
    createdAt: getRelativeDate(-1),
    updatedAt: getRelativeDate(-1),
  },
];

export const INITIAL_TRANSACTIONS: TransactionJSON[] = [
  {
    id: 'tx-1',
    title: 'Nhận lương trợ cấp thực tập tháng trước',
    amount: 6500000,
    type: 'INCOME',
    category: 'Lương',
    createdAt: getRelativeDate(-10),
    updatedAt: getRelativeDate(-10),
  },
  {
    id: 'tx-2',
    title: 'Dự án Freelance thiết kế Landing Page',
    amount: 3200000,
    type: 'INCOME',
    category: 'Freelance',
    createdAt: getRelativeDate(-6),
    updatedAt: getRelativeDate(-6),
  },
  {
    id: 'tx-3',
    title: 'Tiền thuê trọ & điện nước phòng trọ',
    amount: 3000000,
    type: 'EXPENSE',
    category: 'Nhà ở',
    createdAt: getRelativeDate(-5),
    updatedAt: getRelativeDate(-5),
  },
  {
    id: 'tx-4',
    title: 'Đi siêu thị mua thực phẩm & đồ ăn tuần',
    amount: 850000,
    type: 'EXPENSE',
    category: 'Ăn uống',
    createdAt: getRelativeDate(-4),
    updatedAt: getRelativeDate(-4),
  },
  {
    id: 'tx-5',
    title: 'Mua khóa học TypeScript & System Design',
    amount: 450000,
    type: 'EXPENSE',
    category: 'Học tập',
    createdAt: getRelativeDate(-3),
    updatedAt: getRelativeDate(-3),
  },
  {
    id: 'tx-6',
    title: 'Cà phê họp nhóm đồ án tốt nghiệp',
    amount: 110000,
    type: 'EXPENSE',
    category: 'Ăn uống',
    createdAt: getRelativeDate(-2),
    updatedAt: getRelativeDate(-2),
  },
  {
    id: 'tx-7',
    title: 'Đổ xăng xe máy & thay dầu nhớt định kỳ',
    amount: 220000,
    type: 'EXPENSE',
    category: 'Di chuyển',
    createdAt: getRelativeDate(-1),
    updatedAt: getRelativeDate(-1),
  },
  {
    id: 'tx-8',
    title: 'Thưởng KPI hoàn thành đồ án đúng hạn',
    amount: 1500000,
    type: 'INCOME',
    category: 'Thưởng',
    createdAt: getRelativeDate(0),
    updatedAt: getRelativeDate(0),
  },
];

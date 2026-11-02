import { TaskJSON } from '../models/Task';
import { TransactionJSON } from '../models/Transaction';

// Tạo mốc thời gian động tương đối so với ngày hiện tại để dữ liệu luôn mới mẻ
const now = new Date();
const getRelativeDate = (offsetDays: number): string => {
  const d = new Date(now);
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString();
};

export const INITIAL_TASKS: TaskJSON[] = [
  {
    id: 'task-1',
    title: 'Lập kế hoạch quản lý chi tiêu và ngân sách tiết kiệm quý này',
    description: 'Rà soát các khoản chi cố định, mục tiêu đầu tư cá nhân và tối ưu hóa chi phí sinh hoạt hàng tháng.',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    dueDate: getRelativeDate(1), // Ngày mai
    createdAt: getRelativeDate(-2),
    updatedAt: getRelativeDate(-1),
  },
  {
    id: 'task-2',
    title: 'Hoàn thiện slide báo cáo tổng kết tiến độ dự án',
    description: 'Tổng hợp số liệu bàn giao, biểu đồ hiệu suất và các cột mốc đã hoàn thành đúng hạn.',
    priority: 'HIGH',
    status: 'DONE',
    dueDate: getRelativeDate(-1),
    createdAt: getRelativeDate(-4),
    updatedAt: getRelativeDate(-1),
  },
  {
    id: 'task-3',
    title: 'Nghiên cứu tài liệu kiến trúc kỹ thuật cho dự án mới',
    description: 'Đánh giá các giải pháp công nghệ, giải pháp phân tán và các tiêu chuẩn bảo mật dữ liệu.',
    priority: 'HIGH',
    status: 'TODO',
    dueDate: getRelativeDate(2),
    createdAt: getRelativeDate(-3),
    updatedAt: getRelativeDate(-3),
  },
  {
    id: 'task-4',
    title: 'Gia hạn hợp đồng thuê nhà và đóng phí dịch vụ chung cư',
    description: 'Chuyển khoản thanh toán tiền phòng và phí ban quản lý theo thông báo của chủ nhà.',
    priority: 'LOW',
    status: 'TODO',
    dueDate: getRelativeDate(-2), // Quá hạn để kiểm tra hiển thị trạng thái
    createdAt: getRelativeDate(-5),
    updatedAt: getRelativeDate(-5),
  },
  {
    id: 'task-5',
    title: 'Tham gia buổi hội thảo trực tuyến về phát triển sản phẩm công nghệ',
    description: 'Lắng nghe chia sẻ từ các chuyên gia trong ngành về tối ưu hóa quy trình làm việc.',
    priority: 'MEDIUM',
    status: 'IN_PROGRESS',
    dueDate: getRelativeDate(4),
    createdAt: getRelativeDate(-2),
    updatedAt: getRelativeDate(-1),
  },
  {
    id: 'task-6',
    title: 'Đăng ký khóa học tiếng Anh giao tiếp và kỹ năng thuyết trình',
    description: 'Luyện tập phát âm, phản xạ nghe nói và hoàn thành bài kiểm tra phân loại đầu vào.',
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
    title: 'Lương chuyển khoản tháng vừa qua',
    amount: 14500000,
    type: 'INCOME',
    category: 'Lương',
    createdAt: getRelativeDate(-10),
    updatedAt: getRelativeDate(-10),
  },
  {
    id: 'tx-2',
    title: 'Thu nhập từ dự án Freelance thiết kế giao diện web',
    amount: 5200000,
    type: 'INCOME',
    category: 'Freelance',
    createdAt: getRelativeDate(-6),
    updatedAt: getRelativeDate(-6),
  },
  {
    id: 'tx-3',
    title: 'Tiền thuê căn hộ và phí dịch vụ sinh hoạt',
    amount: 4500000,
    type: 'EXPENSE',
    category: 'Nhà ở',
    createdAt: getRelativeDate(-5),
    updatedAt: getRelativeDate(-5),
  },
  {
    id: 'tx-4',
    title: 'Đi siêu thị mua sắm thực phẩm cho gia đình',
    amount: 1250000,
    type: 'EXPENSE',
    category: 'Ăn uống',
    createdAt: getRelativeDate(-4),
    updatedAt: getRelativeDate(-4),
  },
  {
    id: 'tx-5',
    title: 'Mua sách chuyên ngành và tài liệu học tập',
    amount: 420000,
    type: 'EXPENSE',
    category: 'Học tập',
    createdAt: getRelativeDate(-3),
    updatedAt: getRelativeDate(-3),
  },
  {
    id: 'tx-6',
    title: 'Gặp gỡ bạn bè cuối tuần tại quán cà phê',
    amount: 160000,
    type: 'EXPENSE',
    category: 'Ăn uống',
    createdAt: getRelativeDate(-2),
    updatedAt: getRelativeDate(-2),
  },
  {
    id: 'tx-7',
    title: 'Bảo dưỡng xe định kỳ và đổ xăng',
    amount: 350000,
    type: 'EXPENSE',
    category: 'Di chuyển',
    createdAt: getRelativeDate(-1),
    updatedAt: getRelativeDate(-1),
  },
  {
    id: 'tx-8',
    title: 'Thưởng KPI hoàn thành xuất sắc dự án quý',
    amount: 2500000,
    type: 'INCOME',
    category: 'Thưởng',
    createdAt: getRelativeDate(0),
    updatedAt: getRelativeDate(0),
  },
];

import { Task, TaskPriority } from '../models/Task';
import { Transaction } from '../models/Transaction';

/**
 * Priority Weight Mapping:
 * Định lượng độ ưu tiên thành số nguyên để so sánh trong thuật toán sắp xếp
 */
export const PRIORITY_WEIGHTS: Record<TaskPriority, number> = {
  HIGH: 3,
  MEDIUM: 2,
  LOW: 1,
};

/**
 * THUẬT TOÁN MERGE SORT (SẮP XẾP TRỘN) - CHIA ĐỂ TRỊ (DIVIDE AND CONQUER)
 * 
 * - Độ phức tạp thời gian (Time Complexity): Luôn là O(N log N) trong mọi trường hợp (Tốt nhất, Trung bình, Xấu nhất).
 * - Độ phức tạp không gian (Space Complexity): O(N) do cần mảng phụ để lưu trữ các mảng con khi gộp.
 * - Tính ổn định (Stability): Là Stable Sort (bảo toàn thứ tự tương đối của các phần tử có giá trị bằng nhau).
 * 
 * @param array Mảng đầu vào cần sắp xếp
 * @param comparator Hàm so sánh (trả về < 0 nếu a < b, > 0 nếu a > b, 0 nếu a == b)
 */
export function mergeSort<T>(array: T[], comparator: (a: T, b: T) => number): T[] {
  // Điều kiện dừng đệ quy (Base case)
  if (array.length <= 1) {
    return array;
  }

  // Bước 1: Chia (Divide) - Tìm điểm giữa và tách đôi mảng
  const mid = Math.floor(array.length / 2);
  const left = array.slice(0, mid);
  const right = array.slice(mid);

  // Bước 2: Trị (Conquer) - Đệ quy sắp xếp từng nửa
  const sortedLeft = mergeSort(left, comparator);
  const sortedRight = mergeSort(right, comparator);

  // Bước 3: Gộp (Combine/Merge) - Trộn hai nửa đã sắp xếp thành mảng hoàn chỉnh
  return merge(sortedLeft, sortedRight, comparator);
}

/**
 * Hàm phụ trợ gộp hai mảng con đã sắp xếp thành một mảng duy nhất - O(N)
 */
function merge<T>(left: T[], right: T[], comparator: (a: T, b: T) => number): T[] {
  const result: T[] = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (comparator(left[i], right[j]) <= 0) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  // Đưa các phần tử còn dư vào mảng kết quả
  while (i < left.length) {
    result.push(left[i]);
    i++;
  }
  while (j < right.length) {
    result.push(right[j]);
    j++;
  }

  return result;
}

// ==========================================
// CÁC HÀM SẮP XẾP NGHIỆP VỤ (MULTI-CRITERIA)
// ==========================================

export type TaskSortCriteria =
  | 'PRIORITY_DESC'   // Mức ưu tiên cao -> thấp
  | 'DUE_DATE_ASC'    // Ngày hết hạn gần nhất trước
  | 'CREATED_DESC'    // Mới tạo gần đây nhất
  | 'STATUS';         // Nhóm theo trạng thái Todo -> In Progress -> Done

/**
 * Sắp xếp danh sách Task theo tiêu chí yêu cầu (sử dụng Merge Sort O(N log N))
 */
export function sortTasks(tasks: Task[], criteria: TaskSortCriteria): Task[] {
  return mergeSort([...tasks], (a, b) => {
    switch (criteria) {
      case 'PRIORITY_DESC': {
        const weightA = PRIORITY_WEIGHTS[a.priority];
        const weightB = PRIORITY_WEIGHTS[b.priority];
        // Nếu priority khác nhau thì so sánh weight, nếu bằng nhau thì so sánh ngày hết hạn
        if (weightB !== weightA) {
          return weightB - weightA;
        }
        return a.dueDate.getTime() - b.dueDate.getTime();
      }

      case 'DUE_DATE_ASC':
        return a.dueDate.getTime() - b.dueDate.getTime();

      case 'CREATED_DESC':
        return b.createdAt.getTime() - a.createdAt.getTime();

      case 'STATUS': {
        const statusOrder: Record<string, number> = { TODO: 1, IN_PROGRESS: 2, DONE: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      }

      default:
        return 0;
    }
  });
}

export type TransactionSortCriteria =
  | 'DATE_DESC'    // Mới nhất trước
  | 'DATE_ASC'     // Cũ nhất trước
  | 'AMOUNT_DESC'  // Số tiền cao -> thấp
  | 'AMOUNT_ASC';  // Số tiền thấp -> cao

/**
 * Sắp xếp danh sách Transaction theo tiêu chí yêu cầu (sử dụng Merge Sort O(N log N))
 */
export function sortTransactions(
  transactions: Transaction[],
  criteria: TransactionSortCriteria
): Transaction[] {
  return mergeSort([...transactions], (a, b) => {
    switch (criteria) {
      case 'DATE_DESC':
        return b.createdAt.getTime() - a.createdAt.getTime();

      case 'DATE_ASC':
        return a.createdAt.getTime() - b.createdAt.getTime();

      case 'AMOUNT_DESC':
        return b.amount - a.amount;

      case 'AMOUNT_ASC':
        return a.amount - b.amount;

      default:
        return 0;
    }
  });
}


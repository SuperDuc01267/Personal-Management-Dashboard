/**
 * CẤU TRÚC DỮ LIỆU CHUẨN HÓA (NORMALIZED STATE PATTERN)
 * 
 * Vấn đề: Với cấu trúc mảng thông thường T[], khi muốn tìm kiếm, cập nhật hoặc xóa một phần tử
 * theo ID, ta phải duyệt qua mảng (Array.prototype.find / findIndex / filter) tốn độ phức tạp O(N).
 * 
 * Giải pháp: Chuẩn hóa dữ liệu thành Hash Map (Object key-value):
 * - `byId`: Record<string, T> lưu trữ trực tiếp từng entity theo ID => Truy xuất O(1).
 * - `allIds`: string[] mảng lưu danh sách ID theo thứ tự => Giữ nguyên thứ tự hiển thị.
 */

export interface NormalizedState<T> {
  byId: Record<string, T>;
  allIds: string[];
}

/**
 * Chuyển đổi mảng (Array) thành Normalized State - O(N)
 * Thực hiện 1 lần duy nhất khi nạp dữ liệu vào State
 */
export function normalize<T extends { id: string }>(items: T[]): NormalizedState<T> {
  const byId: Record<string, T> = {};
  const allIds: string[] = [];

  for (const item of items) {
    byId[item.id] = item;
    allIds.push(item.id);
  }

  return { byId, allIds };
}

/**
 * Chuyển đổi từ Normalized State về Mảng (Array) để render giao diện - O(N)
 */
export function denormalize<T>(state: NormalizedState<T>): T[] {
  return state.allIds.map((id) => state.byId[id]).filter(Boolean);
}

/**
 * Lấy một phần tử theo ID với độ phức tạp tối ưu O(1)
 */
export function getItemById<T>(state: NormalizedState<T>, id: string): T | undefined {
  return state.byId[id];
}

/**
 * Thêm một phần tử mới vào Normalized State với thời gian O(1)
 */
export function addItemToNormalized<T extends { id: string }>(
  state: NormalizedState<T>,
  item: T
): NormalizedState<T> {
  // Tránh trùng lặp ID nếu phần tử đã tồn tại
  const exists = Boolean(state.byId[item.id]);

  return {
    byId: {
      ...state.byId,
      [item.id]: item,
    },
    allIds: exists ? state.allIds : [item.id, ...state.allIds], // Đưa lên đầu danh sách
  };
}

/**
 * Cập nhật một phần tử có sẵn trong Normalized State với thời gian O(1)
 */
export function updateItemInNormalized<T extends { id: string }>(
  state: NormalizedState<T>,
  item: T
): NormalizedState<T> {
  if (!state.byId[item.id]) {
    return state;
  }

  return {
    ...state,
    byId: {
      ...state.byId,
      [item.id]: item,
    },
  };
}

/**
 * Xóa một phần tử khỏi Normalized State
 * - Xóa key khỏi hash map: O(1)
 * - Lọc id khỏi mảng allIds: O(N)
 */
export function removeItemFromNormalized<T extends { id: string }>(
  state: NormalizedState<T>,
  id: string
): NormalizedState<T> {
  if (!state.byId[id]) {
    return state;
  }

  // Sao chép và xóa key trong hash map
  const newById = { ...state.byId };
  delete newById[id];

  return {
    byId: newById,
    allIds: state.allIds.filter((itemId) => itemId !== id),
  };
}

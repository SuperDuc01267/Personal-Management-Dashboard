/**
 * Debounce Function (Closure & Timer)
 * Kỹ thuật trì hoãn thực thi một hàm cho đến khi người dùng ngừng thao tác trong một khoảng thời gian nhất định (delay ms).
 * 
 * Ứng dụng: Ô tìm kiếm (Search Bar), resize window, scroll event.
 * Lợi ích: Tránh gọi hàm filter/API liên tục sau mỗi ký tự gõ, tối ưu số lần re-render và tải CPU.
 * 
 * @param fn Hàm cần trì hoãn
 * @param delay Thời gian chờ (mili-giây)
 */
export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout | null = null;

  return function (this: unknown, ...args: Parameters<T>) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}


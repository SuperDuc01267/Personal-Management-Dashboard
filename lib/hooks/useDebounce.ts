'use client';

import { useEffect, useState } from 'react';

/**
 * Custom Hook: useDebounce
 * Giúp debounce một giá trị bất kỳ (thường là search query).
 * 
 * @param value Giá trị đầu vào cần debounce
 * @param delay Thời gian delay tính bằng milliseconds (mặc định 350ms)
 * @returns Giá trị đã được debounce sau khoảng thời gian chờ
 */
export function useDebounce<T>(value: T, delay: number = 350): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Đặt timer cập nhật giá trị sau khoảng delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Dọn dẹp (cleanup) timer nếu value thay đổi trước khi delay hết hạn
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

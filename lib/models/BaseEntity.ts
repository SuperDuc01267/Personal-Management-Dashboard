/**
 * BaseEntity - Abstract Base Class cho toàn bộ Entity trong hệ thống.
 * Áp dụng nguyên lý OOP (Kế thừa - Inheritance & Trừu tượng - Abstraction).
 * Sử dụng Generic Type <T> để các lớp con tự định nghĩa kiểu dữ liệu JSON đầu ra.
 */
export abstract class BaseEntity<T = object> {
  public readonly id: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(id?: string, createdAt?: Date, updatedAt?: Date) {
    this.id = id || BaseEntity.generateUUID();
    this.createdAt = createdAt ? new Date(createdAt) : new Date();
    this.updatedAt = updatedAt ? new Date(updatedAt) : new Date();
  }

  /**
   * Cập nhật thời gian chỉnh sửa gần nhất
   */
  public touch(): void {
    this.updatedAt = new Date();
  }

  /**
   * Tạo UUID v4 ngẫu nhiên đơn giản không phụ thuộc thư viện ngoài
   */
  protected static generateUUID(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Abstract method ép các lớp con phải triển khai chuyển đổi dữ liệu thành plain object (serialization)
   */
  public abstract toJSON(): T;
}

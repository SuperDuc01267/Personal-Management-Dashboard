import { BaseEntity } from './BaseEntity';

export type TransactionType = 'INCOME' | 'EXPENSE';

export interface TransactionJSON {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  category: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Transaction Class - Đại diện cho một giao dịch Thu hoặc Chi
 * Áp dụng tính Đóng gói (Encapsulation) để bảo vệ giá trị số tiền (amount) luôn dương (> 0).
 */
export class Transaction extends BaseEntity<TransactionJSON> {
  public title: string;
  private _amount: number;
  public type: TransactionType;
  public category: string;

  constructor(
    title: string,
    amount: number,
    type: TransactionType = 'EXPENSE',
    category: string = 'Khác',
    id?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
    this.title = (title || '').trim() || 'Giao dịch không tên';
    this._amount = 0;
    this.amount = amount; // Kích hoạt setter kiểm tra validation
    this.type = type;
    this.category = category;
  }

  /**
   * Getter cho số tiền
   */
  public get amount(): number {
    return this._amount;
  }

  /**
   * Setter cho số tiền (Nghiệp vụ: Số tiền phải là số dương lớn hơn 0)
   */
  public set amount(value: number) {
    if (isNaN(value) || value <= 0) {
      throw new Error('Số tiền giao dịch phải là một số lớn hơn 0.');
    }
    this._amount = Math.round(value);
    this.touch();
  }

  /**
   * Format số tiền sang định dạng tiền tệ Việt Nam Đồng (VND)
   * Có tiền tố dấu (+) hoặc (-) tùy theo loại giao dịch
   */
  public getFormattedAmount(withSign: boolean = true): string {
    const formatted = new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(this._amount);

    if (!withSign) return formatted;
    return this.type === 'INCOME' ? `+${formatted}` : `-${formatted}`;
  }

  /**
   * Chuyển đổi dữ liệu sang định dạng JSON phẳng
   */
  public toJSON(): TransactionJSON {
    return {
      id: this.id,
      title: this.title,
      amount: this.amount,
      type: this.type,
      category: this.category,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Factory Method: Tái tạo instance Transaction từ dữ liệu thô (LocalStorage/API)
   */
  public static fromJSON(json: TransactionJSON): Transaction {
    return new Transaction(
      json.title,
      json.amount,
      json.type,
      json.category,
      json.id,
      new Date(json.createdAt),
      new Date(json.updatedAt)
    );
  }
}

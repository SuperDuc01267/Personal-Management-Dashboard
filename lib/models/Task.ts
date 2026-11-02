import { BaseEntity } from './BaseEntity';

export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface TaskJSON {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Task Class - Đại diện cho một công việc cần làm
 * Áp dụng tính Đóng gói (Encapsulation) với getter/setter để kiểm soát tính hợp lệ của dữ liệu.
 */
export class Task extends BaseEntity<TaskJSON> {
  private _title: string;
  public description: string;
  public priority: TaskPriority;
  public status: TaskStatus;
  public dueDate: Date;

  constructor(
    title: string,
    description: string = '',
    priority: TaskPriority = 'MEDIUM',
    status: TaskStatus = 'TODO',
    dueDate: Date = new Date(),
    id?: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id, createdAt, updatedAt);
    this._title = '';
    this.title = title; // Kích hoạt setter để kiểm tra validation
    this.description = description;
    this.priority = priority;
    this.status = status;
    this.dueDate = new Date(dueDate);
  }

  /**
   * Getter cho tiêu đề công việc
   */
  public get title(): string {
    return this._title;
  }

  /**
   * Setter cho tiêu đề công việc (Đóng gói nghiệp vụ: Không được để trống)
   */
  public set title(newTitle: string) {
    const trimmed = (newTitle || '').trim();
    if (!trimmed) {
      throw new Error('Tiêu đề công việc không được để trống.');
    }
    this._title = trimmed;
    this.touch();
  }

  /**
   * Nghiệp vụ: Đánh dấu công việc đã hoàn thành
   */
  public markAsCompleted(): void {
    this.status = 'DONE';
    this.touch();
  }

  /**
   * Nghiệp vụ: Kiểm tra công việc có bị quá hạn so với hiện tại không
   * (Chỉ tính là quá hạn khi chưa hoàn thành và dueDate < thời điểm hiện tại)
   */
  public isOverdue(): boolean {
    if (this.status === 'DONE') return false;
    const now = new Date();
    return this.dueDate.getTime() < now.getTime();
  }

  /**
   * Chuyển đổi dữ liệu sang định dạng JSON phẳng để lưu trữ hoặc truyền qua API
   */
  public toJSON(): TaskJSON {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      priority: this.priority,
      status: this.status,
      dueDate: this.dueDate.toISOString(),
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  /**
   * Factory Method (Design Pattern): Khởi tạo instance Task từ object thuần (JSON/LocalStorage)
   */
  public static fromJSON(json: TaskJSON): Task {
    return new Task(
      json.title,
      json.description,
      json.priority,
      json.status,
      new Date(json.dueDate),
      json.id,
      new Date(json.createdAt),
      new Date(json.updatedAt)
    );
  }
}

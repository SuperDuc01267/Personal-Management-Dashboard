# 🎯 Personal Management Dashboard (Quản lý Công việc & Thu chi Cá nhân)

> Dự án demo phỏng vấn vị trí Thực tập sinh Frontend / Fullstack. 
> Xây dựng bằng **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, áp dụng **Clean Architecture**, **Lập trình hướng đối tượng (OOP)**, **Normalized State** và các **Thuật toán xử lý dữ liệu chuẩn chỉnh**.

---

## 🚀 Hướng Dẫn Khởi Chạy Nhanh (Getting Started)

```bash
# 1. Cài đặt dependencies (nếu chưa có)
npm install

# 2. Khởi chạy môi trường phát triển (Development Server)
npm run dev
```

Mở trình duyệt truy cập: [http://localhost:3000](http://localhost:3000)

Để kiểm tra build production:
```bash
npm run build
npm run start
```

---

## 📁 Cấu Trúc Thư Mục (Clean Architecture)

```text
├── app/
│   ├── globals.css           # Cấu hình Tailwind CSS & Custom Theme (Dark/Light Mode)
│   ├── layout.tsx            # Root layout bọc DashboardProvider
│   └── page.tsx              # Single Page Dashboard (2 cột: Thu chi & Task)
│
├── components/
│   ├── Navbar.tsx            # Header bar (Logo, Dark/Light Mode, Reset Mock Data)
│   ├── FinancialSection.tsx  # Cột 1: Quản lý Thu chi, Thống kê, Phân tích danh mục
│   ├── TaskSection.tsx       # Cột 2: Quản lý Công việc, Debounced Search, Filter & Sort
│   └── InterviewGuideModal.tsx # "Interview Cheat Sheet" - Pop-up tóm tắt kiến thức phỏng vấn
│
├── lib/
│   ├── models/               # Triển khai OOP (Lập trình hướng đối tượng)
│   │   ├── BaseEntity.ts     # Abstract Base Class với Generics, UUID & timestamps
│   │   ├── Task.ts           # Class Task kế thừa BaseEntity, Encapsulation, isOverdue()
│   │   ├── Transaction.ts    # Class Transaction kế thừa BaseEntity, VND format, amount validation
│   │   └── index.ts
│   │
│   ├── utils/                # Thuật toán & Hàm xử lý dữ liệu
│   │   ├── sorting.ts        # Thuật toán Merge Sort O(N log N) đa tiêu chí
│   │   ├── debounce.ts       # Hàm debounce (Closure & Timer)
│   │   ├── aggregation.ts    # Thống kê số liệu (Single-pass reduce O(N))
│   │   ├── normalization.ts  # Cấu trúc Normalized State { byId, allIds } truy xuất O(1)
│   │   └── index.ts
│   │
│   ├── hooks/
│   │   └── useDebounce.ts    # Custom React Hook cho tìm kiếm không bị re-render liên tục
│   │
│   ├── context/
│   │   └── DashboardContext.tsx # Quản lý State tập trung dạng Normalized State & LocalStorage
│   │
│   └── data/
│       └── mockData.ts       # 6 Task & 8 Giao dịch mẫu khởi tạo sẵn
```

---

## 💎 Điểm Nhấn Kỹ Thuật Dùng Khi Phỏng Vấn (Key Talking Points)

### 1. Lập Trình Hướng Đối Tượng (OOP)
* **Kế thừa & Trừu tượng (Inheritance & Abstraction):** 
  - `BaseEntity<T>` là abstract class chứa `id`, `createdAt`, `updatedAt`, phương thức cập nhật `touch()` và sinh UUID.
  - Ép các lớp con triển khai phương thức trừu tượng `toJSON(): T`.
* **Đóng gói (Encapsulation):**
  - Trong `Task`: `_title` là `private`. Setter `title` kiểm tra không được rỗng `trim().length > 0`.
  - Trong `Transaction`: `_amount` là `private`. Setter `amount` kiểm tra số tiền phải dương `> 0`.
* **Nghiệp vụ trực tiếp trên Model:**
  - `task.markAsCompleted()`: Đổi trạng thái sang `'DONE'` và cập nhật `updatedAt`.
  - `task.isOverdue()`: Tự động so sánh hạn chót `dueDate` với ngày hiện tại `new Date()`.
  - `tx.getFormattedAmount()`: Định dạng tiền tệ VND kèm dấu `+`/`-`.
* **Design Pattern (Factory Method):**
  - `Task.fromJSON()` và `Transaction.fromJSON()` giúp tái tạo instances có đầy đủ phương thức từ LocalStorage hoặc JSON API.

---

### 2. Cấu Trúc Dữ Liệu Chuẩn Hóa (Normalized State Pattern)
Thay vì lưu trữ dữ liệu dạng mảng phẳng thông thường (`Task[]`), hệ thống áp dụng kỹ thuật **Normalized State**:
```typescript
interface NormalizedState<T> {
  byId: Record<string, T>; // Hash Map: Truy xuất, Cập nhật, Xóa theo ID chỉ mất O(1)
  allIds: string[];         // Mảng chứa ID để bảo toàn thứ tự hiển thị
}
```
* **Lợi ích:** Khi người dùng thay đổi trạng thái của 1 công việc hay cập nhật 1 giao dịch, ứng dụng truy cập trực tiếp `state.byId[id]` với độ phức tạp **$O(1)$**, tránh việc phải lặp mảng $O(N)$ bằng `Array.prototype.find()` hay `Array.prototype.map()`.

---

### 3. Thuật Toán Sắp Xếp Merge Sort ($O(N \log N)$)
* Tự viết hàm `mergeSort<T>(array, comparator)` theo nguyên lý **Chia để trị (Divide and Conquer)**.
* Đảm bảo thời gian chạy luôn đạt **$O(N \log N)$** trong mọi trường hợp (Tốt nhất, Trung bình, Xấu nhất).
* Triển khai so sánh đa tiêu chí (Multi-criteria Comparator): Khi sắp xếp Task theo độ ưu tiên (`HIGH > MEDIUM > LOW`), nếu 2 Task có cùng độ ưu tiên, hệ thống tự động so sánh phụ theo ngày hết hạn (`dueDate`).

---

### 4. Search with Debounce ($300\text{ms}$)
* Áp dụng Custom Hook `useDebounce` kết hợp cơ chế Closure và Cleanup Timer trong `useEffect`.
* Khi người dùng gõ từ khóa vào ô tìm kiếm, hệ thống chỉ kích hoạt lọc dữ liệu sau khi ngừng gõ $300\text{ms}$, loại bỏ tình trạng re-render liên tục gây giật lag giao diện.

---

### 5. Thống Kê & Tổng Hợp Dữ Liệu (Single-Pass Aggregation)
* Hàm `calculateFinancialSummary` sử dụng `Array.prototype.reduce` duyệt qua mảng đúng 1 lần duy nhất (**$O(N)$**) để tính đồng thời: Tổng thu, Tổng chi, Số dư và Tỷ lệ tích lũy.
* Hàm `groupExpensesByCategory` nhóm chi tiêu theo từng danh mục và tính phần trăm tỷ trọng chi phí để hiển thị biểu đồ phân tích trực quan.

---

## 🛠️ Công Nghệ Sử Dụng
- **Next.js 16 (App Router)**
- **React 19**
- **TypeScript 5**
- **Tailwind CSS v4** (Hỗ trợ Dark & Light Theme)
- **lucide-react** (Bộ icon tối giản, hiện đại)
- **LocalStorage API** (Lưu trữ và đồng bộ dữ liệu client-side)

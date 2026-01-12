# Hướng Dẫn Sử Dụng Task Manager với Supabase

## Tổng quan

Hệ thống Task Manager này cho phép bạn quản lý công việc với đầy đủ tính năng CRUD (Create, Read, Update, Delete) và lưu trữ dữ liệu trên Supabase thông qua kết nối MCP.

## Cấu trúc File

```
phong-thuy-minh-phuoc-main/
├── task-manager.html          # Giao diện chính
├── setup-tasks-table.sql      # Script SQL để tạo database
├── js/
│   ├── supabase-client.js     # Quản lý kết nối Supabase
│   ├── task-manager.js        # Logic xử lý tasks
│   └── task-ui.js             # Giao diện và tương tác
```

## Bước 1: Setup Database trên Supabase

### 1.1. Đăng nhập vào Supabase Dashboard
- Truy cập: https://supabase.com/dashboard
- Đăng nhập hoặc tạo tài khoản mới

### 1.2. Tạo Project mới (nếu chưa có)
- Click "New Project"
- Điền thông tin:
  - Project Name: `phong-thuy-tasks` (hoặc tên bạn muốn)
  - Database Password: Tạo mật khẩu mạnh
  - Region: Chọn region gần nhất
- Click "Create new project"
- Đợi vài phút để Supabase setup xong

### 1.3. Chạy SQL Script
1. Trong Dashboard, click vào tab **SQL Editor** (biểu tượng database bên trái)
2. Click **New Query**
3. Copy toàn bộ nội dung file `setup-tasks-table.sql`
4. Paste vào SQL Editor
5. Click **Run** (hoặc nhấn Ctrl/Cmd + Enter)
6. Kiểm tra kết quả - bạn sẽ thấy thông báo thành công

### 1.4. Kiểm tra Table đã được tạo
1. Click vào tab **Table Editor**
2. Bạn sẽ thấy bảng `tasks` với 5 dòng dữ liệu mẫu
3. Click vào bảng để xem cấu trúc:
   - `id`: UUID (Primary Key)
   - `title`: TEXT (Tiêu đề task)
   - `description`: TEXT (Mô tả)
   - `status`: TEXT (Trạng thái: pending, in_progress, completed, cancelled)
   - `priority`: TEXT (Độ ưu tiên: low, medium, high)
   - `due_date`: TIMESTAMP (Hạn hoàn thành)
   - `created_at`: TIMESTAMP (Thời gian tạo)
   - `updated_at`: TIMESTAMP (Thời gian cập nhật)

## Bước 2: Lấy Thông Tin Kết Nối

### 2.1. Lấy Supabase URL
1. Trong Dashboard, click vào **Settings** (icon bánh răng)
2. Click **API**
3. Tìm phần **Project URL**
4. Copy URL (dạng: `https://xxxxxxxxxxxxx.supabase.co`)

### 2.2. Lấy Supabase Anon Key
1. Cùng trang **Settings > API**
2. Tìm phần **Project API keys**
3. Copy **anon/public key** (key dài bắt đầu bằng `eyJhbGciOiJIUzI1NiIsInR5cCI6...`)

## Bước 3: Sử Dụng Task Manager

### 3.1. Mở Ứng Dụng
1. Mở file `task-manager.html` trong trình duyệt web
2. Bạn sẽ thấy form "Cấu hình Supabase"

### 3.2. Kết Nối với Supabase
1. Điền **Supabase URL** vào ô đầu tiên
2. Điền **Supabase Anon Key** vào ô thứ hai
3. Click nút **"Kết nối"**
4. Nếu thành công, bạn sẽ thấy:
   - Thông báo "Kết nối thành công!" màu xanh
   - Form "Thêm Task Mới" hiện ra
   - Danh sách tasks được tải về (bao gồm 5 tasks mẫu)

**Lưu ý**: Thông tin kết nối sẽ được lưu trong localStorage, lần sau mở lại sẽ tự động điền.

### 3.3. Thêm Task Mới
1. Điền thông tin vào form "Thêm Task Mới":
   - **Tiêu đề**: Bắt buộc - Tên công việc
   - **Mô tả**: Tuỳ chọn - Chi tiết công việc
   - **Trạng thái**: Chọn từ dropdown (Chờ xử lý, Đang làm, Hoàn thành, Đã hủy)
   - **Độ ưu tiên**: Chọn từ dropdown (Thấp, Trung bình, Cao)
   - **Hạn hoàn thành**: Tuỳ chọn - Chọn ngày
2. Click **"Thêm Task"**
3. Task mới sẽ xuất hiện ở đầu danh sách

### 3.4. Lọc Tasks
- Click các nút filter phía trên danh sách:
  - **Tất cả**: Hiển thị tất cả tasks
  - **Chờ xử lý**: Chỉ hiện tasks chưa bắt đầu
  - **Đang làm**: Chỉ hiện tasks đang thực hiện
  - **Hoàn thành**: Chỉ hiện tasks đã xong
  - **Đã hủy**: Chỉ hiện tasks bị hủy

### 3.5. Cập Nhật Task
- **Cách 1**: Thay đổi trạng thái trực tiếp
  - Click vào dropdown "Trạng thái" ở cuối mỗi task card
  - Chọn trạng thái mới
  - Task sẽ tự động cập nhật

- **Cách 2**: Chỉnh sửa toàn bộ task
  - Click icon "Edit" (icon bút) ở góc phải task card
  - Form "Thêm Task Mới" sẽ chuyển sang chế độ "Cập nhật"
  - Thay đổi thông tin cần thiết
  - Click **"Cập nhật Task"**

### 3.6. Xóa Task
1. Click icon "Delete" (icon thùng rác) ở góc phải task card
2. Confirm xác nhận xóa
3. Task sẽ bị xóa khỏi database

## Tính Năng Nâng Cao

### Realtime Updates
- Ứng dụng tự động cập nhật khi có thay đổi từ nguồn khác
- Nếu bạn mở 2 tab, thay đổi ở tab 1 sẽ tự động hiện ở tab 2

### Priority Colors
Tasks được tô màu theo độ ưu tiên:
- **Đỏ**: Cao (High)
- **Cam**: Trung bình (Medium)
- **Xanh lá**: Thấp (Low)

### Tìm Kiếm (Có thể thêm)
Bạn có thể sử dụng hàm `taskManager.searchTasks('từ khóa')` trong console để tìm kiếm.

## Cấu Trúc Code

### 1. supabase-client.js
- **Class**: `SupabaseClient`
- **Chức năng**: Quản lý kết nối với Supabase
- **Methods chính**:
  - `initialize(url, key)`: Khởi tạo client
  - `getClient()`: Lấy client instance
  - `testConnection()`: Test kết nối

### 2. task-manager.js
- **Class**: `TaskManager`
- **Chức năng**: CRUD operations cho tasks
- **Methods chính**:
  - `getAllTasks()`: Lấy tất cả tasks
  - `getTaskById(id)`: Lấy task theo ID
  - `createTask(data)`: Tạo task mới
  - `updateTask(id, updates)`: Cập nhật task
  - `deleteTask(id)`: Xóa task
  - `getTasksByStatus(status)`: Lọc theo status
  - `getTasksByPriority(priority)`: Lọc theo priority
  - `searchTasks(query)`: Tìm kiếm tasks
  - `subscribeToChanges()`: Subscribe realtime updates

### 3. task-ui.js
- **Class**: `TaskUI`
- **Chức năng**: Quản lý giao diện và tương tác
- **Methods chính**:
  - `init()`: Khởi tạo UI
  - `loadTasks()`: Load tasks từ DB
  - `renderTasks(tasks)`: Hiển thị danh sách
  - `handleAddTask()`: Xử lý thêm task
  - `handleEditTask(id)`: Xử lý sửa task
  - `handleDeleteTask(id)`: Xử lý xóa task

## Mở Rộng

### Thêm Authentication
Nếu muốn giới hạn tasks theo user:

1. Thêm cột `user_id` vào bảng tasks:
```sql
ALTER TABLE tasks ADD COLUMN user_id UUID REFERENCES auth.users(id);
```

2. Cập nhật RLS policies:
```sql
-- Chỉ cho phép user xem tasks của mình
CREATE POLICY "Users can only see their own tasks" ON tasks
    FOR SELECT
    USING (auth.uid() = user_id);

-- Tương tự cho INSERT, UPDATE, DELETE
```

3. Thêm authentication trong code

### Thêm Tags/Categories
```sql
ALTER TABLE tasks ADD COLUMN tags TEXT[];
```

### Thêm Attachments
```sql
CREATE TABLE task_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Troubleshooting

### Lỗi: "relation 'tasks' does not exist"
- Chưa chạy SQL script
- Giải pháp: Chạy lại file `setup-tasks-table.sql`

### Lỗi: "Invalid API key"
- Sai anon key
- Giải pháp: Kiểm tra lại key trong Settings > API

### Lỗi: "new row violates row-level security policy"
- RLS chưa được config đúng
- Giải pháp: Chạy lại phần policies trong SQL script

### Tasks không hiển thị
- Kiểm tra console để xem lỗi
- Kiểm tra RLS policies
- Kiểm tra connection status

### Realtime không hoạt động
- Kiểm tra trong Supabase Dashboard > Database > Replication
- Enable realtime cho bảng `tasks`

## Support

Nếu gặp vấn đề:
1. Kiểm tra Console (F12) để xem error messages
2. Kiểm tra Network tab để xem API calls
3. Kiểm tra Supabase Dashboard > Logs để xem server logs

## Demo Data

Sau khi chạy SQL script, bạn sẽ có 5 tasks mẫu:
1. Hoàn thành báo cáo tháng (High priority, Pending)
2. Review code cho dự án mới (Medium priority, In Progress)
3. Họp với khách hàng (High priority, Pending)
4. Cập nhật tài liệu API (Low priority, Pending)
5. Fix bug trong module thanh toán (High priority, Completed)

Bạn có thể xóa các tasks này sau khi test xong.

---

**Chúc bạn sử dụng Task Manager hiệu quả! 🚀**

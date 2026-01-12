# Hướng dẫn thiết lập Supabase cho Task Manager

## Bước 1: Tạo bảng Tasks trong Supabase

Truy cập vào Supabase Dashboard → SQL Editor và chạy câu lệnh SQL sau:

```sql
-- Tạo bảng tasks
CREATE TABLE tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    due_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo index để tăng tốc truy vấn
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);

-- Tạo function để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Tạo trigger để tự động cập nhật updated_at khi có thay đổi
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Bật Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Tạo policy cho phép mọi người đọc và ghi (development mode)
-- Trong production, bạn nên tùy chỉnh policy này theo yêu cầu bảo mật
CREATE POLICY "Enable all operations for all users" ON tasks
    FOR ALL
    USING (true)
    WITH CHECK (true);
```

## Bước 2: Thêm dữ liệu mẫu (Optional)

```sql
-- Thêm một vài tasks mẫu
INSERT INTO tasks (title, description, status, priority, due_date) VALUES
    ('Hoàn thành tài liệu dự án', 'Viết tài liệu API và hướng dẫn sử dụng', 'in_progress', 'high', CURRENT_DATE + INTERVAL '7 days'),
    ('Review code PR #123', 'Kiểm tra và review pull request của team', 'pending', 'medium', CURRENT_DATE + INTERVAL '2 days'),
    ('Fix bug đăng nhập', 'Sửa lỗi không thể đăng nhập bằng Google', 'pending', 'high', CURRENT_DATE + INTERVAL '1 day'),
    ('Cập nhật UI dashboard', 'Làm mới giao diện dashboard theo design mới', 'pending', 'low', CURRENT_DATE + INTERVAL '14 days'),
    ('Meeting với khách hàng', 'Họp review sprint và demo sản phẩm', 'completed', 'medium', CURRENT_DATE - INTERVAL '1 day');
```

## Bước 3: Lấy thông tin kết nối

1. Vào **Project Settings** → **API**
2. Copy **Project URL** (dạng: `https://xxxxx.supabase.co`)
3. Copy **anon/public key** (dạng: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## Bước 4: Sử dụng ứng dụng

1. Mở file `task-manager.html` trong trình duyệt
2. Nhập **Supabase URL** và **Anon Key** vào form cấu hình
3. Click nút **Kết nối**
4. Sau khi kết nối thành công, bạn có thể:
   - Thêm tasks mới
   - Xem danh sách tasks
   - Cập nhật trạng thái tasks
   - Chỉnh sửa và xóa tasks
   - Lọc tasks theo trạng thái

## Bước 5: Bảo mật (Production)

Trong môi trường production, bạn nên:

1. **Cập nhật RLS Policies** - Chỉ cho phép user xem và chỉnh sửa tasks của chính họ:

```sql
-- Xóa policy development
DROP POLICY "Enable all operations for all users" ON tasks;

-- Tạo policy cho authenticated users
CREATE POLICY "Users can view their own tasks" ON tasks
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks" ON tasks
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" ON tasks
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" ON tasks
    FOR DELETE
    USING (auth.uid() = user_id);

-- Thêm cột user_id
ALTER TABLE tasks ADD COLUMN user_id UUID REFERENCES auth.users(id);
```

2. **Thêm Authentication** - Tích hợp với Supabase Auth
3. **Rate Limiting** - Giới hạn số lượng requests
4. **Validation** - Kiểm tra dữ liệu đầu vào

## Cấu trúc bảng Tasks

| Cột | Kiểu dữ liệu | Mô tả |
|-----|-------------|-------|
| id | UUID | Primary key, tự động tạo |
| title | TEXT | Tiêu đề task (bắt buộc) |
| description | TEXT | Mô tả chi tiết task |
| status | TEXT | Trạng thái: pending, in_progress, completed, cancelled |
| priority | TEXT | Độ ưu tiên: low, medium, high |
| due_date | DATE | Hạn hoàn thành |
| created_at | TIMESTAMP | Thời gian tạo (tự động) |
| updated_at | TIMESTAMP | Thời gian cập nhật (tự động) |

## Tính năng

✅ Tạo, đọc, cập nhật, xóa tasks (CRUD)
✅ Lọc tasks theo trạng thái
✅ Lọc tasks theo độ ưu tiên
✅ Tìm kiếm tasks
✅ Realtime updates (tự động cập nhật khi có thay đổi)
✅ Responsive design
✅ Notifications

## Troubleshooting

### Lỗi: "relation 'tasks' does not exist"
- Kiểm tra xem bảng `tasks` đã được tạo trong Supabase chưa
- Chạy lại SQL script ở Bước 1

### Lỗi: "Row level security policy violation"
- Kiểm tra RLS policies
- Đảm bảo policy cho phép operations cần thiết

### Lỗi kết nối
- Kiểm tra Supabase URL và API key
- Đảm bảo project Supabase đang active
- Kiểm tra network/firewall settings

## Liên hệ và hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console log trong browser (F12)
2. Kiểm tra Supabase Dashboard → Logs
3. Đọc tài liệu Supabase: https://supabase.com/docs

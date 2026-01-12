-- ==========================================
-- SQL Script để tạo bảng Tasks trong Supabase
-- ==========================================

-- Tạo bảng tasks
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo index để tăng tốc độ query
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);

-- Tạo function để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tạo trigger để tự động cập nhật updated_at khi có thay đổi
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert dữ liệu mẫu (tuỳ chọn - có thể xóa nếu không cần)
INSERT INTO tasks (title, description, status, priority, due_date) VALUES
    ('Hoàn thành báo cáo tháng', 'Tổng hợp và phân tích dữ liệu tháng 12', 'pending', 'high', NOW() + INTERVAL '3 days'),
    ('Review code cho dự án mới', 'Kiểm tra và review pull request từ team', 'in_progress', 'medium', NOW() + INTERVAL '1 day'),
    ('Họp với khách hàng', 'Thảo luận về yêu cầu tính năng mới', 'pending', 'high', NOW() + INTERVAL '2 days'),
    ('Cập nhật tài liệu API', 'Thêm documentation cho các endpoint mới', 'pending', 'low', NOW() + INTERVAL '7 days'),
    ('Fix bug trong module thanh toán', 'Xử lý lỗi khi thanh toán với số tiền lớn', 'completed', 'high', NOW() - INTERVAL '1 day');

-- Bật Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Tạo policy cho phép tất cả mọi người đọc và ghi
-- CHÚ Ý: Đây là policy đơn giản cho mục đích demo
-- Trong production, bạn nên tạo policy phức tạp hơn dựa trên auth.uid()

-- Policy cho SELECT (đọc)
CREATE POLICY "Enable read access for all users" ON tasks
    FOR SELECT
    USING (true);

-- Policy cho INSERT (tạo mới)
CREATE POLICY "Enable insert access for all users" ON tasks
    FOR INSERT
    WITH CHECK (true);

-- Policy cho UPDATE (cập nhật)
CREATE POLICY "Enable update access for all users" ON tasks
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Policy cho DELETE (xóa)
CREATE POLICY "Enable delete access for all users" ON tasks
    FOR DELETE
    USING (true);

-- ==========================================
-- SECURITY NOTE:
-- ==========================================
-- Các policy trên cho phép tất cả mọi người truy cập.
-- Nếu bạn muốn giới hạn quyền truy cập theo user,
-- hãy thay đổi policy sử dụng auth.uid()
--
-- Ví dụ policy chỉ cho phép user đọc/ghi tasks của chính họ:
--
-- CREATE POLICY "Users can only see their own tasks" ON tasks
--     FOR SELECT
--     USING (auth.uid() = user_id);
--
-- (Lưu ý: Bạn cần thêm cột user_id vào bảng tasks)
-- ==========================================

-- Hoàn tất!
-- Bây giờ bạn có thể sử dụng bảng tasks với ứng dụng của mình.

-- ==========================================
-- MIGRATION: Thêm fields mới cho bảng users
-- Version: 2026-01-12
-- ==========================================
-- Chạy script này nếu bảng users đã tồn tại và cần thêm fields mới

-- Thêm cột username (unique)
ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Thêm cột first_name và last_name
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Thêm cột website
ALTER TABLE users ADD COLUMN IF NOT EXISTS website TEXT;

-- Tạo index cho username
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Tạo index cho role
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Cập nhật username từ email nếu chưa có
UPDATE users SET username = SPLIT_PART(email, '@', 1) WHERE username IS NULL;

-- Cập nhật first_name và last_name từ full_name nếu chưa có
-- (Lưu ý: Logic này giả định full_name có format "Họ + Tên")
UPDATE users 
SET last_name = TRIM(SUBSTRING(full_name FROM '^[^\s]+')),
    first_name = TRIM(SUBSTRING(full_name FROM '\s(.+)$'))
WHERE first_name IS NULL AND last_name IS NULL;

-- ==========================================
-- Thêm cột author cho blog_posts nếu chưa có
-- ==========================================
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author TEXT;

-- Cập nhật author từ author_id
UPDATE blog_posts bp
SET author = u.full_name
FROM users u
WHERE bp.author_id = u.id AND bp.author IS NULL;

-- ==========================================
-- HOÀN THÀNH MIGRATION
-- ==========================================

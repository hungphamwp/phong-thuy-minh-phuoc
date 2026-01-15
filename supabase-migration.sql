-- ==========================================
-- SUPABASE MIGRATION SCRIPT
-- ==========================================
-- Cập nhật email thành Contact.minhphuocfs@gmail.com
-- Created: 2026-01-15
-- ==========================================

-- Cập nhật email trong bảng users (nếu có dữ liệu cũ)
UPDATE users
SET email = 'Contact.minhphuocfs@gmail.com'
WHERE role = 'admin' AND (email != 'Contact.minhphuocfs@gmail.com' OR email IS NULL);

-- Cập nhật email trong bảng settings
UPDATE settings
SET setting_value = 'Contact.minhphuocfs@gmail.com'
WHERE setting_key = 'contact_email';

-- Nếu chưa có setting contact_email, thêm mới
INSERT INTO settings (setting_key, setting_value, setting_type, description)
VALUES ('contact_email', 'Contact.minhphuocfs@gmail.com', 'text', 'Email liên hệ')
ON CONFLICT (setting_key)
DO UPDATE SET setting_value = 'Contact.minhphuocfs@gmail.com';

-- Kiểm tra kết quả
SELECT 'Users with admin email:' as info, email, full_name, role
FROM users
WHERE role = 'admin';

SELECT 'Contact email setting:' as info, setting_key, setting_value
FROM settings
WHERE setting_key = 'contact_email';

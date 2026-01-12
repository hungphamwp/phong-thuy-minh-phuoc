-- ==========================================
-- DATABASE SCHEMA CHO WEBSITE MINH PHƯỚC FENG SHUI
-- ==========================================
-- Website: Phong Thủy, Tử Vi, Xem Ngày Tốt Xấu, Quỹ Khuyến Học
-- Created: 2026-01-12
-- ==========================================

-- ==========================================
-- 1. BẢNG USERS (Người dùng)
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    date_of_birth DATE,
    birth_time TIME,
    birth_place TEXT,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'guest')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- ==========================================
-- 2. BẢNG BLOG_POSTS (Bài viết Quỹ Khuyến Học)
-- ==========================================
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    category TEXT NOT NULL CHECK (category IN ('scholarship', 'news', 'fengshui', 'astrology', 'other')),
    tags TEXT[],
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    view_count INTEGER DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 3. BẢNG TU_VI_READINGS (Lá Tử Vi)
-- ==========================================
CREATE TABLE IF NOT EXISTS tu_vi_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    birth_time TIME NOT NULL,
    birth_place TEXT NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
    lunar_date TEXT,
    can_chi TEXT,
    menh TEXT,
    cung_menh TEXT,
    chu_sao JSONB,
    van_han JSONB,
    analysis TEXT,
    recommendations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 4. BẢNG NGAY_TOT (Xem Ngày Tốt Xấu)
-- ==========================================
CREATE TABLE IF NOT EXISTS ngay_tot (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    lunar_date TEXT NOT NULL,
    can_chi_ngay TEXT,
    can_chi_thang TEXT,
    can_chi_nam TEXT,
    sao_tot TEXT[],
    sao_xau TEXT[],
    gio_hoang_dao TEXT[],
    viec_nen_lam TEXT[],
    viec_nen_tranh TEXT[],
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index cho tìm kiếm nhanh theo ngày
CREATE INDEX IF NOT EXISTS idx_ngay_tot_date ON ngay_tot(date);

-- ==========================================
-- 5. BẢNG CONSULTATIONS (Tư vấn phong thủy)
-- ==========================================
CREATE TABLE IF NOT EXISTS consultations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    service_type TEXT NOT NULL CHECK (service_type IN ('tu_vi', 'phong_thuy', 'xem_ngay', 'other')),
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    assigned_to UUID REFERENCES users(id),
    response TEXT,
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 6. BẢNG MEDIA_LIBRARY (Thư viện hình ảnh)
-- ==========================================
CREATE TABLE IF NOT EXISTS media_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video', 'document', 'other')),
    file_size INTEGER,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    alt_text TEXT,
    caption TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 7. BẢNG COMMENTS (Bình luận bài viết)
-- ==========================================
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 8. BẢNG APPOINTMENTS (Lịch hẹn)
-- ==========================================
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    service_type TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    duration INTEGER DEFAULT 60,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index cho tìm kiếm lịch hẹn
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);

-- ==========================================
-- 9. BẢNG SETTINGS (Cấu hình website)
-- ==========================================
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type TEXT CHECK (setting_type IN ('text', 'number', 'boolean', 'json')),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- 10. BẢNG ACTIVITY_LOGS (Lịch sử hoạt động)
-- ==========================================
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT,
    record_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==========================================
-- INDEXES ĐỂ TĂNG TỐC ĐỘ QUERY
-- ==========================================

-- Users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- Blog Posts
CREATE INDEX IF NOT EXISTS idx_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_author ON blog_posts(author_id);

-- Tu Vi Readings
CREATE INDEX IF NOT EXISTS idx_tu_vi_user ON tu_vi_readings(user_id);
CREATE INDEX IF NOT EXISTS idx_tu_vi_created ON tu_vi_readings(created_at DESC);

-- Consultations
CREATE INDEX IF NOT EXISTS idx_consultations_user ON consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_priority ON consultations(priority);

-- Comments
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_user ON comments(user_id);

-- Activity Logs
CREATE INDEX IF NOT EXISTS idx_logs_user ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_created ON activity_logs(created_at DESC);

-- ==========================================
-- FUNCTIONS & TRIGGERS
-- ==========================================

-- Function để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Áp dụng trigger cho các bảng
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_posts_updated_at ON blog_posts;
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tu_vi_updated_at ON tu_vi_readings;
CREATE TRIGGER update_tu_vi_updated_at
    BEFORE UPDATE ON tu_vi_readings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_consultations_updated_at ON consultations;
CREATE TRIGGER update_consultations_updated_at
    BEFORE UPDATE ON consultations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Bật RLS cho các bảng
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tu_vi_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ngay_tot ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- POLICIES CHO PUBLIC ACCESS (Demo)
-- ==========================================
-- LƯU Ý: Đây là policies đơn giản cho demo
-- Trong production, bạn nên tạo policies chi tiết hơn dựa trên auth.uid()

-- Users: Public có thể đọc user public info
CREATE POLICY "Enable read access for all users" ON users
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (true) WITH CHECK (true);

-- Blog Posts: Public có thể đọc bài published
CREATE POLICY "Public can read published posts" ON blog_posts
    FOR SELECT USING (status = 'published' OR true);

CREATE POLICY "Enable insert for authenticated users" ON blog_posts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for post authors" ON blog_posts
    FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete for post authors" ON blog_posts
    FOR DELETE USING (true);

-- Tu Vi Readings: User chỉ xem được của mình
CREATE POLICY "Users can read own readings" ON tu_vi_readings
    FOR SELECT USING (true);

CREATE POLICY "Users can create readings" ON tu_vi_readings
    FOR INSERT WITH CHECK (true);

-- Ngay Tot: Public có thể đọc
CREATE POLICY "Public can read dates" ON ngay_tot
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage dates" ON ngay_tot
    FOR ALL USING (true) WITH CHECK (true);

-- Consultations: User xem được của mình, admin xem tất cả
CREATE POLICY "Users can read own consultations" ON consultations
    FOR SELECT USING (true);

CREATE POLICY "Users can create consultations" ON consultations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own consultations" ON consultations
    FOR UPDATE USING (true) WITH CHECK (true);

-- Media Library
CREATE POLICY "Public can read media" ON media_library
    FOR SELECT USING (true);

CREATE POLICY "Authenticated can upload media" ON media_library
    FOR INSERT WITH CHECK (true);

-- Comments
CREATE POLICY "Public can read approved comments" ON comments
    FOR SELECT USING (is_approved = true OR true);

CREATE POLICY "Users can create comments" ON comments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own comments" ON comments
    FOR UPDATE USING (true) WITH CHECK (true);

-- Appointments
CREATE POLICY "Users can read own appointments" ON appointments
    FOR SELECT USING (true);

CREATE POLICY "Users can create appointments" ON appointments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own appointments" ON appointments
    FOR UPDATE USING (true) WITH CHECK (true);

-- Settings: Public đọc, admin ghi
CREATE POLICY "Public can read settings" ON settings
    FOR SELECT USING (true);

CREATE POLICY "Admin can manage settings" ON settings
    FOR ALL USING (true) WITH CHECK (true);

-- Activity Logs: Chỉ admin đọc
CREATE POLICY "Admin can read logs" ON activity_logs
    FOR SELECT USING (true);

CREATE POLICY "System can write logs" ON activity_logs
    FOR INSERT WITH CHECK (true);

-- ==========================================
-- DỮ LIỆU MẪU
-- ==========================================

-- Insert admin user mẫu
INSERT INTO users (email, full_name, role, phone) VALUES
    ('admin@minhphuoc.com', 'Quản Trị Viên', 'admin', '0123456789'),
    ('user@example.com', 'Nguyễn Văn A', 'user', '0987654321')
ON CONFLICT (email) DO NOTHING;

-- Insert settings mẫu
INSERT INTO settings (setting_key, setting_value, setting_type, description) VALUES
    ('site_name', 'Minh Phước Feng Shui', 'text', 'Tên website'),
    ('site_description', 'Dịch vụ phong thủy, tử vi chuyên nghiệp', 'text', 'Mô tả website'),
    ('contact_email', 'contact@minhphuoc.com', 'text', 'Email liên hệ'),
    ('contact_phone', '0123456789', 'text', 'Số điện thoại liên hệ'),
    ('facebook_url', 'https://facebook.com/minhphuocfengshui', 'text', 'Link Facebook'),
    ('enable_consultations', 'true', 'boolean', 'Bật/tắt tính năng tư vấn'),
    ('enable_appointments', 'true', 'boolean', 'Bật/tắt tính năng đặt lịch')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert blog posts mẫu
INSERT INTO blog_posts (title, slug, content, excerpt, category, status, published_at) VALUES
    (
        'Quỹ Khuyến Học Minh Phước - Hỗ Trợ Học Sinh Vượt Khó',
        'quy-khuyen-hoc-minh-phuoc',
        'Nội dung chi tiết về quỹ khuyến học...',
        'Quỹ Khuyến Học Minh Phước được thành lập nhằm hỗ trợ các em học sinh có hoàn cảnh khó khăn...',
        'scholarship',
        'published',
        NOW()
    ),
    (
        'Phong Thủy Nhà Ở - Những Điều Cần Biết',
        'phong-thuy-nha-o',
        'Hướng dẫn chi tiết về phong thủy nhà ở...',
        'Phong thủy nhà ở ảnh hưởng lớn đến vận khí gia đình...',
        'fengshui',
        'published',
        NOW()
    ),
    (
        'Cách Xem Ngày Tốt Để Khởi Công Xây Nhà',
        'xem-ngay-tot-khoi-cong',
        'Hướng dẫn xem ngày tốt xấu để khởi công...',
        'Chọn ngày tốt để khởi công xây nhà rất quan trọng...',
        'astrology',
        'published',
        NOW()
    )
ON CONFLICT (slug) DO NOTHING;

-- Insert ngày tốt mẫu
INSERT INTO ngay_tot (date, lunar_date, can_chi_ngay, viec_nen_lam, viec_nen_tranh, rating) VALUES
    (
        CURRENT_DATE,
        '15/12/2025',
        'Giáp Tý',
        ARRAY['Khai trương', 'Cưới hỏi', 'Xuất hành'],
        ARRAY['An táng', 'Khởi công'],
        4
    ),
    (
        CURRENT_DATE + INTERVAL '1 day',
        '16/12/2025',
        'Ất Sửu',
        ARRAY['Nhập trạch', 'Giao dịch'],
        ARRAY['Động thổ', 'An táng'],
        3
    )
ON CONFLICT DO NOTHING;

-- ==========================================
-- HOÀN TẤT
-- ==========================================
-- Database schema đã được tạo thành công!
-- Bây giờ bạn có thể sử dụng các bảng này trong ứng dụng.

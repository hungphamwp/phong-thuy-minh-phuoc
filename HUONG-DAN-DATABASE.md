# Hướng Dẫn Database - Minh Phước Feng Shui

## Tổng Quan Database

Database được thiết kế đầy đủ cho website **Minh Phước Feng Shui** với 10 bảng chính:

### 📊 Danh Sách Bảng

1. **users** - Quản lý người dùng (khách hàng, admin)
2. **blog_posts** - Bài viết Quỹ Khuyến Học, tin tức
3. **tu_vi_readings** - Lưu trữ lá tử vi đã lập
4. **ngay_tot** - Dữ liệu xem ngày tốt xấu
5. **consultations** - Yêu cầu tư vấn từ khách hàng
6. **media_library** - Thư viện hình ảnh, media
7. **comments** - Bình luận bài viết
8. **appointments** - Lịch hẹn tư vấn
9. **settings** - Cấu hình website
10. **activity_logs** - Nhật ký hoạt động hệ thống

---

## 🚀 Cách Setup Database

### Bước 1: Đăng nhập Supabase Dashboard
1. Truy cập: https://supabase.com/dashboard
2. Chọn project: **hungphamwp's Project**

### Bước 2: Chạy SQL Script
1. Click **SQL Editor** (menu bên trái)
2. Click **New query**
3. Mở file `database-schema.sql`
4. Copy toàn bộ nội dung
5. Paste vào SQL Editor
6. Click **Run** (hoặc Ctrl/Cmd + Enter)
7. Chờ vài giây để script chạy xong

### Bước 3: Kiểm Tra
1. Click **Table Editor** (menu bên trái)
2. Bạn sẽ thấy 10 bảng mới:
   - users
   - blog_posts
   - tu_vi_readings
   - ngay_tot
   - consultations
   - media_library
   - comments
   - appointments
   - settings
   - activity_logs

---

## 📋 Chi Tiết Các Bảng

### 1. USERS - Người Dùng

**Mục đích**: Quản lý tài khoản người dùng

**Cấu trúc**:
```
- id: UUID (Primary Key)
- email: TEXT (Unique, bắt buộc)
- full_name: TEXT (Họ tên)
- phone: TEXT (Số điện thoại)
- date_of_birth: DATE (Ngày sinh)
- birth_time: TIME (Giờ sinh)
- birth_place: TEXT (Nơi sinh)
- gender: TEXT (male/female/other)
- avatar_url: TEXT (Link ảnh đại diện)
- role: TEXT (admin/user/guest)
- is_active: BOOLEAN
- created_at, updated_at, last_login
```

**Ví dụ sử dụng**:
```javascript
// Tạo user mới
const { data, error } = await supabase
    .from('users')
    .insert({
        email: 'nguyen@example.com',
        full_name: 'Nguyễn Văn A',
        phone: '0987654321',
        role: 'user'
    });

// Lấy thông tin user
const { data } = await supabase
    .from('users')
    .select('*')
    .eq('email', 'nguyen@example.com')
    .single();
```

---

### 2. BLOG_POSTS - Bài Viết

**Mục đích**: Quản lý bài viết Quỹ Khuyến Học, tin tức

**Cấu trúc**:
```
- id: UUID
- title: TEXT (Tiêu đề)
- slug: TEXT (URL-friendly, unique)
- content: TEXT (Nội dung đầy đủ)
- excerpt: TEXT (Tóm tắt)
- featured_image: TEXT (Ảnh đại diện)
- category: TEXT (scholarship/news/fengshui/astrology/other)
- tags: TEXT[] (Array các tag)
- author_id: UUID (Foreign key -> users)
- status: TEXT (draft/published/archived)
- view_count: INTEGER
- published_at: TIMESTAMP
```

**Ví dụ sử dụng**:
```javascript
// Tạo bài viết mới
const { data } = await supabase
    .from('blog_posts')
    .insert({
        title: 'Học Bổng Năm 2026',
        slug: 'hoc-bong-nam-2026',
        content: 'Nội dung chi tiết...',
        excerpt: 'Thông báo học bổng...',
        category: 'scholarship',
        status: 'published',
        published_at: new Date().toISOString()
    });

// Lấy tất cả bài published
const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

// Lấy bài theo category
const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('category', 'scholarship')
    .eq('status', 'published');
```

---

### 3. TU_VI_READINGS - Lá Tử Vi

**Mục đích**: Lưu trữ kết quả lập lá tử vi

**Cấu trúc**:
```
- id: UUID
- user_id: UUID (Foreign key -> users)
- full_name: TEXT
- date_of_birth: DATE
- birth_time: TIME
- birth_place: TEXT
- gender: TEXT (male/female)
- lunar_date: TEXT (Âm lịch)
- can_chi: TEXT (Can Chi năm sinh)
- menh: TEXT (Mệnh)
- cung_menh: TEXT (Cung mệnh)
- chu_sao: JSONB (Chủ sao - dạng JSON)
- van_han: JSONB (Vận hạn - dạng JSON)
- analysis: TEXT (Phân tích)
- recommendations: TEXT (Lời khuyên)
```

**Ví dụ sử dụng**:
```javascript
// Lưu lá tử vi
const { data } = await supabase
    .from('tu_vi_readings')
    .insert({
        user_id: 'user-uuid',
        full_name: 'Nguyễn Văn A',
        date_of_birth: '1990-05-15',
        birth_time: '08:30:00',
        birth_place: 'Hà Nội',
        gender: 'male',
        lunar_date: '01/04/1990',
        can_chi: 'Canh Ngọ',
        menh: 'Kim',
        chu_sao: {
            chinh_tinh: 'Tử Vi',
            phu_tinh: ['Thiên Cơ', 'Thái Dương']
        },
        analysis: 'Phân tích chi tiết...'
    });

// Lấy lịch sử tử vi của user
const { data } = await supabase
    .from('tu_vi_readings')
    .select('*')
    .eq('user_id', 'user-uuid')
    .order('created_at', { ascending: false });
```

---

### 4. NGAY_TOT - Xem Ngày Tốt Xấu

**Mục đích**: Lưu thông tin ngày tốt xấu theo âm lịch

**Cấu trúc**:
```
- id: UUID
- date: DATE (Ngày dương lịch)
- lunar_date: TEXT (Ngày âm lịch)
- can_chi_ngay, can_chi_thang, can_chi_nam: TEXT
- sao_tot: TEXT[] (Array các sao tốt)
- sao_xau: TEXT[] (Array các sao xấu)
- gio_hoang_dao: TEXT[] (Giờ hoàng đạo)
- viec_nen_lam: TEXT[] (Việc nên làm)
- viec_nen_tranh: TEXT[] (Việc nên tránh)
- rating: INTEGER (1-5)
- notes: TEXT
```

**Ví dụ sử dụng**:
```javascript
// Thêm ngày tốt
const { data } = await supabase
    .from('ngay_tot')
    .insert({
        date: '2026-01-15',
        lunar_date: '16/12/2025',
        can_chi_ngay: 'Giáp Tý',
        sao_tot: ['Thiên Đức', 'Nguyệt Đức'],
        sao_xau: ['Tam Sát'],
        viec_nen_lam: ['Khai trương', 'Cưới hỏi', 'Xuất hành'],
        viec_nen_tranh: ['An táng', 'Khởi công'],
        rating: 4
    });

// Xem ngày tốt trong tháng
const { data } = await supabase
    .from('ngay_tot')
    .select('*')
    .gte('date', '2026-01-01')
    .lte('date', '2026-01-31')
    .order('date', { ascending: true });

// Tìm ngày tốt để làm việc cụ thể
const { data } = await supabase
    .from('ngay_tot')
    .select('*')
    .contains('viec_nen_lam', ['Khai trương'])
    .gte('rating', 4);
```

---

### 5. CONSULTATIONS - Tư Vấn

**Mục đích**: Quản lý yêu cầu tư vấn từ khách hàng

**Cấu trúc**:
```
- id: UUID
- user_id: UUID
- full_name, email, phone: TEXT
- service_type: TEXT (tu_vi/phong_thuy/xem_ngay/other)
- subject: TEXT (Chủ đề)
- message: TEXT (Nội dung)
- status: TEXT (pending/in_progress/completed/cancelled)
- priority: TEXT (low/medium/high/urgent)
- assigned_to: UUID (Người phụ trách)
- response: TEXT (Phản hồi)
- responded_at: TIMESTAMP
```

**Ví dụ sử dụng**:
```javascript
// Tạo yêu cầu tư vấn
const { data } = await supabase
    .from('consultations')
    .insert({
        full_name: 'Trần Thị B',
        email: 'tran@example.com',
        phone: '0912345678',
        service_type: 'phong_thuy',
        subject: 'Tư vấn hướng nhà',
        message: 'Tôi muốn xin tư vấn hướng nhà phù hợp...',
        status: 'pending',
        priority: 'medium'
    });

// Lấy danh sách tư vấn chưa xử lý
const { data } = await supabase
    .from('consultations')
    .select('*')
    .eq('status', 'pending')
    .order('priority', { ascending: false });

// Cập nhật phản hồi
const { data } = await supabase
    .from('consultations')
    .update({
        status: 'completed',
        response: 'Theo thông tin bạn cung cấp...',
        responded_at: new Date().toISOString()
    })
    .eq('id', 'consultation-id');
```

---

### 6. APPOINTMENTS - Lịch Hẹn

**Mục đích**: Quản lý lịch hẹn tư vấn trực tiếp

**Cấu trúc**:
```
- id: UUID
- user_id: UUID
- full_name, email, phone: TEXT
- service_type: TEXT
- appointment_date: DATE
- appointment_time: TIME
- duration: INTEGER (phút)
- status: TEXT (pending/confirmed/completed/cancelled/no_show)
- notes: TEXT
```

**Ví dụ sử dụng**:
```javascript
// Đặt lịch hẹn
const { data } = await supabase
    .from('appointments')
    .insert({
        full_name: 'Lê Văn C',
        email: 'le@example.com',
        phone: '0923456789',
        service_type: 'Tư vấn tử vi trực tiếp',
        appointment_date: '2026-01-20',
        appointment_time: '14:00:00',
        duration: 60,
        status: 'pending'
    });

// Xem lịch hẹn trong ngày
const { data } = await supabase
    .from('appointments')
    .select('*')
    .eq('appointment_date', '2026-01-20')
    .order('appointment_time', { ascending: true });
```

---

## 🔧 Cách Sử Dụng Trong Code

### Setup Supabase Client

```javascript
// js/supabase-config.js
const SUPABASE_URL = 'https://kabojqukrwuhwyzbadic.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
```

### Ví Dụ CRUD Operations

```javascript
// CREATE - Thêm mới
const createPost = async (postData) => {
    const { data, error } = await supabase
        .from('blog_posts')
        .insert([postData])
        .select();

    if (error) throw error;
    return data[0];
};

// READ - Đọc
const getPosts = async () => {
    const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

    if (error) throw error;
    return data;
};

// UPDATE - Cập nhật
const updatePost = async (id, updates) => {
    const { data, error } = await supabase
        .from('blog_posts')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) throw error;
    return data[0];
};

// DELETE - Xóa
const deletePost = async (id) => {
    const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

    if (error) throw error;
};
```

---

## 🔐 Row Level Security (RLS)

Database đã được setup RLS với các policies cơ bản:

- **Public**: Có thể đọc bài viết published, ngày tốt, settings
- **Users**: Có thể tạo consultations, appointments, comments
- **Authenticated**: Có thể đọc/ghi dữ liệu của mình
- **Admin**: Có thể quản lý toàn bộ

**Lưu ý**: Hiện tại policies được set cho phép tất cả để demo. Trong production, bạn nên:

1. Thêm Supabase Authentication
2. Cập nhật policies sử dụng `auth.uid()`
3. Giới hạn quyền truy cập theo role

---

## 📊 Realtime Subscriptions

Bạn có thể subscribe để nhận thông báo realtime:

```javascript
// Subscribe to blog posts changes
const subscription = supabase
    .channel('blog_changes')
    .on('postgres_changes',
        { event: '*', schema: 'public', table: 'blog_posts' },
        (payload) => {
            console.log('Blog post changed:', payload);
            // Reload data
        }
    )
    .subscribe();

// Unsubscribe when done
subscription.unsubscribe();
```

---

## 🎯 Các Tính Năng Đã Có

✅ Auto-update `updated_at` khi có thay đổi
✅ Indexes để tăng tốc query
✅ Foreign keys để đảm bảo data integrity
✅ Check constraints để validate data
✅ Row Level Security
✅ Dữ liệu mẫu để test

---

## 📝 Lưu Ý Quan Trọng

1. **Backup**: Luôn backup database trước khi chạy migration
2. **Testing**: Test trên môi trường dev trước khi deploy production
3. **Security**: Không share Supabase Key công khai
4. **Indexes**: Đã có indexes cho các queries thường dùng
5. **JSONB**: Dùng JSONB cho dữ liệu phức tạp (chu_sao, van_han)

---

## 🚀 Bước Tiếp Theo

Sau khi setup database xong, bạn có thể:

1. Tích hợp vào website hiện tại
2. Tạo admin panel để quản lý
3. Thêm authentication cho users
4. Deploy lên production

---

**Chúc bạn thành công! 🎉**
